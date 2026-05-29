import { useState } from 'react';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: rgba(255,255,255,0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #333; margin-bottom: 10px; }
    p { color: #666; line-height: 1.6; }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      border-radius: 25px;
      text-decoration: none;
      transition: transform 0.2s;
    }
    .btn:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello Strata!</h1>
    <p>This is a live HTML preview. Edit the code on the left to see changes instantly.</p>
    <a href="#" class="btn">Get Started</a>
  </div>
</body>
</html>`;

export default function HTMLPreview() {
  const [code, setCode] = useState(SAMPLE_HTML);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      <div className="h-10 flex items-center px-3 border-b border-white/5 bg-[#1a1a2e]/50 text-[10px] text-white/30">
        <span className="flex-1">HTML / CSS / JS</span>
        <span>Live Preview</span>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-1/2 bg-transparent text-xs text-white font-mono p-3 resize-none outline-none border-r border-white/5"
          spellCheck={false}
        />
        <div className="w-1/2 bg-white">
          <iframe srcDoc={code} className="w-full h-full" sandbox="allow-scripts" />
        </div>
      </div>
    </div>
  );
}
