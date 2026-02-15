// AWS Cognito Configuration
const COGNITO_DOMAIN = 'https://us-east-2_FAWeRCqg6.auth.us-east-2.amazoncognito.com';
const CLIENT_ID = '3jgk6bspjforn3v0vccoo8rr95';
const REDIRECT_URI = window.Capacitor?.isNative ? 'resqtap://auth/callback' : 'http://localhost:8100/auth/callback';

const STORAGE_KEY_SESSION = 'resqtap_session';
const STORAGE_KEY_PKCE = 'resqtap_pkce_verifier';

export const AuthService = {
    getToken() {
        try {
            const session = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION));
            return session ? session.id_token : null;
        } catch (e) {
            return null;
        }
    },

    getCurrentUser() {
        try {
            const session = localStorage.getItem(STORAGE_KEY_SESSION);
            if (!session) return null;

            const parsed = JSON.parse(session);
            // Decode ID token to get user info (simple base64 decode)
            if (parsed.id_token) {
                const payload = JSON.parse(atob(parsed.id_token.split('.')[1]));
                return {
                    id: payload.sub,
                    email: payload.email,
                    username: payload['cognito:username'],
                    ...payload
                };
            }
            return null;
        } catch (e) {
            return null;
        }
    },

    async login() {
        // Generate PKCE Verifier and Challenge
        const codeVerifier = this.generateRandomString(128);
        const codeChallenge = await this.generateCodeChallenge(codeVerifier);

        localStorage.setItem(STORAGE_KEY_PKCE, codeVerifier);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            scope: 'email openid phone',
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
    },

    async handleAuthCallback(url) {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');

        if (!code) throw new Error('No authorization code found');

        const codeVerifier = localStorage.getItem(STORAGE_KEY_PKCE);
        if (!codeVerifier) throw new Error('PKCE verifier missing');

        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier
        });

        const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokens = await response.json();
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(tokens));
        localStorage.removeItem(STORAGE_KEY_PKCE);

        return this.getCurrentUser();
    },

    logout() {
        localStorage.removeItem(STORAGE_KEY_SESSION);
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            logout_uri: window.Capacitor?.isNative ? 'resqtap://logout' : 'http://localhost:8100/'
        });
        window.location.href = `${COGNITO_DOMAIN}/logout?${params.toString()}`;
    },

    // PKCE Helpers
    generateRandomString(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        const values = new Uint8Array(length);
        crypto.getRandomValues(values);
        for (let i = 0; i < length; i++) {
            result += charset[values[i] % charset.length];
        }
        return result;
    },

    async generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return this.base64UrlEncode(new Uint8Array(digest));
    },

    base64UrlEncode(array) {
        let str = '';
        for (let i = 0; i < array.length; i++) {
            str += String.fromCharCode(array[i]);
        }
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },

    // Refresh token logic (basic implementation)
    async refreshToken() {
        // In a real app, you would use the refresh_token from storage
        // to get new access/id tokens from Cognito's /oauth2/token endpoint
        // with grant_type=refresh_token.
        // For now, we'll just rely on the user logging in again if tokens expire.
        const session = JSON.parse(localStorage.getItem(STORAGE_KEY_SESSION));
        if (!session || !session.refresh_token) {
            this.logout();
            return null;
        }
    }
};