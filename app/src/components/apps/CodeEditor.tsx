import { useState } from 'react';
import * as Icons from 'lucide-react';

const FILES = [
  { name: 'index.html', lang: 'html', content: `<!DOCTYPE html>
<html>
<head>
  <title>Hello World</title>
  <style>
    body { font-family: Arial; background: #1a1a2e; color: white; }
    h1 { color: #00d4ff; }
  </style>
</head>
<body>
  <h1>Hello Strata OS!</h1>
  <p>Welcome to the built-in code editor.</p>
  <script>
    console.log('Hello from Strata!');
  </script>
</body>
</html>` },
  { name: 'script.js', lang: 'js', content: `// JavaScript example
function greet(name) {
  return \`Hello, \${name}!\`;
}

const users = ['Alice', 'Bob', 'Charlie'];
users.forEach(user => {
  console.log(greet(user));
});

class App {
  constructor() {
    this.version = '2.0';
  }
  
  start() {
    console.log('App v' + this.version + ' started');
  }
}

new App().start();` },
  { name: 'style.css', lang: 'css', content: `/* CSS Example */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.title {
  color: #00d4ff;
  font-size: 1.5rem;
  font-weight: bold;
}` },
];

const SYNTAX_COLORS: Record<string, Record<string, string>> = {
  html: { tag: 'text-pink-400', attr: 'text-yellow-400', string: 'text-green-400', comment: 'text-gray-500' },
  js: { keyword: 'text-purple-400', string: 'text-green-400', comment: 'text-gray-500', function: 'text-blue-400', number: 'text-orange-400' },
  css: { property: 'text-cyan-400', value: 'text-orange-400', selector: 'text-yellow-400', comment: 'text-gray-500' },
};

function highlight(code: string, lang: string): string {
  const colors = SYNTAX_COLORS[lang] || {};
  let result = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  if (lang === 'html') {
    result = result.replace(/(&lt;\/?)([\w-]+)/g, `<span class="${colors.tag}">$1$2</span>`);
    result = result.replace(/([\w-]+)=/g, `<span class="${colors.attr}">$1</span>=`);
    result = result.replace(/"([^"]*)"/g, `<span class="${colors.string}">"$1"</span>`);
  } else if (lang === 'js') {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'true', 'false', 'null'];
    keywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), `<span class="${colors.keyword}">$1</span>`);
    });
    result = result.replace(/"([^"]*)"/g, `<span class="${colors.string}">"$1"</span>`);
    result = result.replace(/'([^']*)'/g, `<span class="${colors.string}">'$1'</span>`);
    result = result.replace(/(\/\/.*$)/gm, `<span class="${colors.comment}">$1</span>`);
  } else if (lang === 'css') {
    result = result.replace(/([.#]?[\w-]+)\s*\{/g, `<span class="${colors.selector}">$1</span> {`);
    result = result.replace(/([\w-]+):/g, `<span class="${colors.property}">$1</span>:`);
    result = result.replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="${colors.comment}">$1</span>`);
  }
  return result;
}

export default function CodeEditor() {
  const [activeFile, setActiveFile] = useState(0);
  const [files, setFiles] = useState(FILES);
  const [showPreview, setShowPreview] = useState(false);

  const file = files[activeFile];

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFiles(prev => prev.map((f, i) => i === activeFile ? { ...f, content: e.target.value } : f));
  };

  const lines = file.content.split('\n');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Tabs */}
      <div className="h-9 flex items-center border-b border-white/5 bg-[#1a1a2e]/50">
        {files.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActiveFile(i)}
            className={`h-full px-4 text-xs transition-all flex items-center gap-2
              ${activeFile === i ? 'bg-[#0d0d12] text-[#00d4ff] border-t-2 border-[#00d4ff]' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
          >
            {f.lang === 'html' && <Icons.FileCode className="w-3 h-3" />}
            {f.lang === 'js' && <Icons.Code2 className="w-3 h-3" />}
            {f.lang === 'css' && <Icons.Palette className="w-3 h-3" />}
            {f.name}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setShowPreview(!showPreview)} className="h-full px-3 text-xs text-white/40 hover:text-white/60 hover:bg-white/5 transition-all flex items-center gap-1.5">
          <Icons.Eye className="w-3 h-3" />
          {showPreview ? 'Hide' : 'Preview'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 flex overflow-hidden ${showPreview ? 'w-1/2' : 'w-full'}`}>
          {/* Line Numbers */}
          <div className="w-10 bg-[#1a1a2e] py-2 text-right pr-2 text-[11px] text-white/20 font-mono select-none overflow-hidden">
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          {/* Code Area */}
          <div className="flex-1 relative">
            <textarea
              value={file.content}
              onChange={handleCodeChange}
              className="absolute inset-0 w-full h-full bg-transparent text-transparent font-mono text-xs leading-5 p-2 resize-none outline-none z-10 caret-white"
              spellCheck={false}
            />
            <pre
              className="absolute inset-0 w-full h-full bg-[#0d0d12] font-mono text-xs leading-5 p-2 overflow-auto pointer-events-none"
              dangerouslySetInnerHTML={{ __html: highlight(file.content, file.lang) }}
            />
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 border-l border-white/5">
            <iframe
              srcDoc={file.lang === 'html' ? file.content : `<style>${files.find(f => f.lang === 'css')?.content || ''}</style>${files.find(f => f.lang === 'html')?.content || ''}`}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
}
