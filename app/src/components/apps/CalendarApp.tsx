import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarApp() {
  const [now, setNow] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventText, setEventText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventKey = (d: number) => `${year}-${month}-${d}`;

  const handleAddEvent = () => {
    if (!selectedDate || !eventText.trim()) return;
    const key = getEventKey(selectedDate.getDate());
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), eventText] }));
    setEventText('');
    setShowEventForm(false);
  };

  const selectedKey = selectedDate ? getEventKey(selectedDate.getDate()) : '';
  const selectedEvents = events[selectedKey] || [];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg text-white font-semibold">{MONTHS[month]} {year}</h2>
          <p className="text-xs text-white/40">
            {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
          >
            <Icons.ChevronLeft className="w-4 h-4 text-white/60" />
          </button>
          <button
            className="px-3 h-8 rounded-lg hover:bg-white/10 text-xs text-white/60 transition-colors"
            onClick={() => setViewDate(new Date())}
          >
            Today
          </button>
          <button
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
          >
            <Icons.ChevronRight className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isToday = day === today && month === todayMonth && year === todayYear;
          const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;
          const hasEvent = day !== null && events[getEventKey(day)]?.length > 0;
          return (
            <button
              key={i}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all text-sm relative
                ${day === null ? 'pointer-events-none' : 'cursor-pointer'}
                ${isToday ? 'bg-[#00d4ff]/20 text-[#00d4ff] font-bold ring-1 ring-[#00d4ff]/40' : ''}
                ${isSelected && !isToday ? 'bg-white/15 text-white' : ''}
                ${!isToday && !isSelected && day !== null ? 'hover:bg-white/10 text-white/70' : ''}
                ${day === null ? '' : ''}`}
              onClick={() => day !== null && setSelectedDate(new Date(year, month, day))}
            >
              {day}
              {hasEvent && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#ff007f]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Events */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">
            {selectedDate ? selectedDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select a date'}
          </span>
          <button
            className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            <Icons.Plus className="w-3 h-3 text-white/40" />
          </button>
        </div>

        {showEventForm && (
          <div className="flex gap-2 mb-2">
            <input
              type="text" value={eventText}
              onChange={e => setEventText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddEvent()}
              placeholder="Add event..."
              className="flex-1 h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white
                placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
              autoFocus
            />
            <button
              className="h-8 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs"
              onClick={handleAddEvent}
            >
              Add
            </button>
          </div>
        )}

        {selectedEvents.length === 0 ? (
          <div className="text-[10px] text-white/20 py-4 text-center">No events</div>
        ) : (
          selectedEvents.map((evt, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
              <span className="text-xs text-white/60">{evt}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
