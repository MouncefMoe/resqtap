/**
 * TrainingModule.js - Public API Facade
 *
 * Single entry point for all training functionality.
 * Import only from this file in UI code (profile.js).
 *
 * Usage:
 *   import * as Training from './training/TrainingModule.js';
 *
 *   // Start session
 *   Training.startSession('mixed');
 *
 *   // Get current state
 *   const state = Training.getState();
 *
 *   // Answer question
 *   Training.answerQuestion(2);
 *
 *   // Navigate
 *   Training.nextQuestion();
 *   Training.previousQuestion();
 *
 *   // Finish
 *   const results = await Training.finishSession();
 *
 *   // Get stats
 *   const stats = await Training.getStats();
 */

// Import internal modules
import { sessionManager } from './SessionManager.js';
import * as HistoryService from './HistoryService.js';
import * as StatsCalculator from './StatsCalculator.js';
import { getPoolTypes, getPoolSize, QUESTION_POOLS } from './QuestionBank.js';

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Start a new training session
 * @param {string} type - Pool type: 'adult' | 'child' | 'infant' | 'mixed'
 * @returns {Object} - Initial state snapshot
 */
export function startSession(type = 'mixed') {
    return sessionManager.start(type);
}

/**
 * Get current session state
 * @returns {Object} - Current state snapshot for UI rendering
 */
export function getState() {
    return sessionManager.getState();
}

/**
 * Check if there's an active session
 * @returns {boolean}
 */
export function isSessionActive() {
    return sessionManager.isActive;
}

/**
 * Check if session is complete
 * @returns {boolean}
 */
export function isSessionComplete() {
    return sessionManager.isComplete;
}

/**
 * Get current session type
 * @returns {string|null}
 */
export function getSessionType() {
    return sessionManager.getSessionType();
}

/**
 * Cancel current session without saving
 */
export function cancelSession() {
    sessionManager.cancel();
}

// ============================================
// QUESTION NAVIGATION
// ============================================

/**
 * Answer the current question
 * @param {number} choiceIndex - Selected option index (0-3)
 * @returns {Object} - Feedback object with isCorrect, correctAnswer, explanation
 */
export function answerQuestion(choiceIndex) {
    return sessionManager.answer(choiceIndex);
}

/**
 * Move to next question
 * @returns {Object|null} - New state snapshot or null if at end
 */
export function nextQuestion() {
    return sessionManager.next();
}

/**
 * Move to previous question
 * @returns {Object|null} - New state snapshot or null if at start
 */
export function previousQuestion() {
    return sessionManager.back();
}

/**
 * Check if can go to next question
 * @returns {boolean}
 */
export function canGoNext() {
    return sessionManager.canGoNext();
}

/**
 * Check if can go to previous question
 * @returns {boolean}
 */
export function canGoBack() {
    return sessionManager.canGoBack();
}

/**
 * Check if on last question
 * @returns {boolean}
 */
export function isLastQuestion() {
    return sessionManager.isLastQuestion();
}

/**
 * Check if current question is answered
 * @returns {boolean}
 */
export function hasAnsweredCurrent() {
    return sessionManager.hasAnsweredCurrent();
}

/**
 * Check if all questions are answered
 * @returns {boolean}
 */
export function allQuestionsAnswered() {
    return sessionManager.allAnswered();
}

// ============================================
// SESSION COMPLETION
// ============================================

/**
 * Finish the session, compute score, and save to history
 * @returns {Promise<Object>} - Results object with score, percentage, review
 */
export async function finishSession() {
    return await sessionManager.finish();
}

// ============================================
// HISTORY & STATS
// ============================================

/**
 * Get all training sessions from history
 * @returns {Promise<Array>} - Array of session objects (newest first)
 */
export async function getHistory() {
    return await HistoryService.getSessions();
}

/**
 * Get number of completed sessions
 * @returns {Promise<number>}
 */
export async function getSessionCount() {
    return await HistoryService.getSessionCount();
}

/**
 * Get most recent session
 * @returns {Promise<Object|null>}
 */
export async function getLastSession() {
    return await HistoryService.getLastSession();
}

/**
 * Get computed statistics
 * @returns {Promise<Object>} - StatsSnapshot object
 */
export async function getStats() {
    const sessions = await HistoryService.getSessions();
    return StatsCalculator.computeStats(sessions);
}

/**
 * Get formatted history for display
 * @param {number} limit - Maximum number of sessions to return
 * @returns {Promise<Array>} - Formatted session objects for UI
 */
export async function getFormattedHistory(limit = 10) {
    const sessions = await HistoryService.getSessions();
    const limited = sessions.slice(0, limit);
    return limited.map(s => StatsCalculator.formatSessionForDisplay(s));
}

/**
 * Clear all training history
 * @returns {Promise<boolean>}
 */
export async function clearHistory() {
    return await HistoryService.clearHistory();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get available training types
 * @returns {Array} - Array of type objects with name and count
 */
export function getTrainingTypes() {
    return [
        { id: 'mixed', name: 'Mixed', count: getPoolSize('mixed') },
        { id: 'adult', name: 'Adult CPR', count: getPoolSize('adult') },
        { id: 'child', name: 'Child CPR', count: getPoolSize('child') },
        { id: 'infant', name: 'Infant CPR', count: getPoolSize('infant') }
    ];
}

/**
 * Format last training date for display
 * @param {string} isoDate - ISO date string
 * @returns {string}
 */
export function formatLastTrainingDate(isoDate) {
    return StatsCalculator.formatLastTrainingDate(isoDate);
}

/**
 * Get score grade/color for display
 * @param {number} percentage
 * @returns {Object} - { color, grade }
 */
export function getScoreGrade(percentage) {
    return StatsCalculator.getScoreGrade(percentage);
}

// Export for debugging
export const _debug = {
    sessionManager,
    HistoryService,
    StatsCalculator,
    QUESTION_POOLS
};
