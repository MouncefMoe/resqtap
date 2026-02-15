// Use Capacitor Plugin API instead of ES module import
// This works without a bundler in plain HTML/JS apps
function getPreferences() {
    if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Preferences) {
        return window.Capacitor.Plugins.Preferences;
    }
    // Fallback to localStorage for web/testing
    return {
        async set({ key, value }) {
            localStorage.setItem(key, value);
        },
        async get({ key }) {
            return { value: localStorage.getItem(key) };
        },
        async remove({ key }) {
            localStorage.removeItem(key);
        }
    };
}

export async function setJson(key, value) {
    const Preferences = getPreferences();
    const serialized = JSON.stringify(value ?? null);
    await Preferences.set({ key, value: serialized });
}

export async function getJson(key, fallback = null) {
    const Preferences = getPreferences();
    const { value } = await Preferences.get({ key });
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch (err) {
        console.warn('Failed to parse stored JSON', err);
        return fallback;
    }
}

export async function remove(key) {
    const Preferences = getPreferences();
    await Preferences.remove({ key });
}

// ===== ONBOARDING STORAGE HELPERS =====

/**
 * Get a string value with fallback to default
 */
export async function get(key, fallback = null) {
    const Preferences = getPreferences();
    const { value } = await Preferences.get({ key });
    return value !== null && value !== undefined ? value : fallback;
}

/**
 * Set a string value
 */
export async function set(key, value) {
    const Preferences = getPreferences();
    await Preferences.set({ key, value: String(value) });
}
