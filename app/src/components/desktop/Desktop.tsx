import { useCallback, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import ContextMenu from './ContextMenu';
import StartMenu from './StartMenu';
import NotificationPanel from './NotificationPanel';
import { FileSystemProvider } from './FileSystemContext';

const WALLPAPERS: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'gradient-2': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'gradient-3': 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
  'gradient-4': 'linear-gradient(135deg, #10002b 0%, #240046 50%, #3c096c 100%)',
  'gradient-5': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  'solid-dark': '#0a0a0a',
  'cyber': 'radial-gradient(ellipse at center, #1a1a2e 0%, #000000 100%)',
};

export default function Desktop() {
  const { state, dispatch, hideContextMenu } = useOSStore();

  const handleDesktopClick = useCallback(() => {
    hideContextMenu();
    if (state.showStartMenu) {
      dispatch({ type: 'TOGGLE_START_MENU' });
    }
  }, [hideContextMenu, dispatch, state.showStartMenu]);

  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SHOW_CONTEXT_MENU',
      x: e.clientX,
      y: e.clientY,
      target: 'desktop',
    });
  }, [dispatch]);

  // Keyboard shortcut to toggle start menu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || (e.key === 'Escape' && state.showStartMenu)) {
        dispatch({ type: 'TOGGLE_START_MENU' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dispatch, state.showStartMenu]);

  const wallpaper = WALLPAPERS[state.wallpaper] || WALLPAPERS['gradient-1'];

  return (
    <FileSystemProvider>
      <div
        className="fixed inset-0 overflow-hidden"
        style={{ background: wallpaper }}
        onClick={handleDesktopClick}
        onContextMenu={handleDesktopContextMenu}
      >
        {/* Animated background dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Desktop Icons */}
        <div className="absolute inset-0 p-4 pt-4">
          <div className="flex flex-col gap-2 flex-wrap content-start h-full">
            {state.desktopIcons.map(icon => (
              <DesktopIcon key={icon.id} icon={icon} />
            ))}
          </div>
        </div>

        {/* Windows */}
        {state.windows.filter(w => !w.isMinimized).map(win => (
          <Window key={win.id} win={win} />
        ))}

        {/* Context Menu */}
        {state.showContextMenu && <ContextMenu />}

        {/* Start Menu */}
        {state.showStartMenu && <StartMenu />}

        {/* Notifications */}
        <NotificationPanel />

        {/* Taskbar */}
        <Taskbar />
      </div>
    </FileSystemProvider>
  );
}
