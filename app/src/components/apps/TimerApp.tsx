import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function TimerApp() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef<number>(0);

  useEffect(() => {
    if (running) {
      endRef.current = Date.now() + totalMs;
      intervalRef.current = window.setInterval(() => {
        const remaining = endRef.current - Date.now();
        if (remaining <= 0) {
          setTotalMs(0);
          setRunning(false);
          setDone(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          setTotalMs(remaining);
        }
      }, 10);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const totalSeconds = Math.ceil(totalMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const progress = 1 - totalMs / ((hours * 3600 + minutes * 60 + seconds) * 1000 || 1);

  const start = () => {
    if (totalMs <= 0) {
      const ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
      if (ms > 0) setTotalMs(ms);
    }
    setDone(false);
    setRunning(true);
  };

  const circumference = 2 * Math.PI * 80;
  const offset = circumference * (1 - progress);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Timer Circle */}
      <div className="flex-1 flex items-center justify-center relative">
        <svg className="w-52 h-52 -rotate-90" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="90" cy="90" r="80" fill="none" stroke="#00d4ff" strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done ? (
            <div className="text-2xl text-[#ff007f] font-bold animate-pulse">TIME UP!</div>
          ) : (
            <>
              <div className="text-3xl text-white font-mono font-bold">
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-white/30 mt-1">{Math.floor(totalMs % 1000 / 10)}ms</div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      {!running && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex flex-col items-center">
            <button onClick={() => setHours(h => Math.min(23, h + 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronUp className="w-3 h-3 text-white/40" /></button>
            <span className="text-lg text-white font-mono">{String(hours).padStart(2, '0')}</span>
            <button onClick={() => setHours(h => Math.max(0, h - 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronDown className="w-3 h-3 text-white/40" /></button>
          </div>
          <span className="text-white/20 text-lg">:</span>
          <div className="flex flex-col items-center">
            <button onClick={() => setMinutes(m => Math.min(59, m + 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronUp className="w-3 h-3 text-white/40" /></button>
            <span className="text-lg text-white font-mono">{String(minutes).padStart(2, '0')}</span>
            <button onClick={() => setMinutes(m => Math.max(0, m - 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronDown className="w-3 h-3 text-white/40" /></button>
          </div>
          <span className="text-white/20 text-lg">:</span>
          <div className="flex flex-col items-center">
            <button onClick={() => setSeconds(s => Math.min(59, s + 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronUp className="w-3 h-3 text-white/40" /></button>
            <span className="text-lg text-white font-mono">{String(seconds).padStart(2, '0')}</span>
            <button onClick={() => setSeconds(s => Math.max(0, s - 1))} className="p-1 hover:bg-white/10 rounded"><Icons.ChevronDown className="w-3 h-3 text-white/40" /></button>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={() => running ? setRunning(false) : start()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
            ${running ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-[#4effa1]/20 hover:bg-[#4effa1]/30'}`}
        >
          {running ? <Icons.Pause className="w-5 h-5 text-red-400" /> : <Icons.Play className="w-5 h-5 text-[#4effa1] ml-0.5" />}
        </button>
        <button
          onClick={() => { setRunning(false); setTotalMs((hours * 3600 + minutes * 60 + seconds) * 1000); setDone(false); }}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <Icons.RotateCcw className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>
  );
}
