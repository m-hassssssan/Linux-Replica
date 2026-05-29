import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      // Fallback - show placeholder
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [facing]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `photo-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Viewfinder */}
      <div className="flex-1 bg-black relative overflow-hidden">
        {captured ? (
          <img src={captured} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        {!stream && !captured && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icons.Camera className="w-12 h-12 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30">Camera access required</p>
              <button onClick={startCamera} className="mt-2 px-3 py-1.5 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Enable Camera</button>
            </div>
          </div>
        )}
        {/* Overlay grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
        </div>
      </div>

      {/* Controls */}
      <div className="h-16 bg-[#1a1a2e] border-t border-white/5 flex items-center justify-center gap-6">
        <button onClick={() => { setCaptured(null); startCamera(); }} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Icons.RotateCcw className="w-5 h-5 text-white/50" />
        </button>
        <button
          onClick={captured ? download : takePhoto}
          className="w-12 h-12 rounded-full border-3 border-white/80 flex items-center justify-center hover:scale-105 transition-transform"
        >
          {captured ? <Icons.Download className="w-5 h-5 text-white" /> : <div className="w-10 h-10 rounded-full bg-white" />}
        </button>
        <button onClick={() => setFacing(f => f === 'user' ? 'environment' : 'user')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Icons.RefreshCw className="w-5 h-5 text-white/50" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
