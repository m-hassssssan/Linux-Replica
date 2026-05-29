import { useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';

export default function NotificationPanel() {
  const { state, removeNotification } = useOSStore();

  // Auto-dismiss notifications
  useEffect(() => {
    if (state.notifications.length === 0) return;
    const timers = state.notifications.map(n =>
      setTimeout(() => removeNotification(n.id), 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [state.notifications, removeNotification]);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-[10002] pointer-events-none">
      {state.notifications.map(notif => {
        const iconMap: Record<string, any> = {
          info: Icons.Info,
          success: Icons.CheckCircle,
          warning: Icons.AlertTriangle,
          error: Icons.XCircle,
        };
        const Icon = iconMap[notif.type] || Icons.Info;
        const colorMap: Record<string, string> = {
          info: 'text-[#00d4ff]',
          success: 'text-[#4effa1]',
          warning: 'text-yellow-400',
          error: 'text-[#ff007f]',
        };
        return (
          <div
            key={notif.id}
            className="pointer-events-auto w-72 bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl
              border border-white/10 shadow-lg p-3 flex items-start gap-3
              animate-in slide-in-from-right duration-300"
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${colorMap[notif.type]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/90">{notif.title}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{notif.message}</div>
            </div>
            <button
              className="shrink-0 hover:bg-white/10 rounded p-0.5 transition-colors"
              onClick={() => removeNotification(notif.id)}
            >
              <Icons.X className="w-3 h-3 text-white/40" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
