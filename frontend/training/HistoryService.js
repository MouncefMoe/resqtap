/**
 * HistoryService.js - Single Source of Truth for Training History
 *
 * Handles all CRUD operations for training session history.
 * Uses Capacitor Preferences (via storage.js) for cross-platform persistence.
 *
 * Storage Key: 'resqtap:trainingHistory'
 *
 * HistoryData format:
 * {
 *   sessions: TrainingSession[],
 *   lastUpdated: string (ISO timestamp)
 * }
 *
 * TrainingSession format:
 * {
 *   id: string,
 *   type: 'adult' | 'child' | 'infant' | 'mixed',
 *   startedAt: string (ISO),
 *   finishedAt: string (ISO),
 *   score: number,
 *   total: number,
 *   questionIds: string[],
 *   answers: number[],
 *   correctAnswers: number[]
 * }
 */

import { getJson, setJson } from '../storage.js';

// Single storage key - DO NOT CHANGE
const STORAGE_KEY = 'resqtap:trainingHistory';

// Default empty history
const DEFAULT_HISTORY = {
    sessions: [],
    lastUpdated: null
};

/**
 * Load training history from storage
 * @returns {Promise<Object>} - HistoryData object with sessions array
 */
export async function load() {
    try {
        const data = await getJson(STORAGE_KEY, DEFAULT_HISTORY);

        // Ensure sessions is always an array
        if (!data || !Array.isArray(data.sessions)) {
            return { ...DEFAULT_HISTORY };
        }

        return data;
    } catch (error) {
        console.error('[HistoryService] Failed to load history:', error);
        return { ...DEFAULT_HISTORY };
    }
}

/**
 * Save training history to storage
 * @param {Object} historyData - HistoryData object to save
 * @returns {Promise<boolean>} - True if save succeeded
 */
export async function save(historyData) {
    try {
        // Validate structure
        if (!historyData || !Array.isArray(historyData.sessions)) {
            console.error('[HistoryService] Invalid history data structure');
            return false;
        }

        // Update timestamp
        historyData.lastUpdated = new Date().toISOString();

        await setJson(STORAGE_KEY, historyData);
        return true;
    } catch (error) {
        console.error('[HistoryService] Failed to save history:', error);
        return false;
    }
}

/**
 * Add a completed session to history
 * Sessions are added to the front (newest first)
 * @param {Object} session - TrainingSession object
 * @returns {Promise<boolean>} - True if save succeeded
 */
export async function addSession(session) {
    try {
        // Validate required session fields
        if (!session || !session.id || typeof session.score !== 'number') {
            console.error('[HistoryService] Invalid session object:', session);
            return false;
        }

        const history = await load();

        // Add to front (newest first)
        history.sessions.unshift(session);

        // Limit history to last 100 sessions to prevent storage bloat
        if (history.sessions.length > 100) {
            history.sessions = history.sessions.slice(0, 100);
        }

        return await save(history);
    } catch (error) {
        console.error('[HistoryService] Failed to add session:', error);
        return false;
    }
}

/**
 * Get all sessions from history
 * @returns {Promise<Array>} - Array of TrainingSession objects (newest first)
 */
export async function getSessions() {
    const history = await load();
    return history.sessions || [];
}

/**
 * Get session count
 * @returns {Promise<number>} - Total number of completed sessions
 */
export async function getSessionCount() {
    const sessions = await getSessions();
    return sessions.length;
}

/**
 * Get most recent session
 * @returns {Promise<Object|null>} - Most recent session or null if none
 */
export async function getLastSession() {
    const sessions = await getSessions();
    return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Clear all training history (use with caution)
 * @returns {Promise<boolean>} - True if clear succeeded
 */
export async function clearHistory() {
    try {
        await setJson(STORAGE_KEY, { ...DEFAULT_HISTORY });
        return true;
    } catch (error) {
        console.error('[HistoryService] Failed to clear history:', error);
        return false;
    }
}

// Export the storage key for debugging purposes only
export const HISTORY_STORAGE_KEY = STORAGE_KEY;
