import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function ClockApp() {
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'clock' | 'world' | 'alarm'>('clock');
  const [alarms, setAlarms] = useState<{ time: string; label: string; on: boolean }[]>([
    { time: '07:00', label: 'Morning Alarm', on: true },
    { time: '08:30', label: 'Work', on: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Analog clock calculations
  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const worldClocks = [
    { city: 'New York', tz: 'America/New_York' },
    { city: 'London', tz: 'Europe/London' },
    { city: 'Tokyo', tz: 'Asia/Tokyo' },
    { city: 'Sydney', tz: 'Australia/Sydney' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['clock', 'world', 'alarm'] as const).map(tab => (
          <button
            key={tab}
            className={`flex-1 h-8 rounded-lg text-xs font-medium capitalize transition-all
              ${activeTab === tab ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'alarm' ? 'Alarms' : tab === 'world' ? 'World Clock' : 'Clock'}
          </button>
        ))}
      </div>

      {activeTab === 'clock' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Analog */}
          <div className="relative w-40 h-40 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            {/* Hour markers */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 50 + 42 * Math.sin(angle);
              const y = 50 - 42 * Math.cos(angle);
              return (
                <div key={i} className="absolute w-1 h-1 rounded-full bg-white/30"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }} />
              );
            })}
            {/* Hands */}
            <div className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-white rounded origin-bottom -translate-x-1/2"
              style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }} />
            <div className="absolute top-1/2 left-1/2 w-0.5 h-14 bg-white/60 rounded origin-bottom -translate-x-1/2"
              style={{ transform: `translate(-50%, -100%) rotate(${minDeg}deg)` }} />
            <div className="absolute top-1/2 left-1/2 w-px h-16 bg-[#ff007f] rounded origin-bottom -translate-x-1/2"
              style={{ transform: `translate(-50%, -100%) rotate(${secDeg}deg)` }} />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#00d4ff] -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Digital */}
          <div className="text-center">
            <div className="text-3xl text-white font-mono font-bold">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
              <span className="text-lg text-white/40">:{String(seconds).padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-white/40 mt-1">
              {now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'world' && (
        <div className="flex-1 space-y-2 overflow-y-auto">
          {worldClocks.map(wc => {
            const time = now.toLocaleTimeString([], {
              timeZone: wc.tz, hour: '2-digit', minute: '2-digit', hour12: false
            });
            const date = now.toLocaleDateString([], {
              timeZone: wc.tz, weekday: 'short', month: 'short', day: 'numeric'
            });
            return (
              <div key={wc.city} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-xl border border-white/5">
                <div>
                  <div className="text-sm text-white font-medium">{wc.city}</div>
                  <div className="text-[10px] text-white/40">{date}</div>
                </div>
                <div className="text-xl text-white font-mono">{time}</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'alarm' && (
        <div className="flex-1 space-y-2 overflow-y-auto">
          {alarms.map((alarm, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-xl border border-white/5">
              <div>
                <div className="text-xl text-white font-mono">{alarm.time}</div>
                <div className="text-[10px] text-white/40">{alarm.label}</div>
              </div>
              <button
                className={`w-10 h-6 rounded-full transition-colors relative
                  ${alarm.on ? 'bg-[#00d4ff]' : 'bg-white/20'}`}
                onClick={() => setAlarms(prev => prev.map((a, j) => i === j ? { ...a, on: !a.on } : a))}
              >
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                  style={{ left: alarm.on ? '18px' : '2px' }} />
              </button>
            </div>
          ))}
          <button
            className="w-full h-10 rounded-xl border border-dashed border-white/10 flex items-center justify-center gap-2
              hover:bg-white/5 transition-colors text-white/40"
          >
            <Icons.Plus className="w-4 h-4" />
            <span className="text-xs">Add Alarm</span>
          </button>
        </div>
      )}
    </div>
  );
}
