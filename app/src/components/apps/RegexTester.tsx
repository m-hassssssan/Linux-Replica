import { useState } from 'react';
import * as Icons from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Z]+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello World! This is Strata OS. ABC xyz 123.');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    try {
      if (!pattern) { setMatches([]); setError(''); return; }
      const regex = new RegExp(pattern, flags);
      const found = text.match(regex) || [];
      setMatches(found);
      setError('');
    } catch (e) {
      setError('Invalid regex: ' + String(e));
      setMatches([]);
    }
  };

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  const highlighted = () => {
    if (!pattern || error) return text;
    try {
      const regex = new RegExp(`(${pattern})`, flags.includes('g') ? flags : flags + 'g');
      return text.replace(regex, '<mark class="bg-[#00d4ff]/30 text-[#00d4ff] rounded px-0.5">$1</mark>');
    } catch { return text; }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Pattern */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-white/40 text-sm">/</span>
        <input
          value={pattern} onChange={e => { setPattern(e.target.value); }} onBlur={test}
          placeholder="Enter regex pattern"
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono
            placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
        />
        <span className="text-white/40 text-sm">/</span>
        <div className="flex gap-1">
          {['g', 'i', 'm', 's'].map(f => (
            <button key={f} onClick={() => toggleFlag(f)}
              className={`w-7 h-7 rounded text-xs font-mono transition-all
                ${flags.includes(f) ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={test} className="px-3 h-9 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">
          <Icons.Play className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

      {/* Test String */}
      <div className="text-[10px] text-white/30 mb-1">Test String</div>
      <textarea
        value={text} onChange={e => { setText(e.target.value); }}
        className="h-24 mb-3 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white font-mono resize-none outline-none"
      />

      {/* Highlighted Result */}
      <div className="text-[10px] text-white/30 mb-1">Matches ({matches.length})</div>
      <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-3 overflow-auto">
        <pre className="text-xs text-white/70 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlighted() }} />
      </div>

      {/* Quick Reference */}
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {[
          ['.', 'Any char'], ['\\d', 'Digit'], ['\\w', 'Word'], ['\\s', 'Whitespace'],
          ['*', '0+ times'], ['+', '1+ times'], ['?', 'Optional'], ['^', 'Start'],
        ].map(([pat, desc]) => (
          <button key={pat} onClick={() => setPattern(pat)} className="py-1 px-2 rounded bg-white/5 hover:bg-white/10 text-left transition-colors">
            <span className="text-[10px] text-[#00d4ff] font-mono">{pat}</span>
            <span className="text-[9px] text-white/30 ml-1">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
