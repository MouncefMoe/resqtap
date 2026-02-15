import { isLoggedIn } from './authService.js';
import { apiClient } from './apiClient.js';
import { getJson, setJson } from './storage.js';
import { getProfile, saveProfile } from './profileService.js';
import { getFavorites, setFavorites } from './favorites.js';

const SYNC_QUEUE_KEY = 'resqtap:syncQueue';
const MAX_RETRIES = 3;
let syncing = false;
let initialized = false;

const EVENT_NAMES = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    VISIBILITY: 'visibilitychange',
    AUTH_CHANGED: 'auth-changed'
};

async function loadQueue() {
    return (await getJson(SYNC_QUEUE_KEY, [])) || [];
}

async function saveQueue(queue) {
    await setJson(SYNC_QUEUE_KEY, queue);
}

export async function enqueueProfile(profile) {
    const queue = await loadQueue();
    queue.push({
        type: 'profile',
        payload: profile,
        updatedAt: profile.updatedAt,
        retries: 0
    });
    await saveQueue(queue);
    triggerSync('enqueueProfile');
}

export async function enqueueFavorites(favs) {
    const queue = await loadQueue();
    queue.push({
        type: 'favorites',
        payload: favs,
        updatedAt: Date.now(),
        retries: 0
    });
    await saveQueue(queue);
    triggerSync('enqueueFavorites');
}

export async function enqueueTrainingSession(session) {
    const queue = await loadQueue();
    queue.push({
        type: 'trainingSession',
        payload: session,
        updatedAt: session.completedAt,
        retries: 0
    });
    await saveQueue(queue);
    triggerSync('enqueueTraining');
}

function isOnline() {
    return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function startSync() {
    if (initialized) return;
    initialized = true;
    window.addEventListener(EVENT_NAMES.ONLINE, () => triggerSync('online'));
    window.addEventListener(EVENT_NAMES.VISIBILITY, () => {
        if (document.visibilityState === 'visible') triggerSync('resume');
    });
    window.addEventListener(EVENT_NAMES.AUTH_CHANGED, () => triggerSync('auth-change'));
    triggerSync('init');
}

async function processQueue() {
    if (syncing) return;
    const loggedIn = await isLoggedIn();
    if (!loggedIn || !isOnline()) return;
    syncing = true;
    try {
        let queue = await loadQueue();
        const remaining = [];
        for (const item of queue) {
            try {
                if (item.type === 'profile') {
                    await apiClient.putProfile(item.payload);
                } else if (item.type === 'favorites') {
                    await apiClient.putFavorites(item.payload);
                } else if (item.type === 'trainingSession') {
                    await apiClient.putTrainingSessions([item.payload]);
                }
            } catch (err) {
                item.retries = (item.retries || 0) + 1;
                if (item.retries < MAX_RETRIES) remaining.push(item);
            }
        }
        await saveQueue(remaining);
        await pullRemote();
    } finally {
        syncing = false;
    }
}

async function pullRemote() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn || !isOnline()) return;
    try {
        // Profile merge: last-write-wins by updatedAt
        const remoteProfile = await apiClient.getProfile();
        if (remoteProfile) {
            const localProfile = await getProfile();
            const localTime = new Date(localProfile.updatedAt || 0).getTime();
            const remoteTime = new Date(remoteProfile.updatedAt || 0).getTime();
            if (remoteTime > localTime) {
                await saveProfile(remoteProfile);
            } else if (localTime > remoteTime) {
                await apiClient.putProfile(localProfile);
            }
        }
    } catch (err) {
        console.warn('Profile pull failed', err);
    }
    try {
        // Favorites merge: union of local + cloud
        const remoteFavsResp = await apiClient.getFavorites();
        const remoteFavs = remoteFavsResp?.favorites || [];
        const localFavs = getFavorites();
        const merged = Array.from(new Set([...(localFavs || []), ...(remoteFavs || [])]));
        setFavorites(merged);
        await apiClient.putFavorites(merged);
    } catch (err) {
        console.warn('Favorites pull failed', err);
    }

    try {
        const remoteSessionsResp = await apiClient.listTrainingSessions();
        const remoteSessions = remoteSessionsResp?.sessions || [];
        // Use new unified storage key
        const localHistory = (await getJson('resqtap:trainingHistory', { sessions: [] })) || { sessions: [] };
        const localSessions = localHistory.sessions || [];
        const map = new Map();
        [...localSessions, ...remoteSessions].forEach(s => {
            const key = s.id || s.completedAt || s.finishedAt;
            if (key) map.set(key, s);
        });
        const merged = Array.from(map.values()).sort((a, b) => {
            const dateA = new Date(a.finishedAt || a.completedAt);
            const dateB = new Date(b.finishedAt || b.completedAt);
            return dateB - dateA; // Newest first
        });
        await setJson('resqtap:trainingHistory', { sessions: merged, lastUpdated: new Date().toISOString() });
    } catch (err) {
        console.warn('Training pull failed', err);
    }
}

export function triggerSync(reason = '') {
    if (!isOnline()) return;
    requestIdleCallback?.(processQueue) || setTimeout(processQueue, 0);
}
