import { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function ImageViewer() {
  const [image, setImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(String(ev.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const sampleImages = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={handleOpen} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.FolderOpen className="w-3.5 h-3.5 text-white/50" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div className="w-px h-4 bg-white/10" />
        <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomOut className="w-3.5 h-3.5 text-white/50" />
        </button>
        <span className="text-[10px] text-white/40 w-10 text-center">{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(400, z + 25))} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.ZoomIn className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={() => setRotation(r => r - 90)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.RotateCcw className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={() => setRotation(r => r + 90)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.RotateCw className="w-3.5 h-3.5 text-white/50" />
        </button>
        <div className="flex-1" />
        <button onClick={() => { setImage(null); setZoom(100); setRotation(0); }} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.X className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        {image ? (
          <img
            src={image}
            alt="View"
            className="max-w-full max-h-full object-contain transition-all"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="grid grid-cols-2 gap-2">
              {sampleImages.map((src, i) => (
                <button key={i} onClick={() => setImage(src)} className="w-32 h-24 rounded-lg overflow-hidden hover:ring-2 ring-[#00d4ff] transition-all">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <span className="text-xs text-white/30">Click to open or select from samples</span>
          </div>
        )}
      </div>
    </div>
  );
}
