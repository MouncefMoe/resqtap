import { isLoggedIn, getAuthUser, login, logout, handleRedirect } from './authService.js';
import { startSync, triggerSync } from './syncService.js';

const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const profileSyncHint = document.getElementById('profileSyncHint');

async function renderStatus() {
    const loggedIn = await isLoggedIn();
    const user = await getAuthUser();
    if (loggedIn && user?.email) {
        statusBadge.textContent = 'Signed in';
        statusBadge.className = 'badge success-badge';
        statusText.textContent = `Signed in as ${user.email}`;
        signInBtn.classList.add('is-hidden');
        signOutBtn.classList.remove('is-hidden');
        if (profileSyncHint) profileSyncHint.textContent = 'Profile will sync when online.';
    } else {
        statusBadge.textContent = 'Offline mode';
        statusBadge.className = 'badge muted-badge';
        statusText.textContent = 'Using ResqTap without an account. CPR and First Aid stay fully offline.';
        signInBtn.classList.remove('is-hidden');
        signOutBtn.classList.add('is-hidden');
        if (profileSyncHint) profileSyncHint.textContent = 'Sign in to sync across devices (optional).';
    }
}

function bindEvents() {
    signInBtn?.addEventListener('click', async () => {
        await login();
    });
    signOutBtn?.addEventListener('click', async () => {
        await logout();
        renderStatus();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await handleRedirect();
    bindEvents();
    startSync();
    triggerSync('settings-open');
    renderStatus();
});
