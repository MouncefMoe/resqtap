import { saveProfile, getProfile } from './profileService.js';
import { enqueueTrainingSession } from './syncService.js';
import { getJson, setJson } from './storage.js';

export const UserService = {
    async updateHealthProfile(data) {
        const current = await getProfile();
        const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
        await saveProfile(updated);
        return updated;
    },

    async addTrainingSession(session) {
        // Use new unified storage format
        const historyData = await getJson('resqtap:trainingHistory', { sessions: [] });
        const sessions = historyData.sessions || [];

        const newSession = {
            id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
            ...session,
            finishedAt: new Date().toISOString()
        };

        // Add to front (newest first)
        sessions.unshift(newSession);

        await setJson('resqtap:trainingHistory', {
            sessions: sessions,
            lastUpdated: new Date().toISOString()
        });

        // Queue for sync
        enqueueTrainingSession({
            ...newSession,
            completedAt: newSession.finishedAt
        });

        return newSession;
    }
};