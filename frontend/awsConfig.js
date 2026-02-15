// Placeholder AWS config for Cognito Hosted UI + API Gateway integration
export const AWS = {
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
    identityPoolId: '',
    hostedUiDomain: '', // e.g., https://your-domain.auth.region.amazoncognito.com
    redirectSignIn: '', // e.g., resqtap://auth-callback or https://app.local/auth
    redirectSignOut: '', // same scheme as above
    apiBase: '' // API Gateway base URL for profile/training endpoints (future phase)
};
