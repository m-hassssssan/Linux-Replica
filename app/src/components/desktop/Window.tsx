import { useRef, useCallback, useState, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';
import type { WindowState } from '@/types/os';

// Lazy load all app components
import Terminal from '@/components/apps/Terminal';
import FileManager from '@/components/apps/FileManager';
import Settings from '@/components/apps/Settings';
import Calculator from '@/components/apps/Calculator';
import CalendarApp from '@/components/apps/CalendarApp';
import ClockApp from '@/components/apps/ClockApp';
import TaskManager from '@/components/apps/TaskManager';
import SystemMonitor from '@/components/apps/SystemMonitor';
import TextEditor from '@/components/apps/TextEditor';
import Spreadsheet from '@/components/apps/Spreadsheet';
import Notes from '@/components/apps/Notes';
import TodoList from '@/components/apps/TodoList';
import WeatherApp from '@/components/apps/WeatherApp';
import NewsReader from '@/components/apps/NewsReader';
import PDFViewer from '@/components/apps/PDFViewer';
import DictionaryApp from '@/components/apps/DictionaryApp';
import Stopwatch from '@/components/apps/Stopwatch';
import TimerApp from '@/components/apps/TimerApp';
import PasswordGenerator from '@/components/apps/PasswordGenerator';
import UnitConverter from '@/components/apps/UnitConverter';
import Reminders from '@/components/apps/Reminders';
import GeminiChat from '@/components/apps/GeminiChat';
import Paint from '@/components/apps/Paint';
import ImageViewer from '@/components/apps/ImageViewer';
import MusicPlayer from '@/components/apps/MusicPlayer';
import VideoPlayer from '@/components/apps/VideoPlayer';
import Camera from '@/components/apps/Camera';
import ColorPicker from '@/components/apps/ColorPicker';
import SoundRecorder from '@/components/apps/SoundRecorder';
import ASCIIArt from '@/components/apps/ASCIIArt';
import PhotoEditor from '@/components/apps/PhotoEditor';
import DrumKit from '@/components/apps/DrumKit';
import Piano from '@/components/apps/Piano';
import CodeEditor from '@/components/apps/CodeEditor';
import MarkdownEditor from '@/components/apps/MarkdownEditor';
import JSONFormatter from '@/components/apps/JSONFormatter';
import RegexTester from '@/components/apps/RegexTester';
import Base64Converter from '@/components/apps/Base64Converter';
import DiffChecker from '@/components/apps/DiffChecker';
import HTMLPreview from '@/components/apps/HTMLPreview';
import Browser from '@/components/apps/Browser';
import EmailClient from '@/components/apps/EmailClient';
import ChatApp from '@/components/apps/ChatApp';
import FTPClient from '@/components/apps/FTPClient';
import NetworkScanner from '@/components/apps/NetworkScanner';
import SnakeGame from '@/components/apps/SnakeGame';
import TetrisGame from '@/components/apps/TetrisGame';
import MinesweeperGame from '@/components/apps/MinesweeperGame';
import Game2048 from '@/components/apps/Game2048';
import TicTacToeGame from '@/components/apps/TicTacToeGame';
import SudokuGame from '@/components/apps/SudokuGame';
import MemoryGame from '@/components/apps/MemoryGame';
import PongGame from '@/components/apps/PongGame';
import BreakoutGame from '@/components/apps/BreakoutGame';
import WordleGame from '@/components/apps/WordleGame';
import FlappyBirdGame from '@/components/apps/FlappyBirdGame';
import ConnectFourGame from '@/components/apps/ConnectFourGame';
import CheckersGame from '@/components/apps/CheckersGame';
import SolitaireGame from '@/components/apps/SolitaireGame';
import HangmanGame from '@/components/apps/HangmanGame';
import RPSGame from '@/components/apps/RPSGame';
import ChessGame from '@/components/apps/ChessGame';
import GalaxyShooter from '@/components/apps/GalaxyShooter';
import MazeGame from '@/components/apps/MazeGame';
import QuizGame from '@/components/apps/QuizGame';
import TowerDefense from '@/components/apps/TowerDefense';

const APP_COMPONENTS: Record<string, React.FC<any>> = {
  Terminal, FileManager, Settings, Calculator, CalendarApp, ClockApp,
  TaskManager, SystemMonitor, TextEditor, Spreadsheet, Notes, TodoList,
  WeatherApp, NewsReader, PDFViewer, DictionaryApp, Stopwatch, TimerApp,
  PasswordGenerator, UnitConverter, Reminders, GeminiChat, Paint,
  ImageViewer, MusicPlayer, VideoPlayer, Camera, ColorPicker,
  SoundRecorder, ASCIIArt, PhotoEditor, DrumKit, Piano, CodeEditor,
  MarkdownEditor, JSONFormatter, RegexTester, Base64Converter, DiffChecker,
  HTMLPreview, Browser, EmailClient, ChatApp, FTPClient, NetworkScanner,
  SnakeGame, TetrisGame, MinesweeperGame, Game2048, TicTacToeGame,
  SudokuGame, MemoryGame, PongGame, BreakoutGame, WordleGame,
  FlappyBirdGame, ConnectFourGame, CheckersGame, SolitaireGame,
  HangmanGame, RPSGame, ChessGame, GalaxyShooter, MazeGame,
  QuizGame, TowerDefense,
};

interface WindowProps {
  win: WindowState;
}

export default function WindowComponent({ win }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, dispatch, apps } = useOSStore();
  const divRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const app = apps.find(a => a.id === win.appId);
  const AppComponent = app ? APP_COMPONENTS[app.component] : null;

  const handleMouseDown = useCallback(() => {
    if (!win.isFocused) {
      focusWindow(win.id);
    }
  }, [win.id, win.isFocused, focusWindow]);

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest('.window-btn')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, winX: win.x, winY: win.y };
    e.preventDefault();
  }, [win.x, win.y, win.isMaximized]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!app?.canResize || win.isMaximized) return;
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };
    e.preventDefault();
    e.stopPropagation();
  }, [win.width, win.height, win.isMaximized, app?.canResize]);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, dragStart.current.winX + (e.clientX - dragStart.current.x));
        const newY = Math.max(0, dragStart.current.winY + (e.clientY - dragStart.current.y));
        dispatch({ type: 'UPDATE_WINDOW_POS', windowId: win.id, x: newX, y: newY });
      }
      if (isResizing) {
        const newW = Math.max(200, resizeStart.current.w + (e.clientX - resizeStart.current.x));
        const newH = Math.max(150, resizeStart.current.h + (e.clientY - resizeStart.current.y));
        dispatch({ type: 'UPDATE_WINDOW_SIZE', windowId: win.id, width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, win.id, dispatch]);

  const style: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 48px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      ref={divRef}
      className={`absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10
        ${win.isFocused ? 'shadow-cyan-500/10 border-cyan-500/20' : 'border-white/5'}
        ${isDragging ? 'cursor-grabbing' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title Bar */}
      <div
        className="h-9 flex items-center justify-between px-3 bg-[#1a1a2e]/90 backdrop-blur-xl
          border-b border-white/5 select-none"
        onMouseDown={handleTitleBarMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : win.isMaximized ? 'default' : 'grab' }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {app && (() => { const I = (Icons as any)[app.icon]; return I ? <I className="w-3.5 h-3.5 text-[#00d4ff]" /> : null; })()}
          <span className="text-xs text-white/80 truncate font-medium">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="window-btn w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
          >
            <Icons.Minus className="w-3 h-3 text-white/60" />
          </button>
          <button
            className="window-btn w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id);
            }}
          >
            <Icons.Square className="w-2.5 h-2.5 text-white/60" />
          </button>
          <button
            className="window-btn w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/80 transition-colors"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
          >
            <Icons.X className="w-3 h-3 text-white/60" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-[#0d0d12]/95 backdrop-blur-sm relative">
        {AppComponent ? <AppComponent windowId={win.id} content={win.content} /> : (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            App not implemented yet
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {app?.canResize && !win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
          onMouseDown={handleResizeMouseDown}
          style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 50%)' }}
        />
      )}
    </div>
  );
}
