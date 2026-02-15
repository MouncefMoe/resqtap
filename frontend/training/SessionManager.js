/**
 * SessionManager.js - Quiz Session State Machine
 *
 * Encapsulates all quiz state and transitions.
 * Single source of truth for:
 * - Current session data
 * - Question index (0-4)
 * - User answers
 * - Session completion status
 *
 * All state mutations go through controlled methods.
 */

import { getRandomQuestions } from './QuestionBank.js';
import * as HistoryService from './HistoryService.js';

/**
 * SessionManager class - manages quiz session lifecycle
 */
class SessionManager {
    constructor() {
        this.reset();
    }

    /**
     * Reset all state to initial values
     */
    reset() {
        this.session = null;           // Current session object
        this.questions = [];           // Question objects for current session
        this.currentIndex = 0;         // Current question index (0-4)
        this.answers = [];             // User's selected answers [null, 2, 1, null, 3]
        this.isComplete = false;       // Session finished?
        this.isActive = false;         // Session in progress?
    }

    /**
     * Start a new training session
     * @param {string} type - Question pool type: 'adult' | 'child' | 'infant' | 'mixed'
     * @returns {Object} - State snapshot for UI
     */
    start(type = 'mixed') {
        // Reset any previous session
        this.reset();

        // Get 5 random questions (no duplicates guaranteed by QuestionBank)
        this.questions = getRandomQuestions(type, 5);

        // Create session object
        this.session = {
            id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            type: type,
            startedAt: new Date().toISOString(),
            finishedAt: null,
            score: null,
            total: 5,
            questionIds: this.questions.map(q => q.id),
            answers: [],
            correctAnswers: this.questions.map(q => q.answer)
        };

        // Initialize answers array with nulls
        this.answers = [null, null, null, null, null];

        // Set state flags
        this.currentIndex = 0;
        this.isComplete = false;
        this.isActive = true;

        console.log('[SessionManager] Session started:', this.session.id, 'Type:', type);

        return this.getState();
    }

    /**
     * Record answer for current question
     * @param {number} choiceIndex - Index of selected option (0-3)
     * @returns {Object} - Feedback object with isCorrect, correctAnswer, explanation
     */
    answer(choiceIndex) {
        // Validate state
        if (!this.isActive || this.isComplete) {
            console.error('[SessionManager] Cannot answer: no active session');
            return null;
        }

        // Validate choice index
        if (choiceIndex < 0 || choiceIndex > 3) {
            console.error('[SessionManager] Invalid choice index:', choiceIndex);
            return null;
        }

        // Record answer
        this.answers[this.currentIndex] = choiceIndex;

        // Get current question
        const question = this.questions[this.currentIndex];

        // Determine correctness
        const isCorrect = choiceIndex === question.answer;

        console.log('[SessionManager] Answer recorded:', {
            questionIndex: this.currentIndex,
            selected: choiceIndex,
            correct: question.answer,
            isCorrect
        });

        return {
            isCorrect,
            correctAnswer: question.answer,
            explanation: question.explanation || ''
        };
    }

    /**
     * Move to next question
     * @returns {Object|null} - New state snapshot, or null if at last question
     */
    next() {
        if (!this.isActive || this.isComplete) {
            console.error('[SessionManager] Cannot go next: no active session');
            return null;
        }

        if (this.currentIndex >= 4) {
            console.log('[SessionManager] Already at last question');
            return null;
        }

        this.currentIndex++;
        console.log('[SessionManager] Moved to question:', this.currentIndex + 1);

        return this.getState();
    }

    /**
     * Move to previous question
     * @returns {Object|null} - New state snapshot, or null if at first question
     */
    back() {
        if (!this.isActive || this.isComplete) {
            console.error('[SessionManager] Cannot go back: no active session');
            return null;
        }

        if (this.currentIndex <= 0) {
            console.log('[SessionManager] Already at first question');
            return null;
        }

        this.currentIndex--;
        console.log('[SessionManager] Moved back to question:', this.currentIndex + 1);

        return this.getState();
    }

    /**
     * Check if can go to next question
     * @returns {boolean}
     */
    canGoNext() {
        return this.isActive && !this.isComplete && this.currentIndex < 4;
    }

    /**
     * Check if can go to previous question
     * @returns {boolean}
     */
    canGoBack() {
        return this.isActive && !this.isComplete && this.currentIndex > 0;
    }

    /**
     * Check if on last question
     * @returns {boolean}
     */
    isLastQuestion() {
        return this.currentIndex === 4;
    }

    /**
     * Check if current question has been answered
     * @returns {boolean}
     */
    hasAnsweredCurrent() {
        return this.answers[this.currentIndex] !== null;
    }

    /**
     * Check if all questions have been answered
     * @returns {boolean}
     */
    allAnswered() {
        return this.answers.every(a => a !== null);
    }

    /**
     * Finish the session and compute score
     * @returns {Promise<Object>} - Results object with score, percentage, and review
     */
    async finish() {
        // Validate state
        if (!this.isActive || this.isComplete) {
            console.error('[SessionManager] Cannot finish: no active session');
            return null;
        }

        // Check all questions answered
        const unansweredIndex = this.answers.findIndex(a => a === null);
        if (unansweredIndex !== -1) {
            console.error('[SessionManager] Cannot finish: question', unansweredIndex + 1, 'not answered');
            return {
                error: true,
                message: `Please answer question ${unansweredIndex + 1} before submitting.`
            };
        }

        // Compute score
        let score = 0;
        const results = this.questions.map((q, i) => {
            const userAnswer = this.answers[i];
            const isCorrect = userAnswer === q.answer;
            if (isCorrect) score++;

            return {
                questionIndex: i,
                questionId: q.id,
                question: q.q,
                options: q.options,
                userAnswer: userAnswer,
                correctAnswer: q.answer,
                isCorrect: isCorrect,
                explanation: q.explanation || ''
            };
        });

        // Update session
        this.session.finishedAt = new Date().toISOString();
        this.session.score = score;
        this.session.answers = [...this.answers];
        this.isComplete = true;
        this.isActive = false;

        console.log('[SessionManager] Session finished:', {
            id: this.session.id,
            score: score,
            total: 5,
            percentage: (score / 5) * 100
        });

        // Save to history
        const saved = await HistoryService.addSession(this.session);
        if (!saved) {
            console.error('[SessionManager] Failed to save session to history');
        }

        return {
            error: false,
            sessionId: this.session.id,
            type: this.session.type,
            score: score,
            total: 5,
            percentage: (score / 5) * 100,
            startedAt: this.session.startedAt,
            finishedAt: this.session.finishedAt,
            results: results
        };
    }

    /**
     * Get current state snapshot for UI rendering
     * @returns {Object} - Read-only state snapshot
     */
    getState() {
        if (!this.isActive && !this.isComplete) {
            return {
                isActive: false,
                isComplete: false,
                currentQuestion: null,
                currentIndex: 0,
                total: 5,
                selectedAnswer: null,
                canGoBack: false,
                canGoNext: false,
                isLastQuestion: false,
                allAnswered: false
            };
        }

        const currentQuestion = this.questions[this.currentIndex] || null;

        return {
            isActive: this.isActive,
            isComplete: this.isComplete,
            sessionId: this.session?.id,
            type: this.session?.type,
            currentIndex: this.currentIndex,
            total: 5,
            currentQuestion: currentQuestion ? {
                id: currentQuestion.id,
                pool: currentQuestion.pool,
                question: currentQuestion.q,
                options: currentQuestion.options,
                // Note: Do NOT expose answer during active session
            } : null,
            selectedAnswer: this.answers[this.currentIndex],
            answers: [...this.answers], // Copy to prevent mutation
            canGoBack: this.canGoBack(),
            canGoNext: this.canGoNext(),
            isLastQuestion: this.isLastQuestion(),
            hasAnsweredCurrent: this.hasAnsweredCurrent(),
            allAnswered: this.allAnswered()
        };
    }

    /**
     * Get the session type (for retake functionality)
     * @returns {string|null}
     */
    getSessionType() {
        return this.session?.type || null;
    }

    /**
     * Cancel current session without saving
     */
    cancel() {
        console.log('[SessionManager] Session cancelled');
        this.reset();
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();

// Also export class for testing
export { SessionManager };
