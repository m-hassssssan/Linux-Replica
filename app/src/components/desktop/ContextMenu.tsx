import { useOSStore } from '@/hooks/useOSStore';
import { useFS } from './FileSystemContext';
import * as Icons from 'lucide-react';

export default function ContextMenu() {
  const { state, hideContextMenu, dispatch, openWindow } = useOSStore();
  const fs = useFS();

  const handleAction = (action: string) => {
    switch (action) {
      case 'new-folder':
        fs.createDirectory('New Folder', 'root');
        break;
      case 'new-text':
        fs.createFile('New Document.txt', 'root', '', 'text/plain');
        break;
      case 'new-doc':
        fs.createFile('New Document.docx', 'root', '', 'application/docx');
        break;
      case 'open-terminal':
        openWindow('terminal');
        break;
      case 'settings':
        openWindow('settings');
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'delete-icon':
        if (state.contextMenuTargetId) {
          dispatch({ type: 'DELETE_DESKTOP_ICON', id: state.contextMenuTargetId });
        }
        break;
    }
    hideContextMenu();
  };

  const menuItems = state.contextMenuTarget === 'desktop'
    ? [
        { label: 'New Folder', icon: 'FolderPlus', action: 'new-folder' },
        { label: 'New Document', icon: 'FilePlus', action: 'new-text' },
        null,
        { label: 'Open Terminal', icon: 'Terminal', action: 'open-terminal' },
        { label: 'Settings', icon: 'Settings', action: 'settings' },
        null,
        { label: 'Refresh', icon: 'RefreshCw', action: 'refresh' },
      ]
    : state.contextMenuTarget === 'icon'
    ? [
        { label: 'Open', icon: 'ExternalLink', action: 'open' },
        null,
        { label: 'Delete', icon: 'Trash2', action: 'delete-icon' },
        { label: 'Rename', icon: 'Pencil', action: 'rename' },
      ]
    : [
        { label: 'Open', icon: 'ExternalLink', action: 'open-file' },
        null,
        { label: 'Cut', icon: 'Scissors', action: 'cut' },
        { label: 'Copy', icon: 'Copy', action: 'copy' },
        { label: 'Delete', icon: 'Trash2', action: 'delete-file' },
      ];

  return (
    <div
      className="fixed bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/10
        shadow-2xl shadow-black/50 py-1.5 z-[10001] min-w-[180px]"
      style={{ left: state.contextMenuX, top: state.contextMenuY }}
      onClick={e => e.stopPropagation()}
    >
      {menuItems.map((item, i) => (
        item === null
          ? <div key={i} className="h-px bg-white/10 my-1" />
          : (() => {
              const Icon = (Icons as any)[item.icon];
              return (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left
                    hover:bg-white/10 transition-colors text-white/80"
                  onClick={() => handleAction(item.action)}
                >
                  {Icon && <Icon className="w-4 h-4 text-white/50" />}
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })()
      ))}
    </div>
  );
}
