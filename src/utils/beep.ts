/**
 * Native AudioContext EVM Confirmation Synthesizer
 * Generates an authentic 440Hz square-wave tone without external audio files.
 * Fully compliant with browser user-gesture requirements.
 */

let sharedAudioCtx: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentGainNode: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    try {
      sharedAudioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }

  return sharedAudioCtx;
}

/**
 * Triggers the authentic 440Hz EVM confirmation beep.
 * @param durationMs Duration of continuous tone (strictly 5000ms = 5 seconds upon pressing vote).
 * @param soundEnabled Master mute switch check.
 * @returns Stop function to manually cancel tone if needed.
 */
export function playEvmBeep(durationMs: number = 5000, soundEnabled: boolean = true): () => void {
  if (!soundEnabled) {
    return () => {};
  }

  const ctx = getAudioContext();
  if (!ctx) return () => {};

  try {
    // Resume context if browser suspended it pending user interaction
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    // Stop any existing tone cleanly
    stopCurrentTone();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Standard EVM specification tone: 440 Hz square wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    // Smooth envelope to prevent audio clicking on start/stop
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.03); // Safe comfortable volume

    // Schedule smooth decay at end of 5 seconds duration
    const stopTime = now + durationMs / 1000;
    gain.gain.setValueAtTime(0.18, stopTime - 0.05);
    gain.gain.linearRampToValueAtTime(0.0001, stopTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(stopTime);

    currentOscillator = osc;
    currentGainNode = gain;

    const stopFn = () => {
      try {
        if (currentOscillator === osc) {
          stopCurrentTone();
        }
      } catch {
        // Safe fallback
      }
    };

    osc.onended = () => {
      if (currentOscillator === osc) {
        currentOscillator = null;
        currentGainNode = null;
      }
    };

    return stopFn;
  } catch {
    return () => {};
  }
}

/**
 * Kept silent to satisfy rule: "the beep sound should only come when pressing vote"
 */
export function playOfficerChime(_soundEnabled: boolean = true): void {
  // Silent - beep only sounds upon casting vote
}

/**
 * Stop any active synthesizer tones immediately
 */
export function stopCurrentTone(): void {
  try {
    if (currentOscillator) {
      currentOscillator.stop();
      currentOscillator.disconnect();
      currentOscillator = null;
    }
    if (currentGainNode) {
      currentGainNode.disconnect();
      currentGainNode = null;
    }
  } catch {
    currentOscillator = null;
    currentGainNode = null;
  }
}
