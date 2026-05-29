import { useState } from 'react';
import * as Icons from 'lucide-react';

const HOMEPAGE = `
<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: #1a1a2e; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
.logo { font-size: 48px; font-weight: bold; background: linear-gradient(135deg, #00d4ff, #4effa1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
.search-box { width: 100%; max-width: 500px; display: flex; gap: 10px; }
input { flex: 1; padding: 12px 20px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; font-size: 14px; outline: none; }
input::placeholder { color: rgba(255,255,255,0.3); }
button { padding: 12px 24px; border-radius: 24px; border: none; background: linear-gradient(135deg, #00d4ff, #4effa1); color: #1a1a2e; font-weight: bold; cursor: pointer; }
.links { display: flex; gap: 20px; margin-top: 30px; flex-wrap: wrap; justify-content: center; }
.link { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6); text-decoration: none; font-size: 11px; transition: all 0.2s; width: 80px; }
.link:hover { background: rgba(255,255,255,0.08); color: white; }
.icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
</style>
</head>
<body>
<div class="logo">Strata</div>
<div class="search-box">
  <input type="text" placeholder="Search the web..." />
  <button>Search</button>
</div>
<div class="links">
  <a href="#" class="link"><div class="icon" style="background:#e74c3c">G</div>GitHub</a>
  <a href="#" class="link"><div class="icon" style="background:#3498db">S</div>Stack</a>
  <a href="#" class="link"><div class="icon" style="background:#f39c12">D</div>Docs</a>
  <a href="#" class="link"><div class="icon" style="background:#2ecc71">N</div>News</a>
  <a href="#" class="link"><div class="icon" style="background:#9b59b6">M</div>Maps</a>
  <a href="#" class="link"><div class="icon" style="background:#1abc9c">W</div>Weather</a>
</div>
</body>
</html>`;

export default function Browser() {
  const [url, setUrl] = useState('strata://home');
  const [history, setHistory] = useState<string[]>(['strata://home']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const navigate = (newUrl: string) => {
    setUrl(newUrl);
    setHistory(prev => [...prev.slice(0, historyIdx + 1), newUrl]);
    setHistoryIdx(prev => prev + 1);
  };

  const back = () => {
    if (historyIdx > 0) {
      setHistoryIdx(prev => prev - 1);
      setUrl(history[historyIdx - 1]);
    }
  };

  const forward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(prev => prev + 1);
      setUrl(history[historyIdx + 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = url;
    if (!url.includes('://') && !url.startsWith('//')) {
      if (url.includes('.')) target = 'https://' + url;
      else target = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
    }
    navigate(target);
  };

  const isExternal = url.startsWith('http://') || url.startsWith('https://');
  const iframeUrl = isExternal ? url : undefined;

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-2 gap-1 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={back} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ArrowLeft className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={forward} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ArrowRight className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={() => navigate(url)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.RefreshCw className="w-3.5 h-3.5 text-white/50" />
        </button>
        <form onSubmit={handleSubmit} className="flex-1 ml-2">
          <div className="flex items-center h-7 px-3 rounded-full bg-white/5 border border-white/5">
            <Icons.Lock className="w-3 h-3 text-green-400/50 mr-2" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white outline-none"
            />
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isExternal ? (
          <iframe src={iframeUrl} className="w-full h-full bg-white" sandbox="allow-scripts allow-same-origin allow-forms" />
        ) : (
          <iframe srcDoc={HOMEPAGE} className="w-full h-full" sandbox="allow-scripts" />
        )}
      </div>
    </div>
  );
}
