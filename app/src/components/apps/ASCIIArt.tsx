import { useState, useRef, useCallback } from 'react';
import * as Icons from 'lucide-react';

const ASCII_CHARS = ' .:-=+*#%@';

export default function ASCIIArt() {
  const [ascii, setAscii] = useState('');
  const [width, setWidth] = useState(80);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((imgSrc: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      setImage(imgSrc);
      const aspect = img.height / img.width;
      const h = Math.floor(width * aspect * 0.5);
      canvas.width = width;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, width, h);
      const data = ctx.getImageData(0, 0, width, h).data;
      let result = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
          result += ASCII_CHARS[charIndex];
        }
        result += '\n';
      }
      setAscii(result);
    };
    img.src = imgSrc;
  }, [width]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processImage(String(ev.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const copy = () => {
    navigator.clipboard.writeText(ascii);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <button onClick={() => fileRef.current?.click()} className="p-1.5 rounded hover:bg-white/10">
          <Icons.Upload className="w-3.5 h-3.5 text-white/50" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <span className="text-[10px] text-white/30">Width:</span>
        <input type="range" min="40" max="160" value={width} onChange={e => { setWidth(Number(e.target.value)); if (image) processImage(image); }}
          className="w-20 accent-[#00d4ff]" />
        <span className="text-[10px] text-white/40 w-6">{width}</span>
        <div className="flex-1" />
        <button onClick={copy} className="p-1.5 rounded hover:bg-white/10" disabled={!ascii}>
          <Icons.Copy className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        {ascii ? (
          <pre className="text-[6px] leading-[5px] text-[#00d4ff] font-mono whitespace-pre">{ascii}</pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <Icons.Type className="w-10 h-10 mb-2" />
            <span className="text-xs">Upload an image to convert</span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
