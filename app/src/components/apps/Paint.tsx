import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

const COLORS = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6'];

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'line' | 'rect' | 'circle'>('brush');
  const [, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIndex] = useState(-1);
  const startRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState(ctx);
  }, []);

  const saveState = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyIdx + 1), data].slice(-20));
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  };

  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent) => {
    setDrawing(true);
    const pos = getPos(e);
    startRef.current = pos;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    if (tool === 'brush') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 3;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
    saveState(ctx);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState(ctx);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'painting.png';
    a.click();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Toolbar */}
      <div className="h-10 flex items-center px-2 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        {(['brush', 'eraser'] as const).map(t => (
          <button key={t} onClick={() => setTool(t)} className={`p-1.5 rounded transition-colors ${tool === t ? 'bg-[#00d4ff]/20' : 'hover:bg-white/10'}`}>
            {t === 'brush' ? <Icons.Paintbrush className="w-3.5 h-3.5 text-white/60" /> : <Icons.Eraser className="w-3.5 h-3.5 text-white/60" />}
          </button>
        ))}
        <div className="w-px h-5 bg-white/10" />
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); setTool('brush'); }} className={`w-5 h-5 rounded-full transition-all ${color === c ? 'ring-2 ring-white scale-110' : ''}`} style={{ backgroundColor: c }} />
        ))}
        <div className="w-px h-5 bg-white/10 mx-1" />
        <span className="text-[10px] text-white/30">{brushSize}px</span>
        <input type="range" min="1" max="20" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-16 accent-[#00d4ff]" />
        <div className="flex-1" />
        <button onClick={clear} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.Trash2 className="w-3.5 h-3.5 text-white/40" />
        </button>
        <button onClick={download} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.Download className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-2 overflow-auto">
        <canvas
          ref={canvasRef}
          className="bg-white rounded shadow-lg cursor-crosshair"
          style={{ width: '100%', height: 'calc(100% - 8px)' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
        />
      </div>
    </div>
  );
}
