import { useState, useMemo } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';

const CATEGORIES = [
  { id: 'system', name: 'System', icon: 'Monitor' },
  { id: 'productivity', name: 'Work', icon: 'Briefcase' },
  { id: 'creative', name: 'Creative', icon: 'Palette' },
  { id: 'dev', name: 'Dev', icon: 'Code2' },
  { id: 'internet', name: 'Web', icon: 'Globe' },
  { id: 'games', name: 'Games', icon: 'Gamepad2' },
];

export default function StartMenu() {
  const { state, apps, openWindow } = useOSStore();
  const [activeCategory, setActiveCategory] = useState('system');
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    let result = apps;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q));
    } else if (activeCategory) {
      result = result.filter(a => a.category === activeCategory);
    }
    return result;
  }, [apps, search, activeCategory]);

  return (
    <div
      className="absolute bottom-14 left-2 w-[520px] h-[580px] bg-[#1a1a2e]/95 backdrop-blur-2xl
        rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-[10000]
        flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10
              text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00d4ff]/50
              focus:bg-white/10 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-24 flex flex-col gap-0.5 p-2 border-r border-white/5">
          {CATEGORIES.map(cat => {
            const Icon = (Icons as any)[cat.icon];
            return (
              <button
                key={cat.id}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all
                  ${activeCategory === cat.id && !search ? 'bg-[#00d4ff]/15 text-[#00d4ff]' : 'hover:bg-white/5 text-white/50'}`}
                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="text-[10px] font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* App Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2 px-1">
            {search ? `Search results` : CATEGORIES.find(c => c.id === activeCategory)?.name || 'All Apps'}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {filteredApps.map(app => {
              const Icon = (Icons as any)[app.icon];
              return (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10
                    transition-all group"
                  onClick={() => openWindow(app.id)}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#00d4ff]/10
                    flex items-center justify-center transition-all border border-white/5
                    group-hover:border-[#00d4ff]/20">
                    {Icon && <Icon className="w-6 h-6 text-white/60 group-hover:text-[#00d4ff] transition-colors" />}
                  </div>
                  <span className="text-[11px] text-white/70 group-hover:text-white text-center leading-tight">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredApps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-white/30">
              <Icons.Search className="w-10 h-10 mb-2" />
              <span className="text-sm">No apps found</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 border-t border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#4effa1] flex items-center justify-center">
            <Icons.User className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs text-white/70">{state.currentUser}</span>
        </div>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <Icons.Power className="w-3.5 h-3.5 text-white/50" />
          <span className="text-[11px] text-white/50">Power</span>
        </button>
      </div>
    </div>
  );
}
