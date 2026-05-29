import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      const start = Date.now() - time;
      intervalRef.current = window.setInterval(() => setTime(Date.now() - start), 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const format = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Display */}
      <div className="text-center py-8">
        <div className="text-5xl text-white font-mono font-bold tracking-wider">{format(time)}</div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setRunning(!running)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all
            ${running ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-[#4effa1]/20 hover:bg-[#4effa1]/30'}`}
        >
          {running ? <Icons.Pause className="w-6 h-6 text-red-400" /> : <Icons.Play className="w-6 h-6 text-[#4effa1] ml-0.5" />}
        </button>
        <button
          onClick={() => { setRunning(false); setTime(0); setLaps([]); }}
          className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <Icons.Square className="w-5 h-5 text-white/60" />
        </button>
        <button
          onClick={() => setLaps(prev => [time, ...prev])}
          disabled={!running}
          className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-30"
        >
          <Icons.Flag className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Laps */}
      <div className="flex-1 overflow-y-auto">
        {laps.map((lap, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 px-2">
            <span className="text-xs text-white/40">Lap {laps.length - i}</span>
            <span className="text-sm text-white font-mono">{format(lap)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
