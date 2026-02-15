/**
 * profile.js - Profile Page Controller
 *
 * Handles:
 * - User profile form (health info)
 * - Health card display
 * - Training quiz (via TrainingModule)
 * - Training history display
 */

import { getProfile, saveProfile } from './profileService.js';
import { isLoggedIn, getAuthUser, logout } from './authService.js';
import * as Training from './training/TrainingModule.js';

// ==================== DOM ELEMENTS ====================

const form = document.getElementById('profileForm');
const saveStatus = document.getElementById('saveStatus');
const signinBanner = document.getElementById('signinBanner');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// ==================== UTILITY FUNCTIONS ====================

function showStatus(text) {
    if (saveStatus) saveStatus.textContent = text || '';
}

function toList(str) {
    return (str || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
}

function fromList(arr) {
    if (!arr) return '';
    if (Array.isArray(arr)) return arr.join(', ');
    if (typeof arr === 'string') return arr;
    return String(arr);
}

// ==================== PROFILE FORM ====================

function contactsToLines(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
    return arr.join('\n');
}

function linesToContacts(str) {
    if (!str) return [];
    return str.split('\n').map(s => s.trim()).filter(Boolean);
}

async function loadProfile() {
    try {
        const profile = await getProfile();
        if (form) {
            // userName field
            if (form.userName) form.userName.value = profile.userName || '';

            // bloodType - select element
            if (form.bloodType) form.bloodType.value = profile.bloodType || '';

            // Height/weight/units
            if (form.height) form.height.value = profile.height || '';
            if (form.weight) form.weight.value = profile.weight || '';
            if (form.units) form.units.value = profile.units || 'metric';

            // Allergies and conditions (comma-separated)
            if (form.allergies) form.allergies.value = fromList(profile.allergies);
            if (form.chronicConditions) form.chronicConditions.value = fromList(profile.chronicConditions);

            // Medications (text)
            if (form.medications) form.medications.value = profile.medications || '';

            // Emergency contacts (one per line)
            if (form.emergencyContacts) form.emergencyContacts.value = contactsToLines(profile.emergencyContacts);
        }
    } catch (err) {
        console.error('Failed to load profile:', err);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    // Get current profile to preserve any fields we're not editing
    const currentProfile = await getProfile();

    const next = {
        ...currentProfile,
        userName: form.userName?.value?.trim() || '',
        bloodType: form.bloodType?.value || '',
        height: form.height?.value ? Number(form.height.value) : null,
        weight: form.weight?.value ? Number(form.weight.value) : null,
        units: form.units?.value || 'metric',
        allergies: toList(form.allergies?.value),
        chronicConditions: toList(form.chronicConditions?.value),
        medications: form.medications?.value?.trim() || '',
        emergencyContacts: linesToContacts(form.emergencyContacts?.value)
    };

    await saveProfile(next);

    // Refresh displays
    await loadProfile();
    await renderHealthCard();

    // Show save feedback
    showStatus('Profile saved!');
    setTimeout(() => showStatus(''), 2000);

    // Collapse edit section
    toggleEditSection(false);
}

// ==================== AUTH & BANNER ====================

function renderBanner() {
    const loggedIn = isLoggedIn();
    if (!loggedIn && signinBanner) signinBanner.classList.remove('is-hidden');
    else signinBanner?.classList.add('is-hidden');
}

async function renderUser() {
    try {
        const user = await getAuthUser();
        if (user?.email) {
            if (userEmail) userEmail.textContent = user.email;
            logoutBtn?.classList.remove('is-hidden');
        } else {
            if (userEmail) userEmail.textContent = 'Offline';
            logoutBtn?.classList.add('is-hidden');
        }
    } catch (err) {
        if (userEmail) userEmail.textContent = 'Offline';
        logoutBtn?.classList.add('is-hidden');
    }
}

// ==================== HEALTH CARD ====================

async function renderHealthCard() {
    try {
        const profile = await getProfile();

        // User name - prefer profile.userName, fallback to auth username
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            if (profile.userName) {
                userNameEl.textContent = profile.userName;
            } else {
                const user = await getAuthUser();
                userNameEl.textContent = user?.username || 'User';
            }
        }

        // Blood type
        const bloodTypeEl = document.getElementById('bloodTypeDisplay');
        if (bloodTypeEl) bloodTypeEl.textContent = profile.bloodType || '-';

        // Height/weight with units
        const units = profile.units || 'metric';
        const heightEl = document.getElementById('heightDisplay');
        if (heightEl) {
            heightEl.textContent = profile.height
                ? `${profile.height} ${units === 'metric' ? 'cm' : 'in'}`
                : '-';
        }

        const weightEl = document.getElementById('weightDisplay');
        if (weightEl) {
            weightEl.textContent = profile.weight
                ? `${profile.weight} ${units === 'metric' ? 'kg' : 'lbs'}`
                : '-';
        }

        // Allergies
        const allergiesEl = document.getElementById('allergiesDisplay');
        if (allergiesEl) allergiesEl.textContent = fromList(profile.allergies) || 'None';

        // Conditions
        const conditionsEl = document.getElementById('conditionsDisplay');
        if (conditionsEl) conditionsEl.textContent = fromList(profile.chronicConditions) || 'None';

        // Medications
        const medicationsEl = document.getElementById('medicationsDisplay');
        if (medicationsEl) medicationsEl.textContent = profile.medications || 'None';

        // Emergency contacts count
        const contactsEl = document.getElementById('contactsDisplay');
        if (contactsEl) {
            const contacts = profile.emergencyContacts || [];
            contactsEl.textContent = contacts.length > 0 ? `${contacts.length} saved` : 'None';
        }
    } catch (err) {
        console.error('Failed to render health card:', err);
    }
}

function scrollToMedicalProfile() {
    const profileFormSection = document.getElementById('profileForm');
    if (profileFormSection) {
        profileFormSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== TRAINING STATS ====================

async function loadTrainingStats() {
    try {
        const stats = await Training.getStats();

        // Total sessions
        const totalEl = document.getElementById('totalSessionsValue');
        if (totalEl) totalEl.textContent = stats.totalCompleted || 0;

        // Last training date
        const lastDateEl = document.getElementById('lastTrainingDateValue');
        if (lastDateEl) {
            lastDateEl.textContent = Training.formatLastTrainingDate(stats.lastTrainingDate);
        }

        // Average score
        const avgEl = document.getElementById('averageScoreValue');
        if (avgEl) {
            avgEl.textContent = stats.totalCompleted > 0
                ? Math.round(stats.averageScore) + '%'
                : '0%';
        }

        // Certification status
        const certEl = document.getElementById('certStatusValue');
        if (certEl) {
            if (stats.totalCompleted >= 10 && stats.averageScore >= 80) {
                certEl.textContent = 'Certified';
                certEl.className = 'stat-value text-success';
            } else if (stats.totalCompleted >= 5) {
                certEl.textContent = 'In Progress';
                certEl.className = 'stat-value text-info';
            } else {
                certEl.textContent = 'Get Started';
                certEl.className = 'stat-value';
            }
        }
    } catch (err) {
        console.error('Failed to load training stats:', err);
    }
}

// ==================== TRAINING QUIZ ====================

/**
 * Start a new quiz session
 */
async function startQuiz() {
    try {
        // Start session with mixed questions
        Training.startSession('mixed');

        // Show quiz container, hide other sections
        const startSection = document.getElementById('startQuizSection');
        const historySection = document.getElementById('trainingHistory');
        const quizContainer = document.getElementById('quickQuizContainer');
        const resultsSection = document.getElementById('quizResults');

        if (startSection) startSection.style.display = 'none';
        if (historySection) historySection.style.display = 'none';
        if (quizContainer) quizContainer.style.display = 'block';
        if (resultsSection) resultsSection.style.display = 'none';

        // Render first question
        renderQuestion();
    } catch (err) {
        console.error('Failed to start quiz:', err);
        alert('Failed to start quiz. Please try again.');
    }
}

/**
 * Render the current question
 */
function renderQuestion() {
    const state = Training.getState();

    if (!state.isActive) {
        console.error('No active session');
        return;
    }

    // Update progress indicator
    const progressEl = document.getElementById('quizProgress');
    if (progressEl) {
        progressEl.textContent = `${state.currentIndex + 1}/${state.total}`;
    }

    // Update question text
    const questionTextEl = document.getElementById('questionText');
    if (questionTextEl && state.currentQuestion) {
        questionTextEl.textContent = state.currentQuestion.question;
    }

    // Render answer options
    const optionsContainer = document.getElementById('quizOptions');
    if (optionsContainer && state.currentQuestion) {
        optionsContainer.innerHTML = '';

        state.currentQuestion.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'quiz-option';

            const isSelected = state.selectedAnswer === index;
            if (isSelected) optionEl.classList.add('selected');

            optionEl.innerHTML = `
                <input type="radio" name="quizAnswer" id="option${index}" value="${index}" ${isSelected ? 'checked' : ''}>
                <label for="option${index}">${option}</label>
            `;

            // Only allow clicking if not yet answered
            if (!state.hasAnsweredCurrent) {
                optionEl.addEventListener('click', () => selectAnswer(index));
            } else {
                optionEl.style.pointerEvents = 'none';
                optionEl.style.opacity = '0.7';
            }

            optionsContainer.appendChild(optionEl);
        });
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (prevBtn) {
        prevBtn.style.display = state.canGoBack ? 'inline-block' : 'none';
    }

    if (nextBtn) {
        // Show Next if: answered current AND not last question
        nextBtn.style.display = (state.hasAnsweredCurrent && !state.isLastQuestion) ? 'inline-block' : 'none';
    }

    if (submitBtn) {
        // Show Submit if: on last question AND answered
        submitBtn.style.display = (state.isLastQuestion && state.hasAnsweredCurrent) ? 'inline-block' : 'none';
    }

    // Hide feedback initially (will show after answer)
    const feedbackEl = document.getElementById('quizFeedback');
    if (feedbackEl && !state.hasAnsweredCurrent) {
        feedbackEl.style.display = 'none';
    }
}

/**
 * Handle answer selection
 */
function selectAnswer(optionIndex) {
    const state = Training.getState();

    // Prevent changing answer if already answered
    if (state.hasAnsweredCurrent) {
        return;
    }

    // Record answer and get feedback
    const feedback = Training.answerQuestion(optionIndex);

    if (!feedback) {
        console.error('Failed to record answer');
        return;
    }

    // Update option visual state
    document.querySelectorAll('.quiz-option').forEach((el, i) => {
        el.classList.toggle('selected', i === optionIndex);
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.7';
    });

    // Show feedback
    const feedbackEl = document.getElementById('quizFeedback');
    if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = feedback.isCorrect ? 'quiz-feedback correct' : 'quiz-feedback incorrect';

        const currentState = Training.getState();
        const correctOption = currentState.currentQuestion?.options[feedback.correctAnswer] || '';

        feedbackEl.innerHTML = feedback.isCorrect
            ? '&#10003; Correct!'
            : `&#10007; Incorrect. The correct answer is: <strong>${correctOption}</strong>`;
    }

    // Show appropriate navigation button
    const newState = Training.getState();
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (newState.isLastQuestion) {
        if (submitBtn) submitBtn.style.display = 'inline-block';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

/**
 * Move to next question
 */
function goToNextQuestion() {
    const result = Training.nextQuestion();
    if (result) {
        renderQuestion();
    }
}

/**
 * Move to previous question
 */
function goToPreviousQuestion() {
    const result = Training.previousQuestion();
    if (result) {
        renderQuestion();
    }
}

/**
 * Submit the quiz
 */
async function submitQuiz() {
    try {
        const results = await Training.finishSession();

        if (results.error) {
            alert(results.message || 'Please answer all questions before submitting.');
            return;
        }

        // Show results screen
        showResults(results);
    } catch (err) {
        console.error('Failed to submit quiz:', err);
        alert('Failed to submit quiz. Please try again.');
    }
}

/**
 * Display quiz results
 */
function showResults(results) {
    // Hide quiz, show results
    const quizContainer = document.getElementById('quickQuizContainer');
    const resultsSection = document.getElementById('quizResults');

    if (quizContainer) quizContainer.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'block';

    // Update score display
    const finalScoreEl = document.getElementById('finalScore');
    if (finalScoreEl) {
        finalScoreEl.textContent = `${results.score}/${results.total}`;
    }

    const percentageEl = document.getElementById('scorePercentage');
    if (percentageEl) {
        percentageEl.textContent = `${Math.round(results.percentage)}%`;
    }

    // Update message based on score
    const messageEl = document.getElementById('resultsMessage');
    if (messageEl) {
        const { grade } = Training.getScoreGrade(results.percentage);
        let message = '';

        if (results.percentage >= 80) {
            message = 'Excellent work! You have a strong understanding of emergency response procedures.';
        } else if (results.percentage >= 60) {
            message = 'Good job! Review the topics you missed to strengthen your knowledge.';
        } else {
            message = 'Keep practicing! Consider reviewing the emergency guides for better preparation.';
        }

        messageEl.textContent = message;
    }

    // Reload stats to show updated numbers
    loadTrainingStats();
}

/**
 * Start a new quiz after completing one
 */
function startNewQuiz() {
    const resultsSection = document.getElementById('quizResults');
    if (resultsSection) resultsSection.style.display = 'none';

    startQuiz();
}

/**
 * Return to profile from results
 */
function backToProfile() {
    const resultsSection = document.getElementById('quizResults');
    const startSection = document.getElementById('startQuizSection');

    if (resultsSection) resultsSection.style.display = 'none';
    if (startSection) startSection.style.display = 'block';

    // Reload stats
    loadTrainingStats();
}

/**
 * Exit quiz without completing
 */
function exitQuiz() {
    Training.cancelSession();

    const quizContainer = document.getElementById('quickQuizContainer');
    const startSection = document.getElementById('startQuizSection');

    if (quizContainer) quizContainer.style.display = 'none';
    if (startSection) startSection.style.display = 'block';
}

// ==================== TRAINING HISTORY ====================

async function toggleHistory() {
    const historySection = document.getElementById('trainingHistory');
    if (!historySection) return;

    const isVisible = historySection.style.display === 'block';

    if (isVisible) {
        historySection.style.display = 'none';
    } else {
        // Load and display history
        try {
            const history = await Training.getFormattedHistory(10);
            const historyList = document.getElementById('historyList');

            if (!historyList) return;

            if (history.length === 0) {
                historyList.innerHTML = '<p class="empty-state">No training sessions yet. Start your first quiz!</p>';
            } else {
                historyList.innerHTML = history.map(session => {
                    const passClass = session.scorePercent >= 80 ? 'pass' : session.scorePercent >= 60 ? 'ok' : 'fail';
                    return `
                        <div class="history-item ${passClass}">
                            <span class="history-date">${session.date}</span>
                            <span class="history-score">${session.scoreDisplay}</span>
                            <span class="history-type">${session.typeLabel}</span>
                        </div>
                    `;
                }).join('');
            }

            historySection.style.display = 'block';
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    }
}

// ==================== EDIT SECTION ====================

/**
 * Toggle the edit section visibility
 * @param {boolean|undefined} forceState - Optional: true to show, false to hide
 */
function toggleEditSection(forceState) {
    const editSection = document.getElementById('editSection');
    const editBtn = document.getElementById('editHealthBtn');

    if (!editSection) return;

    const isCurrentlyVisible = editSection.style.display === 'block';
    const shouldShow = forceState !== undefined ? forceState : !isCurrentlyVisible;

    if (shouldShow) {
        // Load form data before showing
        loadProfile();
        editSection.style.display = 'block';
        editSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (editBtn) editBtn.textContent = 'Cancel Editing';
    } else {
        editSection.style.display = 'none';
        if (editBtn) editBtn.textContent = 'Edit Health Info';
    }
}

function cancelEdit() {
    toggleEditSection(false);
}

// ==================== GLOBAL EXPORTS ====================

window.scrollToMedicalProfile = scrollToMedicalProfile;
window.startQuiz = startQuiz;
window.startNewQuiz = startNewQuiz;
window.toggleHistory = toggleHistory;
window.exitQuiz = exitQuiz;
window.backToProfile = backToProfile;
window.cancelEdit = cancelEdit;
window.toggleEditSection = toggleEditSection;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Render auth state
    renderBanner();
    await renderUser();

    // Render health card
    await renderHealthCard();

    // Load profile form
    try {
        await loadProfile();
    } catch (err) {
        console.error('Profile load failed, continuing:', err);
    }

    // Load training stats
    await loadTrainingStats();

    // Form submit handler
    form?.addEventListener('submit', handleSubmit);

    // Logout handler
    logoutBtn?.addEventListener('click', async () => {
        await logout();
        renderBanner();
        renderUser();
    });

    // Quiz navigation handlers
    document.getElementById('nextQuestionBtn')?.addEventListener('click', goToNextQuestion);
    document.getElementById('prevQuestionBtn')?.addEventListener('click', goToPreviousQuestion);
    document.getElementById('submitQuizBtn')?.addEventListener('click', submitQuiz);

    // Edit health info button
    document.getElementById('editHealthBtn')?.addEventListener('click', () => toggleEditSection());

    // Cancel edit button
    document.getElementById('cancelEditBtn')?.addEventListener('click', () => toggleEditSection(false));
});
