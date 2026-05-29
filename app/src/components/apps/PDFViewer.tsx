import { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

const SAMPLE_PAGES = [
  { title: 'Introduction to Strata OS', content: 'Strata OS is a revolutionary web-based operating system that brings the full desktop experience to your browser. Built with modern web technologies, it demonstrates the power and flexibility of web applications.' },
  { title: 'Getting Started', content: 'To get started with Strata OS, simply explore the desktop environment. Double-click icons to open applications, right-click for context menus, and use the Start Menu to discover all available apps.' },
  { title: 'System Architecture', content: 'The system is built on a modular architecture with a custom window manager, virtual file system, and application framework. Each app runs in its own managed window with full lifecycle support.' },
  { title: 'Application Framework', content: 'Applications are built as modular components with standardized interfaces. The window manager handles positioning, sizing, z-index stacking, and lifecycle events automatically.' },
  { title: 'File System', content: 'The virtual file system provides persistent storage using localStorage. Users can create, edit, rename, and delete files and folders just like a real operating system.' },
  { title: 'Future Roadmap', content: 'Future versions will include cloud synchronization, multi-user support, plugin architecture, and enhanced 3D applications using WebGL and WebGPU technologies.' },
];

export default function PDFViewer() {
  const [page, setPage] = useState(0);
  const [scale, setScale] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = SAMPLE_PAGES[page];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Open">
          <Icons.FolderOpen className="w-3.5 h-3.5 text-white/50" />
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" />
        <div className="w-px h-4 bg-white/10" />
        <button onClick={() => setPage(Math.max(0, page - 1))} className="p-1.5 rounded hover:bg-white/10 transition-colors" disabled={page === 0}>
          <Icons.ChevronLeft className="w-3.5 h-3.5 text-white/50" />
        </button>
        <span className="text-xs text-white/50 font-mono">{page + 1} / {SAMPLE_PAGES.length}</span>
        <button onClick={() => setPage(Math.min(SAMPLE_PAGES.length - 1, page + 1))} className="p-1.5 rounded hover:bg-white/10 transition-colors" disabled={page === SAMPLE_PAGES.length - 1}>
          <Icons.ChevronRight className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => setScale(Math.max(50, scale - 10))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomOut className="w-3.5 h-3.5 text-white/50" />
        </button>
        <span className="text-[10px] text-white/40 w-10 text-center">{scale}%</span>
        <button onClick={() => setScale(Math.min(200, scale + 10))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomIn className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="flex-1" />
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.RotateCcw className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.Download className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      {/* Page */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <div
          className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] max-w-[500px]"
          style={{ transform: `scale(${scale / 100})`, transformOrigin: 'top center' }}
        >
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{current.title}</h1>
            <p className="text-xs text-gray-500 mt-1">Strata OS Documentation — Page {page + 1}</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{current.content}</p>
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p className="text-xs text-gray-500 italic">This is a sample PDF document for demonstration purposes. In a production environment, this viewer would render actual PDF files using a library like PDF.js.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
