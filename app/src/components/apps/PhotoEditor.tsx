import { useState, useRef, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function PhotoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const originalRef = useRef<ImageData | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const maxW = 700, maxH = 450;
        let w = img.width, h = img.height;
        if (w > maxW) { h *= maxW / w; w = maxW; }
        if (h > maxH) { w *= maxH / h; h = maxH; }
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        originalRef.current = ctx.getImageData(0, 0, w, h);
        setImageLoaded(true);
      };
      img.src = String(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const applyFilters = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !originalRef.current) return;
    ctx.putImageData(originalRef.current, 0, 0);
    canvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px) hue-rotate(${hueRotate}deg) sepia(${sepia}%) grayscale(${grayscale}%)`;
  }, [brightness, contrast, saturate, blur, hueRotate, sepia, grayscale]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Create temp canvas with filters applied
    const temp = document.createElement('canvas');
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tCtx = temp.getContext('2d');
    if (!tCtx) return;
    tCtx.filter = canvas.style.filter;
    tCtx.drawImage(canvas, 0, 0);
    const a = document.createElement('a');
    a.href = temp.toDataURL('image/png');
    a.download = 'edited.png';
    a.click();
  };

  const reset = () => {
    setBrightness(100); setContrast(100); setSaturate(100); setBlur(0);
    setHueRotate(0); setSepia(0); setGrayscale(0);
  };

  const slider = (label: string, value: number, min: number, max: number, _def: number, set: (v: number) => void) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/40 w-14">{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))} className="flex-1 accent-[#00d4ff]" />
      <span className="text-[10px] text-white/40 w-6 text-right">{value}</span>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={() => fileRef.current?.click()} className="p-1.5 rounded hover:bg-white/10">
          <Icons.FolderOpen className="w-3.5 h-3.5 text-white/50" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button onClick={download} disabled={!imageLoaded} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30">
          <Icons.Download className="w-3.5 h-3.5 text-white/50" />
        </button>
        <button onClick={reset} disabled={!imageLoaded} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30">
          <Icons.RotateCcw className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-2">
          {imageLoaded ? (
            <canvas ref={canvasRef} className="max-w-full max-h-full rounded shadow-lg" />
          ) : (
            <div className="flex flex-col items-center text-white/20">
              <Icons.Image className="w-12 h-12 mb-2" />
              <span className="text-xs">Open an image to edit</span>
            </div>
          )}
        </div>

        {/* Filters */}
        {imageLoaded && (
          <div className="w-48 border-l border-white/5 p-3 space-y-2 overflow-y-auto">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Adjustments</div>
            {slider('Brightness', brightness, 0, 200, 100, setBrightness)}
            {slider('Contrast', contrast, 0, 200, 100, setContrast)}
            {slider('Saturation', saturate, 0, 200, 100, setSaturate)}
            {slider('Blur', blur, 0, 10, 0, setBlur)}
            {slider('Hue', hueRotate, 0, 360, 0, setHueRotate)}
            {slider('Sepia', sepia, 0, 100, 0, setSepia)}
            {slider('Grayscale', grayscale, 0, 100, 0, setGrayscale)}

            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2 mt-4">Presets</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Normal', b: 100, c: 100, s: 100 },
                { name: 'Vivid', b: 110, c: 130, s: 150 },
                { name: 'B&W', b: 100, c: 120, g: 100 },
                { name: 'Vintage', b: 90, c: 80, se: 60 },
                { name: 'Cool', b: 105, c: 110, h: 20 },
                { name: 'Warm', b: 105, c: 110, h: -20 },
              ].map(preset => (
                <button key={preset.name} onClick={() => {
                  setBrightness(preset.b ?? 100);
                  setContrast(preset.c ?? 100);
                  setSaturate(preset.s ?? 100);
                  setGrayscale((preset as any).g ?? 0);
                  setSepia((preset as any).se ?? 0);
                  setHueRotate((preset as any).h ?? 0);
                }} className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-white/60 transition-colors">
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
