import { useEffect, useCallback } from 'react';

const DRUMS = [
  { key: 'Q', name: 'Kick', freq: 150, type: 'sine', decay: 0.3 },
  { key: 'W', name: 'Snare', freq: 300, type: 'triangle', decay: 0.15 },
  { key: 'E', name: 'Hi-Hat', freq: 8000, type: 'square', decay: 0.05 },
  { key: 'A', name: 'Tom', freq: 200, type: 'sine', decay: 0.25 },
  { key: 'S', name: 'Clap', freq: 1200, type: 'triangle', decay: 0.1 },
  { key: 'D', name: 'Crash', freq: 5000, type: 'sawtooth', decay: 0.4 },
  { key: 'Z', name: 'Boom', freq: 80, type: 'sine', decay: 0.5 },
  { key: 'X', name: 'Ride', freq: 6000, type: 'square', decay: 0.2 },
  { key: 'C', name: 'Tink', freq: 3500, type: 'sine', decay: 0.08 },
];

export default function DrumKit() {
  const play = useCallback((freq: number, type: OscillatorType, decay: number) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + decay);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const drum = DRUMS.find(d => d.key === e.key.toUpperCase());
      if (drum) play(drum.freq, drum.type as OscillatorType, drum.decay);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [play]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-6">
      <div className="text-xs text-white/30 mb-6">Press keys or click pads to play</div>
      <div className="grid grid-cols-3 gap-3">
        {DRUMS.map(drum => (
          <button
            key={drum.key}
            onClick={() => play(drum.freq, drum.type as OscillatorType, drum.decay)}
            className="w-28 h-24 rounded-xl bg-white/5 hover:bg-[#00d4ff]/10 active:bg-[#00d4ff]/20
              border border-white/5 hover:border-[#00d4ff]/20 active:scale-95 transition-all
              flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg text-white/20 font-bold">{drum.key}</span>
            <span className="text-[10px] text-white/40">{drum.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
