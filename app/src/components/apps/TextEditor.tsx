import { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function TextEditor() {
  const [content, setContent] = useState('');
  const [filename, setFilename] = useState('untitled.txt');
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.ts,.html,.css,.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent(String(ev.target?.result || ''));
        setFilename(file.name);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-9 flex items-center px-2 gap-1 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={handleOpen} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Open">
          <Icons.FolderOpen className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={handleSave} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Save">
          <Icons.Save className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => setIsBold(!isBold)} className={`p-1.5 rounded transition-colors ${isBold ? 'bg-white/15' : 'hover:bg-white/10'}`}>
          <Icons.Bold className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={() => setIsItalic(!isItalic)} className={`p-1.5 rounded transition-colors ${isItalic ? 'bg-white/15' : 'hover:bg-white/10'}`}>
          <Icons.Italic className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomOut className="w-3.5 h-3.5 text-white/50" />
        </button>
        <span className="text-[10px] text-white/30 w-6 text-center">{fontSize}</span>
        <button onClick={() => setFontSize(Math.min(32, fontSize + 1))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomIn className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="flex-1" />
        <input
          value={filename}
          onChange={e => setFilename(e.target.value)}
          className="text-[10px] text-white/40 bg-transparent text-right outline-none w-32"
        />
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="flex-1 bg-transparent text-white p-4 outline-none resize-none font-mono leading-relaxed"
        style={{ fontSize: `${fontSize}px`, fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal' }}
        placeholder="Start typing..."
        spellCheck={false}
      />

      {/* Status */}
      <div className="h-6 flex items-center px-3 justify-between text-[10px] text-white/30 border-t border-white/5">
        <span>{content.length} chars | {wordCount} words</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
