// src/components/Gacha/SoundSynth.ts

let sharedCtx: AudioContext | null = null;

const getAudioContext = async (): Promise<AudioContext | null> => {
  if (typeof window === "undefined") return null;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    if (!sharedCtx) {
      sharedCtx = new AudioContextClass();
    }
    
    if (sharedCtx.state === "suspended") {
      await sharedCtx.resume();
    }
    return sharedCtx;
  } catch (e) {
    console.error("Failed to initialize AudioContext:", e);
    return null;
  }
};

export const playSynthSound = async (
  type: "coin" | "clack" | "pop" | "fanfare_c" | "fanfare_sr" | "fanfare_epic",
  muted: boolean
) => {
  if (muted) return;
  
  const ctx = await getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    if (type === "coin") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "clack") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "fanfare_c") {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.07 + 0.18);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.18);
      });
    } else if (type === "fanfare_sr") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        const noteStart = now + idx * 0.09;
        gain.gain.setValueAtTime(0.06, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.005, noteStart + 0.35);
        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } else if (type === "fanfare_epic") {
      const notes = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.frequency.value = 5.5;
        lfoGain.gain.value = freq * 0.008;

        osc.frequency.value = freq;
        const noteStart = now + idx * 0.04;
        gain.gain.setValueAtTime(0.04, noteStart);
        gain.gain.linearRampToValueAtTime(0.04, noteStart + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.2);

        lfo.start(noteStart);
        osc.start(noteStart);
        lfo.stop(noteStart + 1.2);
        osc.stop(noteStart + 1.2);
      });
    }
  } catch (e) {
    console.error("Synthesizer sound play error:", e);
  }
};
