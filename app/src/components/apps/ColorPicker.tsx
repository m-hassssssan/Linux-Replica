import { useState, useRef, useCallback, useEffect } from 'react';

export default function ColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState(200);
  const [sat, setSat] = useState(80);
  const [light, setLight] = useState(50);
  const [history, setHistory] = useState<string[]>(['#00d4ff', '#4effa1', '#ff007f', '#ff9500', '#a855f7']);
  const [copied, setCopied] = useState(false);

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hex = hslToHex(hue, sat, light);
  const rgb = hexToRgb(hex);
  const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  // Draw hue spectrum
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    for (let i = 0; i < canvas.width; i++) {
      ctx.fillStyle = `hsl(${(i / canvas.width) * 360}, 100%, 50%)`;
      ctx.fillRect(i, 0, 1, canvas.height);
    }
  }, []);

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
  }

  const addToHistory = useCallback(() => {
    setHistory(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 10));
  }, [hex]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Preview */}
      <div className="flex gap-3 mb-4">
        <div className="w-20 h-20 rounded-xl shadow-lg shrink-0" style={{ backgroundColor: hex }} />
        <div className="flex-1 space-y-1.5">
          <button onClick={() => copy(hex)} className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-xs text-white/60">HEX</span>
            <span className="text-xs text-white font-mono">{hex}</span>
          </button>
          <button onClick={() => copy(rgbStr)} className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-xs text-white/60">RGB</span>
            <span className="text-xs text-white font-mono">{rgbStr}</span>
          </button>
          <button onClick={() => copy(`hsl(${hue}, ${sat}%, ${light}%)`)} className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-xs text-white/60">HSL</span>
            <span className="text-xs text-white font-mono">{hue}, {sat}%, {light}%</span>
          </button>
          {copied && <span className="text-[10px] text-[#4effa1]">Copied!</span>}
        </div>
      </div>

      {/* Hue Spectrum */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/40">Hue</span>
          <span className="text-[10px] text-white/40">{hue}°</span>
        </div>
        <canvas ref={canvasRef} className="w-full h-4 rounded-full cursor-crosshair" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setHue(Math.round((x / rect.width) * 360));
          addToHistory();
        }} />
      </div>

      {/* Saturation */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/40">Saturation</span>
          <span className="text-[10px] text-white/40">{sat}%</span>
        </div>
        <input type="range" min="0" max="100" value={sat} onChange={e => setSat(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
      </div>

      {/* Lightness */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/40">Lightness</span>
          <span className="text-[10px] text-white/40">{light}%</span>
        </div>
        <input type="range" min="0" max="100" value={light} onChange={e => setLight(Number(e.target.value))} className="w-full accent-[#00d4ff]" />
      </div>

      {/* Gradient Preview */}
      <div className="h-8 rounded-lg mb-3" style={{ background: `linear-gradient(to right, hsl(${hue}, 0%, ${light}%), hsl(${hue}, 100%, ${light}%))` }} />

      {/* History */}
      <div>
        <span className="text-[10px] text-white/30 mb-1 block">History</span>
        <div className="flex gap-1.5 flex-wrap">
          {history.map((c, i) => (
            <button key={i} onClick={() => {
              // Parse hex and update hsl
              const r = parseInt(c.slice(1, 3), 16) / 255;
              const g = parseInt(c.slice(3, 5), 16) / 255;
              const b = parseInt(c.slice(5, 7), 16) / 255;
              const max = Math.max(r, g, b), min = Math.min(r, g, b);
              let h = 0;
              const d = max - min;
              if (d !== 0) {
                if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                else if (max === g) h = ((b - r) / d + 2) / 6;
                else h = ((r - g) / d + 4) / 6;
              }
              const l = (max + min) / 2;
              const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
              setHue(Math.round(h * 360));
              setSat(Math.round(s * 100));
              setLight(Math.round(l * 100));
            }} className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
