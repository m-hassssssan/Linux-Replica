import { useState } from 'react';
import * as Icons from 'lucide-react';

const NEWS = [
  { id: '1', title: 'Strata OS 2.0 Released with 50+ Apps', source: 'TechDaily', time: '2h ago', category: 'tech', summary: 'The revolutionary web-based operating system now includes over 50 fully functional applications, from system utilities to games.' },
  { id: '2', title: 'AI Integration Coming to Desktop Environments', source: 'AI Weekly', time: '4h ago', category: 'tech', summary: 'New AI-powered assistants are being integrated directly into desktop operating systems, changing how we interact with computers.' },
  { id: '3', title: 'WebAssembly Enables Native Performance in Browsers', source: 'DevWorld', time: '6h ago', category: 'tech', summary: 'WebAssembly continues to blur the line between web and native applications, enabling complex software to run in browsers.' },
  { id: '4', title: 'Global Tech Stocks Rally on Strong Earnings', source: 'FinanceToday', time: '8h ago', category: 'business', summary: 'Technology companies posted stronger than expected quarterly earnings, driving a broad rally in global markets.' },
  { id: '5', title: 'New Programming Language Gains Traction', source: 'CodeMag', time: '12h ago', category: 'tech', summary: 'A new systems programming language is gaining popularity among developers for its safety guarantees and performance.' },
  { id: '6', title: 'SpaceX Announces New Mars Mission Timeline', source: 'SpaceNews', time: '1d ago', category: 'science', summary: 'The ambitious mission timeline has been updated with new milestones for the journey to Mars.' },
  { id: '7', title: 'Open Source Desktop Environment Reaches 1M Users', source: 'OSS Weekly', time: '1d ago', category: 'tech', summary: 'A popular open source desktop environment has reached a major milestone in user adoption.' },
  { id: '8', title: 'Quantum Computing Breakthrough Announced', source: 'ScienceDaily', time: '2d ago', category: 'science', summary: 'Researchers have achieved a new milestone in quantum computing stability and error correction.' },
];

export default function NewsReader() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? NEWS : NEWS.filter(n => n.category === filter);
  const selected = NEWS.find(n => n.id === selectedId);

  return (
    <div className="w-full h-full flex bg-[#0d0d12]">
      {/* List */}
      <div className="w-64 border-r border-white/5 flex flex-col">
        <div className="h-10 flex items-center px-3 border-b border-white/5 gap-1 overflow-x-auto">
          {['all', 'tech', 'business', 'science'].map(cat => (
            <button
              key={cat}
              className={`px-2 py-1 rounded-md text-[10px] font-medium capitalize whitespace-nowrap transition-all
                ${filter === cat ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'text-white/30 hover:bg-white/5'}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(item => (
            <button
              key={item.id}
              className={`w-full text-left p-3 border-b border-white/5 transition-all
                ${selectedId === item.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setSelectedId(item.id)}
            >
              <div className="text-xs text-white/80 font-medium leading-tight line-clamp-2">{item.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#00d4ff]">{item.source}</span>
                <span className="text-[10px] text-white/20">{item.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Article */}
      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <div>
            <span className="text-[10px] text-[#00d4ff] uppercase tracking-wider font-medium">{selected.category}</span>
            <h1 className="text-lg text-white font-semibold mt-1 mb-2">{selected.title}</h1>
            <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
              <span>{selected.source}</span>
              <span>{selected.time}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{selected.summary}</p>
            <p className="text-sm text-white/40 leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-sm text-white/40 leading-relaxed mt-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <Icons.Newspaper className="w-12 h-12 mb-2" />
            <span className="text-sm">Select an article to read</span>
          </div>
        )}
      </div>
    </div>
  );
}
