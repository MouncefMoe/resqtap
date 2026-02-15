/**
 * progressService.js - Training Progress Summary
 *
 * Provides progress summary for profile display.
 * Uses the new HistoryService as single source of truth.
 */

import * as HistoryService from './training/HistoryService.js';

/**
 * Get training progress summary
 * @param {number} refreshMonths - Number of months before refresh is recommended
 * @returns {Promise<Object>} - Progress summary object
 */
export async function getProgressSummary(refreshMonths = 6) {
    const sessions = await HistoryService.getSessions();

    if (!sessions || sessions.length === 0) {
        return {
            lastTrainingDate: null,
            total: 0,
            monthlyCounts: {},
            refreshOverdue: true
        };
    }

    // Get date field (finishedAt or completedAt for backwards compatibility)
    const getDate = (s) => s.finishedAt || s.completedAt || s.startedAt;

    // Sort by date (newest first)
    const sorted = [...sessions].sort((a, b) => {
        const dateA = new Date(getDate(a));
        const dateB = new Date(getDate(b));
        return dateB - dateA;
    });

    const lastDate = getDate(sorted[0]);
    const total = sessions.length;

    // Count sessions per month
    const monthlyCounts = {};
    sessions.forEach(s => {
        const dateStr = getDate(s);
        if (!dateStr) return;

        try {
            const d = new Date(dateStr);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        } catch (e) {
            // Skip invalid dates
        }
    });

    // Check if refresh is overdue
    const monthsSince = monthsBetween(new Date(lastDate), new Date());
    const refreshOverdue = monthsSince >= refreshMonths;

    return {
        lastTrainingDate: lastDate,
        total,
        monthlyCounts,
        refreshOverdue
    };
}

/**
 * Calculate months between two dates
 */
function monthsBetween(a, b) {
    return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
