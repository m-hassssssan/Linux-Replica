import { useState, useCallback } from 'react';
import * as Icons from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [cycling, setCycling] = useState(false);

  const generate = useCallback(() => {
    setCycling(true);
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setCycling(false); return; }

    // Cycling animation
    let steps = 0;
    const interval = setInterval(() => {
      let temp = '';
      for (let i = 0; i < length; i++) temp += chars[Math.floor(Math.random() * chars.length)];
      setPassword(temp);
      steps++;
      if (steps > 10) {
        clearInterval(interval);
        setCycling(false);
        setHistory(prev => [temp, ...prev].slice(0, 10));
      }
    }, 50);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 16) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    if (score <= 2) return { label: 'Weak', color: 'text-red-400' };
    if (score <= 4) return { label: 'Medium', color: 'text-yellow-400' };
    return { label: 'Strong', color: 'text-green-400' };
  };

  const s = strength();

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Display */}
      <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex-1 font-mono text-lg break-all ${password ? 'text-white' : 'text-white/20'}`}>
            {password || 'Click generate...'}
          </div>
          <button onClick={copy} disabled={!password} className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30">
            {copied ? <Icons.Check className="w-4 h-4 text-[#4effa1]" /> : <Icons.Copy className="w-4 h-4 text-white/50" />}
          </button>
          <button onClick={generate} disabled={cycling} className="p-2 rounded-lg bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 transition-colors disabled:opacity-50">
            <Icons.RefreshCw className={`w-4 h-4 text-[#00d4ff] ${cycling ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${s.color.replace('text-', 'bg-')}`} style={{ width: `${(length / 32) * 100}%` }} />
          </div>
          <span className={`text-[10px] font-medium ${s.color}`}>{s.label}</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/50">Length</span>
            <span className="text-xs text-white font-mono">{length}</span>
          </div>
          <input type="range" min="4" max="32" value={length} onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-[#00d4ff]" />
        </div>
        {[
          { label: 'Uppercase (A-Z)', state: uppercase, set: setUppercase },
          { label: 'Lowercase (a-z)', state: lowercase, set: setLowercase },
          { label: 'Numbers (0-9)', state: numbers, set: setNumbers },
          { label: 'Symbols (!@#$)', state: symbols, set: setSymbols },
        ].map(opt => (
          <label key={opt.label} className="flex items-center justify-between">
            <span className="text-xs text-white/60">{opt.label}</span>
            <button
              className={`w-9 h-5 rounded-full transition-colors relative
                ${opt.state ? 'bg-[#00d4ff]' : 'bg-white/20'}`}
              onClick={() => opt.set(!opt.state)}
            >
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: opt.state ? '18px' : '2px' }} />
            </button>
          </label>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="text-xs text-white/30 mb-1">History</div>
          {history.map((p, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-white/3 group">
              <span className="text-[10px] text-white/30 font-mono">{i + 1}.</span>
              <span className="text-[10px] text-white/40 font-mono flex-1 truncate">{p}</span>
              <button onClick={() => navigator.clipboard.writeText(p)} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all">
                <Icons.Copy className="w-2.5 h-2.5 text-white/30" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
