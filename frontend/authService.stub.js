/**
 * Stub Auth Service - No AWS Amplify Required
 *
 * This is a temporary stub for testing the app without AWS Amplify authentication.
 * Returns mock data to prevent app crashes.
 *
 * TODO: Re-enable real authService.js when AWS Cognito is fully configured
 */

// Mock user for testing
const mockUser = {
    username: 'testuser',
    email: 'test@resqtap.com',
    sub: 'mock-user-id-12345',
    attributes: {
        email: 'test@resqtap.com',
        email_verified: true
    }
};

export const AuthService = {
    async getCurrentUser() {
        // Return null to indicate "not logged in" for now
        return null;
    },

    async login(username, password) {
        console.log('[AuthService STUB] Login called - returning mock success');
        return { user: mockUser };
    },

    async register(username, email, password) {
        console.log('[AuthService STUB] Register called - returning mock success');
        return { user: mockUser };
    },

    async confirmRegistration(username, code) {
        console.log('[AuthService STUB] Confirm registration called');
        return { success: true };
    },

    async resendConfirmationCode(username) {
        console.log('[AuthService STUB] Resend code called');
        return { success: true };
    },

    async forgotPassword(username) {
        console.log('[AuthService STUB] Forgot password called');
        return { success: true };
    },

    async confirmForgotPassword(username, code, newPassword) {
        console.log('[AuthService STUB] Confirm forgot password called');
        return { success: true };
    },

    async logout() {
        console.log('[AuthService STUB] Logout called');
        return { success: true };
    },

    async getSession() {
        console.log('[AuthService STUB] Get session called');
        return null;
    }
};

// Also export individual functions for compatibility
export async function register(username, password, email) {
    return AuthService.register(username, email, password);
}

export async function confirmRegister(username, code) {
    return AuthService.confirmRegistration(username, code);
}

export async function login(username, password) {
    return AuthService.login(username, password);
}

export async function logout() {
    return AuthService.logout();
}

export async function getCurrentUser() {
    return AuthService.getCurrentUser();
}

export async function fetchAuthSession() {
    return { tokens: null };
}

export async function resetPassword(username) {
    return AuthService.forgotPassword(username);
}

export async function confirmResetPassword(username, code, newPassword) {
    return AuthService.confirmForgotPassword(username, code, newPassword);
}

export async function resendSignUpCode(username) {
    return AuthService.resendConfirmationCode(username);
}

// Additional required exports for compatibility
export function isLoggedIn() {
    // Return false to indicate "not logged in" for now
    return false;
}

export function getAuthUser() {
    // Return null to indicate "not logged in" for now
    return null;
}

export async function handleRedirect() {
    // Stub for OAuth redirect handling
    console.log('[AuthService STUB] Handle redirect called');
    return { success: false, message: 'Auth not configured' };
}
