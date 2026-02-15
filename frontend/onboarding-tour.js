// Main Onboarding Tour Controller
// Simplified tour for home page features only

import { TOUR_STEPS } from './tour-steps.js';
import { setJson, getJson, remove } from './storage.js';

const STORAGE_KEY_COMPLETED = 'resqtap:onboardingCompleted';
const STORAGE_KEY_STEP = 'resqtap:onboardingStep';

export class OnboardingTour {
  constructor() {
    this.currentStep = 0;
    this.steps = TOUR_STEPS;
    this.isActive = false;
    this.currentHighlight = null;
    this.currentTooltip = null;
    this.tooltipTimeoutId = null;
  }

  /**
   * Start the tour from beginning
   */
  async start() {
    console.log('[Tour] Starting onboarding tour...');
    this.isActive = true;
    this.currentStep = 0;

    // Show first step
    await this.showStep(this.currentStep);
  }

  /**
   * Display a specific tour step
   */
  async showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      console.warn('[Tour] Invalid step index:', stepIndex);
      await this.completeTour();
      return;
    }

    this.currentStep = stepIndex;
    const step = this.steps[stepIndex];

    console.log(`[Tour] Showing step ${step.id}/${this.steps.length}: ${step.title}`);

    // Wait for target element to exist
    const target = await this.waitForElement(step.target, 3000);

    if (!target) {
      console.warn('[Tour] Target not found, skipping to next step:', step.target);
      // Skip to next step if target not found
      await this.nextStep();
      return;
    }

    // Create tour UI
    this.createTourUI(step, target);
  }

  /**
   * Wait for a target element to appear in the DOM
   */
  waitForElement(selector, timeout = 3000) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  /**
   * Create and display tour UI (overlay, highlight, tooltip)
   */
  createTourUI(step, target) {
    // Remove previous tour UI
    this.removeTourUI();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.id = 'tourOverlay';
    document.body.appendChild(overlay);

    // Add highlight to target
    this.currentHighlight = target;
    target.classList.add('tour-highlight');

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Create tooltip after a short delay to allow scrolling
    this.tooltipTimeoutId = setTimeout(() => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tour-tooltip';
      tooltip.id = 'tourTooltip';

      // Build tooltip HTML
      const progressDots = this.steps
        .map((_, i) => `<div class="tour-progress-dot ${i <= this.currentStep ? 'active' : ''}"></div>`)
        .join('');

      const isLastStep = step.isLast || this.currentStep === this.steps.length - 1;
      const buttonText = isLastStep ? 'Get Started!' : 'Next';

      // Inline styles as fallback in case CSS doesn't load on Android WebView
      tooltip.innerHTML = `
        <h3 class="tour-tooltip-title" style="color: #0f172a !important; font-weight: 700; font-size: 18px; margin: 0 0 8px 0;">${step.title}</h3>
        <p class="tour-tooltip-message" style="color: #64748b !important; line-height: 1.5; margin: 0 0 16px 0; font-size: 14px;">${step.message}</p>
        <div class="tour-progress" style="display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap;">${progressDots}</div>
        <button class="tour-next-btn" id="tourNextBtn" style="width: 100%; padding: 12px 16px; background: #667EEA; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; pointer-events: auto !important;">${buttonText}</button>
        ${this.currentStep > 0 && !isLastStep ? '<button class="tour-skip-btn" id="tourSkipBtn" style="width: 100%; padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 500; font-size: 13px; cursor: pointer; margin-top: 8px; touch-action: manipulation; -webkit-tap-highlight-color: transparent; pointer-events: auto !important;">Skip Tour</button>' : ''}
        <div class="tour-step-counter" style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 12px;">Step ${step.id} of ${this.steps.length}</div>
      `;

      document.body.appendChild(tooltip);
      this.currentTooltip = tooltip;

      // Position tooltip near target
      this.positionTooltip(target, tooltip);

      // Set up event listeners with touch support for mobile
      const nextBtn = document.getElementById('tourNextBtn');
      if (nextBtn) {
        const nextHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isLastStep) {
            this.completeTour();
          } else {
            this.nextStep();
          }
        };
        nextBtn.addEventListener('click', nextHandler);
        nextBtn.addEventListener('touchstart', nextHandler, { passive: false });
      }

      const skipBtn = document.getElementById('tourSkipBtn');
      if (skipBtn) {
        const skipHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.skipTour();
        };
        skipBtn.addEventListener('click', skipHandler);
        skipBtn.addEventListener('touchstart', skipHandler, { passive: false });
      }
    }, 300);
  }

  /**
   * Position tooltip relative to target element
   */
  positionTooltip(target, tooltip) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = rect.bottom + 16;
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

    // Check if tooltip would go below viewport
    if (top + tooltipRect.height > window.innerHeight - 20) {
      // Position above target instead
      top = rect.top - tooltipRect.height - 16;
      tooltip.classList.remove('arrow-top');
      tooltip.classList.add('arrow-bottom');
    } else {
      tooltip.classList.remove('arrow-bottom');
      tooltip.classList.add('arrow-top');
    }

    // Adjust horizontal position for screen boundaries
    if (left < 16) {
      left = 16;
    } else if (left + tooltipRect.width > window.innerWidth - 16) {
      left = window.innerWidth - tooltipRect.width - 16;
    }

    tooltip.style.top = `${Math.max(16, top)}px`;
    tooltip.style.left = `${left}px`;
  }

  /**
   * Move to next step
   */
  async nextStep() {
    this.currentStep++;

    if (this.currentStep >= this.steps.length) {
      await this.completeTour();
    } else {
      await this.showStep(this.currentStep);
    }
  }

  /**
   * Skip the tour completely
   */
  async skipTour() {
    await this.completeTour();
  }

  /**
   * Mark tour as complete
   */
  async completeTour() {
    console.log('[Tour] Tour completed!');
    this.isActive = false;
    this.removeTourUI();

    // Save completion flag
    await setJson(STORAGE_KEY_COMPLETED, true);
    await remove(STORAGE_KEY_STEP);

    // Re-enable normal app interaction
    document.body.style.overflow = '';

    // Dispatch completion event
    window.dispatchEvent(new Event('onboardingCompleted'));
  }

  /**
   * Remove all tour UI elements
   */
  removeTourUI() {
    // Clear any pending tooltip creation timeout
    if (this.tooltipTimeoutId) {
      clearTimeout(this.tooltipTimeoutId);
      this.tooltipTimeoutId = null;
    }

    const overlay = document.getElementById('tourOverlay');
    const tooltip = document.getElementById('tourTooltip');

    if (overlay) overlay.remove();
    if (tooltip) tooltip.remove();

    if (this.currentHighlight) {
      this.currentHighlight.classList.remove('tour-highlight');
      this.currentHighlight = null;
    }

    this.currentTooltip = null;
  }

  /**
   * Reset tour and start from beginning
   */
  async reset() {
    await remove(STORAGE_KEY_COMPLETED);
    await remove(STORAGE_KEY_STEP);
    this.currentStep = 0;
    await this.start();
  }
}

/**
 * Check if onboarding has been completed
 */
export async function isOnboardingCompleted() {
  const completed = await getJson(STORAGE_KEY_COMPLETED, false);
  return completed === true;
}

/**
 * Get current onboarding step
 */
export async function getCurrentOnboardingStep() {
  return await getJson(STORAGE_KEY_STEP, 0);
}

/**
 * Mark onboarding as completed (for manual skip)
 */
export async function markOnboardingCompleted() {
  await setJson(STORAGE_KEY_COMPLETED, true);
  await remove(STORAGE_KEY_STEP);
}

/**
 * Initialize global tour instance
 */
let tourInstance = null;

export function getTourInstance() {
  if (!tourInstance) {
    tourInstance = new OnboardingTour();
  }
  return tourInstance;
}

export function resetTourInstance() {
  tourInstance = null;
}
