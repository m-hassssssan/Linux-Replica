import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { OSState, OSAction, WindowState, AppDefinition, Notification, DesktopIcon } from '@/types/os';

const APPS: AppDefinition[] = [
  // System
  { id: 'terminal', name: 'Terminal', icon: 'Terminal', category: 'system', component: 'Terminal', defaultWidth: 700, defaultHeight: 450, canResize: true },
  { id: 'filemanager', name: 'File Manager', icon: 'FolderOpen', category: 'system', component: 'FileManager', defaultWidth: 800, defaultHeight: 500, canResize: true },
  { id: 'settings', name: 'Settings', icon: 'Settings', category: 'system', component: 'Settings', defaultWidth: 700, defaultHeight: 500, canResize: true },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'system', component: 'Calculator', defaultWidth: 340, defaultHeight: 500, canResize: false },
  { id: 'calendar', name: 'Calendar', icon: 'Calendar', category: 'system', component: 'CalendarApp', defaultWidth: 500, defaultHeight: 450, canResize: false },
  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'system', component: 'ClockApp', defaultWidth: 350, defaultHeight: 400, canResize: false },
  { id: 'taskmanager', name: 'Task Manager', icon: 'Activity', category: 'system', component: 'TaskManager', defaultWidth: 600, defaultHeight: 450, canResize: true },
  { id: 'systemmonitor', name: 'System Monitor', icon: 'BarChart3', category: 'system', component: 'SystemMonitor', defaultWidth: 650, defaultHeight: 450, canResize: true },
  // Productivity
  { id: 'texteditor', name: 'Text Editor', icon: 'FileText', category: 'productivity', component: 'TextEditor', defaultWidth: 700, defaultHeight: 500, canResize: true },
  { id: 'spreadsheet', name: 'Spreadsheet', icon: 'Table2', category: 'productivity', component: 'Spreadsheet', defaultWidth: 750, defaultHeight: 500, canResize: true },
  { id: 'notes', name: 'Sticky Notes', icon: 'StickyNote', category: 'productivity', component: 'Notes', defaultWidth: 350, defaultHeight: 400, canResize: true },
  { id: 'todo', name: 'To-Do List', icon: 'CheckSquare', category: 'productivity', component: 'TodoList', defaultWidth: 400, defaultHeight: 500, canResize: true },
  { id: 'weather', name: 'Weather', icon: 'CloudSun', category: 'productivity', component: 'WeatherApp', defaultWidth: 450, defaultHeight: 550, canResize: false },
  { id: 'news', name: 'News Reader', icon: 'Newspaper', category: 'productivity', component: 'NewsReader', defaultWidth: 700, defaultHeight: 550, canResize: true },
  { id: 'pdfviewer', name: 'PDF Viewer', icon: 'FileType', category: 'productivity', component: 'PDFViewer', defaultWidth: 750, defaultHeight: 600, canResize: true },
  { id: 'dictionary', name: 'Dictionary', icon: 'BookOpen', category: 'productivity', component: 'DictionaryApp', defaultWidth: 500, defaultHeight: 450, canResize: true },
  { id: 'stopwatch', name: 'Stopwatch', icon: 'Timer', category: 'productivity', component: 'Stopwatch', defaultWidth: 350, defaultHeight: 300, canResize: false },
  { id: 'timer', name: 'Timer', icon: 'Hourglass', category: 'productivity', component: 'TimerApp', defaultWidth: 350, defaultHeight: 300, canResize: false },
  { id: 'passwordgen', name: 'Password Generator', icon: 'KeyRound', category: 'productivity', component: 'PasswordGenerator', defaultWidth: 450, defaultHeight: 400, canResize: false },
  { id: 'unitconverter', name: 'Unit Converter', icon: 'ArrowLeftRight', category: 'productivity', component: 'UnitConverter', defaultWidth: 500, defaultHeight: 400, canResize: false },
  { id: 'reminders', name: 'Reminders', icon: 'Bell', category: 'productivity', component: 'Reminders', defaultWidth: 400, defaultHeight: 450, canResize: true },
  { id: 'gemini', name: 'Gemini AI', icon: 'Sparkles', category: 'productivity', component: 'GeminiChat', defaultWidth: 550, defaultHeight: 600, canResize: true },
  // Creative
  { id: 'paint', name: 'Paint', icon: 'Paintbrush', category: 'creative', component: 'Paint', defaultWidth: 800, defaultHeight: 600, canResize: true },
  { id: 'imageviewer', name: 'Image Viewer', icon: 'Image', category: 'creative', component: 'ImageViewer', defaultWidth: 700, defaultHeight: 550, canResize: true },
  { id: 'musicplayer', name: 'Music Player', icon: 'Music', category: 'creative', component: 'MusicPlayer', defaultWidth: 550, defaultHeight: 500, canResize: true },
  { id: 'videoplayer', name: 'Video Player', icon: 'Play', category: 'creative', component: 'VideoPlayer', defaultWidth: 720, defaultHeight: 480, canResize: true },
  { id: 'camera', name: 'Camera', icon: 'Camera', category: 'creative', component: 'Camera', defaultWidth: 640, defaultHeight: 520, canResize: false },
  { id: 'colorpicker', name: 'Color Picker', icon: 'Palette', category: 'creative', component: 'ColorPicker', defaultWidth: 450, defaultHeight: 500, canResize: false },
  { id: 'soundrecorder', name: 'Sound Recorder', icon: 'Mic', category: 'creative', component: 'SoundRecorder', defaultWidth: 450, defaultHeight: 350, canResize: false },
  { id: 'asciiart', name: 'ASCII Art', icon: 'Type', category: 'creative', component: 'ASCIIArt', defaultWidth: 650, defaultHeight: 550, canResize: true },
  { id: 'photoeditor', name: 'Photo Editor', icon: 'SlidersHorizontal', category: 'creative', component: 'PhotoEditor', defaultWidth: 800, defaultHeight: 600, canResize: true },
  { id: 'drumkit', name: 'Drum Kit', icon: 'Drum', category: 'creative', component: 'DrumKit', defaultWidth: 650, defaultHeight: 400, canResize: false },
  { id: 'piano', name: 'Piano', icon: 'Piano', category: 'creative', component: 'Piano', defaultWidth: 700, defaultHeight: 300, canResize: false },
  // Dev Tools
  { id: 'codeeditor', name: 'Code Editor', icon: 'Code2', category: 'dev', component: 'CodeEditor', defaultWidth: 850, defaultHeight: 600, canResize: true },
  { id: 'markdown', name: 'Markdown Editor', icon: 'FileCode', category: 'dev', component: 'MarkdownEditor', defaultWidth: 900, defaultHeight: 600, canResize: true },
  { id: 'jsonformat', name: 'JSON Formatter', icon: 'Braces', category: 'dev', component: 'JSONFormatter', defaultWidth: 650, defaultHeight: 550, canResize: true },
  { id: 'regex', name: 'Regex Tester', icon: 'Search', category: 'dev', component: 'RegexTester', defaultWidth: 650, defaultHeight: 500, canResize: true },
  { id: 'base64', name: 'Base64 Converter', icon: 'Shuffle', category: 'dev', component: 'Base64Converter', defaultWidth: 550, defaultHeight: 450, canResize: true },
  { id: 'diffchecker', name: 'Diff Checker', icon: 'GitCompare', category: 'dev', component: 'DiffChecker', defaultWidth: 800, defaultHeight: 550, canResize: true },
  { id: 'htmlpreview', name: 'HTML Preview', icon: 'Globe', category: 'dev', component: 'HTMLPreview', defaultWidth: 800, defaultHeight: 600, canResize: true },
  // Internet
  { id: 'browser', name: 'Browser', icon: 'Globe', category: 'internet', component: 'Browser', defaultWidth: 900, defaultHeight: 650, canResize: true },
  { id: 'email', name: 'Email', icon: 'Mail', category: 'internet', component: 'EmailClient', defaultWidth: 900, defaultHeight: 600, canResize: true },
  { id: 'chat', name: 'Chat', icon: 'MessageCircle', category: 'internet', component: 'ChatApp', defaultWidth: 500, defaultHeight: 550, canResize: true },
  { id: 'ftpclient', name: 'FTP Client', icon: 'HardDrive', category: 'internet', component: 'FTPClient', defaultWidth: 700, defaultHeight: 500, canResize: true },
  { id: 'networkscanner', name: 'Network Scanner', icon: 'Scan', category: 'internet', component: 'NetworkScanner', defaultWidth: 650, defaultHeight: 450, canResize: true },
  // Games
  { id: 'snake', name: 'Snake', icon: 'Gamepad2', category: 'games', component: 'SnakeGame', defaultWidth: 600, defaultHeight: 450, canResize: false },
  { id: 'tetris', name: 'Tetris', icon: 'Gamepad2', category: 'games', component: 'TetrisGame', defaultWidth: 450, defaultHeight: 600, canResize: false },
  { id: 'minesweeper', name: 'Minesweeper', icon: 'Bomb', category: 'games', component: 'MinesweeperGame', defaultWidth: 380, defaultHeight: 460, canResize: false },
  { id: 'game2048', name: '2048', icon: 'Grid3X3', category: 'games', component: 'Game2048', defaultWidth: 450, defaultHeight: 550, canResize: false },
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: 'Grid3X3', category: 'games', component: 'TicTacToeGame', defaultWidth: 400, defaultHeight: 480, canResize: false },
  { id: 'sudoku', name: 'Sudoku', icon: 'Grid3X3', category: 'games', component: 'SudokuGame', defaultWidth: 500, defaultHeight: 580, canResize: false },
  { id: 'memory', name: 'Memory Match', icon: 'Brain', category: 'games', component: 'MemoryGame', defaultWidth: 520, defaultHeight: 520, canResize: false },
  { id: 'pong', name: 'Pong', icon: 'Gamepad2', category: 'games', component: 'PongGame', defaultWidth: 700, defaultHeight: 450, canResize: false },
  { id: 'breakout', name: 'Breakout', icon: 'Gamepad2', category: 'games', component: 'BreakoutGame', defaultWidth: 650, defaultHeight: 480, canResize: false },
  { id: 'wordle', name: 'Wordle', icon: 'Type', category: 'games', component: 'WordleGame', defaultWidth: 450, defaultHeight: 600, canResize: false },
  { id: 'flappybird', name: 'Flappy Bird', icon: 'Bird', category: 'games', component: 'FlappyBirdGame', defaultWidth: 450, defaultHeight: 600, canResize: false },
  { id: 'connectfour', name: 'Connect Four', icon: 'Circle', category: 'games', component: 'ConnectFourGame', defaultWidth: 500, defaultHeight: 520, canResize: false },
  { id: 'checkers', name: 'Checkers', icon: 'CircleDot', category: 'games', component: 'CheckersGame', defaultWidth: 560, defaultHeight: 580, canResize: false },
  { id: 'solitaire', name: 'Solitaire', icon: 'Diamond', category: 'games', component: 'SolitaireGame', defaultWidth: 800, defaultHeight: 600, canResize: true },
  { id: 'hangman', name: 'Hangman', icon: 'User', category: 'games', component: 'HangmanGame', defaultWidth: 500, defaultHeight: 520, canResize: false },
  { id: 'rps', name: 'Rock Paper Scissors', icon: 'Hand', category: 'games', component: 'RPSGame', defaultWidth: 450, defaultHeight: 450, canResize: false },
  { id: 'chess', name: 'Cyber Chess', icon: 'Crown', category: 'games', component: 'ChessGame', defaultWidth: 560, defaultHeight: 600, canResize: false },
  { id: 'galaxys', name: 'Galaxy Shooter', icon: 'Rocket', category: 'games', component: 'GalaxyShooter', defaultWidth: 700, defaultHeight: 600, canResize: false },
  { id: 'maze', name: 'Maze Runner', icon: 'Labyrinth', category: 'games', component: 'MazeGame', defaultWidth: 620, defaultHeight: 620, canResize: false },
  { id: 'quiz', name: 'Quiz Master', icon: 'HelpCircle', category: 'games', component: 'QuizGame', defaultWidth: 600, defaultHeight: 500, canResize: false },
  { id: 'towerdefense', name: 'Core Defenders', icon: 'Shield', category: 'games', component: 'TowerDefense', defaultWidth: 800, defaultHeight: 600, canResize: false },
];

const DEFAULT_DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'd1', name: 'Home', appId: 'filemanager', icon: 'Home', x: 20, y: 20 },
  { id: 'd2', name: 'Terminal', appId: 'terminal', icon: 'Terminal', x: 20, y: 100 },
  { id: 'd3', name: 'Browser', appId: 'browser', icon: 'Globe', x: 20, y: 180 },
  { id: 'd4', name: 'Settings', appId: 'settings', icon: 'Settings', x: 20, y: 260 },
  { id: 'd5', name: 'Trash', icon: 'Trash2', x: 20, y: 340 },
];

const initialState: OSState = {
  bootPhase: 'bios',
  isLocked: false,
  currentUser: 'user',
  wallpaper: 'gradient-1',
  desktopIcons: DEFAULT_DESKTOP_ICONS,
  showContextMenu: false,
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuTarget: null,
  contextMenuTargetId: null,
  windows: [],
  nextZIndex: 100,
  focusedWindowId: null,
  showStartMenu: false,
  pinnedApps: ['terminal', 'filemanager', 'browser', 'settings'],
  notifications: [],
  theme: 'dark',
  accentColor: '#00d4ff',
  soundEnabled: true,
  animationsEnabled: true,
};

function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case 'SET_BOOT_PHASE':
      return { ...state, bootPhase: action.phase };
    case 'SET_LOCKED':
      return { ...state, isLocked: action.locked };
    case 'SET_USER':
      return { ...state, currentUser: action.user };
    case 'SET_WALLPAPER':
      return { ...state, wallpaper: action.wallpaper };

    case 'OPEN_WINDOW': {
      const app = APPS.find(a => a.id === action.appId);
      if (!app) return state;
      const existing = app.singleInstance ? state.windows.find(w => w.appId === action.appId) : null;
      if (existing) {
        return {
          ...state,
          windows: state.windows.map(w =>
            w.id === existing.id ? { ...w, isMinimized: false, isFocused: true, zIndex: state.nextZIndex } : w
          ),
          focusedWindowId: existing.id,
          nextZIndex: state.nextZIndex + 1,
          showStartMenu: false,
        };
      }
      const newWindow: WindowState = {
        id: `win-${Date.now()}`,
        appId: action.appId,
        title: app.name,
        x: 80 + (state.windows.length * 30) % 200,
        y: 60 + (state.windows.length * 30) % 150,
        width: app.defaultWidth,
        height: app.defaultHeight,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: state.nextZIndex,
        content: action.content,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        focusedWindowId: newWindow.id,
        nextZIndex: state.nextZIndex + 1,
        showStartMenu: false,
      };
    }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.windowId),
        focusedWindowId: state.focusedWindowId === action.windowId
          ? (state.windows.filter(w => w.id !== action.windowId).slice(-1)[0]?.id ?? null)
          : state.focusedWindowId,
      };

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, isMinimized: true, isFocused: false } : w
        ),
        focusedWindowId: state.focusedWindowId === action.windowId ? null : state.focusedWindowId,
      };

    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, isMaximized: true, x: 0, y: 0 } : w
        ),
      };

    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, isMaximized: false, x: 80, y: 60 } : w
        ),
      };

    case 'FOCUS_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, isFocused: true, zIndex: state.nextZIndex, isMinimized: false } : { ...w, isFocused: false }
        ),
        focusedWindowId: action.windowId,
        nextZIndex: state.nextZIndex + 1,
      };

    case 'UPDATE_WINDOW_POS':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, x: action.x, y: action.y } : w
        ),
      };

    case 'UPDATE_WINDOW_SIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.windowId ? { ...w, width: action.width, height: action.height } : w
        ),
      };

    case 'TOGGLE_START_MENU':
      return { ...state, showStartMenu: !state.showStartMenu };

    case 'SHOW_CONTEXT_MENU':
      return {
        ...state,
        showContextMenu: true,
        contextMenuX: action.x,
        contextMenuY: action.y,
        contextMenuTarget: action.target,
        contextMenuTargetId: action.targetId ?? null,
      };

    case 'HIDE_CONTEXT_MENU':
      return { ...state, showContextMenu: false };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.notification, ...state.notifications].slice(0, 10) };

    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };

    case 'SET_SETTING':
      return { ...state, [action.key]: action.value };

    case 'CREATE_DESKTOP_ICON':
      return { ...state, desktopIcons: [...state.desktopIcons, action.icon] };

    case 'DELETE_DESKTOP_ICON':
      return { ...state, desktopIcons: state.desktopIcons.filter(i => i.id !== action.id) };

    case 'MOVE_DESKTOP_ICON':
      return {
        ...state,
        desktopIcons: state.desktopIcons.map(i =>
          i.id === action.id ? { ...i, x: action.x, y: action.y } : i
        ),
      };

    default:
      return state;
  }
}

interface OSStoreContextValue {
  state: OSState;
  dispatch: React.Dispatch<OSAction>;
  apps: AppDefinition[];
  openWindow: (appId: string, content?: any) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  toggleStartMenu: () => void;
  showContextMenu: (x: number, y: number, target: 'desktop' | 'icon' | 'file', targetId?: string) => void;
  hideContextMenu: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

const OSStoreContext = createContext<OSStoreContextValue | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, initialState);

  const openWindow = useCallback((appId: string, content?: any) => {
    dispatch({ type: 'OPEN_WINDOW', appId, content });
  }, []);

  const closeWindow = useCallback((windowId: string) => {
    dispatch({ type: 'CLOSE_WINDOW', windowId });
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    dispatch({ type: 'FOCUS_WINDOW', windowId });
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    dispatch({ type: 'MINIMIZE_WINDOW', windowId });
  }, []);

  const maximizeWindow = useCallback((windowId: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', windowId });
  }, []);

  const restoreWindow = useCallback((windowId: string) => {
    dispatch({ type: 'RESTORE_WINDOW', windowId });
  }, []);

  const toggleStartMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_START_MENU' });
  }, []);

  const showContextMenu = useCallback((x: number, y: number, target: 'desktop' | 'icon' | 'file', targetId?: string) => {
    dispatch({ type: 'SHOW_CONTEXT_MENU', x, y, target, targetId });
  }, []);

  const hideContextMenu = useCallback(() => {
    dispatch({ type: 'HIDE_CONTEXT_MENU' });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification: { ...notification, id: `notif-${Date.now()}`, timestamp: Date.now() },
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', id });
  }, []);

  return (
    <OSStoreContext.Provider
      value={{
        state,
        dispatch,
        apps: APPS,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        toggleStartMenu,
        showContextMenu,
        hideContextMenu,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </OSStoreContext.Provider>
  );
}

export function useOSStore(): OSStoreContextValue {
  const ctx = useContext(OSStoreContext);
  if (!ctx) throw new Error('useOSStore must be used within OSProvider');
  return ctx;
}
