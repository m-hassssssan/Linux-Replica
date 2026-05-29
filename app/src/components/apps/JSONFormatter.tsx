import { useState } from 'react';
import * as Icons from 'lucide-react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      if (!input.trim()) { setOutput(''); setError(''); return; }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) {
      setError(String(e));
      setOutput('');
    }
  };

  const minify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError(String(e));
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  const highlight = (json: string) => {
    return json
      .replace(/(".*?")(\s*:\s*)/g, '<span class="text-pink-400">$1</span><span class="text-white/40">$2</span>')
      .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={format} className="px-3 h-7 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium hover:bg-[#00d4ff]/30 transition-colors">
          Format
        </button>
        <button onClick={minify} className="px-3 h-7 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors">
          Minify
        </button>
        <button onClick={copy} disabled={!output} className="px-3 h-7 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors disabled:opacity-30">
          Copy
        </button>
        <div className="flex items-center gap-1 ml-2">
          <span className="text-[10px] text-white/30">Indent:</span>
          {[2, 4].map(i => (
            <button key={i} onClick={() => setIndent(i)} className={`px-2 py-0.5 rounded text-[10px] ${indent === i ? 'bg-white/10 text-white' : 'text-white/30 hover:bg-white/5'}`}>
              {i}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="p-1.5 rounded hover:bg-white/10">
          <Icons.Trash2 className="w-3.5 h-3.5 text-white/30" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          <div className="text-[10px] text-white/30 px-3 py-1">Input</div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="flex-1 bg-transparent text-white text-xs p-3 font-mono resize-none outline-none"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] text-white/30 px-3 py-1">Output</div>
          {error ? (
            <div className="flex-1 p-3 text-xs text-red-400">{error}</div>
          ) : (
            <pre
              className="flex-1 text-xs p-3 font-mono overflow-auto"
              dangerouslySetInnerHTML={{ __html: output ? highlight(output) : '<span class="text-white/20">Formatted JSON will appear here</span>' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
