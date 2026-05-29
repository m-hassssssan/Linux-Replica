import { useState, useEffect, useRef, useCallback } from 'react';

const GRAVITY = 0.4;
const JUMP = -6;
const PIPE_W = 60;
const GAP = 140;

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({
    bird: { y: 200, vy: 0 },
    pipes: [] as { x: number; topH: number; passed: boolean }[],
    frame: 0,
  });

  const jump = useCallback(() => {
    if (gameOver) return;
    if (!running) setRunning(true);
    stateRef.current.bird.vy = JUMP;
  }, [gameOver, running]);

  const reset = () => {
    stateRef.current = { bird: { y: 200, vy: 0 }, pipes: [], frame: 0 };
    setScore(0); setGameOver(false); setRunning(false);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [jump]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      const s = stateRef.current;
      s.bird.vy += GRAVITY;
      s.bird.y += s.bird.vy;
      s.frame++;

      // Add pipes
      if (s.frame % 100 === 0) {
        s.pipes.push({ x: 400, topH: 50 + Math.random() * 150, passed: false });
      }

      // Move pipes
      s.pipes.forEach(p => {
        p.x -= 2;
        if (!p.passed && p.x + PIPE_W < 80) { p.passed = true; setScore(sc => sc + 1); }
      });
      s.pipes = s.pipes.filter(p => p.x + PIPE_W > 0);

      // Collision
      const birdX = 80, birdR = 12;
      if (s.bird.y < 0 || s.bird.y > 480) { setGameOver(true); setRunning(false); return; }
      for (const p of s.pipes) {
        if (birdX + birdR > p.x && birdX - birdR < p.x + PIPE_W) {
          if (s.bird.y - birdR < p.topH || s.bird.y + birdR > p.topH + GAP) {
            setGameOver(true); setRunning(false); return;
          }
        }
      }

      // Draw
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      ctx.fillStyle = '#0d0d12'; ctx.fillRect(0, 0, 400, 500);
      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let i = 0; i < 20; i++) ctx.fillRect((i * 37 + s.frame * 0.5) % 400, (i * 53) % 500, 1, 1);
      // Pipes
      s.pipes.forEach(p => {
        ctx.fillStyle = '#4effa1'; ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillStyle = '#4effa1'; ctx.fillRect(p.x, p.topH + GAP, PIPE_W, 500 - p.topH - GAP);
        ctx.fillStyle = '#3dd88f'; ctx.fillRect(p.x, p.topH - 10, PIPE_W, 10);
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, 10);
      });
      // Bird
      ctx.fillStyle = '#ff007f'; ctx.beginPath(); ctx.arc(birdX, s.bird.y, birdR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(birdX + 4, s.bird.y - 3, 4, 0, Math.PI * 2); ctx.fill();
      // Score
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px monospace'; ctx.fillText(String(s.pipes.filter(p => p.passed).length), 190, 30);
    }, 16);
    return () => clearInterval(iv);
  }, [running]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-2">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">New Game</button>
      </div>
      <canvas ref={canvasRef} width={400} height={500} className="rounded-lg border border-white/5 cursor-pointer" onClick={jump} />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-1">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-3">Score: {score}</div>
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
          </div>
        </div>
      )}
      {!running && !gameOver && <div className="text-[10px] text-white/20 mt-1">Click or Space to start/jump</div>}
    </div>
  );
}
