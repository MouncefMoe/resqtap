export const AMPLIFY_CONFIG = {
    Auth: {
        Cognito: {
            userPoolId: 'us-east-2_FAWeRCqg6',
            userPoolClientId: '3jgk6bspjforn3v0vccoo8rr95',
            signUpVerificationMethod: 'code',
            loginWith: {
                email: true
            }
        }
    }
};

// Import the dynamic API base function
import { getApiBase } from './api.js';

// Point to your Spring Boot backend. Use your machine's IP if testing on device.
export const API_BASE_URL = getApiBase() + '/api';