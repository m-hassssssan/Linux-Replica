import { useState, useCallback } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';
import type { DesktopIcon as DesktopIconType } from '@/types/os';

interface Props {
  icon: DesktopIconType;
}

export default function DesktopIcon({ icon }: Props) {
  const { openWindow, dispatch } = useOSStore();
  const [isDragging, setIsDragging] = useState(false);

  const IconComponent = (Icons as any)[icon.icon] || Icons.File;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (icon.appId) {
      openWindow(icon.appId);
    }
  }, [icon.appId, openWindow]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', icon.id);
  }, [icon.id]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-1 w-20 p-2 rounded-lg cursor-pointer transition-all
        hover:bg-white/10 active:bg-white/20 ${isDragging ? 'opacity-50' : ''}`}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ position: 'absolute', left: icon.x, top: icon.y }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: 'SHOW_CONTEXT_MENU',
          x: e.clientX,
          y: e.clientY,
          target: 'icon',
          targetId: icon.id,
        });
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center
        shadow-lg shadow-black/20 border border-white/5">
        <IconComponent className="w-7 h-7 text-[#00d4ff]" />
      </div>
      <span className="text-xs text-white/90 text-center leading-tight drop-shadow-md font-medium px-1 rounded">
        {icon.name}
      </span>
    </div>
  );
}
