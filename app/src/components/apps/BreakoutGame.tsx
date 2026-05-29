import { useState, useEffect, useRef, useCallback } from 'react';

const COLS = 8;
const ROWS = 5;
const BRICK_W = 75;
const BRICK_H = 20;
const PAD_W = 100;
const PAD_H = 10;
const BALL_R = 6;

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({
    paddle: { x: 300 },
    ball: { x: 350, y: 350, dx: 3, dy: -3 },
    bricks: Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => ({ x: c * (BRICK_W + 5) + 20, y: r * (BRICK_H + 5) + 40, alive: true, color: ['#ff007f', '#ff9500', '#00d4ff', '#4effa1', '#a855f7'][r] }))
    ).flat(),
  });

  const reset = useCallback(() => {
    stateRef.current = {
      paddle: { x: 300 },
      ball: { x: 350, y: 350, dx: 3 * (Math.random() > 0.5 ? 1 : -1), dy: -3 },
      bricks: Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => ({ x: c * (BRICK_W + 5) + 20, y: r * (BRICK_H + 5) + 40, alive: true, color: ['#ff007f', '#ff9500', '#00d4ff', '#4effa1', '#a855f7'][r] }))
      ).flat(),
    };
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.paddle.x = e.clientX - rect.left - PAD_W / 2;
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const iv = setInterval(() => {
      const s = stateRef.current;
      s.ball.x += s.ball.dx;
      s.ball.y += s.ball.dy;

      // Walls
      if (s.ball.x <= BALL_R || s.ball.x >= 700 - BALL_R) s.ball.dx *= -1;
      if (s.ball.y <= BALL_R) s.ball.dy *= -1;

      // Paddle
      if (s.ball.y >= 370 - BALL_R && s.ball.y <= 380 && s.ball.x >= s.paddle.x && s.ball.x <= s.paddle.x + PAD_W)
        s.ball.dy = -Math.abs(s.ball.dy);

      // Bottom
      if (s.ball.y > 400) {
        setLives(l => { if (l <= 1) { setGameOver(true); setRunning(false); } return l - 1; });
        s.ball = { x: 350, y: 350, dx: 3 * (Math.random() > 0.5 ? 1 : -1), dy: -3 };
        return;
      }

      // Bricks
      s.bricks.forEach(b => {
        if (!b.alive) return;
        if (s.ball.x >= b.x && s.ball.x <= b.x + BRICK_W && s.ball.y >= b.y && s.ball.y <= b.y + BRICK_H) {
          b.alive = false;
          s.ball.dy *= -1;
          setScore(sc => sc + 10);
        }
      });

      // Draw
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx) return;
      ctx.fillStyle = '#0d0d12'; ctx.fillRect(0, 0, 700, 400);
      s.bricks.forEach(b => { if (b.alive) { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H); } });
      ctx.fillStyle = '#00d4ff'; ctx.fillRect(s.paddle.x, 380, PAD_W, PAD_H);
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    }, 16);
    return () => clearInterval(iv);
  }, [running, gameOver]);

  const restart = () => { reset(); setScore(0); setLives(3); setGameOver(false); setRunning(true); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-2">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <span className="text-xs text-white/50">Lives: <span className="text-red-400 font-mono">{lives}</span></span>
        <button onClick={() => { if (!running && !gameOver) setRunning(true); }} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">{running ? 'Running' : 'Start'}</button>
      </div>
      <canvas ref={canvasRef} width={700} height={400} className="rounded-lg border border-white/5" />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-1">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-3">Score: {score}</div>
            <button onClick={restart} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
          </div>
        </div>
      )}
      <div className="text-[10px] text-white/20 mt-1">Move mouse to control paddle</div>
    </div>
  );
}
