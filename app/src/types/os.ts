// OS Core Types

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  content?: any;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // lucide icon name
  category: AppCategory;
  component: string; // component name mapping
  defaultWidth: number;
  defaultHeight: number;
  canResize: boolean;
  singleInstance?: boolean;
}

export type AppCategory =
  | 'system'
  | 'productivity'
  | 'creative'
  | 'games'
  | 'dev'
  | 'internet';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  parentId: string | null;
  content?: string;
  mimeType?: string;
  size?: number;
  createdAt: number;
  updatedAt: number;
}

export interface DesktopIcon {
  id: string;
  name: string;
  appId?: string;
  fileId?: string;
  icon: string;
  x: number;
  y: number;
}

export interface OSState {
  // Boot / Auth
  bootPhase: 'bios' | 'loading' | 'login' | 'desktop';
  isLocked: boolean;
  currentUser: string;

  // Desktop
  wallpaper: string;
  desktopIcons: DesktopIcon[];
  showContextMenu: boolean;
  contextMenuX: number;
  contextMenuY: number;
  contextMenuTarget: 'desktop' | 'icon' | 'file' | null;
  contextMenuTargetId: string | null;

  // Windows
  windows: WindowState[];
  nextZIndex: number;
  focusedWindowId: string | null;

  // Taskbar
  showStartMenu: boolean;
  pinnedApps: string[];

  // Notifications
  notifications: Notification[];

  // Settings
  theme: 'dark' | 'light';
  accentColor: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export interface FileSystemState {
  items: FileSystemItem[];
  currentDirectory: string | null; // parentId
}

export type OSAction =
  | { type: 'SET_BOOT_PHASE'; phase: OSState['bootPhase'] }
  | { type: 'SET_LOCKED'; locked: boolean }
  | { type: 'SET_USER'; user: string }
  | { type: 'SET_WALLPAPER'; wallpaper: string }
  | { type: 'OPEN_WINDOW'; appId: string; content?: any }
  | { type: 'CLOSE_WINDOW'; windowId: string }
  | { type: 'MINIMIZE_WINDOW'; windowId: string }
  | { type: 'MAXIMIZE_WINDOW'; windowId: string }
  | { type: 'RESTORE_WINDOW'; windowId: string }
  | { type: 'FOCUS_WINDOW'; windowId: string }
  | { type: 'UPDATE_WINDOW_POS'; windowId: string; x: number; y: number }
  | { type: 'UPDATE_WINDOW_SIZE'; windowId: string; width: number; height: number }
  | { type: 'TOGGLE_START_MENU' }
  | { type: 'SHOW_CONTEXT_MENU'; x: number; y: number; target: 'desktop' | 'icon' | 'file'; targetId?: string }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'REMOVE_NOTIFICATION'; id: string }
  | { type: 'SET_SETTING'; key: string; value: any }
  | { type: 'CREATE_DESKTOP_ICON'; icon: DesktopIcon }
  | { type: 'DELETE_DESKTOP_ICON'; id: string }
  | { type: 'MOVE_DESKTOP_ICON'; id: string; x: number; y: number };

// Game types
export interface HighScore {
  game: string;
  score: number;
  date: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface SpreadsheetCell {
  row: number;
  col: number;
  value: string;
  computed?: number | string;
}
