/**
 * StatsCalculator.js - Compute Training Statistics
 *
 * Pure functions to compute statistics from training session history.
 * Does NOT access storage directly - receives sessions as input.
 *
 * StatsSnapshot format:
 * {
 *   totalCompleted: number,
 *   averageScore: number (percentage),
 *   bestScore: number (percentage),
 *   lastTrainingDate: string (ISO) | null,
 *   byType: {
 *     adult: { completed: number, avgScore: number },
 *     child: { completed: number, avgScore: number },
 *     ...
 *   }
 * }
 */

/**
 * Compute statistics from an array of training sessions
 * @param {Array} sessions - Array of TrainingSession objects
 * @returns {Object} - StatsSnapshot object
 */
export function computeStats(sessions) {
    // Handle empty or invalid input
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
        return {
            totalCompleted: 0,
            averageScore: 0,
            bestScore: 0,
            lastTrainingDate: null,
            byType: {}
        };
    }

    // Filter out invalid sessions
    const validSessions = sessions.filter(s =>
        s &&
        typeof s.score === 'number' &&
        typeof s.total === 'number' &&
        s.total > 0
    );

    if (validSessions.length === 0) {
        return {
            totalCompleted: 0,
            averageScore: 0,
            bestScore: 0,
            lastTrainingDate: null,
            byType: {}
        };
    }

    // Calculate scores as percentages
    const scores = validSessions.map(s => (s.score / s.total) * 100);

    // Total completed
    const totalCompleted = validSessions.length;

    // Average score
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Best score
    const bestScore = Math.max(...scores);

    // Last training date (assumes sessions are sorted newest first)
    const lastTrainingDate = validSessions[0].finishedAt || validSessions[0].startedAt || null;

    // Group by type
    const byType = {};
    for (const session of validSessions) {
        const type = session.type || 'mixed';

        if (!byType[type]) {
            byType[type] = {
                completed: 0,
                totalScore: 0
            };
        }

        byType[type].completed++;
        byType[type].totalScore += (session.score / session.total) * 100;
    }

    // Calculate average for each type
    for (const type in byType) {
        byType[type].avgScore = byType[type].totalScore / byType[type].completed;
        delete byType[type].totalScore; // Remove intermediate value
    }

    return {
        totalCompleted,
        averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
        bestScore: Math.round(bestScore * 10) / 10,
        lastTrainingDate,
        byType
    };
}

/**
 * Get formatted last training date string
 * @param {string|null} isoDate - ISO date string
 * @returns {string} - Formatted date string or 'Never'
 */
export function formatLastTrainingDate(isoDate) {
    if (!isoDate) return 'Never';

    try {
        const date = new Date(isoDate);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            // Format as short date
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    } catch (e) {
        return 'Unknown';
    }
}

/**
 * Format a session for display in history list
 * @param {Object} session - TrainingSession object
 * @returns {Object} - Formatted session for UI
 */
export function formatSessionForDisplay(session) {
    if (!session) return null;

    const date = session.finishedAt || session.startedAt;
    const scorePercent = session.total > 0 ? Math.round((session.score / session.total) * 100) : 0;

    // Format date
    let dateStr = 'Unknown';
    try {
        const d = new Date(date);
        dateStr = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    } catch (e) {
        dateStr = 'Unknown';
    }

    // Format type
    const typeLabels = {
        'adult': 'Adult CPR',
        'child': 'Child CPR',
        'infant': 'Infant CPR',
        'mixed': 'Mixed'
    };

    return {
        id: session.id,
        date: dateStr,
        type: session.type,
        typeLabel: typeLabels[session.type] || session.type || 'Mixed',
        score: session.score,
        total: session.total,
        scorePercent: scorePercent,
        scoreDisplay: `${session.score}/${session.total} (${scorePercent}%)`
    };
}

/**
 * Get score color/grade based on percentage
 * @param {number} percentage - Score percentage
 * @returns {Object} - { color: string, grade: string }
 */
export function getScoreGrade(percentage) {
    if (percentage >= 80) {
        return { color: '#22c55e', grade: 'Excellent' }; // Green
    } else if (percentage >= 60) {
        return { color: '#eab308', grade: 'Good' }; // Yellow
    } else if (percentage >= 40) {
        return { color: '#f97316', grade: 'Needs Practice' }; // Orange
    } else {
        return { color: '#ef4444', grade: 'Keep Studying' }; // Red
    }
}
