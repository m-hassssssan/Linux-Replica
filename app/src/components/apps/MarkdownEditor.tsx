import { useState } from 'react';

const DEFAULT_MD = `# Welcome to Strata OS

## Features

- **Desktop Environment** with window management
- **50+ Applications** including games, tools, and utilities
- **Virtual File System** with persistence
- **Terminal** with real commands

## Code Example

\`\`\`javascript
const hello = () => {
  console.log("Hello from Strata!");
};
\`\`\`

## Table

| Feature | Status |
|---------|--------|
| Windows | Done |
| File Manager | Done |
| Games | Done |

> *Built with React and love.*
`;

function parseMarkdown(md: string): string {
  return md
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mt-4 mb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-[#00d4ff] mt-3 mb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-white/80 mt-2 mb-1">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-white/70 italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 rounded text-[#4effa1] text-xs">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-[#1a1a2e] p-3 rounded-lg border border-white/5 my-2 overflow-auto"><code class="text-xs text-white/70">$1</code></pre>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return `<tr>${cells.map(c => `<td class="border border-white/10 px-2 py-1 text-xs text-white/70">${c.trim()}</td>`).join('')}</tr>`;
    })
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-[#00d4ff] pl-3 my-2 text-white/50 italic text-xs">$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li class="text-xs text-white/70 ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="text-xs text-white/70 ml-4 list-decimal">$1</li>')
    .replace(/\n/g, '<br/>');
}

export default function MarkdownEditor() {
  const [content, setContent] = useState(DEFAULT_MD);
  const [activeTab, setActiveTab] = useState<'split' | 'preview' | 'write'>('split');

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-9 flex items-center px-3 gap-1 border-b border-white/5 bg-[#1a1a2e]/50">
        {(['write', 'split', 'preview'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-[10px] font-medium capitalize transition-all
              ${activeTab === tab ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-white/30 hover:bg-white/5 hover:text-white/50'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className={`${activeTab === 'split' ? 'w-1/2 border-r border-white/5' : 'flex-1'} bg-transparent text-white text-xs p-4 font-mono resize-none outline-none leading-relaxed`}
            spellCheck={false}
          />
        )}

        {/* Preview */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className={`${activeTab === 'split' ? 'w-1/2' : 'flex-1'} p-4 overflow-auto`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        )}
      </div>
    </div>
  );
}
