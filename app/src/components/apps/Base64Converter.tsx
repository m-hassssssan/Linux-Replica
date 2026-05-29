import { useState } from 'react';
import * as Icons from 'lucide-react';

export default function Base64Converter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    try {
      setError('');
      if (mode === 'encode') {
        setResult(btoa(text));
      } else {
        setResult(atob(text));
      }
    } catch (e) {
      setError(String(e));
      setResult('');
    }
  };

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Mode */}
      <div className="flex gap-2 mb-4">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 h-9 rounded-lg text-xs font-medium capitalize transition-all
              ${mode === m ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
            {m}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="text-[10px] text-white/30 mb-1">{mode === 'encode' ? 'Text' : 'Base64'}</div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter base64 to decode...'}
        className="h-32 mb-3 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white font-mono resize-none outline-none" />

      <button onClick={convert} className="h-9 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium hover:bg-[#00d4ff]/30 transition-colors mb-3">
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>

      {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

      {/* Output */}
      {result && (
        <>
          <div className="text-[10px] text-white/30 mb-1">Result</div>
          <div className="bg-[#1a1a2e] rounded-lg border border-white/5 p-3">
            <pre className="text-xs text-white/70 font-mono break-all">{result}</pre>
            <button onClick={copy} className="mt-2 px-3 py-1 rounded bg-white/5 text-[10px] text-white/50 hover:bg-white/10 transition-colors">
              <Icons.Copy className="w-3 h-3 inline mr-1" /> Copy
            </button>
          </div>
        </>
      )}
    </div>
  );
}
