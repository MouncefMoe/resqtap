import { isFavorite, toggleFavorite } from './favorites.js';

const API_BASE = window.API_BASE || 'http://localhost:8080';
const FALLBACK_IMAGE = '/images/fallback.jpg';
const JSON_DATA_FILES = [
    'cardiac.json', 'trauma.json', 'burns.json', 'allergic.json',
    'poisoning.json', 'neurological.json', 'respiratory.json',
    'environmental.json', 'medical.json', 'bites.json',
    'pregnancy.json', 'dental.json', 'mental-health.json', 'eye.json',
    'water.json', 'airway.json',
    'cpr-adult.json', 'cpr-child.json', 'cpr-infant.json'
];

let currentSteps = [];
let currentIndex = 0;
let currentEmergencySlug = null;
const scratchDiv = document.createElement('div');

const el = {
    heroImage: document.getElementById('injuryHeroImage'),
    title: document.getElementById('injuryTitle'),
    meta: document.getElementById('injuryMeta'),
    appbarTitle: document.getElementById('appbarTitle'),
    stepIndicator: document.getElementById('stepIndicator'),
    stepCounter: document.getElementById('stepCounter'),
    stepProgressFill: document.getElementById('stepProgressFill'),
    stepsList: document.getElementById('stepsList'),
    prevBtn: document.getElementById('prevStepBtn'),
    nextBtn: document.getElementById('nextStepBtn'),
    favoriteBtn: document.getElementById('favoriteBtn')
};

function formatCategoryLabel(category) {
    if (!category) return '';
    return category
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function getSeverityClass(severity) {
    if (!severity) return 'severity-low';
    return `severity-${severity.toLowerCase()}`;
}

function plainText(value) {
    scratchDiv.innerHTML = value || '';
    return scratchDiv.textContent || '';
}

function updateFavoriteButtonUI(slug) {
    if (!el.favoriteBtn) return;
    const isFav = isFavorite(slug);
    el.favoriteBtn.classList.toggle('is-favorite', isFav);
    el.favoriteBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
}

function handleFavoriteToggle() {
    if (!currentEmergencySlug) return;
    toggleFavorite(currentEmergencySlug);
    updateFavoriteButtonUI(currentEmergencySlug);
}

async function fetchEmergencyFromApi(slug) {
    const response = await fetch(`${API_BASE}/api/emergencies/slug/${slug}`);
    if (!response.ok) throw new Error(`API failed for slug ${slug} with status ${response.status}`);
    return response.json();
}

async function fetchEmergencyFromLocalFiles(slug) {
    const promises = JSON_DATA_FILES.map(file => fetch(`/data/${file}`).then(res => res.json()));
    const results = await Promise.allSettled(promises);

    // Handle both array format (modern) and object format (legacy CPR files)
    const allEmergencies = results
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

    const emergency = allEmergencies.find(e => e.id === slug);
    if (!emergency) throw new Error(`Emergency with slug '${slug}' not found in local files.`);
    return emergency;
}

async function loadEmergencyDetail(slug) {
    try {
        const data = await fetchEmergencyFromApi(slug).catch(() => fetchEmergencyFromLocalFiles(slug));
        displayEmergency(data);
    } catch (err) {
        console.error(`Fatal: Could not load emergency detail for '${slug}'.`, err);
        showError('This emergency could not be loaded. Please try again later.');
    }
}

function setHeroImage(src, alt) {
    if (!el.heroImage) return;
    el.heroImage.classList.remove('is-visible');
    el.heroImage.src = '';
    const safeSrc = src || FALLBACK_IMAGE;
    requestAnimationFrame(() => {
        el.heroImage.src = safeSrc;
        el.heroImage.alt = alt || 'Emergency';
    });
    el.heroImage.onload = () => el.heroImage.classList.add('is-visible');
    el.heroImage.onerror = () => {
        el.heroImage.src = FALLBACK_IMAGE;
        el.heroImage.classList.add('is-visible');
    };
}

function renderHero(data) {
    if (el.title) el.title.textContent = data.name || 'Emergency Details';
    if (el.appbarTitle) el.appbarTitle.textContent = data.name || 'Injury';
    setHeroImage(data.image || data.imageUrl, data.name);

    if (el.meta) el.meta.innerHTML = '';
    if (data.category && el.meta) {
        const categoryTag = document.createElement('span');
        categoryTag.className = 'injury-pill';
        categoryTag.textContent = formatCategoryLabel(data.category);
        el.meta.appendChild(categoryTag);
    }
    if (data.severity && el.meta) {
        const badge = document.createElement('span');
        badge.className = `severity-chip ${getSeverityClass(data.severity)}`;
        badge.textContent = data.severity;
        el.meta.appendChild(badge);
    }
}

function displayEmergency(data) {
    currentEmergencySlug = data.id;
    currentSteps = data.steps || [];
    currentIndex = 0;

    renderHero(data);
    updateFavoriteButtonUI(currentEmergencySlug);

    if (!currentSteps.length) {
        showError('No steps available for this emergency.');
        return;
    }

    renderSteps();
    displayStep();
    updateNavigationButtons();
}

function displayStep() {
    const step = currentSteps[currentIndex];
    if (!step) return;

    if (el.stepIndicator) el.stepIndicator.textContent = `Step ${currentIndex + 1}`;
    setActiveStepCard();

    updateProgress();
    updateNavigationButtons();
}

function renderSteps() {
    if (!el.stepsList) return;
    el.stepsList.innerHTML = '';
    currentSteps.forEach((step, idx) => {
        // Map backend fields to frontend expectations
        const mappedStep = {
            title: step.title || `Step ${step.stepNumber || idx + 1}`,
            text: step.text || step.description || '',
            image: step.image || step.imageUrl || ''
        };

        const card = document.createElement('article');
        card.className = 'injury-step-card';
        card.dataset.stepIndex = idx.toString();
        const title = mappedStep.title;
        const text = plainText(mappedStep.text);

        const header = document.createElement('div');
        header.className = 'step-headline';
        const chip = document.createElement('div');
        chip.className = 'step-chip';
        chip.textContent = `Step ${idx + 1}`;
        const heading = document.createElement('h3');
        heading.className = 'injury-step-title';
        heading.textContent = title;
        header.append(chip, heading);

        const body = document.createElement('p');
        body.className = 'injury-step-text';
        body.textContent = text || 'Follow this step carefully.';

        card.append(header, body);

        if (mappedStep.image) {
            const img = document.createElement('img');
            img.className = 'injury-step-image';
            img.src = mappedStep.image;
            img.alt = title;
            img.loading = 'lazy';
            img.onerror = () => img.remove();
            card.appendChild(img);
        }
        el.stepsList.appendChild(card);
    });
}

function setActiveStepCard() {
    if (!el.stepsList) return;
    const cards = el.stepsList.querySelectorAll('.injury-step-card');
    cards.forEach(card => {
        const idx = Number(card.dataset.stepIndex);
        const isActive = idx === currentIndex;
        card.classList.toggle('active', isActive);
        if (isActive) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function updateProgress() {
    const total = currentSteps.length || 1;
    const pct = ((currentIndex + 1) / total) * 100;
    if (el.stepProgressFill) el.stepProgressFill.style.width = `${pct}%`;
    if (el.stepCounter) el.stepCounter.textContent = `${currentIndex + 1} / ${total}`;
}

function showError(message) {
    if (el.title) el.title.textContent = 'Error';
    if (el.appbarTitle) el.appbarTitle.textContent = 'Error';
    if (el.stepIndicator) el.stepIndicator.textContent = 'Error';
    if (el.stepsList) el.stepsList.innerHTML = `<p class="error-state">${message}</p>`;
    updateNavigationButtons();
}

function nextStep() {
    if (currentIndex < currentSteps.length - 1) {
        currentIndex++;
        displayStep();
    }
}

function previousStep() {
    if (currentIndex > 0) {
        currentIndex--;
        displayStep();
    }
}

function updateNavigationButtons() {
    const hasSteps = currentSteps.length > 0;
    if (el.prevBtn) el.prevBtn.disabled = !hasSteps || currentIndex === 0;
    if (el.nextBtn) el.nextBtn.disabled = !hasSteps || currentIndex >= currentSteps.length - 1;
}

function setupEventListeners() {
    if (el.prevBtn) el.prevBtn.addEventListener('click', previousStep);
    if (el.nextBtn) el.nextBtn.addEventListener('click', nextStep);
    if (el.favoriteBtn) el.favoriteBtn.addEventListener('click', handleFavoriteToggle);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextStep();
        else if (e.key === 'ArrowLeft') previousStep();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('id');
    currentEmergencySlug = slug;

    setupEventListeners();
    updateNavigationButtons();
    updateFavoriteButtonUI(slug);

    if (!slug) {
        showError('No emergency specified. Please go back and select one.');
        return;
    }

    loadEmergencyDetail(slug);
});

// Removed: cancelSpeech function not defined
// window.addEventListener('pagehide', cancelSpeech);
