import { useState } from 'react';
import { useFS } from '@/components/desktop/FileSystemContext';
import * as Icons from 'lucide-react';

export default function FileManager() {
  const { getChildren, getPath, navigateTo, navigateUp, currentDir, createDirectory, createFile, renameItem } = useFS();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const children = getChildren(currentDir);
  const path = getPath(currentDir);

  const handleCreateFolder = () => {
    const name = prompt('Folder name:');
    if (name) createDirectory(name, currentDir);
  };

  const handleCreateFile = () => {
    const name = prompt('File name:');
    if (name) createFile(name, currentDir, '');
  };

  const getIcon = (item: any) => {
    if (item.type === 'directory') return <Icons.Folder className="w-8 h-8 text-yellow-400/80" />;
    if (item.name.endsWith('.txt')) return <Icons.FileText className="w-8 h-8 text-blue-400/80" />;
    if (item.name.endsWith('.docx')) return <Icons.FileText className="w-8 h-8 text-blue-300/80" />;
    if (item.name.endsWith('.json')) return <Icons.FileCode className="w-8 h-8 text-yellow-300/80" />;
    if (item.name.endsWith('.js') || item.name.endsWith('.ts')) return <Icons.Code2 className="w-8 h-8 text-yellow-400/80" />;
    if (item.name.endsWith('.html')) return <Icons.Globe className="w-8 h-8 text-orange-400/80" />;
    if (item.name.endsWith('.css')) return <Icons.Palette className="w-8 h-8 text-blue-400/80" />;
    return <Icons.File className="w-8 h-8 text-white/50" />;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={navigateUp} className="p-1.5 rounded hover:bg-white/10 transition-colors" disabled={!path[path.length - 1]?.parentId}>
          <Icons.ArrowUp className="w-4 h-4 text-white/60" />
        </button>
        <div className="flex items-center gap-1 text-xs text-white/50 flex-1 overflow-hidden">
          {path.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1">
              {i > 0 && <Icons.ChevronRight className="w-3 h-3" />}
              <button className="hover:text-white/80 transition-colors" onClick={() => navigateTo(p.id)}>
                {p.name}
              </button>
            </span>
          ))}
        </div>
        <button onClick={handleCreateFolder} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="New Folder">
          <Icons.FolderPlus className="w-4 h-4 text-white/60" />
        </button>
        <button onClick={handleCreateFile} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="New File">
          <Icons.FilePlus className="w-4 h-4 text-white/60" />
        </button>
        <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          {viewMode === 'grid' ? <Icons.List className="w-4 h-4 text-white/60" /> : <Icons.Grid3X3 className="w-4 h-4 text-white/60" />}
        </button>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto p-3">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-3">
            {children.map(item => (
              <div
                key={item.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all
                  ${selectedId === item.id ? 'bg-white/15' : 'hover:bg-white/10'}`}
                onClick={() => {
                  setSelectedId(item.id);
                  if (item.type === 'directory') {
                    navigateTo(item.id);
                  }
                }}
              >
                {getIcon(item)}
                {renamingId === item.id ? (
                  <input
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={() => { renameItem(item.id, renameValue); setRenamingId(null); }}
                    onKeyDown={e => e.key === 'Enter' && renameItem(item.id, renameValue) && setRenamingId(null)}
                    className="w-full text-center text-xs bg-white/10 rounded px-1 outline-none text-white"
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-xs text-white/70 text-center truncate w-full">{item.name}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {children.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
                  ${selectedId === item.id ? 'bg-white/15' : 'hover:bg-white/10'}`}
                onClick={() => {
                  setSelectedId(item.id);
                  if (item.type === 'directory') {
                    navigateTo(item.id);
                  }
                }}
              >
                {getIcon(item)}
                <span className="text-xs text-white/70 flex-1">{item.name}</span>
                <span className="text-[10px] text-white/30">{item.type === 'file' ? `${item.size || 0} B` : '--'}</span>
              </div>
            ))}
          </div>
        )}
        {children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-white/30">
            <Icons.FolderOpen className="w-10 h-10 mb-2" />
            <span className="text-sm">Folder is empty</span>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-7 flex items-center px-3 text-[10px] text-white/30 border-t border-white/5">
        {children.length} items
      </div>
    </div>
  );
}
