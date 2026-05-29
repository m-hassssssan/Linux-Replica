import { useState } from 'react';

export default function DiffChecker() {
  const [left, setLeft] = useState(`function hello() {
  console.log("Hello World");
}`);
  const [right, setRight] = useState(`function hello() {
  console.log("Hello Strata");
  return true;
}`);

  const computeDiff = () => {
    const l = left.split('\n');
    const r = right.split('\n');
    const maxLen = Math.max(l.length, r.length);
    const result: { left?: string; right?: string; type: 'same' | 'diff' | 'added' | 'removed' }[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (l[i] === r[i]) {
        result.push({ left: l[i], right: r[i], type: 'same' });
      } else if (l[i] && !r[i]) {
        result.push({ left: l[i], type: 'removed' });
      } else if (!l[i] && r[i]) {
        result.push({ right: r[i], type: 'added' });
      } else {
        result.push({ left: l[i], right: r[i], type: 'diff' });
      }
    }
    return result;
  };

  const diff = computeDiff();

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      <div className="h-10 flex items-center px-3 border-b border-white/5 bg-[#1a1a2e]/50 text-[10px] text-white/30">
        <div className="flex-1">Original</div>
        <div className="flex-1 border-l border-white/5 pl-3">Modified</div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <textarea value={left} onChange={e => setLeft(e.target.value)}
          className="flex-1 bg-transparent text-xs text-white font-mono p-3 resize-none outline-none border-r border-white/5" spellCheck={false} />
        <textarea value={right} onChange={e => setRight(e.target.value)}
          className="flex-1 bg-transparent text-xs text-white font-mono p-3 resize-none outline-none" spellCheck={false} />
      </div>
      <div className="h-px bg-white/5" />
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Left diff */}
          <div className="flex-1 font-mono text-xs">
            {diff.map((d, i) => (
              <div key={i} className={`px-3 py-0.5 ${d.type === 'removed' ? 'bg-red-500/10 text-red-400' : d.type === 'diff' ? 'bg-yellow-500/5 text-yellow-400' : 'text-white/40'}`}>
                {d.left || ''}
              </div>
            ))}
          </div>
          {/* Right diff */}
          <div className="flex-1 font-mono text-xs border-l border-white/5">
            {diff.map((d, i) => (
              <div key={i} className={`px-3 py-0.5 ${d.type === 'added' ? 'bg-green-500/10 text-green-400' : d.type === 'diff' ? 'bg-yellow-500/5 text-yellow-400' : 'text-white/40'}`}>
                {d.right || ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
