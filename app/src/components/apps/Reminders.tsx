import { useState } from 'react';
import * as Icons from 'lucide-react';

interface Reminder {
  id: string;
  text: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const PRIORITY_COLORS = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Team standup meeting', date: '2026-05-15T09:00', completed: false, priority: 'high' },
    { id: '2', text: 'Submit project report', date: '2026-05-15T17:00', completed: false, priority: 'high' },
    { id: '3', text: 'Review pull requests', date: '2026-05-15T11:00', completed: true, priority: 'medium' },
    { id: '4', text: 'Update documentation', date: '2026-05-16T10:00', completed: false, priority: 'low' },
    { id: '5', text: 'Coffee with Sarah', date: '2026-05-16T14:00', completed: false, priority: 'medium' },
  ]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const add = () => {
    if (!text.trim()) return;
    setReminders(prev => [...prev, { id: `r-${Date.now()}`, text, date: new Date().toISOString().slice(0, 16), completed: false, priority }]);
    setText('');
  };

  const toggle = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const upcoming = reminders.filter(r => !r.completed);
  const completed_r = reminders.filter(r => r.completed);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      <h2 className="text-sm text-white/80 font-medium mb-3">Reminders</h2>

      {/* Add */}
      <div className="flex gap-2 mb-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add reminder..."
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white
            placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as any)}
          className="h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
        >
          <option value="low" className="bg-[#1a1a2e]">Low</option>
          <option value="medium" className="bg-[#1a1a2e]">Med</option>
          <option value="high" className="bg-[#1a1a2e]">High</option>
        </select>
        <button onClick={add} className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff]">
          <Icons.Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Upcoming */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium">Upcoming ({upcoming.length})</div>
        {upcoming.map(r => (
          <div key={r.id} className="flex items-center gap-3 py-2 border-b border-white/5 group">
            <button onClick={() => toggle(r.id)} className="w-5 h-5 rounded-md border-2 border-white/20 hover:border-[#00d4ff] flex items-center justify-center transition-all" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/80">{r.text}</div>
              <div className="text-[10px] text-white/30">{new Date(r.date).toLocaleString()}</div>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[r.priority]}`}>{r.priority}</span>
          </div>
        ))}

        {completed_r.length > 0 && (
          <>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 mt-4 font-medium">Completed</div>
            {completed_r.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-b border-white/5 opacity-50">
                <button onClick={() => toggle(r.id)} className="w-5 h-5 rounded-md bg-[#4effa1] flex items-center justify-center">
                  <Icons.Check className="w-3 h-3 text-black" />
                </button>
                <div className="flex-1">
                  <div className="text-xs text-white/50 line-through">{r.text}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
