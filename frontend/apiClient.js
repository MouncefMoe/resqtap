import { API_BASE_URL } from './config.js';
import { fetchAuthSession } from './authService.js';

async function getAuthHeader() {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (e) {
        console.warn('Failed to fetch auth session:', e);
        return {};
    }
}

async function request(endpoint, options = {}) {
    const headers = await getAuthHeader();
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (response.status === 401) {
        // Handle unauthorized (optional: redirect to login)
        throw new Error('Unauthorized');
    }
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    // Return null for 204 No Content, otherwise JSON
    if (response.status === 204) return null;
    return response.json();
}

export const apiClient = {
    getProfile: () => request('/profile').catch(() => null), // Return null if not found
    putProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
    
    getFavorites: () => request('/favorites').catch(() => ({ favorites: [] })),
    putFavorites: (favs) => request('/favorites', { method: 'PUT', body: JSON.stringify({ favorites: favs }) }),
    
    listTrainingSessions: () => request('/training/sessions').catch(() => ({ sessions: [] })),
    putTrainingSessions: (sessions) => request('/training/sessions', { method: 'POST', body: JSON.stringify(sessions) })
};