import { useState, useEffect, useRef, useCallback } from 'react';

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p: 0, ai: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const stateRef = useRef({
    ball: { x: 350, y: 200, dx: 4, dy: 3 },
    paddleP: { y: 150 },
    paddleAI: { y: 150 },
  });

  const reset = useCallback(() => {
    stateRef.current = {
      ball: { x: 350, y: 200, dx: 4 * (Math.random() > 0.5 ? 1 : -1), dy: 3 * (Math.random() > 0.5 ? 1 : -1) },
      paddleP: { y: 150 },
      paddleAI: { y: 150 },
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'ArrowUp') s.paddleP.y = Math.max(0, s.paddleP.y - 20);
      if (e.key === 'ArrowDown') s.paddleP.y = Math.min(320, s.paddleP.y + 20);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!gameRunning) return;
    const interval = setInterval(() => {
      const s = stateRef.current;
      s.ball.x += s.ball.dx;
      s.ball.y += s.ball.dy;

      // Bounce off top/bottom
      if (s.ball.y <= 0 || s.ball.y >= 390) s.ball.dy *= -1;

      // AI paddle
      const aiCenter = s.paddleAI.y + 40;
      if (aiCenter < s.ball.y - 10) s.paddleAI.y = Math.min(320, s.paddleAI.y + 3.5);
      if (aiCenter > s.ball.y + 10) s.paddleAI.y = Math.max(0, s.paddleAI.y - 3.5);

      // Paddle collisions
      if (s.ball.x <= 20 && s.ball.y >= s.paddleP.y && s.ball.y <= s.paddleP.y + 80) s.ball.dx = Math.abs(s.ball.dx) * 1.02;
      if (s.ball.x >= 670 && s.ball.y >= s.paddleAI.y && s.ball.y <= s.paddleAI.y + 80) s.ball.dx = -Math.abs(s.ball.dx) * 1.02;

      // Score
      if (s.ball.x < 0) { setScore(sc => ({ ...sc, ai: sc.ai + 1 })); reset(); }
      if (s.ball.x > 700) { setScore(sc => ({ ...sc, p: sc.p + 1 })); reset(); }

      // Draw
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#0d0d12'; ctx.fillRect(0, 0, 700, 400);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(350, 0); ctx.lineTo(350, 400); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#00d4ff'; ctx.fillRect(10, s.paddleP.y, 10, 80);
      ctx.fillStyle = '#ff007f'; ctx.fillRect(680, s.paddleAI.y, 10, 80);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2); ctx.fill();
    }, 16);
    return () => clearInterval(interval);
  }, [gameRunning, reset]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-8 mb-2">
        <span className="text-xs text-[#00d4ff]">You: {score.p}</span>
        <button onClick={() => { setGameRunning(!gameRunning); if (!gameRunning) reset(); }} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">
          {gameRunning ? 'Pause' : 'Start'}
        </button>
        <span className="text-xs text-[#ff007f]">AI: {score.ai}</span>
      </div>
      <canvas ref={canvasRef} width={700} height={400} className="rounded-lg border border-white/5" />
      <div className="text-[10px] text-white/20 mt-2">Arrow Up/Down to move</div>
    </div>
  );
}
