import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';

interface StatRingProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: any;
}

function StatRing({ label, value, max, color, icon: Icon }: StatRingProps) {
  const pct = Math.min(100, (value / max) * 100);
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="40" cy="40" r="38" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-500" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 mb-0.5" style={{ color }} />
          <span className="text-sm font-bold text-white">{value.toFixed(0)}%</span>
        </div>
      </div>
      <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function SystemMonitor() {
  const [cpu, setCpu] = useState(23);
  const [ram, setRam] = useState(42);
  const [disk, setDisk] = useState(67);
  const [net, setNet] = useState(15);
  const [uptime, setUptime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>(new Array(60).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(10 + Math.random() * 50);
      setRam(35 + Math.random() * 20);
      setDisk(67 + Math.random() * 2);
      setNet(Math.random() * 80);
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time graph
  useEffect(() => {
    dataRef.current = [...dataRef.current.slice(1), cpu];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Line
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    dataRef.current.forEach((val, i) => {
      const x = (i / (dataRef.current.length - 1)) * canvas.width;
      const y = canvas.height - (val / 100) * canvas.height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
  }, [cpu]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4 gap-4 overflow-y-auto">
      {/* Stat Rings */}
      <div className="grid grid-cols-4 gap-4">
        <StatRing label="CPU" value={cpu} max={100} color="#00d4ff" icon={Icons.Cpu} />
        <StatRing label="RAM" value={ram} max={100} color="#4effa1" icon={Icons.MemoryStick} />
        <StatRing label="Disk" value={disk} max={100} color="#ff007f" icon={Icons.HardDrive} />
        <StatRing label="Network" value={net} max={100} color="#ff9500" icon={Icons.Wifi} />
      </div>

      {/* Real-time Graph */}
      <div className="flex-1 bg-[#1a1a2e] rounded-xl border border-white/5 p-3 min-h-[150px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">CPU Usage (Real-time)</span>
          <span className="text-xs text-[#00d4ff] font-mono">{cpu.toFixed(1)}%</span>
        </div>
        <canvas ref={canvasRef} className="w-full h-[120px]" />
      </div>

      {/* System Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Icons.Clock className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/50">Uptime</span>
          </div>
          <span className="text-sm text-white font-mono">{formatUptime(uptime)}</span>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Icons.Thermometer className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/50">Temperature</span>
          </div>
          <span className="text-sm text-white font-mono">{(42 + Math.random() * 8).toFixed(1)}°C</span>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Icons.Zap className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/50">Processes</span>
          </div>
          <span className="text-sm text-white font-mono">142</span>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Icons.Layers className="w-4 h-4 text-white/40" />
            <span className="text-xs text-white/50">Threads</span>
          </div>
          <span className="text-sm text-white font-mono">1,247</span>
        </div>
      </div>
    </div>
  );
}
