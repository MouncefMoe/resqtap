import { getJson, setJson } from './storage.js';
import { isLoggedIn } from './authService.js';
import { enqueueProfile } from './syncService.js';

const PROFILE_KEY = 'resqtap:profile';

export async function getProfile() {
    const profile = await getJson(PROFILE_KEY, {});
    return profile || {};
}

export async function saveProfile(profile) {
    const next = { ...(profile || {}), updatedAt: new Date().toISOString() };
    await setJson(PROFILE_KEY, next);
    if (await isLoggedIn()) {
        // enqueue for background sync; non-blocking
        enqueueProfile(next).catch(() => {});
    }
    return next;
}

export function validateProfile(profile) {
    // Minimal validation for MVP
    if (!profile) return { valid: false, message: 'Profile missing' };
    return { valid: true };
}
