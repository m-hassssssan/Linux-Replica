import { useState } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import * as Icons from 'lucide-react';

const WALLPAPERS = [
  { id: 'gradient-1', name: 'Ocean Deep', preview: 'from-[#0f0c29] via-[#302b63] to-[#24243e]' },
  { id: 'gradient-2', name: 'Midnight', preview: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]' },
  { id: 'gradient-3', name: 'Steel Blue', preview: 'from-[#0d1b2a] via-[#1b263b] to-[#415a77]' },
  { id: 'gradient-4', name: 'Purple Haze', preview: 'from-[#10002b] via-[#240046] to-[#3c096c]' },
  { id: 'gradient-5', name: 'Dark Matter', preview: 'from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]' },
  { id: 'cyber', name: 'Cyber Void', preview: 'from-[#0a0a0a] via-[#1a1a2e] to-[#0d0d0d]' },
];

const ACCENTS = [
  { name: 'Cyan', color: '#00d4ff' },
  { name: 'Green', color: '#4effa1' },
  { name: 'Pink', color: '#ff007f' },
  { name: 'Orange', color: '#ff9500' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Red', color: '#ef4444' },
];

const SECTIONS = [
  { id: 'appearance', name: 'Appearance', icon: 'Palette' },
  { id: 'system', name: 'System', icon: 'Monitor' },
  { id: 'sound', name: 'Sound', icon: 'Volume2' },
  { id: 'about', name: 'About', icon: 'Info' },
];

export default function Settings() {
  const { state, dispatch } = useOSStore();
  const [activeSection, setActiveSection] = useState('appearance');

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-white/90 mb-3 font-medium">Wallpaper</h3>
              <div className="grid grid-cols-3 gap-3">
                {WALLPAPERS.map(wp => (
                  <button
                    key={wp.id}
                    className={`relative rounded-xl overflow-hidden aspect-video transition-all
                      ${state.wallpaper === wp.id ? 'ring-2 ring-[#00d4ff] scale-105' : 'hover:scale-105'}`}
                    onClick={() => dispatch({ type: 'SET_SETTING', key: 'wallpaper', value: wp.id })}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${wp.preview}`} />
                    <span className="absolute bottom-1 left-2 text-[10px] text-white/80 font-medium">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-white/90 mb-3 font-medium">Accent Color</h3>
              <div className="flex gap-3">
                {ACCENTS.map(accent => (
                  <button
                    key={accent.color}
                    className={`w-10 h-10 rounded-full transition-all
                      ${state.accentColor === accent.color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: accent.color }}
                    onClick={() => dispatch({ type: 'SET_SETTING', key: 'accentColor', value: accent.color })}
                    title={accent.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-white/90 mb-3 font-medium">Animations</h3>
              <label className="flex items-center gap-3">
                <button
                  className={`w-11 h-6 rounded-full transition-colors relative
                    ${state.animationsEnabled ? 'bg-[#00d4ff]' : 'bg-white/20'}`}
                  onClick={() => dispatch({ type: 'SET_SETTING', key: 'animationsEnabled', value: !state.animationsEnabled })}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform
                    ${state.animationsEnabled ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`}
                    style={{ left: state.animationsEnabled ? '20px' : '2px' }} />
                </button>
                <span className="text-xs text-white/60">Enable window animations</span>
              </label>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/80">Dark Mode</span>
              <span className="text-xs text-[#4effa1]">Always On</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/80">Auto-save</span>
              <button className="w-11 h-6 rounded-full bg-[#00d4ff] relative">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: '20px' }} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-white/80">Show desktop icons</span>
              <button className="w-11 h-6 rounded-full bg-[#00d4ff] relative">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: '20px' }} />
              </button>
            </div>
          </div>
        );
      case 'sound':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-white/90 mb-3 font-medium">System Sounds</h3>
              <label className="flex items-center gap-3">
                <button
                  className={`w-11 h-6 rounded-full transition-colors relative
                    ${state.soundEnabled ? 'bg-[#00d4ff]' : 'bg-white/20'}`}
                  onClick={() => dispatch({ type: 'SET_SETTING', key: 'soundEnabled', value: !state.soundEnabled })}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: state.soundEnabled ? '20px' : '2px' }} />
                </button>
                <span className="text-xs text-white/60">Enable system sounds</span>
              </label>
            </div>
            {['Master Volume', 'Notification Volume', 'Alert Volume'].map(label => (
              <div key={label}>
                <span className="text-xs text-white/60 block mb-2">{label}</span>
                <input type="range" min="0" max="100" defaultValue="75" className="w-full accent-[#00d4ff]" />
              </div>
            ))}
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#4effa1] flex items-center justify-center">
                <Icons.Hexagon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-lg text-white font-semibold">Strata OS</h2>
                <p className="text-xs text-white/50">Version 2.0.1 (Build 2026.05.15)</p>
              </div>
            </div>
            {[
              ['Device Name', 'strata-desktop'],
              ['Processor', 'Strata Core i9 14900K'],
              ['Memory', '16 GB'],
              ['Storage', '512 GB SSD'],
              ['Display', '1920 x 1080'],
              ['Kernel', 'strata-linux 6.8.0'],
              ['Shell', 'strata-sh 2.0'],
              ['DE', 'Strata Desktop 2.0'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-white/50">{label}</span>
                <span className="text-xs text-white/80">{value}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex bg-[#0d0d12]">
      {/* Sidebar */}
      <div className="w-44 border-r border-white/5 bg-[#1a1a2e]/30 flex flex-col py-3">
        {SECTIONS.map(section => {
          const Icon = (Icons as any)[section.icon];
          return (
            <button
              key={section.id}
              className={`flex items-center gap-3 px-4 py-2.5 text-left transition-all
                ${activeSection === section.id ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'text-white/60 hover:bg-white/5 hover:text-white/80'}`}
              onClick={() => setActiveSection(section.id)}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="text-xs font-medium">{section.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg text-white font-semibold mb-4">
          {SECTIONS.find(s => s.id === activeSection)?.name}
        </h2>
        {renderSection()}
      </div>
    </div>
  );
}
