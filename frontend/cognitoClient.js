/**
 * AWS Cognito REST API Client
 *
 * Direct REST API calls to AWS Cognito without AWS Amplify library.
 * Works perfectly with Capacitor and plain HTML/JS (no bundler needed).
 *
 * AWS Cognito Configuration:
 * - Region: us-east-2
 * - User Pool ID: us-east-2_FAWeRCqg6
 * - Client ID: 3jgk6bspjforn3v0vccoo8rr95
 */

const AWS_REGION = 'us-east-2';
const CLIENT_ID = '3jgk6bspjforn3v0vccoo8rr95';
const COGNITO_ENDPOINT = `https://cognito-idp.${AWS_REGION}.amazonaws.com/`;

/**
 * Make a request to AWS Cognito API with improved error handling
 */
async function cognitoRequest(action, body) {
    try {
        const response = await fetch(COGNITO_ENDPOINT, {
            method: 'POST',
            mode: 'cors',  // Explicitly enable CORS
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            // Extract error message from AWS Cognito response
            const errorMessage = data.message || data.__type || 'Cognito API error';

            // Provide user-friendly error messages for common issues
            if (errorMessage.includes('USER_PASSWORD_AUTH')) {
                throw new Error('Login method not enabled. Please enable USER_PASSWORD_AUTH in AWS Cognito Console (App Client settings → Authentication flows).');
            }

            if (errorMessage.includes('NotAuthorizedException')) {
                throw new Error('Incorrect username or password. Please try again.');
            }

            if (errorMessage.includes('UserNotFoundException')) {
                throw new Error('User not found. Please check your username or sign up for a new account.');
            }

            if (errorMessage.includes('InvalidPasswordException')) {
                throw new Error('Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.');
            }

            if (errorMessage.includes('UsernameExistsException')) {
                throw new Error('Username already exists. Please choose a different username or login.');
            }

            if (errorMessage.includes('CodeMismatchException')) {
                throw new Error('Invalid verification code. Please check the code and try again.');
            }

            if (errorMessage.includes('ExpiredCodeException')) {
                throw new Error('Verification code has expired. Please request a new code.');
            }

            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        // Handle network errors
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Cannot reach authentication server. Please check your internet connection.');
        }

        // Re-throw the error to be handled by the calling function
        throw error;
    }
}

/**
 * Sign up a new user
 * @param {string} username - Username
 * @param {string} password - Password (must meet Cognito requirements)
 * @param {string} email - Email address
 */
export async function signUp(username, password, email) {
    return await cognitoRequest('SignUp', {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ]
    });
}

/**
 * Confirm user registration with verification code
 * @param {string} username - Username
 * @param {string} code - Verification code from email
 */
export async function confirmSignUp(username, code) {
    return await cognitoRequest('ConfirmSignUp', {
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: code
    });
}

/**
 * Resend verification code
 * @param {string} username - Username
 */
export async function resendConfirmationCode(username) {
    return await cognitoRequest('ResendConfirmationCode', {
        ClientId: CLIENT_ID,
        Username: username
    });
}

/**
 * Sign in a user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object} Authentication result with tokens
 */
export async function signIn(username, password) {
    const result = await cognitoRequest('InitiateAuth', {
        ClientId: CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password
        }
    });

    // Store tokens in localStorage
    if (result.AuthenticationResult) {
        localStorage.setItem('cognito_id_token', result.AuthenticationResult.IdToken);
        localStorage.setItem('cognito_access_token', result.AuthenticationResult.AccessToken);
        localStorage.setItem('cognito_refresh_token', result.AuthenticationResult.RefreshToken);
        localStorage.setItem('cognito_username', username);
    }

    return result;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    // Get access token
    const accessToken = localStorage.getItem('cognito_access_token');

    if (accessToken) {
        try {
            await cognitoRequest('GlobalSignOut', {
                AccessToken: accessToken
            });
        } catch (e) {
            console.warn('Error during global sign out:', e);
        }
    }

    // Clear local tokens
    localStorage.removeItem('cognito_id_token');
    localStorage.removeItem('cognito_access_token');
    localStorage.removeItem('cognito_refresh_token');
    localStorage.removeItem('cognito_username');
    localStorage.removeItem('cognito_user_info');
}

/**
 * Get current authenticated user info
 * @returns {Object|null} User info or null if not authenticated
 */
export async function getCurrentUser() {
    const accessToken = localStorage.getItem('cognito_access_token');

    if (!accessToken) {
        return null;
    }

    try {
        const result = await cognitoRequest('GetUser', {
            AccessToken: accessToken
        });

        const userInfo = {
            username: result.Username,
            attributes: {}
        };

        // Parse user attributes
        if (result.UserAttributes) {
            result.UserAttributes.forEach(attr => {
                userInfo.attributes[attr.Name] = attr.Value;
            });
        }

        // Cache user info
        localStorage.setItem('cognito_user_info', JSON.stringify(userInfo));

        return userInfo;
    } catch (e) {
        console.warn('Error getting current user:', e);
        // Clear invalid tokens
        signOut();
        return null;
    }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user has valid access token
 */
export function isAuthenticated() {
    const accessToken = localStorage.getItem('cognito_access_token');
    return !!accessToken;
}

/**
 * Get access token
 * @returns {string|null} Access token or null
 */
export function getAccessToken() {
    return localStorage.getItem('cognito_access_token');
}

/**
 * Get ID token
 * @returns {string|null} ID token or null
 */
export function getIdToken() {
    return localStorage.getItem('cognito_id_token');
}

/**
 * Refresh access token using refresh token
 */
export async function refreshSession() {
    const refreshToken = localStorage.getItem('cognito_refresh_token');

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const result = await cognitoRequest('InitiateAuth', {
        ClientId: CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken
        }
    });

    // Update tokens
    if (result.AuthenticationResult) {
        localStorage.setItem('cognito_id_token', result.AuthenticationResult.IdToken);
        localStorage.setItem('cognito_access_token', result.AuthenticationResult.AccessToken);
        // Refresh token is not returned in refresh response, keep existing one
    }

    return result;
}

/**
 * Initiate forgot password flow
 * @param {string} username - Username
 */
export async function forgotPassword(username) {
    return await cognitoRequest('ForgotPassword', {
        ClientId: CLIENT_ID,
        Username: username
    });
}

/**
 * Confirm forgot password with code
 * @param {string} username - Username
 * @param {string} code - Verification code from email
 * @param {string} newPassword - New password
 */
export async function confirmForgotPassword(username, code, newPassword) {
    return await cognitoRequest('ConfirmForgotPassword', {
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: code,
        Password: newPassword
    });
}

/**
 * Change password for authenticated user
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 */
export async function changePassword(oldPassword, newPassword) {
    const accessToken = localStorage.getItem('cognito_access_token');

    if (!accessToken) {
        throw new Error('Not authenticated');
    }

    return await cognitoRequest('ChangePassword', {
        AccessToken: accessToken,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword
    });
}
