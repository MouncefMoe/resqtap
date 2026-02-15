// CPR Disclaimer Modal - Shown every time CPR section is accessed
// Session-only flag (resets on app restart)

const CPR_DISCLAIMER = {
  title: '⚠️ Important Notice',
  content: `
    <p><strong>CPR requires proper certification and training.</strong></p>
    <p>This application is for first aid education and training purposes only.</p>
    <p>It does <strong>NOT</strong> replace professional medical training.</p>
    <p>In real emergencies, always call <strong>Emergency Medical Services (911)</strong> immediately.</p>
  `,
  buttonText: 'I Understand'
};

let disclaimerShown = false;

/**
 * Initialize disclaimer modal in the DOM
 * Should be called during page load
 */
export function initDisclaimer() {
  // Check if disclaimer container already exists
  if (document.getElementById('cprDisclaimerModal')) {
    return;
  }

  // Create disclaimer modal HTML
  const disclaimerHTML = `
    <div id="cprDisclaimerModal" class="disclaimer-overlay">
      <div class="disclaimer-panel">
        <h2>⚠️ Important Notice</h2>
        <div class="disclaimer-content">
          <p><strong>CPR requires proper certification and training.</strong></p>
          <p>This application is for first aid education and training purposes only.</p>
          <p>It does <strong>NOT</strong> replace professional medical training.</p>
          <p>In real emergencies, always call <strong>Emergency Medical Services (911)</strong> immediately.</p>
        </div>
        <button id="disclaimerAccept" class="disclaimer-btn">I Understand</button>
        <div class="disclaimer-legal">
          By proceeding, you acknowledge that you have read this notice.
        </div>
      </div>
    </div>
  `;

  // Append to body
  document.body.insertAdjacentHTML('beforeend', disclaimerHTML);

  // Set up event listeners
  setupDisclaimerListeners();
}

/**
 * Show the CPR disclaimer modal
 * Returns a promise that resolves when user accepts
 */
export function showDisclaimer() {
  return new Promise((resolve) => {
    const modal = document.getElementById('cprDisclaimerModal');
    const acceptBtn = document.getElementById('disclaimerAccept');

    if (!modal) {
      // If modal doesn't exist, create it first
      initDisclaimer();
      // Call recursively to show the newly created modal
      return showDisclaimer().then(resolve);
    }

    // Show the modal
    modal.classList.add('is-visible');

    // One-time listener for accept
    const onAccept = () => {
      acceptBtn.removeEventListener('click', onAccept);
      hideDisclaimer();
      disclaimerShown = true;
      resolve();
    };

    acceptBtn.addEventListener('click', onAccept);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  });
}

/**
 * Hide the disclaimer modal
 */
function hideDisclaimer() {
  const modal = document.getElementById('cprDisclaimerModal');
  if (modal) {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
}

/**
 * Set up event listeners for disclaimer
 */
function setupDisclaimerListeners() {
  const modal = document.getElementById('cprDisclaimerModal');
  const acceptBtn = document.getElementById('disclaimerAccept');

  if (!acceptBtn) return;

  // Prevent clicking outside modal to dismiss
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

/**
 * Check if CPR action should trigger disclaimer
 * Called before any CPR-related action
 */
export async function checkCPRDisclaimer() {
  // Only show once per session
  if (disclaimerShown) {
    return true;
  }

  // Show disclaimer and wait for acceptance
  await showDisclaimer();
  return true;
}

/**
 * Reset disclaimer for new session
 * Called on app restart
 */
export function resetDisclaimer() {
  disclaimerShown = false;
}

/**
 * Check if disclaimer has been shown this session
 */
export function hasDisclaimerBeenShown() {
  return disclaimerShown;
}
