import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

const TRACKS = [
  { id: '1', title: 'Midnight City', artist: 'Neon Dreams', duration: 234 },
  { id: '2', title: 'Cyber Rain', artist: 'Digital Souls', duration: 198 },
  { id: '3', title: 'Quantum Leap', artist: 'Strata', duration: 267 },
  { id: '4', title: 'Glass Prism', artist: 'Crystal Echo', duration: 312 },
  { id: '5', title: 'Neon Horizon', artist: 'Synthwave', duration: 245 },
  { id: '6', title: 'Deep Space', artist: 'Cosmic Drift', duration: 289 },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [visualizer, setVisualizer] = useState<number[]>(new Array(20).fill(5));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS[currentTrack];

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= track.duration) { setPlaying(false); return 0; }
          return p + 1;
        });
        setVisualizer(Array.from({ length: 20 }, () => 3 + Math.random() * 22));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, track]);

  const togglePlay = () => setPlaying(!playing);
  const next = () => { setCurrentTrack(i => (i + 1) % TRACKS.length); setProgress(0); };
  const prev = () => { setCurrentTrack(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Visualizer */}
      <div className="h-32 bg-[#1a1a2e] flex items-end justify-center gap-0.5 px-4 pb-2 border-b border-white/5">
        {visualizer.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-200"
            style={{
              height: `${h * 4}px`,
              background: `linear-gradient(to top, #00d4ff, #4effa1)`,
              opacity: playing ? 0.7 + Math.random() * 0.3 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Now Playing */}
      <div className="p-4 text-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#4effa1]/20 flex items-center justify-center mx-auto mb-3 border border-[#00d4ff]/10">
          <Icons.Music className="w-8 h-8 text-[#00d4ff]" />
        </div>
        <div className="text-sm text-white font-medium truncate">{track.title}</div>
        <div className="text-xs text-white/40">{track.artist}</div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-2">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setProgress(Math.floor(pct * track.duration));
          }}>
          <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#4effa1] rounded-full transition-all" style={{ width: `${(progress / track.duration) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/30 font-mono">{formatTime(progress)}</span>
          <span className="text-[10px] text-white/30 font-mono">{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button onClick={prev} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Icons.SkipBack className="w-5 h-5 text-white/60" />
        </button>
        <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30 flex items-center justify-center transition-all">
          {playing ? <Icons.Pause className="w-6 h-6 text-[#00d4ff]" /> : <Icons.Play className="w-6 h-6 text-[#00d4ff] ml-0.5" />}
        </button>
        <button onClick={next} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Icons.SkipForward className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 mb-3">
        <Icons.Volume2 className="w-3.5 h-3.5 text-white/30" />
        <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 accent-[#00d4ff]" />
        <span className="text-[10px] text-white/30 w-6 text-right">{volume}</span>
      </div>

      {/* Playlist */}
      <div className="flex-1 overflow-y-auto">
        {TRACKS.map((t, i) => (
          <button
            key={t.id}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-all
              ${currentTrack === i ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => { setCurrentTrack(i); setProgress(0); setPlaying(true); }}
          >
            {currentTrack === i && playing ? (
              <div className="w-4 flex gap-px items-end justify-center h-3">
                <div className="w-px bg-[#00d4ff] animate-pulse" style={{ height: '60%' }} />
                <div className="w-px bg-[#00d4ff] animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
                <div className="w-px bg-[#00d4ff] animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
              </div>
            ) : (
              <span className="text-xs text-white/30 w-4 text-center">{i + 1}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className={`text-xs truncate ${currentTrack === i ? 'text-[#00d4ff]' : 'text-white/70'}`}>{t.title}</div>
              <div className="text-[10px] text-white/30">{t.artist}</div>
            </div>
            <span className="text-[10px] text-white/30">{formatTime(t.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
