import { checkCPRDisclaimer } from './cpr-disclaimer.js';

const STATES = {
    IDLE: 'IDLE',
    STEPS: 'STEPS',
    COUNTDOWN: 'COUNTDOWN',
    COMPRESSIONS: 'COMPRESSIONS',
    BREATHS: 'BREATHS',
    STOPPED: 'STOPPED'
};

const PHASES = {
    COMPRESSIONS: 'compressions',
    BREATHS: 'breaths'
};

const CPR_LIBRARY = {
    adult: {
        title: 'Adult CPR',
        subtitle: 'Puberty and older',
        accent: 'adult',
        ratio: '30:2',
        steps: [
            {
                title: 'Check responsiveness & call 911',
                instructions: [
                    'Tap the shoulders, shout, and look for normal breathing.',
                    'Send someone to call 911 and get an AED if available.',
                    'Lay the person on a firm, flat surface.'
                ],
                image: 'images/cpr/adult/check-life.jpg'
            },
            {
                title: 'Start chest compressions',
                instructions: [
                    'Heel of one hand in the center of the chest, other hand on top.',
                    'Push hard and fast, 100–120 per minute.',
                    'Allow full chest recoil between compressions.'
                ],
                image: 'images/cpr/adult/compression-adult.jpg.webp'
            },
            {
                title: 'Open the airway',
                instructions: [
                    'Tilt the head back and lift the chin.',
                    'Look in the mouth only if you see an obvious blockage.'
                ],
                image: 'images/cpr/adult/hand-position.jpg'
            },
            {
                title: 'Give rescue breaths (if trained)',
                instructions: [
                    'Pinch the nose closed and seal your mouth over theirs.',
                    'Give 2 slow breaths (about 1 second each) and watch the chest rise.'
                ],
                image: 'images/cpr/adult/rescue_breathing_a.jpg'
            },
            {
                title: 'Continue cycles',
                instructions: [
                    '30 compressions, 2 breaths. Repeat without long pauses.',
                    'If untrained to give breaths, keep compressions going nonstop.'
                ],
                image: 'images/cpr/adult/recovery-position.jpg.webp'
            }
        ]
    },
    child: {
        title: 'Child CPR',
        subtitle: '1–puberty',
        accent: 'child',
        ratio: '30:2 (15:2 if two rescuers)',
        steps: [
            {
                title: 'Check response & call 911',
                instructions: [
                    'Tap and shout. If unresponsive, call 911 immediately.',
                    'Place the child on a firm surface.'
                ],
                image: 'images/cpr/child/wakingup-kid.png'
            },
            {
                title: 'Begin compressions',
                instructions: [
                    'Use one or two hands in the center of the chest.',
                    'Push hard and fast ~2 inches deep, 100–120/min.',
                    'Allow full recoil between compressions.'
                ],
                image: 'images/cpr/child/one-hand.jpg'
            },
            {
                title: 'Open airway & give breaths',
                instructions: [
                    'Tilt the head slightly back; lift the chin.',
                    'Give 2 gentle breaths; watch for chest rise.'
                ],
                image: 'images/cpr/child/rescue_breathing_a.jpg'
            },
            {
                title: 'Continue cycles',
                instructions: [
                    '30 compressions, then 2 breaths. Repeat without delay.',
                    'If two rescuers are present, switch to 15:2.'
                ],
                image: 'images/cpr/child/recovry-kid.jpg'
            }
        ]
    },
    infant: {
        title: 'Infant CPR',
        subtitle: 'Under 1 year',
        accent: 'infant',
        ratio: '30:2 (15:2 if two rescuers)',
        steps: [
            {
                title: 'Check responsiveness & call 911',
                instructions: [
                    'Tap the soles of the feet and call the infant.',
                    'If no response, call 911 immediately.'
                ],
                image: 'images/cpr/infant/wakingup-baby.jpg.webp'
            },
            {
                title: 'Two-finger compressions',
                instructions: [
                    'Use two fingers just below the nipple line, center of the chest.',
                    'Press about 1.5 inches deep, 100–120/min.',
                    'Allow the chest to fully recoil each time.'
                ],
                image: 'images/cpr/infant/cpr-baby.webp'
            },
            {
                title: 'Open neutral airway',
                instructions: [
                    'Keep the head in neutral (do not over-tilt).',
                    'Lift the chin slightly to open the airway.'
                ],
                image: 'images/cpr/infant/open-airway-baby.jpg'
            },
            {
                title: 'Gentle rescue breaths',
                instructions: [
                    'Seal your mouth over the infant’s mouth and nose.',
                    'Give 2 gentle puffs (1 second each) just to see chest rise.'
                ],
                image: 'images/cpr/infant/breath-baby.png'
            },
            {
                title: 'Repeat cycles',
                instructions: [
                    'Stay with the infant and keep the rhythm until help arrives.',
                    'If alone, perform ~2 minutes of CPR before leaving to call 911.'
                ],
                image: 'images/cpr/infant/cpr2-baby.jpeg'
            }
        ]
    }
};

const els = {
    selection: document.getElementById('typeSelection'),
    stepViewer: document.getElementById('stepViewer'),
    typeBadge: document.getElementById('selectedType'),
    typeSubtitle: document.getElementById('selectedSubtitle'),
    stepNumber: document.getElementById('stepNumber'),
    stepTitle: document.getElementById('stepTitle'),
    stepImage: document.getElementById('stepImage'),
    stepInstructions: document.getElementById('stepInstructions'),
    progressFill: document.getElementById('progressFill'),
    stepCounter: document.getElementById('stepCounter'),
    stepHint: document.getElementById('stepHint'),
    navBack: document.getElementById('navBack'),
    navNext: document.getElementById('navNext'),
    navStatus: document.getElementById('navStatus'),
    changeType: document.getElementById('changeType'),
    startGuidedBtn: document.getElementById('startGuidedBtn'),
    guidedOverlay: document.getElementById('guidedOverlay'),
    guidedCycle: document.getElementById('guidedCycle'),
    guidedPhase: document.getElementById('guidedPhase'),
    guidedSub: document.getElementById('guidedSub'),
    guidedCount: document.getElementById('guidedCount'),
    guidedRatio: document.getElementById('guidedRatio'),
    guidedPulse: document.getElementById('guidedPulse'),
    skipBreaths: document.getElementById('skipBreaths'),
    twoRescuerRow: document.getElementById('twoRescuerRow'),
    toggleTwoRescuer: document.getElementById('toggleTwoRescuer'),
    toggleSound: document.getElementById('toggleSound'),
    toggleBreathSound: document.getElementById('toggleBreathSound'),
    bpmInput: document.getElementById('bpmInput'),
    bpmValue: document.getElementById('bpmValue'),
    breathDuration: document.getElementById('breathDuration'),
    soundHint: document.getElementById('soundHint'),
    guidedPause: document.getElementById('guidedPause'),
    guidedResume: document.getElementById('guidedResume'),
    guidedStop: document.getElementById('guidedStop'),
    guidedClose: document.getElementById('guidedClose'),
    precheckScreen: document.getElementById('precheckScreen'),
    countdownScreen: document.getElementById('countdownScreen'),
    precheckContinue: document.getElementById('precheckContinue'),
    countdownNumber: document.getElementById('countdownNumber'),
    stopConfirm: document.getElementById('stopConfirm'),
    confirmStop: document.getElementById('confirmStop'),
    cancelStop: document.getElementById('cancelStop')
};

let currentType = null;
let currentSteps = [];
let currentIndex = 0;
let appState = STATES.IDLE;
let guidedPhase = PHASES.COMPRESSIONS;
let guidedCount = 0;
let guidedCycle = 1;
let bpm = 110;
let breathDurationMs = 6000;
let soundOn = true;
let breathSoundOn = false;
let isPaused = false;
let ratio = { compressions: 30, breaths: 2 };
let metronomeId = null;
let countdownId = null;
let breathTimers = [];
let audioCtx = null;
let hapticsPromise = null;
let stopPending = false;
let cycleCount = 0;
let totalCompressionCount = 0;
let tapTimings = [];
let lastTapTime = 0;

function init() {
    document.querySelectorAll('.type-card').forEach(card => {
        card.addEventListener('click', () => selectType(card.dataset.type));
    });

    els.changeType?.addEventListener('click', resetToLanding);
    els.startGuidedBtn?.addEventListener('click', openGuidedOverlay);

    els.navBack?.addEventListener('click', () => changeStep(-1));
    els.navNext?.addEventListener('click', () => changeStep(1));

    els.toggleTwoRescuer?.addEventListener('change', () => {
        updateRatio();
    });
    els.toggleSound?.addEventListener('change', () => {
        soundOn = !!els.toggleSound?.checked;
        if (soundOn) {
            ensureAudioContext();
            els.soundHint?.classList.add('is-hidden');
        } else {
            els.soundHint?.classList.remove('is-hidden');
        }
    });
    els.toggleBreathSound?.addEventListener('change', () => {
        breathSoundOn = !!els.toggleBreathSound?.checked;
    });
    els.bpmInput?.addEventListener('input', () => {
        const val = clamp(Number(els.bpmInput.value), 100, 120);
        bpm = val;
        els.bpmInput.value = val;
        els.bpmValue && (els.bpmValue.textContent = String(val));
        if (appState === STATES.COMPRESSIONS) restartMetronome();
    });
    els.breathDuration?.addEventListener('change', () => {
        breathDurationMs = Number(els.breathDuration.value) || 6000;
    });

    els.precheckContinue?.addEventListener('click', startCountdown);
    els.guidedClose?.addEventListener('click', stopGuided);
    els.guidedStop?.addEventListener('click', () => {
        stopPending = true;
        pauseGuided();
        els.stopConfirm?.classList.remove('is-hidden');
    });
    els.confirmStop?.addEventListener('click', stopGuided);
    els.cancelStop?.addEventListener('click', () => {
        stopPending = false;
        els.stopConfirm?.classList.add('is-hidden');
        if (!isPaused) return;
        resumeGuided();
    });
    els.guidedPause?.addEventListener('click', pauseGuided);
    els.guidedResume?.addEventListener('click', resumeGuided);
    els.skipBreaths?.addEventListener('click', skipBreaths);

    window.addEventListener('pagehide', cleanup);
}

async function selectType(type) {
    const config = CPR_LIBRARY[type];
    if (!config || !els.selection || !els.stepViewer) return;

    // Check CPR disclaimer before proceeding
    try {
        await checkCPRDisclaimer();
    } catch (err) {
        console.error('[CPR] Disclaimer error:', err);
        return;
    }

    currentType = type;
    currentSteps = config.steps;
    currentIndex = 0;
    appState = STATES.STEPS;
    document.body.classList.remove('theme-child', 'theme-infant');
    if (type === 'child') document.body.classList.add('theme-child');
    if (type === 'infant') document.body.classList.add('theme-infant');

    if (els.typeBadge) els.typeBadge.textContent = config.title;
    if (els.typeSubtitle) els.typeSubtitle.textContent = config.subtitle;

    els.selection.classList.add('is-hidden');
    els.stepViewer.classList.remove('is-hidden');

    updateStepView();
    updateRatio();
    updateTwoRescuerVisibility();
}

function changeStep(delta) {
    const newIndex = currentIndex + delta;
    if (newIndex >= 0 && newIndex < currentSteps.length) {
        currentIndex = newIndex;
        updateStepView();
    }
}

function updateStepView() {
    if (!currentSteps.length) return;
    
    const step = currentSteps[currentIndex];
    
    if (els.stepNumber) els.stepNumber.textContent = `Step ${currentIndex + 1}`;
    if (els.stepTitle) els.stepTitle.textContent = step.title;
    if (els.stepImage) els.stepImage.src = step.image;
    if (els.stepInstructions) {
        els.stepInstructions.innerHTML = step.instructions.map(i => `<li>${i}</li>`).join('');
    }
    
    // Update progress bar
    if (els.progressFill) {
        const pct = ((currentIndex + 1) / currentSteps.length) * 100;
        els.progressFill.style.width = `${pct}%`;
    }

    if (els.stepCounter) els.stepCounter.textContent = `Step ${currentIndex + 1} of ${currentSteps.length}`;
    if (els.navStatus) els.navStatus.textContent = `Step ${currentIndex + 1}`;

    // Update buttons
    if (els.navBack) els.navBack.disabled = currentIndex === 0;
    if (els.navNext) {
        // If last step, maybe show "Finish" or just disable
        els.navNext.disabled = currentIndex === currentSteps.length - 1;
    }
}

function resetToLanding() {
    cleanup();
    currentType = null;
    currentSteps = [];
    currentIndex = 0;
    appState = STATES.IDLE;
    document.body.classList.remove('theme-child', 'theme-infant', 'guided-active');
    els.stepViewer?.classList.add('is-hidden');
    els.selection?.classList.remove('is-hidden');
    els.navStatus && (els.navStatus.textContent = '');
}

function updateRatio() {
    const isChildOrInfant = currentType === 'child' || currentType === 'infant';
    const twoRescuer = !!els.toggleTwoRescuer?.checked && isChildOrInfant;
    ratio.compressions = twoRescuer ? 15 : 30;
    ratio.breaths = 2;
    els.guidedRatio && (els.guidedRatio.textContent = `${ratio.compressions}:${ratio.breaths}`);
}

function updateTwoRescuerVisibility() {
    const allow = currentType === 'child' || currentType === 'infant';
    els.twoRescuerRow?.classList.toggle('is-hidden', !allow);
    if (!allow && els.toggleTwoRescuer) els.toggleTwoRescuer.checked = false;
}

async function openGuidedOverlay() {
    if (!currentType || !els.guidedOverlay) return;

    // Check CPR disclaimer before starting guided mode
    try {
        await checkCPRDisclaimer();
    } catch (err) {
        console.error('[CPR] Disclaimer error:', err);
        return;
    }

    isPaused = false;
    soundOn = !!els.toggleSound?.checked;
    breathSoundOn = !!els.toggleBreathSound?.checked;
    bpm = clamp(Number(els.bpmInput?.value) || 110, 100, 120);
    breathDurationMs = Number(els.breathDuration?.value) || 6000;
    els.bpmInput && (els.bpmInput.value = bpm);
    els.bpmValue && (els.bpmValue.textContent = String(bpm));
    breathDurationMs = Number(els.breathDuration?.value) || 6000;
    els.soundHint?.classList.toggle('is-hidden', soundOn);
    guidedCount = 0;
    guidedCycle = 1;
    guidedPhase = PHASES.COMPRESSIONS;
    els.guidedCycle && (els.guidedCycle.textContent = 'Cycle 1');
    els.guidedCount && (els.guidedCount.textContent = '0');
    els.guidedPhase && (els.guidedPhase.textContent = 'Compressions');
    els.guidedSub && (els.guidedSub.textContent = getPhaseCopy());
    els.guidedRatio && (els.guidedRatio.textContent = `${ratio.compressions}:${ratio.breaths}`);
    els.skipBreaths?.classList.add('is-hidden');
    els.stopConfirm?.classList.add('is-hidden');
    els.precheckScreen?.classList.remove('is-hidden');
    els.countdownScreen?.classList.add('is-hidden');
    els.guidedResume?.classList.add('is-hidden');
    els.guidedPause?.classList.remove('is-hidden');
    if (els.guidedPulse) {
        els.guidedPulse.classList.remove('breath-mode');
        els.guidedPulse.style.animationPlayState = 'running';
    }
    updateTwoRescuerVisibility();
    updateRatio();

    document.body.classList.add('guided-active');
    els.guidedOverlay.classList.remove('is-hidden');
    els.guidedOverlay.classList.add('active');
    appState = STATES.STEPS;
}

function startCountdown() {
    if (!els.countdownScreen) return;
    clearCountdown();
    els.precheckScreen?.classList.add('is-hidden');
    els.countdownScreen.classList.remove('is-hidden');
    appState = STATES.COUNTDOWN;
    let count = 3;
    els.countdownNumber && (els.countdownNumber.textContent = String(count));
    countdownId = setInterval(() => {
        count -= 1;
        if (els.countdownNumber) els.countdownNumber.textContent = String(Math.max(count, 0));
        if (count <= 0) {
            clearCountdown();
            startCompressions();
        }
    }, 1000);
}

function startCompressions() {
    appState = STATES.COMPRESSIONS;
    guidedPhase = PHASES.COMPRESSIONS;
    guidedCount = 0;

    // Track session start for summary
    if (sessionStartTime === 0) {
        sessionStartTime = Date.now();
        totalCompressionCount = 0;
        tapScore = 0;
        tapTimings = [];
        lastTapTime = 0;
    }

    stopBreathTimers();
    els.countdownScreen?.classList.add('is-hidden');
    els.guidedPhase && (els.guidedPhase.textContent = 'Compressions');
    els.guidedSub && (els.guidedSub.textContent = getPhaseCopy());
    els.guidedCount && (els.guidedCount.textContent = '0');
    els.skipBreaths?.classList.add('is-hidden');
    els.guidedPause?.classList.remove('is-hidden');
    els.guidedResume?.classList.add('is-hidden');
    isPaused = false;

    // Voice announcement
    if (voiceEnabled && guidedCount === 0) {
        speakAnnouncement('Begin compressions');
    }

    startMetronome();
}

function startBreaths() {
    if (appState === STATES.STOPPED) return;
    appState = STATES.BREATHS;
    guidedPhase = PHASES.BREATHS;
    guidedCount = 0;
    stopMetronome();
    stopBreathTimers();

    // Voice announcement for breath phase
    if (voiceEnabled) {
        speakAnnouncement('Give two breaths', true);
    }

    els.guidedPhase && (els.guidedPhase.textContent = 'Breaths');
    els.guidedSub && (els.guidedSub.textContent = 'Give two slow breaths (~3s each).');
    els.guidedCount && (els.guidedCount.textContent = '0');
    els.skipBreaths?.classList.remove('is-hidden');
    if (els.guidedPulse) {
        els.guidedPulse.classList.add('breath-mode');
        els.guidedPulse.style.animationPlayState = 'paused';
    }
    const half = breathDurationMs / 2;
    const breath1 = setTimeout(() => {
        if (!isActiveBreathPhase()) return;
        guidedCount = 1;
        els.guidedCount && (els.guidedCount.textContent = '1');
        if (breathSoundOn) playBreathCue();

        // Voice announcement for first breath
        if (voiceEnabled) {
            speakAnnouncement('Breath one');
        }
    }, 0);

    // NEW: "Breathe in" prompt for first breath
    const breathIn1 = setTimeout(() => {
        if (!isActiveBreathPhase()) return;
        if (voiceEnabled) {
            speakAnnouncement('Breathe in', false); // Non-urgent, calm
        }
    }, 500);

    const breath2 = setTimeout(() => {
        if (!isActiveBreathPhase()) return;
        guidedCount = 2;
        els.guidedCount && (els.guidedCount.textContent = '2');
        if (breathSoundOn) playBreathCue();

        // Voice announcement for second breath
        if (voiceEnabled) {
            speakAnnouncement('Breath two');
        }
    }, half);

    // NEW: "Breathe in" prompt for second breath
    const breathIn2 = setTimeout(() => {
        if (!isActiveBreathPhase()) return;
        if (voiceEnabled) {
            speakAnnouncement('Breathe in', false); // Non-urgent, calm
        }
    }, half + 500);

    const finish = setTimeout(() => {
        if (!isActiveBreathPhase()) return;
        nextCycle();
    }, breathDurationMs);
    breathTimers.push(breath1, breathIn1, breath2, breathIn2, finish);
}

function nextCycle() {
    guidedCycle += 1;
    els.guidedCycle && (els.guidedCycle.textContent = `Cycle ${guidedCycle}`);
    els.skipBreaths?.classList.add('is-hidden');
    if (els.guidedPulse) {
        els.guidedPulse.classList.remove('breath-mode');
    }

    // Motivational messages at cycle milestones
    if (voiceEnabled) {
        let motivationalMessage = '';

        switch(guidedCycle) {
            case 1:
                motivationalMessage = 'Great start!';
                break;
            case 2:
                motivationalMessage = 'Keep going!';
                break;
            case 3:
                motivationalMessage = 'You\'re doing great!';
                break;
            case 5:
                motivationalMessage = 'Excellent work!';
                break;
            case 10:
                motivationalMessage = 'Stay strong!';
                break;
            default:
                // Every 5 cycles after 10
                if (guidedCycle > 10 && guidedCycle % 5 === 0) {
                    motivationalMessage = 'Keep it up!';
                }
        }

        if (motivationalMessage) {
            speakAnnouncement(motivationalMessage, false); // Calm, encouraging

            // Delay before "Resume compressions" to prevent overlap
            if (guidedCycle > 1) {
                setTimeout(() => {
                    if (voiceEnabled) {
                        speakAnnouncement('Resume compressions');
                    }
                }, 1000); // 1 second delay
            }
        } else if (voiceEnabled && guidedCycle > 1) {
            // No motivational message, just announce resume
            speakAnnouncement('Resume compressions');
        }
    }

    startCompressions();
}

function startMetronome() {
    if (isPaused || appState !== STATES.COMPRESSIONS) {
        console.log('Metronome not started - paused or wrong state');
        return;
    }
    stopMetronome();
    ensureAudioContext();
    const beatMs = 60000 / clamp(bpm || 110, 100, 120);
    console.log('Starting metronome with beat interval:', beatMs, 'ms');

    if (els.guidedPulse) {
        els.guidedPulse.style.setProperty('--beat-speed', `${beatMs}ms`);
        els.guidedPulse.classList.remove('breath-mode');
        els.guidedPulse.style.animationPlayState = 'running';
    }

    // Start the interval
    metronomeId = setInterval(tickCompression, beatMs);
    console.log('Metronome interval started with ID:', metronomeId);

    // Call first tick immediately
    tickCompression();
}

function restartMetronome() {
    if (appState !== STATES.COMPRESSIONS) return;
    startMetronome();
}

function tickCompression() {
    if (isPaused || appState !== STATES.COMPRESSIONS) return;
    guidedCount += 1;

    console.log('Compression tick:', guidedCount); // Debug log

    // Track compressions for summary
    totalCompressionCount++;
    recordCompressionTap();

    // Update UI
    if (els.guidedCount) {
        els.guidedCount.textContent = String(guidedCount);
    }
    if (els.guidedSub) {
        els.guidedSub.textContent = getPhaseCopy();
    }

    // Play sound
    if (soundOn) playTick();

    // Voice counting at key intervals (5, 10, 15, 20, 25, 30)
    if (voiceEnabled && guidedCount % 5 === 0 && guidedCount <= ratio.compressions) {
        speakAnnouncement(String(guidedCount));
    }

    beatHaptics();

    // Check if we've reached the breath phase
    if (guidedCount >= ratio.compressions) {
        cycleCount++;
        startBreaths();
    }
}

function skipBreaths() {
    stopBreathTimers();
    els.skipBreaths?.classList.add('is-hidden');
    nextCycle();
}

function pauseGuided() {
    if (appState === STATES.STOPPED) return;
    isPaused = true;
    stopMetronome();
    stopBreathTimers();
    els.guidedPause?.classList.add('is-hidden');
    els.guidedResume?.classList.remove('is-hidden');
    if (els.guidedPulse) els.guidedPulse.classList.add('breath-mode');
}

function resumeGuided() {
    if (appState === STATES.STOPPED) return;
    els.stopConfirm?.classList.add('is-hidden');
    stopPending = false;
    isPaused = false;
    els.guidedPause?.classList.remove('is-hidden');
    els.guidedResume?.classList.add('is-hidden');
    if (guidedPhase === PHASES.BREATHS) {
        startBreaths();
    } else {
        startMetronome();
    }
}

function stopGuided() {
    appState = STATES.STOPPED;
    stopPending = false;
    isPaused = false;
    stopMetronome();
    stopBreathTimers();
    clearCountdown();

    els.guidedOverlay?.classList.add('is-hidden');
    els.guidedOverlay?.classList.remove('active');
    els.stopConfirm?.classList.add('is-hidden');
    if (els.guidedPulse) {
        els.guidedPulse.classList.remove('breath-mode');
        els.guidedPulse.style.animationPlayState = 'paused';
    }
    document.body.classList.remove('guided-active');

    // Show session summary AFTER closing overlay (if compressions were performed)
    if (totalCompressionCount > 0) {
        setTimeout(() => {
            showSessionSummary();
        }, 300);
    }
}

function cleanup() {
    stopGuided();
}

function stopMetronome() {
    if (metronomeId) clearInterval(metronomeId);
    metronomeId = null;
}

function stopBreathTimers() {
    breathTimers.forEach(t => clearTimeout(t));
    breathTimers = [];
}

function clearCountdown() {
    if (countdownId) clearInterval(countdownId);
    countdownId = null;
}

function ensureAudioContext() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } else if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch (err) {
        console.warn('Audio context unavailable', err);
    }
}

function playTick() {
    try {
        ensureAudioContext();
        const ctx = audioCtx;
        if (!ctx) return;

        const now = ctx.currentTime;

        // High tick (880Hz)
        const tick = ctx.createOscillator();
        const tickGain = ctx.createGain();
        tick.type = 'sine';
        tick.frequency.value = 880;
        tickGain.gain.setValueAtTime(0.12, now);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        tick.connect(tickGain).connect(ctx.destination);
        tick.start(now);
        tick.stop(now + 0.1);

        // Bass beat (110Hz for depth)
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.value = 110;
        bassGain.gain.setValueAtTime(0.15, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        bass.connect(bassGain).connect(ctx.destination);
        bass.start(now);
        bass.stop(now + 0.18);
    } catch (err) {
        console.warn('Tick sound unavailable', err);
    }
}

function playBreathCue() {
    try {
        ensureAudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.32);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.34);
    } catch (err) {
        console.warn('Breath cue unavailable', err);
    }
}

function beatHaptics() {
    (hapticsPromise ||= loadHaptics())
        .then(engine => {
            if (engine?.Haptics) {
                return engine.Haptics.impact({ style: engine.ImpactStyle?.Medium || 'medium' });
            }
            if (navigator.vibrate) navigator.vibrate(10);
            return null;
        })
        .catch(() => {});
}

async function loadHaptics() {
    try {
        if (window.Capacitor?.Plugins?.Haptics) {
            // Use Capacitor Plugin API instead of ES module import
            const Haptics = window.Capacitor.Plugins.Haptics;
            // ImpactStyle enum values
            const ImpactStyle = {
                Heavy: 'HEAVY',
                Medium: 'MEDIUM',
                Light: 'LIGHT'
            };
            return { Haptics, ImpactStyle };
        }
    } catch {
        // Fallback handled below
    }
    return null;
}

function isActiveBreathPhase() {
    return !isPaused && appState === STATES.BREATHS;
}

function getPhaseCopy() {
    if (currentType === 'infant') return 'Two-finger compressions. Gentle but fast.';
    if (currentType === 'child') return 'Strong, steady compressions. 30:2 or 15:2 if two rescuers.';
    return 'Push hard and fast, 100–120 per minute.';
}

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

// ==================== PROFESSIONAL CPR ENHANCEMENTS ====================

// Voice announcement system
let voiceEnabled = false;
let practiceMode = false;
let tapScore = 0;
let sessionStartTime = 0;

async function speakAnnouncement(text, urgent = false) {
    if (!voiceEnabled) return;

    // Try Capacitor TextToSpeech first (works on Android WebView)
    if (window.Capacitor?.Plugins?.TextToSpeech) {
        try {
            const { TextToSpeech } = window.Capacitor.Plugins;

            // Visual indicator - show speaking state
            if (els.guidedPulse) {
                els.guidedPulse.classList.add('voice-speaking');
            }

            await TextToSpeech.speak({
                text: text,
                lang: 'en-US',
                rate: urgent ? 1.2 : 1.0,
                pitch: urgent ? 1.2 : 1.0,
                volume: 0.8,
                category: 'ambient'
            });

            // Remove visual indicator after speech completes
            if (els.guidedPulse) {
                els.guidedPulse.classList.remove('voice-speaking');
            }

            return; // Success, exit function
        } catch (err) {
            console.warn('Capacitor TTS error:', err);
            // Fall through to Web Speech API
        }
    }

    // Fallback to Web Speech Synthesis API (browser support)
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis) {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = urgent ? 1.2 : 1.0;
            utterance.pitch = urgent ? 1.2 : 1.0;
            utterance.volume = 0.8;

            // Use clearer voice if available
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(v =>
                v.name.includes('Female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Google')
            );
            if (preferredVoice) utterance.voice = preferredVoice;

            // Visual indicator - pulse heart when speaking
            utterance.onstart = () => {
                if (els.guidedPulse) {
                    els.guidedPulse.classList.add('voice-speaking');
                }
            };

            utterance.onend = () => {
                if (els.guidedPulse) {
                    els.guidedPulse.classList.remove('voice-speaking');
                }
            };

            utterance.onerror = (event) => {
                console.warn('Speech synthesis error:', event);
                if (els.guidedPulse) {
                    els.guidedPulse.classList.remove('voice-speaking');
                }
            };

            speechSynthesis.speak(utterance);
            return; // Success
        } catch (err) {
            console.warn('Speech synthesis error:', err);
        }
    }

    // No TTS available
    console.warn('No text-to-speech available on this device');
}

// Load voices (needed for some browsers)
if (typeof speechSynthesis !== 'undefined' && speechSynthesis) {
    try {
        speechSynthesis.addEventListener('voiceschanged', () => {
            speechSynthesis.getVoices();
        });
    } catch (err) {
        console.warn('Voice loading not available:', err);
    }
}

// BPM Accuracy Tracking
function recordCompressionTap() {
    const now = Date.now();
    if (lastTapTime > 0) {
        const interval = now - lastTapTime;
        tapTimings.push(interval);

        // Keep only last 10 taps
        if (tapTimings.length > 10) tapTimings.shift();

        // Calculate average BPM
        const avgInterval = tapTimings.reduce((a, b) => a + b) / tapTimings.length;
        const actualBPM = Math.round(60000 / avgInterval);

        updateBPMAccuracy(actualBPM);
    }
    lastTapTime = now;
}

function updateBPMAccuracy(actualBPM) {
    const target = bpm || 110;
    const diff = Math.abs(actualBPM - target);

    let quality = 'perfect';
    let depthClass = '';
    let depthText = 'Perfect Rhythm';

    if (diff > 5 && diff <= 10) {
        quality = 'good';
        depthClass = 'warning';
        depthText = 'Good Pace';
    } else if (diff > 10) {
        quality = 'poor';
        depthClass = 'danger';
        depthText = actualBPM > target ? 'Too Fast' : 'Too Slow';
    }

    // Update UI
    const bpmEl = document.getElementById('bpmAccuracy');
    const qualityEl = document.getElementById('bpmQuality');
    const depthFillEl = document.getElementById('depthFill');
    const depthLabelEl = document.getElementById('depthLabel');

    if (bpmEl) bpmEl.textContent = `${actualBPM} BPM`;
    if (qualityEl) {
        qualityEl.textContent = quality.charAt(0).toUpperCase() + quality.slice(1);
        qualityEl.className = `bpm-quality quality-${quality}`;
    }
    if (depthFillEl) {
        depthFillEl.className = `depth-fill ${depthClass}`;
    }
    if (depthLabelEl) {
        depthLabelEl.textContent = depthText;
    }

    // Show BPM container after first compression
    const bpmContainer = document.getElementById('bpmAccuracyContainer');
    if (bpmContainer && guidedCount > 2) {
        bpmContainer.style.display = 'block';
    }
}

// Practice Mode - Touch/Click to Practice
function enablePracticeMode() {
    practiceMode = true;
    const pulseEl = els.guidedPulse;
    if (pulseEl) {
        pulseEl.classList.add('practice-mode');
        pulseEl.addEventListener('touchstart', handlePracticeTap);
        pulseEl.addEventListener('mousedown', handlePracticeTap);
    }
}

function disablePracticeMode() {
    practiceMode = false;
    const pulseEl = els.guidedPulse;
    if (pulseEl) {
        pulseEl.classList.remove('practice-mode');
        pulseEl.removeEventListener('touchstart', handlePracticeTap);
        pulseEl.removeEventListener('mousedown', handlePracticeTap);
    }
}

function handlePracticeTap(e) {
    e.preventDefault();
    if (!practiceMode || isPaused) return;

    // Calculate timing accuracy
    const now = Date.now();
    const beatMs = 60000 / clamp(bpm || 110, 100, 120);
    const expectedBeatTime = lastTapTime + beatMs;
    const timingError = Math.abs(now - expectedBeatTime);

    // Score: 100 points for perfect timing (within 50ms)
    let points = 0;
    if (timingError < 50) points = 100;
    else if (timingError < 100) points = 80;
    else if (timingError < 150) points = 60;
    else if (timingError < 200) points = 40;

    tapScore += points;

    // Visual feedback
    showTapFeedback(points);
    recordCompressionTap();
}

function showTapFeedback(points) {
    const feedback = document.createElement('div');
    feedback.className = 'tap-feedback';
    feedback.textContent = `+${points}`;
    feedback.style.color = points >= 80 ? '#10b981' : points >= 60 ? '#f59e0b' : '#ef4444';

    const pulseContainer = document.querySelector('.pulse-container');
    if (pulseContainer) {
        pulseContainer.appendChild(feedback);
        setTimeout(() => feedback.remove(), 800);
    }
}

// Enhanced Audio - Layered Metronome
function playLayeredTick() {
    const ctx = audioCtx;
    if (!ctx) return;

    const now = ctx.currentTime;

    // High tick (existing 880Hz)
    const tick = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tick.type = 'sine';
    tick.frequency.value = 880;
    tickGain.gain.setValueAtTime(0.12, now);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    tick.connect(tickGain).connect(ctx.destination);
    tick.start(now);
    tick.stop(now + 0.1);

    // Bass beat (new - 110Hz for depth)
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.value = 110;
    bassGain.gain.setValueAtTime(0.15, now);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    bass.connect(bassGain).connect(ctx.destination);
    bass.start(now);
    bass.stop(now + 0.18);
}

// Milestone Sounds
function playMilestoneTick(count) {
    if (count === 10 || count === 20) {
        playTickWithFrequency(1100, 0.15); // Higher pitch for milestones
        if (voiceEnabled) speakAnnouncement(`${count} compressions`);
    } else if (count === 30) {
        playCompletionChord();
        if (voiceEnabled) speakAnnouncement('Give two breaths', true);
    } else {
        playLayeredTick();
    }
}

function playTickWithFrequency(freq, gain) {
    const ctx = audioCtx;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.frequency.value = freq;
    gainNode.gain.setValueAtTime(gain, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gainNode).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

function playCompletionChord() {
    const ctx = audioCtx;
    if (!ctx) return;

    const now = ctx.currentTime;

    // Play C major chord (C-E-G: 523Hz, 659Hz, 784Hz)
    [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + (i * 0.05));
        osc.stop(now + 0.5);
    });
}

// Session Summary
function showSessionSummary() {
    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const avgBPM = calculateAverageBPM();
    const accuracyScore = calculateAccuracyScore();

    const summary = {
        totalCompressions: totalCompressionCount,
        totalCycles: cycleCount,
        averageBPM: avgBPM,
        accuracyScore: accuracyScore,
        duration: duration,
        practiceScore: tapScore
    };

    renderSummaryScreen(summary);
    saveSessionToHistory(summary);
}

function renderSummaryScreen(summary) {
    const minutes = Math.floor(summary.duration / 60);
    const seconds = summary.duration % 60;
    const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const html = `
        <div class="summary-stat">
            <span class="summary-stat-value">${summary.totalCompressions}</span>
            <span class="summary-stat-label">Total Compressions</span>
        </div>
        <div class="summary-stat">
            <span class="summary-stat-value">${summary.totalCycles}</span>
            <span class="summary-stat-label">Cycles Completed</span>
        </div>
        <div class="summary-stat">
            <span class="summary-stat-value">${summary.averageBPM}</span>
            <span class="summary-stat-label">Avg BPM</span>
        </div>
        <div class="summary-stat">
            <span class="summary-stat-value">${summary.accuracyScore}%</span>
            <span class="summary-stat-label">Accuracy</span>
        </div>
        <div class="summary-stat">
            <span class="summary-stat-value">${durationText}</span>
            <span class="summary-stat-label">Duration</span>
        </div>
        ${practiceMode ? `
        <div class="summary-stat">
            <span class="summary-stat-value">${summary.practiceScore}</span>
            <span class="summary-stat-label">Practice Score</span>
        </div>
        ` : ''}
    `;

    const summaryStats = document.getElementById('summaryStats');
    const summaryEl = document.getElementById('sessionSummary');

    if (summaryStats) summaryStats.innerHTML = html;
    if (summaryEl) summaryEl.classList.remove('is-hidden');
}

function calculateAverageBPM() {
    if (tapTimings.length === 0) return bpm || 110;

    const avgInterval = tapTimings.reduce((a, b) => a + b) / tapTimings.length;
    return Math.round(60000 / avgInterval);
}

function calculateAccuracyScore() {
    if (tapTimings.length === 0) return 100;

    const target = bpm || 110;
    const avgBPM = calculateAverageBPM();
    const diff = Math.abs(avgBPM - target);

    if (diff <= 5) return 100;
    if (diff <= 10) return 85;
    if (diff <= 15) return 70;
    return 50;
}

function saveSessionToHistory(summary) {
    try {
        const history = JSON.parse(localStorage.getItem('resqtap:cprSessions') || '[]');
        history.push({
            ...summary,
            timestamp: new Date().toISOString(),
            type: currentType
        });

        // Keep last 50 sessions
        if (history.length > 50) history.shift();

        localStorage.setItem('resqtap:cprSessions', JSON.stringify(history));
    } catch (e) {
        console.warn('Could not save CPR session:', e);
    }
}

// Fullscreen Mode
function enterFullscreen() {
    const elem = els.guidedOverlay;
    if (!elem) return;

    try {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }

        elem.classList.add('fullscreen');

        // Lock screen orientation to portrait (mobile)
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => {});
        }

        // Keep screen awake
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(() => {});
        }
    } catch (e) {
        console.warn('Fullscreen not supported:', e);
    }
}

function exitFullscreen() {
    const elem = els.guidedOverlay;
    if (!elem) return;

    elem.classList.remove('fullscreen');

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

// Enhanced Event Listeners
document.getElementById('toggleVoice')?.addEventListener('change', (e) => {
    voiceEnabled = e.target.checked;
    if (voiceEnabled && guidedPhase === PHASES.COMPRESSIONS) {
        speakAnnouncement('Voice guidance enabled');
    }
});

document.getElementById('togglePractice')?.addEventListener('change', (e) => {
    if (e.target.checked) {
        enablePracticeMode();
        speakAnnouncement('Practice mode enabled. Tap the circle in rhythm.');
    } else {
        disablePracticeMode();
    }
});

document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
});

document.getElementById('newSessionBtn')?.addEventListener('click', () => {
    const summaryEl = document.getElementById('sessionSummary');
    if (summaryEl) summaryEl.classList.add('is-hidden');

    // Reset stats
    totalCompressionCount = 0;
    tapScore = 0;
    tapTimings = [];
    lastTapTime = 0;

    // Restart
    openGuidedOverlay();
});

document.getElementById('closeSummaryBtn')?.addEventListener('click', () => {
    const summaryEl = document.getElementById('sessionSummary');
    if (summaryEl) summaryEl.classList.add('is-hidden');
    closeGuidedOverlay();
});

// These functions will be integrated by modifying the existing ones below

init();
