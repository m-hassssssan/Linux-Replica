import { useEffect, useCallback } from 'react';

// Frequencies for 2 octaves starting from C4
const WHITE_KEYS = [
  { note: 'C', freq: 261.63, key: 'a' },
  { note: 'D', freq: 293.66, key: 's' },
  { note: 'E', freq: 329.63, key: 'd' },
  { note: 'F', freq: 349.23, key: 'f' },
  { note: 'G', freq: 392.00, key: 'g' },
  { note: 'A', freq: 440.00, key: 'h' },
  { note: 'B', freq: 493.88, key: 'j' },
  { note: 'C2', freq: 523.25, key: 'k' },
];

const BLACK_KEYS = [
  { note: 'C#', freq: 277.18, key: 'w', pos: 0 },
  { note: 'D#', freq: 311.13, key: 'e', pos: 1 },
  { note: 'F#', freq: 369.99, key: 't', pos: 3 },
  { note: 'G#', freq: 415.30, key: 'y', pos: 4 },
  { note: 'A#', freq: 466.16, key: 'u', pos: 5 },
];

export default function Piano() {
  const play = useCallback((freq: number) => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const white = WHITE_KEYS.find(w => w.key === k);
      const black = BLACK_KEYS.find(b => b.key === k);
      if (white) play(white.freq);
      if (black) play(black.freq);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [play]);

  const whiteKeyWidth = 100 / WHITE_KEYS.length;

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-6">
      <div className="text-xs text-white/30 mb-4">Press keyboard keys or click to play</div>
      <div className="relative w-full max-w-[600px]" style={{ height: '160px' }}>
        {/* White keys */}
        <div className="absolute inset-0 flex">
          {WHITE_KEYS.map((k) => (
            <button
              key={k.note}
              onClick={() => play(k.freq)}
              className="h-full bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-300
                rounded-b-lg flex flex-col items-center justify-end pb-2 transition-colors"
              style={{ width: `${whiteKeyWidth}%` }}
            >
              <span className="text-[9px] text-gray-400 font-medium">{k.note}</span>
              <span className="text-[8px] text-gray-300">{k.key}</span>
            </button>
          ))}
        </div>

        {/* Black keys */}
        {BLACK_KEYS.map(k => (
          <button
            key={k.note}
            onClick={() => play(k.freq)}
            className="absolute top-0 h-[60%] bg-[#1a1a2e] hover:bg-[#2a2a3e] active:bg-[#3a3a4e]
              border border-white/10 rounded-b-lg z-10 flex flex-col items-center justify-end pb-1 transition-colors"
            style={{
              left: `${(k.pos + 1) * whiteKeyWidth - whiteKeyWidth * 0.35}%`,
              width: `${whiteKeyWidth * 0.7}%`,
            }}
          >
            <span className="text-[7px] text-white/30">{k.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
