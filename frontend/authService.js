/**
 * Authentication Service
 *
 * Uses AWS Cognito REST API directly (no AWS Amplify library needed).
 * Works perfectly with Capacitor and plain HTML/JS.
 */

import * as CognitoClient from './cognitoClient.js';
import { remove } from './storage.js';

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} email - Email address
 */
export async function register(username, password, email) {
    try {
        const result = await CognitoClient.signUp(username, password, email);
        console.log('[AuthService] User registered successfully:', username);
        return {
            success: true,
            userSub: result.UserSub,
            userConfirmed: result.UserConfirmed,
            codeDeliveryDetails: result.CodeDeliveryDetails
        };
    } catch (error) {
        console.error('[AuthService] Registration error:', error);
        throw error;
    }
}

/**
 * Confirm user registration with verification code
 * @param {string} username - Username
 * @param {string} code - Verification code from email
 */
export async function confirmRegister(username, code) {
    try {
        await CognitoClient.confirmSignUp(username, code);
        console.log('[AuthService] User confirmed successfully:', username);
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Confirmation error:', error);
        throw error;
    }
}

/**
 * Sign in a user
 * @param {string} username - Username
 * @param {string} password - Password
 */
export async function login(username, password) {
    try {
        const result = await CognitoClient.signIn(username, password);
        console.log('[AuthService] User logged in successfully:', username);
        return {
            success: true,
            tokens: result.AuthenticationResult
        };
    } catch (error) {
        console.error('[AuthService] Login error:', error);
        throw error;
    }
}

/**
 * Sign out the current user
 */
export async function logout() {
    try {
        // Clear onboarding state so next user/account sees the tour
        await remove('resqtap:onboardingCompleted');
        await remove('resqtap:onboardingStep');

        await CognitoClient.signOut();
        console.log('[AuthService] User logged out successfully');
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Logout error:', error);
        throw error;
    }
}

/**
 * Get current authenticated user
 * @returns {Object|null} User info or null if not authenticated
 */
export async function getAuthUser() {
    try {
        const user = await CognitoClient.getCurrentUser();
        if (user) {
            return {
                username: user.username,
                email: user.attributes.email,
                sub: user.attributes.sub,
                emailVerified: user.attributes.email_verified === 'true'
            };
        }
        return null;
    } catch (error) {
        console.error('[AuthService] Get user error:', error);
        return null;
    }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is authenticated
 */
export async function isLoggedIn() {
    return CognitoClient.isAuthenticated();
}

/**
 * Reset password (forgot password flow)
 * @param {string} username - Username
 */
export async function resetPassword(username) {
    try {
        const result = await CognitoClient.forgotPassword(username);
        console.log('[AuthService] Password reset initiated for:', username);
        return {
            success: true,
            codeDeliveryDetails: result.CodeDeliveryDetails
        };
    } catch (error) {
        console.error('[AuthService] Reset password error:', error);
        throw error;
    }
}

/**
 * Confirm password reset with code
 * @param {string} username - Username
 * @param {string} code - Verification code from email
 * @param {string} newPassword - New password
 */
export async function confirmResetPassword(username, code, newPassword) {
    try {
        await CognitoClient.confirmForgotPassword(username, code, newPassword);
        console.log('[AuthService] Password reset confirmed for:', username);
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Confirm reset password error:', error);
        throw error;
    }
}

/**
 * Resend verification code
 * @param {string} username - Username
 */
export async function resendSignUpCode(username) {
    try {
        const result = await CognitoClient.resendConfirmationCode(username);
        console.log('[AuthService] Verification code resent to:', username);
        return {
            success: true,
            codeDeliveryDetails: result.CodeDeliveryDetails
        };
    } catch (error) {
        console.error('[AuthService] Resend code error:', error);
        throw error;
    }
}

/**
 * Get authentication session (for API calls)
 * @returns {Object} Session object with tokens
 */
export async function fetchAuthSession() {
    const accessToken = CognitoClient.getAccessToken();
    const idToken = CognitoClient.getIdToken();

    if (!accessToken) {
        return { tokens: null };
    }

    return {
        tokens: {
            accessToken: {
                toString: () => accessToken
            },
            idToken: {
                toString: () => idToken
            }
        }
    };
}

/**
 * Change password for authenticated user
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 */
export async function changePassword(oldPassword, newPassword) {
    try {
        await CognitoClient.changePassword(oldPassword, newPassword);
        console.log('[AuthService] Password changed successfully');
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Change password error:', error);
        throw error;
    }
}

/**
 * Handle OAuth redirect (no-op for REST API auth)
 */
export async function handleRedirect() {
    // No-op - OAuth not used with REST API
    return { success: false, message: 'OAuth not implemented' };
}

/**
 * AuthService object for backward compatibility
 */
export const AuthService = {
    register: (username, email, password) => register(username, password, email), // Fix param order
    confirmRegistration: confirmRegister,
    resendConfirmationCode: resendSignUpCode,
    login,
    logout,
    getCurrentUser: getAuthUser,
    isLoggedIn,
    forgotPassword: resetPassword,
    confirmForgotPassword: confirmResetPassword,
    changePassword,
    getSession: fetchAuthSession
};

// Export all functions
export { CognitoClient };
