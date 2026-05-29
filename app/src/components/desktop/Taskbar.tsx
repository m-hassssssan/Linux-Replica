import { useState, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';

export default function Taskbar() {
  const { state, toggleStartMenu, focusWindow, openWindow, apps } = useOSStore();
  const [time, setTime] = useState(new Date());
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#1a1a2e]/80 backdrop-blur-xl
      border-t border-white/10 flex items-center px-2 gap-1 z-[9999]">
      {/* Start Button */}
      <button
        className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all
          ${state.showStartMenu ? 'bg-[#00d4ff]/20' : 'hover:bg-white/10'}`}
        onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}
      >
        <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00d4ff] to-[#4effa1] flex items-center justify-center">
          <Icons.Hexagon className="w-4 h-4 text-white" />
        </div>
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Pinned Apps */}
      {state.pinnedApps.map(appId => {
        const app = apps.find(a => a.id === appId);
        if (!app) return null;
        const Icon = (Icons as any)[app.icon];
        const isOpen = state.windows.some(w => w.appId === appId && !w.isMinimized);
        const hasWindow = state.windows.some(w => w.appId === appId);
        return (
          <button
            key={appId}
            className={`h-10 w-10 rounded-lg flex items-center justify-center transition-all relative
              ${isOpen ? 'bg-white/15' : 'hover:bg-white/10'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (hasWindow) {
                const win = state.windows.find(w => w.appId === appId);
                if (win) {
                  if (win.isMinimized) {
                    focusWindow(win.id);
                  } else if (state.focusedWindowId === win.id) {
                    // minimize
                  } else {
                    focusWindow(win.id);
                  }
                }
              } else {
                openWindow(appId);
              }
            }}
          >
            {Icon && <Icon className="w-5 h-5 text-white/70" />}
            {hasWindow && (
              <div className={`absolute bottom-1 h-0.5 rounded-full transition-all
                ${isOpen ? 'w-5 bg-[#00d4ff]' : 'w-1.5 bg-white/30'}`} />
            )}
          </button>
        );
      })}

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Open Windows */}
      <div className="flex-1 flex items-center gap-0.5 overflow-hidden">
        {state.windows.filter(w => !w.isMinimized).map(win => {
          const app = apps.find(a => a.id === win.appId);
          const Icon = app ? (Icons as any)[app.icon] : Icons.File;
          return (
            <button
              key={win.id}
              className={`h-10 px-2 rounded-lg flex items-center gap-2 transition-all min-w-0 max-w-40
                ${state.focusedWindowId === win.id ? 'bg-white/15' : 'hover:bg-white/10'}`}
              onClick={(e) => {
                e.stopPropagation();
                focusWindow(win.id);
              }}
            >
              {Icon && <Icon className="w-4 h-4 text-white/60 shrink-0" />}
              <span className="text-xs text-white/70 truncate">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-1">
        {/* Volume */}
        <div className="relative">
          <button
            className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }}
          >
            <Icons.Volume2 className="w-4 h-4 text-white/60" />
          </button>
          {showVolume && (
            <div className="absolute bottom-12 right-0 w-10 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl
              border border-white/10 p-2 flex flex-col items-center gap-2"
              onClick={e => e.stopPropagation()}>
              <span className="text-[10px] text-white/60">{volume}</span>
              <input
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 -rotate-90 origin-center translate-y-8"
              />
            </div>
          )}
        </div>

        {/* Wifi */}
        <button className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Icons.Wifi className="w-4 h-4 text-white/60" />
        </button>

        {/* Battery */}
        <button className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <Icons.BatteryMedium className="w-4 h-4 text-white/60" />
        </button>

        {/* Clock */}
        <button
          className="h-10 px-3 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-end justify-center"
          onClick={(e) => { e.stopPropagation(); setShowCalendar(!showCalendar); }}
        >
          <span className="text-xs text-white/80 font-medium leading-tight">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-white/50 leading-tight">
            {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </button>

        {/* Notification Bell */}
        <button className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors relative">
          <Icons.Bell className="w-4 h-4 text-white/60" />
          {state.notifications.length > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff007f]" />
          )}
        </button>
      </div>
    </div>
  );
}
