import { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

const DEMO_VIDEOS = [
  { title: 'Big Buck Bunny', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { title: 'Elephants Dream', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { title: 'For Bigger Blazes', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { title: 'For Bigger Escapes', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
];

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause(); else videoRef.current.play();
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = (Number(e.target.value) / 100) * v.duration;
  };

  const video = DEMO_VIDEOS[current];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Video */}
      <div className="flex-1 bg-black flex items-center justify-center relative">
        <video
          ref={videoRef}
          src={video.url}
          className="max-w-full max-h-full"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setCurrent(i => (i + 1) % DEMO_VIDEOS.length)}
          onClick={togglePlay}
        />
        {!playing && (
          <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Icons.Play className="w-8 h-8 text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="h-16 bg-[#1a1a2e] border-t border-white/5 flex flex-col px-3 py-1">
        {/* Progress */}
        <input type="range" min="0" max="100" value={progress} onChange={handleSeek}
          className="w-full h-1 accent-[#00d4ff] mb-1" />

        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="p-1.5 rounded hover:bg-white/10">
            {playing ? <Icons.Pause className="w-4 h-4 text-white/70" /> : <Icons.Play className="w-4 h-4 text-white/70 ml-0.5" />}
          </button>
          <button onClick={() => setCurrent(i => (i - 1 + DEMO_VIDEOS.length) % DEMO_VIDEOS.length)} className="p-1.5 rounded hover:bg-white/10">
            <Icons.SkipBack className="w-4 h-4 text-white/50" />
          </button>
          <button onClick={() => setCurrent(i => (i + 1) % DEMO_VIDEOS.length)} className="p-1.5 rounded hover:bg-white/10">
            <Icons.SkipForward className="w-4 h-4 text-white/50" />
          </button>

          <div className="flex items-center gap-1.5">
            <Icons.Volume2 className="w-3 h-3 text-white/30" />
            <input type="range" min="0" max="100" value={volume} onChange={e => { setVolume(Number(e.target.value)); if (videoRef.current) videoRef.current.volume = Number(e.target.value) / 100; }}
              className="w-16 accent-[#00d4ff]" />
          </div>

          <div className="flex-1" />
          <span className="text-[10px] text-white/40 truncate max-w-[150px]">{video.title}</span>
          <button onClick={() => setShowPlaylist(!showPlaylist)} className="p-1.5 rounded hover:bg-white/10">
            <Icons.List className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="h-32 bg-[#1a1a2e] border-t border-white/5 overflow-y-auto">
          {DEMO_VIDEOS.map((v, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-all
              ${current === i ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => { setCurrent(i); setProgress(0); }}>
              <Icons.Play className={`w-3 h-3 ${current === i ? 'text-[#00d4ff]' : 'text-white/30'}`} />
              <span className={`text-xs ${current === i ? 'text-[#00d4ff]' : 'text-white/60'}`}>{v.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
