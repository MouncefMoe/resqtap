console.log('[Script] Main script starting...');
import { getFavorites, isFavorite, toggleFavorite, getFavoritesCount } from './favorites.js';
import { AuthService } from './authService.js';
import { UserService } from './user.js';
import { getRandomQuestions } from './training/QuestionBank.js';
import { API_BASE_URL } from './config.js';
import { imageCache } from './imageCache.js';
import { isOnboardingCompleted, getTourInstance } from './onboarding-tour.js';

// ===================== CONFIG =====================
const FALLBACK_IMAGE = '/images/fallback.jpg';
const JSON_DATA_FILES = [
    'cardiac.json', 'trauma.json', 'burns.json', 'allergic.json',
    'poisoning.json', 'neurological.json', 'respiratory.json',
    'environmental.json', 'medical.json', 'bites.json',
    'pregnancy.json', 'dental.json', 'mental-health.json', 'eye.json',
    'water.json', 'airway.json'
    // Removed legacy CPR files: cpr-adult.json, cpr-child.json, cpr-infant.json
    // These have no category field and were creating empty "general" category
    // CPR functionality is handled by cpr.html with its own dedicated UI
];

const CATEGORY_ICONS = {
    cardiac: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-2 5 5 0 0 1 9 2c0 5.65-7 10-7 10z"/></svg>',
    trauma: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h9"/></svg>',
    burns: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s3 3 3 6-1.5 5-3 6.5S9 17 9 13s3-4 3-7Z"/></svg>',
    allergic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13c0-4 3-7 8-7s8 3 8 7-3 7-8 7-8-3-8-7Z"/><path d="M12 6v12"/></svg>',
    respiratory: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v7l-2 4h4l-2 7"/><path d="M8 7c-2 1-3 3-3 5"/><path d="M16 7c2 1 3 3 3 5"/></svg>',
    neurological: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M9 9h6"/><path d="M9 13h3"/></svg>',
    bites: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 0 1 14 0c0 3.87-3.13 7-7 7a7 7 0 0 1-7-7Z"/><path d="M9 12h.01"/><path d="M15 12h.01"/></svg>',
    default: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 9v12h16V9Z"/><path d="M9 21v-6h6v6"/></svg>'
};

let ALL_EMERGENCIES = [];
let EMERGENCIES_PROMISE = null;
let renderFrame = null;
let SEARCH_QUERY = '';

// Filter state variables - use explicit state instead of DOM queries for reliability on mobile
let CURRENT_CATEGORY_FILTER = 'all';
let CURRENT_SEVERITY_FILTER = 'all';

// Performance: DOM caching for instant navigation
let HOME_DOM_CACHE = null;
let HOME_SCROLL_CACHE = 0;
let HOME_DATA_VERSION = 0; // Increment when data changes

console.log(`[ResqTap] API_BASE set to: ${API_BASE_URL}`);

/* ===================== HELPERS ===================== */

// Throttle utility for scroll handlers (60fps = ~16ms)
const throttle = (fn, wait) => {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn(...args);
        }
    };
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

const getSeverityClass = (severity) => {
    if (!severity) return 'severity-low';
    switch (severity.toUpperCase()) {
        case 'CRITICAL': return 'severity-critical';
        case 'HIGH': return 'severity-high';
        case 'MEDIUM': return 'severity-medium';
        case 'LOW': return 'severity-low';
        default: return 'severity-low';
    }
};

const formatCategoryLabel = (category) => {
    if (!category) return '';
    return category
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const normalizeValue = (value) => (value || '').toString().trim().toLowerCase();

const renderSkeletons = () => {
    const container = document.getElementById('crisisContainer');
    if (!container) return;
    container.innerHTML = Array(8).fill(`
        <article class="emergency-card skeleton" style="min-height: 200px;">
            <div class="card-image-wrapper" style="background:#f3f4f6;height:150px;border-radius:12px;"></div>
            <div class="card-content">
                <div style="height:20px;background:#e5e7eb;border-radius:6px;width:70%;margin:12px 0;"></div>
                <div style="height:14px;background:#e5e7eb;border-radius:6px;width:50%;"></div>
            </div>
        </article>
    `).join('');
};

/* ===================== DATA LOADING ===================== */

/**
 * Fetches all emergencies from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of emergencies.
 */
async function fetchEmergenciesFromApi() {
    const response = await fetch(`${API_BASE_URL}/emergencies`);
    if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
    }
    return response.json();
}

/**
 * Fetches all emergencies from local JSON files as a fallback.
 * @returns {Promise<Array>} A promise that resolves to a combined array of emergencies.
 */
async function fetchEmergenciesFromLocalFiles() {
    console.warn('API fetch failed. Falling back to local JSON files.');
    const offlineIndicator = document.getElementById('offlineIndicator');
    if (offlineIndicator) {
        offlineIndicator.hidden = false;
    }

    const promises = JSON_DATA_FILES.map(file =>
        fetch(`/data/${file}`).then(res => res.ok ? res.json() : Promise.reject(file))
    );

    const results = await Promise.allSettled(promises);

    // Handle both array format (modern) and object format (legacy CPR files)
    const allLocalEmergencies = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => {
            const data = result.value;
            // If it's an array, return as-is
            if (Array.isArray(data)) {
                return data;
            }
            // If it's an object (legacy CPR format), wrap in array
            if (typeof data === 'object' && data !== null) {
                return [data];
            }
            return [];
        });

    if (allLocalEmergencies.length === 0) {
        console.error('Failed to load any local JSON data.');
        return [];
    }
    return allLocalEmergencies;
}

/**
 * Main function to load emergency data, preferring API with a local JSON fallback.
 */
async function loadEmergencies() {
    if (EMERGENCIES_PROMISE) {
        return EMERGENCIES_PROMISE;
    }

    renderSkeletons();

    // Force offline mode: use local JSON files only (fixes numeric ID vs string slug mismatch)
    EMERGENCIES_PROMISE = fetchEmergenciesFromLocalFiles();

    try {
        const data = await EMERGENCIES_PROMISE;
        ALL_EMERGENCIES = data;

        if (data.length === 0) {
            showEmptyState('No emergencies could be loaded.');
            return;
        }

        // Performance: Preload all emergency images for instant display
        const imageUrls = data
            .map(e => e.imageUrl || e.image)
            .filter(Boolean);
        imageCache.preload(imageUrls);
        console.log(`[Performance] Preloading ${imageUrls.length} emergency images`);

        updateFavoritesCounter();
        applyFilters(); // Renders the loaded data

        HOME_DATA_VERSION++; // Invalidate cache when data changes

        // Signal that emergencies are loaded (for onboarding tour)
        window.dispatchEvent(new Event('emergenciesLoaded'));
    } catch (err) {
        console.error('Fatal: Could not load emergencies from API or local files.', err);
        showEmptyState('Could not load emergency data. Please check your connection or try again later.');
    }
}

/* ===================== FAVORITES ===================== */
function updateFavoritesCounter() {
    const counter = document.getElementById('favoritesCount');
    if (counter) {
        counter.textContent = getFavoritesCount();
    }
}

function handleFavoriteToggle(slug, event) {
    event.preventDefault();
    event.stopPropagation();
    
    toggleFavorite(slug);
    
    // Update button UI directly
    const button = event.currentTarget;
    if (button) {
        button.classList.toggle('is-favorite', isFavorite(slug));
    }
    updateFavoritesCounter();
}


/* ===================== RENDERING & FILTERING ===================== */

function showEmptyState(message) {
    const container = document.getElementById('crisisContainer');
    if (container) {
        container.innerHTML = `<p class="empty-state">${escapeHtml(message)}</p>`;
    }
}

function createEmergencyCard(emergency) {
    const cardLink = document.createElement('a');
    cardLink.href = `injury.html?id=${emergency.id}`;
    cardLink.className = 'emergency-card-link';

    const severityClass = getSeverityClass(emergency.severity);
    const categoryLabel = formatCategoryLabel(emergency.category);
    const isFav = isFavorite(emergency.id);
    const categoryKey = normalizeValue(emergency.category);
    const categoryIcon = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.default;

    const card = document.createElement('article');
    card.className = `emergency-card pro-card`;
    
    card.innerHTML = `
        <div class="card-media">
            <img src="${escapeHtml(emergency.imageUrl || emergency.image || FALLBACK_IMAGE)}"
                 alt="${escapeHtml(emergency.name)}"
                 class="card-image"
                 loading="eager"
                 decoding="async"
                 fetchpriority="high"
                 onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';" />
            <button class="favorite-btn ${isFav ? 'is-favorite' : ''}" data-slug="${emergency.id}" title="Toggle Favorite">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
        <div class="card-body">
            <div class="card-title-row">
                <h2 class="card-title">${escapeHtml(emergency.name)}</h2>
                <span class="steps-chip">
                    ${(emergency.steps && emergency.steps.length) || 0} steps
                </span>
            </div>
            <div class="card-meta">
                <span class="category-pill with-icon">
                    <span class="pill-icon" aria-hidden="true">${categoryIcon}</span>
                    ${escapeHtml(categoryLabel || 'General')}
                </span>
                <span class="severity-dot ${severityClass}" aria-hidden="true"></span>
            </div>
            <div class="card-footer-badge">
                <span class="severity-badge ${severityClass}">
                    ${escapeHtml(emergency.severity || 'LOW')}
                </span>
            </div>
        </div>
    `;
    
    card.querySelector('.favorite-btn').addEventListener('click', (event) => {
        handleFavoriteToggle(emergency.id, event);
    });
    
    cardLink.appendChild(card);
    return cardLink;
}

function renderEmergencies(emergencies) {
    const container = document.getElementById('crisisContainer');
    if (!container) return;

    if (renderFrame) cancelAnimationFrame(renderFrame);

    renderFrame = requestAnimationFrame(() => {
        if (!emergencies || emergencies.length === 0) {
            showEmptyState('No emergencies match your filters.');
            return;
        }

        // Group emergencies by category
        const grouped = {};
        emergencies.forEach(emergency => {
            const category = emergency.category; // All emergencies now have categories
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(emergency);
        });

        // Build horizontal scroll sections (use DocumentFragment for performance)
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        Object.keys(grouped).sort().forEach(category => {
            // Skip empty categories (safety filter)
            if (!grouped[category] || grouped[category].length === 0) {
                return;
            }

            const categoryLabel = formatCategoryLabel(category);
            const categoryKey = normalizeValue(category);
            const categoryIcon = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.default;

            // Create category section
            const section = document.createElement('div');
            section.className = 'category-section';

            // Category header
            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <div class="category-header-content">
                    <span class="category-icon-circle" aria-hidden="true">${categoryIcon}</span>
                    <h2 class="category-title">${escapeHtml(categoryLabel)}</h2>
                    <span class="category-count">${grouped[category].length}</span>
                </div>
            `;

            // Horizontal scroll container with scroll arrows
            const scrollContainer = document.createElement('div');
            scrollContainer.className = 'cards-scroll-container';

            // Left arrow
            const leftArrow = document.createElement('button');
            leftArrow.className = 'scroll-arrow scroll-arrow-left';
            leftArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
            leftArrow.style.display = 'none'; // Hidden by default

            // Right arrow
            const rightArrow = document.createElement('button');
            rightArrow.className = 'scroll-arrow scroll-arrow-right';
            rightArrow.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

            const cardsWrapper = document.createElement('div');
            cardsWrapper.className = 'cards-row';

            grouped[category].forEach(emergency => {
                cardsWrapper.appendChild(createEmergencyCard(emergency));
            });

            scrollContainer.appendChild(leftArrow);
            scrollContainer.appendChild(cardsWrapper);
            scrollContainer.appendChild(rightArrow);

            // Scroll arrow functionality (throttled for performance)
            const updateArrows = () => {
                const { scrollLeft, scrollWidth, clientWidth } = cardsWrapper;
                leftArrow.style.display = scrollLeft > 20 ? 'flex' : 'none';
                rightArrow.style.display = scrollLeft < scrollWidth - clientWidth - 20 ? 'flex' : 'none';
            };

            const throttledUpdateArrows = throttle(updateArrows, 16); // 60fps

            leftArrow.addEventListener('click', () => {
                cardsWrapper.scrollBy({ left: -300, behavior: 'smooth' });
            });

            rightArrow.addEventListener('click', () => {
                cardsWrapper.scrollBy({ left: 300, behavior: 'smooth' });
            });

            cardsWrapper.addEventListener('scroll', throttledUpdateArrows);

            // Initial arrow state
            setTimeout(updateArrows, 100);

            // Auto-scroll hint animation (subtle bounce to show scrollability)
            setTimeout(() => {
                if (cardsWrapper.scrollWidth > cardsWrapper.clientWidth) {
                    // Subtle bounce animation to hint at scrollability
                    const scrollHintAnimation = [
                        { transform: 'translateX(0px)' },
                        { transform: 'translateX(-15px)' },
                        { transform: 'translateX(0px)' }
                    ];
                    const scrollHintTiming = {
                        duration: 800,
                        iterations: 2,
                        easing: 'ease-in-out'
                    };
                    cardsWrapper.animate(scrollHintAnimation, scrollHintTiming);
                }
            }, 500);

            section.appendChild(header);
            section.appendChild(scrollContainer);
            fragment.appendChild(section); // Append to fragment instead of DOM
        });

        // Batch append all sections at once (1 reflow instead of 16)
        container.appendChild(fragment);
    });
}

function applyFilters() {
    const categoryValue = normalizeValue(CURRENT_CATEGORY_FILTER);
    const severityValue = normalizeValue(CURRENT_SEVERITY_FILTER);
    const showFavorites = document.getElementById('favoritesToggle')?.classList.contains('active') || false;
    const searchValue = normalizeValue(SEARCH_QUERY || '');

    const favs = getFavorites();

    const filtered = ALL_EMERGENCIES.filter(emergency => {
        if (showFavorites && !favs.includes(emergency.id)) {
            return false;
        }

        const categoryMatch = categoryValue === 'all' || normalizeValue(emergency.category) === categoryValue;
        const severityMatch = severityValue === 'all' || normalizeValue(emergency.severity) === severityValue;

        const name = normalizeValue(emergency.name);
        const desc = normalizeValue(emergency.description);
        const searchMatch = !searchValue || name.includes(searchValue) || desc.includes(searchValue);

        return categoryMatch && severityMatch && searchMatch;
    });

    renderEmergencies(filtered);
}

/**
 * Initialize simple select-based filters
 */
function initFilters() {
    const categorySelect = document.getElementById('categorySelect');
    const severitySelect = document.getElementById('severitySelect');

    if (categorySelect) {
        categorySelect.value = CURRENT_CATEGORY_FILTER;
        categorySelect.addEventListener('change', (e) => {
            CURRENT_CATEGORY_FILTER = e.target.value;
            applyFilters();
        });
    }

    if (severitySelect) {
        severitySelect.value = CURRENT_SEVERITY_FILTER;
        severitySelect.addEventListener('change', (e) => {
            CURRENT_SEVERITY_FILTER = e.target.value;
            applyFilters();
        });
    }
}

/* ===================== INIT ===================== */

const Templates = {
    Login: `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header" style="text-align: center;">
                    <img src="images/app-icon/resqtap-icon-1024.png" class="app-logo-img" alt="ResqTap Logo">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 800;">ResqTap Pro</h1>
                    <p class="muted" style="font-size: 15px;">Professional Emergency Response Platform</p>
                </div>
                <div id="authError" class="error-message is-hidden"></div>
                <form id="loginForm" class="form-group">
                    <div class="form-group">
                        <label style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Username or Email</label>
                        <input type="text" name="username" required placeholder="username or email" style="background: #f8fafc; border-color: #e2e8f0; color: #0f172a;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Password</label>
                        <div style="position:relative;">
                            <input type="password" id="passwordInput" name="password" required placeholder="••••••" style="background: #f8fafc; border-color: #e2e8f0; padding-right: 50px; color: #0f172a;">
                            <button type="button" id="togglePassword" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#0284c7; font-size:12px; font-weight:700;">SHOW</button>
                        </div>
                    </div>
                    <button type="submit" class="nav-btn primary fullwidth" style="margin-top:16px; height: 50px; font-size: 16px; background: #0284c7;">Secure Login</button>
                </form>
                <div class="auth-footer">
                    <span class="link-text" id="goForgotPassword">Forgot Password?</span>
                    <span style="margin: 0 8px;">•</span>
                    <span class="link-text" id="goSignup">Create Account</span>
                </div>
                <div style="text-align:center; margin-top:16px; font-size:13px;">
                    <span class="link-text" id="goVerify" style="color:#64748b;">Have a code? Verify Account</span>
                </div>
            </div>
        </div>`,
    Signup: `
        <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1 style="color: #0f172a;">Create Profile</h1>
                <p class="muted">Join the professional response network</p>
            </div>
            <div id="authError" class="error-message is-hidden"></div>
            <form id="signupForm" class="form-group">
                <div class="form-group"><label>Username</label><input type="text" name="username" required placeholder="username" style="color: #0f172a;"></div>
                <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="name@example.com" style="color: #0f172a;"></div>
                <div class="form-group">
                    <label>Password</label>
                    <div style="position:relative;">
                        <input type="password" id="signupPasswordInput" name="password" required placeholder="Min 8 chars, 1 Upper, 1 Special" style="padding-right: 50px; color: #0f172a;">
                        <button type="button" id="toggleSignupPassword" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#0284c7; font-size:12px; font-weight:700;">SHOW</button>
                    </div>
                    <p class="small muted" style="font-size: 11px; margin-top: 4px;">Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special.</p>
                </div>
                <button type="submit" class="nav-btn primary fullwidth" style="background: #0284c7;">Create Account</button>
            </form>
            <div class="auth-footer">Already have an account? <span class="link-text" id="goLogin">Sign In</span></div>
        </div>
        </div>
    `,
    VerifyAccount: `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Verify Account</h1>
                    <p class="muted">Enter the code sent to your email.</p>
                </div>
                <div id="authError" class="error-message is-hidden"></div>
                <div id="authSuccess" class="feedback-area correct is-hidden" style="margin-bottom:16px;background:#f0fdf4;color:#15803d;padding:10px;border-radius:8px;"></div>
                <form id="verifyForm" class="form-group">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required placeholder="username">
                    </div>
                    <div class="form-group">
                        <label>Verification Code</label>
                        <input type="text" name="code" required placeholder="123456">
                    </div>
                    <button type="submit" class="nav-btn primary fullwidth">Verify Account</button>
                </form>
                <div style="text-align:center; margin-top:12px;">
                    <button id="resendBtn" class="link-text" style="background:none; border:none; font-size:13px;">Resend Code</button>
                </div>
                <div class="auth-footer"><span class="link-text" id="goLogin">Back to Login</span></div>
            </div>
        </div>`,
    ForgotPassword: `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1>Reset Password</h1>
                    <p class="muted">Enter your email to receive a reset code.</p>
                </div>
                <div id="authMessage" class="feedback-area is-hidden"></div>
                <form id="forgotPasswordForm" class="form-group">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required placeholder="username">
                    </div>
                    <button type="submit" class="nav-btn primary fullwidth">Send Code</button>
                </form>
                <form id="confirmResetForm" class="form-group is-hidden">
                    <div class="form-group">
                        <label>Verification Code</label>
                        <input type="text" name="code" required placeholder="123456">
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" required placeholder="New secure password">
                    </div>
                    <button type="submit" class="nav-btn primary fullwidth">Set New Password</button>
                </form>
                <div class="auth-footer"><span class="link-text" id="goLogin">Back to Login</span></div>
            </div>
        </div>`,
    AppShell: `
        <header class="header">
            <div class="header-content">
                <h1>ResqTap</h1>
                <p class="header-subtitle">Emergency Response Guide</p>
            </div>
            <div class="search-wrapper">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                <input type="text" id="searchInput" placeholder="Search emergencies..." />
            </div>
        </header>
        <main class="main-content" id="mainView"></main>
        <nav class="bottom-nav">
            <button class="nav-item active" onclick="App.renderHome()">
                <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Home</span>
            </button>
            <button class="nav-item" onclick="window.location.href='cpr.html'">
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                <span>CPR Guide</span>
            </button>
            <button class="nav-item" onclick="window.location.href='profile.html'">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Profile</span>
            </button>
            <button class="nav-item call-911" onclick="window.location.href='tel:911'">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>911</span>
            </button>
        </nav>
    `,
    Home: `
        <div class="filter-bar">
            <!-- Category Filter -->
            <div class="filter-group">
                <label class="filter-label">Category</label>
                <select id="categorySelect" class="filter-select">
                    <option value="all">All Categories</option>
                    <option value="airway">Airway</option>
                    <option value="allergic">Allergic</option>
                    <option value="bites">Bites</option>
                    <option value="burns">Burns</option>
                    <option value="cardiac">Cardiac</option>
                    <option value="dental">Dental</option>
                    <option value="environmental">Environmental</option>
                    <option value="eye">Eye</option>
                    <option value="medical">Medical</option>
                    <option value="mental-health">Mental Health</option>
                    <option value="neurological">Neurological</option>
                    <option value="poisoning">Poisoning</option>
                    <option value="pregnancy">Pregnancy</option>
                    <option value="respiratory">Respiratory</option>
                    <option value="trauma">Trauma</option>
                    <option value="water">Water</option>
                </select>
            </div>

            <!-- Severity Filter -->
            <div class="filter-group">
                <label class="filter-label">Severity</label>
                <select id="severitySelect" class="filter-select">
                    <option value="all">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <!-- Favorites Toggle -->
            <button id="favoritesToggle" class="favorites-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                <span>Favorites</span>
                <span id="favoritesCount" class="favorites-count">0</span>
            </button>
        </div>
        <div id="crisisContainer" class="crisis-container"></div>
    `
};

const App = {
    async start() {
        try {
            // Race against a timeout to prevent infinite loading
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Auth timeout')), 5000)
            );
            const user = await Promise.race([
                AuthService.getCurrentUser(),
                timeout
            ]);
            if (!user) {
                this.renderLogin();
            } else {
                // Always render app shell first
                await this.renderAppShell();

                // ONBOARDING GATE - Check if user has completed onboarding (first-time user only)
                const completed = await isOnboardingCompleted();
                if (!completed) {
                    console.log('[App] First-time user detected, waiting for data to load...');

                    // Wait for emergencies to load before starting tour
                    await new Promise(resolve => {
                        if (ALL_EMERGENCIES.length > 0) {
                            resolve(); // Data already loaded
                        } else {
                            const handler = () => {
                                window.removeEventListener('emergenciesLoaded', handler);
                                resolve();
                            };
                            window.addEventListener('emergenciesLoaded', handler);
                            setTimeout(resolve, 5000); // Fallback timeout
                        }
                    });

                    console.log('[App] Starting onboarding tour...');
                    const tour = getTourInstance();
                    await tour.start();
                }
            }
        } catch (e) {
            console.error("App start error:", e);
            this.renderLogin();
        }
    },

    renderLogin() {
        document.getElementById('app').innerHTML = Templates.Login;
        document.body.classList.add('auth-mode');

        // Password Toggle Logic
        const toggleBtn = document.getElementById('togglePassword');
        const passInput = document.getElementById('passwordInput');
        toggleBtn.addEventListener('click', () => {
            const isPass = passInput.type === 'password';
            passInput.type = isPass ? 'text' : 'password';
            toggleBtn.textContent = isPass ? 'HIDE' : 'SHOW';
        });
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value.trim();
            console.log(`[UI] Login submitting: ${username}`);
            const password = e.target.password.value;
            try {
                await AuthService.login(username, password);
                this.start();
            } catch (err) {
                const errorEl = document.getElementById('authError');
                let errorMessage = err.message || 'An error occurred during login';

                // Add icons for better visual feedback
                if (errorMessage.includes('USER_PASSWORD_AUTH')) {
                    errorMessage = '⚠️ ' + errorMessage;
                } else if (errorMessage.includes('Incorrect username or password')) {
                    errorMessage = '❌ ' + errorMessage;
                } else if (errorMessage.includes('User not found')) {
                    errorMessage = '❌ ' + errorMessage;
                } else if (errorMessage.includes('Network error')) {
                    errorMessage = '🌐 ' + errorMessage;
                }

                errorEl.textContent = errorMessage;
                errorEl.classList.remove('is-hidden');
                console.error('[UI] Login error:', err);
            }
        });
        document.getElementById('goSignup').addEventListener('click', () => this.renderSignup());
        document.getElementById('goForgotPassword').addEventListener('click', () => this.renderForgotPassword());
        document.getElementById('goVerify').addEventListener('click', () => this.renderVerifyAccount());
    },

    renderSignup() {
        document.getElementById('app').innerHTML = Templates.Signup;
        document.body.classList.add('auth-mode');

        // Password Toggle Logic for Signup
        const toggleBtn = document.getElementById('toggleSignupPassword');
        const passInput = document.getElementById('signupPasswordInput');
        if (toggleBtn && passInput) {
            toggleBtn.addEventListener('click', () => {
                const isPass = passInput.type === 'password';
                passInput.type = isPass ? 'text' : 'password';
                toggleBtn.textContent = isPass ? 'HIDE' : 'SHOW';
            });
        }

        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value.trim();
            const email = e.target.email.value.trim().toLowerCase();
            const password = e.target.password.value;
            try {
                await AuthService.register(username, email, password);
                this.renderVerifyAccount(username);
            } catch (err) {
                const errorEl = document.getElementById('authError');
                errorEl.textContent = err.message || JSON.stringify(err);
                errorEl.classList.remove('is-hidden');
            }
        });
        document.getElementById('goLogin').addEventListener('click', () => this.renderLogin());
    },

    renderVerifyAccount(username = '') {
        document.getElementById('app').innerHTML = Templates.VerifyAccount;
        document.body.classList.add('auth-mode');
        
        const usernameInput = document.querySelector('input[name="username"]');
        if (username && usernameInput) usernameInput.value = username;

        document.getElementById('verifyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = e.target.username.value.trim();
            const code = e.target.code.value.trim();
            try {
                await AuthService.confirmRegistration(user, code);
                alert('Account verified! Please sign in.');
                this.renderLogin();
            } catch (err) {
                const errorEl = document.getElementById('authError');
                errorEl.textContent = err.message || JSON.stringify(err);
                errorEl.classList.remove('is-hidden');
            }
        });

        document.getElementById('resendBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            const user = document.querySelector('input[name="username"]').value.trim();
            if (!user) {
                alert('Please enter your username first.');
                return;
            }
            try {
                await AuthService.resendConfirmationCode(user);
                const successEl = document.getElementById('authSuccess');
                successEl.textContent = 'Code resent! Check your email.';
                successEl.classList.remove('is-hidden');
            } catch (err) {
                const errorEl = document.getElementById('authError');
                errorEl.textContent = err.message || JSON.stringify(err);
                errorEl.classList.remove('is-hidden');
            }
        });

        document.getElementById('goLogin').addEventListener('click', () => this.renderLogin());
    },

    renderForgotPassword() {
        document.getElementById('app').innerHTML = Templates.ForgotPassword;
        document.body.classList.add('auth-mode');
        let resetUsername = '';

        document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            resetUsername = e.target.username.value.trim();
            try {
                await AuthService.forgotPassword(resetUsername);
                document.getElementById('forgotPasswordForm').classList.add('is-hidden');
                document.getElementById('confirmResetForm').classList.remove('is-hidden');
                const msg = document.getElementById('authMessage');
                msg.textContent = 'Code sent! Check your email.';
                msg.classList.remove('is-hidden');
                msg.classList.add('correct');
            } catch (err) {
                const msg = document.getElementById('authMessage');
                msg.textContent = err.message || JSON.stringify(err);
                msg.classList.remove('is-hidden');
                msg.classList.add('wrong');
            }
        });

        document.getElementById('confirmResetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = e.target.code.value.trim();
            const newPassword = e.target.newPassword.value;
            try {
                await AuthService.confirmForgotPassword(resetUsername, code, newPassword);
                alert('Password reset successful! Please login.');
                this.renderLogin();
            } catch (err) {
                const msg = document.getElementById('authMessage');
                msg.textContent = err.message || JSON.stringify(err);
                msg.classList.remove('is-hidden');
                msg.classList.add('wrong');
            }
        });

        document.getElementById('goLogin').addEventListener('click', () => this.renderLogin());
    },

    renderHealthForm() {
        document.getElementById('app').innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header"><h1>Health Profile</h1><p class="muted">This info is stored locally.</p></div>
                <form id="healthForm" class="form-group" style="gap:16px;">
                    <div class="form-group">
                        <label>Blood Type</label>
                        <select name="bloodType" required style="background: #fff;">
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Preferred Units</label>
                        <div style="display: flex; gap: 16px; padding: 4px 0;">
                            <label style="display:flex; align-items:center; gap: 6px; font-weight:400;"><input type="radio" name="units" value="metric" checked> Metric</label>
                            <label style="display:flex; align-items:center; gap: 6px; font-weight:400;"><input type="radio" name="units" value="imperial"> Imperial</label>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" id="height-group">
                            <label>Height (cm)</label><input type="number" name="height" placeholder="175">
                        </div>
                        <div class="form-group" id="weight-group">
                            <label>Weight (kg)</label><input type="number" name="weight" placeholder="70">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Allergies</label>
                        <input type="text" name="allergies" list="allergies-list" placeholder="e.g., Peanuts, Penicillin">
                        <datalist id="allergies-list">
                            <option value="Peanuts"></option>
                            <option value="Shellfish"></option>
                            <option value="Penicillin"></option>
                            <option value="Aspirin"></option>
                            <option value="Pollen"></option>
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Chronic Conditions</label>
                        <input type="text" name="conditions" list="conditions-list" placeholder="e.g., Asthma, Diabetes">
                        <datalist id="conditions-list">
                            <option value="Asthma"></option>
                            <option value="Diabetes Type 1"></option>
                            <option value="Diabetes Type 2"></option>
                            <option value="Hypertension"></option>
                            <option value="Epilepsy"></option>
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Current Medications (Optional)</label>
                        <input type="text" name="medications" placeholder="e.g., Insulin, Aspirin">
                        <datalist id="medications-list">
                            <option value="Insulin"></option>
                            <option value="Metformin"></option>
                            <option value="Lisinopril"></option>
                            <option value="Albuterol"></option>
                            <option value="Warfarin"></option>
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Emergency Notes (Optional)</label>
                        <textarea name="emergencyNotes" rows="3" placeholder="Any critical information for first responders (e.g., 'Pacemaker', 'Deaf')"></textarea>
                    </div>
                    <button type="submit" class="nav-btn primary fullwidth">Save Profile</button>
                </form>
            </div>
        </div>
        `;

        // Dynamic label update logic
        const updateLabels = () => {
            const isImperial = document.querySelector('input[name="units"][value="imperial"]').checked;
            const heightLabel = document.querySelector('#height-group label');
            const weightLabel = document.querySelector('#weight-group label');
            const heightInput = document.querySelector('input[name="height"]');
            const weightInput = document.querySelector('input[name="weight"]');
            
            if (heightLabel) heightLabel.textContent = `Height (${isImperial ? 'in' : 'cm'})`;
            if (weightLabel) weightLabel.textContent = `Weight (${isImperial ? 'lbs' : 'kg'})`;
            if (heightInput) heightInput.placeholder = isImperial ? "69" : "175";
            if (weightInput) weightInput.placeholder = isImperial ? "154" : "70";
        };
        updateLabels(); // Call initially to set correct labels

        document.querySelectorAll('input[name="units"]').forEach(radio => {
            radio.addEventListener('change', updateLabels);
        });

        // Load existing profile data if available
        (async () => {
            const { getProfile } = await import('./profileService.js');
            const profile = await getProfile();
            if (profile) {
                const form = document.getElementById('healthForm');
                if (profile.bloodType) form.bloodType.value = profile.bloodType;
                if (profile.units) {
                    const unitsRadio = form.querySelector(`input[name="units"][value="${profile.units}"]`);
                    if (unitsRadio) {
                        unitsRadio.checked = true;
                        updateLabels();
                    }
                }
                if (profile.height) form.height.value = profile.height;
                if (profile.weight) form.weight.value = profile.weight;
                if (profile.allergies) form.allergies.value = profile.allergies;
                if (profile.conditions) form.conditions.value = profile.conditions;
                if (profile.medications) form.medications.value = profile.medications;
                if (profile.emergencyNotes) form.emergencyNotes.value = profile.emergencyNotes;
            }
        })();

        document.body.classList.add('auth-mode');
        document.getElementById('healthForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            await UserService.updateHealthProfile(data);
            this.start();
        });
    },

    async renderAppShell() {
        // Load health profile from localStorage
        const { getProfile } = await import('./profileService.js');
        const healthProfile = await getProfile();

        // Check if user has completed health profile
        if (!healthProfile || !healthProfile.bloodType) {
            this.renderHealthForm();
            return;
        }

        document.body.classList.remove('auth-mode');
        document.getElementById('app').innerHTML = Templates.AppShell;
        this.renderHome();
    },

    renderHome() {
        const mainView = document.getElementById('mainView');

        // Performance: Use cached DOM if available and data hasn't changed
        if (HOME_DOM_CACHE && mainView.dataset.dataVersion === String(HOME_DATA_VERSION)) {
            console.log('[Performance] Restoring cached Home DOM');
            mainView.innerHTML = HOME_DOM_CACHE;
            setupHomeListeners(); // Re-attach event listeners

            // Restore scroll position
            requestAnimationFrame(() => {
                mainView.scrollTop = HOME_SCROLL_CACHE;
            });
        } else {
            // Full render
            mainView.innerHTML = Templates.Home;
            mainView.dataset.dataVersion = HOME_DATA_VERSION;
            setupHomeListeners();

            // Fix: Check if data is already loaded to prevent blank screen
            if (typeof ALL_EMERGENCIES !== 'undefined' && ALL_EMERGENCIES.length > 0) {
                updateFavoritesCounter();
                applyFilters();

                // Cache DOM after render completes
                requestAnimationFrame(() => {
                    HOME_DOM_CACHE = mainView.innerHTML;
                    console.log('[Performance] Home DOM cached');
                });
            } else {
                loadEmergencies();
            }
        }

        this.updateNav('Home');
    },

    renderProfile() {
        // Performance: Save scroll position before navigating away
        const mainView = document.getElementById('mainView');
        if (mainView) {
            HOME_SCROLL_CACHE = mainView.scrollTop;
            console.log('[Performance] Saved scroll position:', HOME_SCROLL_CACHE);
        }

        const user = AuthService.getCurrentUser();
        mainView.innerHTML = '<div id="authContainer"></div>';
        renderProfile(user);
        this.updateNav('Profile');
    },

    updateNav(name) {
        // Simple active state toggle could go here
    }
};

// Expose App globally
window.App = App;

/* ===================== MODIFIED RENDERERS ===================== */
// These functions now target the container injected by App.render*

async function renderProfile(user) {
    const container = document.getElementById('authContainer');
    if(!container) return;

    // Guard against null/undefined user or missing email
    if (!user || !user.email) {
        console.warn('renderProfile called without valid user');
        return;
    }

    container.classList.remove('is-hidden');
    container.style.maxWidth = '100%'; // Reset width constraint for main view

    // Calculate stats
    const history = (user.trainingHistory || []).sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalSessions = history.length;
    const avgScore = totalSessions ? Math.round(history.reduce((a,b) => a + b.score, 0) / totalSessions) : 0;
    const lastTraining = history.length > 0 ? new Date(history[0].date).toLocaleDateString() : 'Never';

    container.innerHTML = `
        <div class="settings-shell">
            <div class="profile-header">
                <div class="profile-avatar">${user.email[0].toUpperCase()}</div>
                <div class="profile-info">
                    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a;">${user.username || user.email.split('@')[0]}</h2>
                    <p style="font-size: 14px;">Member since ${new Date(user.createdAt || Date.now()).getFullYear()}</p>
                </div>
            </div>

            <h3 class="section-title">Personal & Medical Info</h3>
            <div class="card" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <label class="small muted">Blood Type</label>
                    <div style="font-weight: 700; font-size: 16px;">${user.health?.bloodType || '--'}</div>
                </div>
                <div>
                    <label class="small muted">Height / Weight (${user.units === 'imperial' ? 'in, lbs' : 'cm, kg'})</label>
                    <div style="font-weight: 700; font-size: 16px;">
                        ${user.health?.height || '--'} ${user.units === 'imperial' ? 'in' : 'cm'} / 
                        ${user.health?.weight || '--'} ${user.units === 'imperial' ? 'lbs' : 'kg'}
                    </div>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label class="small muted">Allergies</label>
                    <div style="font-weight: 600; color: #ef4444;">${user.health?.allergies || 'None listed'}</div>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label class="small muted">Conditions</label>
                    <div style="font-weight: 600;">${user.health?.conditions || 'None listed'}</div>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label class="small muted">Medications</label>
                    <div style="font-weight: 600;">${user.health?.medications || 'None listed'}</div>
                </div>
                <div style="grid-column: 1 / -1;">
                    <label class="small muted">Emergency Notes</label>
                    <div style="font-weight: 600;">${user.health?.emergencyNotes || 'None listed'}</div>
                </div>
            </div>

            <h3 class="section-title">Training Dashboard</h3>
            <div class="stats-grid">
                <div class="stat-card"><span class="stat-value">${totalSessions}</span><span class="stat-label">Trainings</span></div>
                <div class="stat-card"><span class="stat-value">${avgScore}%</span><span class="stat-label">Avg Score</span></div>
                <div class="stat-card" style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; padding: 12px 24px;">
                    <span class="stat-label">Last Training</span>
                    <span style="font-weight: 700; color: #0f172a;">${lastTraining}</span>
                </div>
            </div>

            <h3 class="section-title">Training</h3>
            <div class="scenario-selector">
                <button class="scenario-btn" id="btnTrainStart" style="background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; border: none;">
                    <div>
                        <div style="font-size: 16px;">Start Training Game</div>
                        <div class="small" style="color: rgba(255,255,255,0.9); font-weight: 500;">Test your skills with random scenarios</div>
                    </div>
                    <span style="font-size: 20px;">🎮</span>
                </button>
            </div>

            <button id="btnMedicalID" class="nav-btn fullwidth" style="background: #fff; color: #ef4444; border: 2px solid #ef4444;">
                🪪 View Emergency Medical ID
            </button>

            <h3 class="section-title">Recent Activity</h3>
            <div class="card">
                ${history.slice(-3).reverse().map(h => `
                    <div class="info-row" style="border-bottom:1px solid #f1f5f9;padding:8px 0;">
                        <span>${new Date(h.date).toLocaleDateString()}</span>
                        <span class="badge ${h.score >= 80 ? 'success-badge' : 'muted-badge'}">Score: ${h.score}%</span>
                    </div>
                `).join('') || '<p class="muted">No training yet.</p>'}
            </div>

            <button id="logoutBtn" class="nav-btn danger fullwidth" style="margin-top:20px;">Log Out</button>
        </div>
    `;

    document.getElementById('btnTrainStart').addEventListener('click', () => renderTrainingMode('mixed'));
    document.getElementById('btnMedicalID').addEventListener('click', () => renderMedicalID(user));

    document.getElementById('logoutBtn').addEventListener('click', () => {
        AuthService.logout();
        App.start();
    });
}

function renderMedicalID(user) {
    const container = document.getElementById('authContainer');
    if (!container) return;
    
    // Hide bottom nav for full-screen focus
    document.querySelector('.bottom-nav')?.classList.add('is-hidden');
    document.querySelector('.header')?.classList.add('is-hidden');

    const health = user.health || {};
    const isImperial = user.units === 'imperial';

    container.innerHTML = `
        <div class="medical-id-shell">
            <div class="medical-id-card">
                <div class="id-header">
                    <div class="id-title">
                        <h1>Medical ID</h1>
                        <p>Emergency Information</p>
                    </div>
                    <div class="id-icon">⚕️</div>
                </div>
                <div class="id-body">
                    <div class="id-row highlight">
                        <label>Name</label>
                        <div class="id-value">${user.username || 'Unknown'}</div>
                    </div>
                    <div class="id-grid">
                        <div class="id-row">
                            <label>Blood Type</label>
                            <div class="id-value big">${health.bloodType || '--'}</div>
                        </div>
                        <div class="id-row">
                            <label>Weight</label>
                            <div class="id-value">${health.weight || '--'} ${isImperial ? 'lbs' : 'kg'}</div>
                        </div>
                    </div>
                    <div class="id-section">
                        <label>Allergies & Reactions</label>
                        <div class="id-value alert">${health.allergies || 'None Known'}</div>
                    </div>
                    <div class="id-section">
                        <label>Medical Conditions</label>
                        <div class="id-value">${health.conditions || 'None Listed'}</div>
                    </div>
                    <div class="id-section">
                        <label>Current Medications</label>
                        <div class="id-value">${health.medications || 'None Listed'}</div>
                    </div>
                    ${health.emergencyNotes ? `
                    <div class="id-section">
                        <label>Emergency Notes</label>
                        <div class="id-value note">${health.emergencyNotes}</div>
                    </div>` : ''}
                </div>
                <div class="id-footer">
                    <p>Shown on lock screen enabled</p>
                </div>
            </div>
            <button id="closeMedicalID" class="nav-btn primary fullwidth" style="margin-top: 16px;">Close ID</button>
        </div>
    `;

    document.getElementById('closeMedicalID').addEventListener('click', () => {
        document.querySelector('.bottom-nav')?.classList.remove('is-hidden');
        document.querySelector('.header')?.classList.remove('is-hidden');
        renderProfile(user);
    });
}

/* ===================== TRAINING MODE ===================== */

function renderTrainingMode(scenario = 'adult') {
    const container = document.getElementById('authContainer');
    if(!container) return;
    container.classList.remove('is-hidden');

    const questions = getRandomQuestions(scenario, 5);
    let currentQ = 0;
    let score = 0;

    function showQuestion() {
        if (currentQ >= questions.length) {
            showResults();
            return;
        }
        const q = questions[currentQ];
        container.innerHTML = `
            <div class="training-card">
                <div class="training-header">
                    <span style="text-transform: capitalize;">${scenario === 'mixed' ? 'General Training' : scenario + ' CPR Training'}</span>
                    <span class="training-progress">Q ${currentQ + 1} / ${questions.length}</span>
                </div>
                <div class="training-body">
                    <div class="question-text">${q.q}</div>
                    <div class="training-options">
                        ${q.options.map((opt, idx) => `
                            <button class="training-btn" data-idx="${idx}">${opt}</button>
                        `).join('')}
                    </div>
                    <div id="feedback" class="feedback-area is-hidden"></div>
                    <button id="nextBtn" class="nav-btn primary fullwidth is-hidden" style="margin-top:16px;">Next Question</button>
                </div>
            </div>
        `;

        container.querySelectorAll('.training-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (container.querySelector('.training-btn.correct')) return; // Already answered
                
                const selected = parseInt(e.target.dataset.idx);
                const isCorrect = selected === q.answer;

                e.target.classList.add(isCorrect ? 'correct' : 'wrong');
                if (isCorrect) score++;
                else container.querySelector(`button[data-idx="${q.answer}"]`).classList.add('correct');

                const fb = document.getElementById('feedback');
                fb.classList.remove('is-hidden');
                fb.className = `feedback-area ${isCorrect ? 'correct' : 'wrong'}`;
                fb.textContent = isCorrect ? "Correct! " + (q.explanation || '') : "Incorrect. " + (q.explanation || '');
                
                document.getElementById('nextBtn').classList.remove('is-hidden');
            });
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            currentQ++;
            showQuestion();
        });
    }

    function showResults() {
        const percentage = Math.round((score / questions.length) * 100);
        UserService.addTrainingSession({ score: percentage, total: questions.length, scenario });
        
        container.innerHTML = `
            <div class="training-card" style="text-align:center; padding:40px;">
                <h2>Training Complete</h2>
                <div class="result-score">${percentage}%</div>
                <p class="muted">You got ${score} out of ${questions.length} correct.</p>
                <button id="finishTraining" class="nav-btn primary fullwidth">Back to Profile</button>
            </div>
        `;
        document.getElementById('finishTraining').addEventListener('click', () => {
            renderProfile(AuthService.getCurrentUser());
        });
    }

    showQuestion();
}

function setupHomeListeners() {
    // Only attach these once we are in "Home" mode
    if (document.getElementById('homeListenersAttached')) return;

    const searchInput = document.getElementById('searchInput');
    const favoritesToggle = document.getElementById('favoritesToggle');

    // Initialize filter dropdowns
    initFilters();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            SEARCH_QUERY = (e.target.value || '').trim();
            applyFilters();
        });
    }

    if (favoritesToggle) {
        favoritesToggle.addEventListener('click', () => {
            favoritesToggle.classList.toggle('active');
            applyFilters();
        });
    }

    // Mark as attached so we don't duplicate listeners if init() is called again
    const marker = document.createElement('div');
    marker.id = 'homeListenersAttached';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    // Listen for favorite changes from other pages/tabs
    window.addEventListener('favorites-changed', () => {
        updateFavoritesCounter();
        applyFilters(); // Re-filter to show/hide favorites if the view is active
    });
}

console.log('[ResqTap] App starting...');
App.start().catch(err => {
    console.error("Fatal App Start Error:", err);
    App.renderLogin();
});
