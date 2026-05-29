import { useState, useEffect, useRef } from 'react';

const GRID = 20;
const CELL = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snake_hs') || '0'));
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  dirRef.current = dir;
  snakeRef.current = snake;

  const reset = () => {
    const s = [{ x: 10, y: 10 }];
    setSnake(s);
    snakeRef.current = s;
    setFood({ x: 5 + Math.floor(Math.random() * 10), y: 5 + Math.floor(Math.random() * 10) });
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (['ArrowUp', 'w', 'W'].includes(e.key) && d.y === 0) setDir({ x: 0, y: -1 });
      if (['ArrowDown', 's', 'S'].includes(e.key) && d.y === 0) setDir({ x: 0, y: 1 });
      if (['ArrowLeft', 'a', 'A'].includes(e.key) && d.x === 0) setDir({ x: -1, y: 0 });
      if (['ArrowRight', 'd', 'D'].includes(e.key) && d.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const s = snakeRef.current;
      const d = dirRef.current;
      const head = { x: s[0].x + d.x, y: s[0].y + d.y };
      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || s.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        setScore(sc => {
          if (sc > highScore) { setHighScore(sc); localStorage.setItem('snake_hs', String(sc)); }
          return sc;
        });
        return;
      }
      const newSnake = [head, ...s];
      setFood(f => {
        if (head.x === f.x && head.y === f.y) {
          setScore(sc => sc + 10);
          setSpeed(sp => Math.max(60, sp - 3));
          let nf: { x: number; y: number };
          do { nf = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
          } while (newSnake.some(seg => seg.x === nf.x && seg.y === nf.y));
          return nf;
        }
        newSnake.pop();
        return f;
      });
      setSnake(newSnake);
      snakeRef.current = newSnake;
    }, speed);
    return () => clearInterval(interval);
  }, [gameOver, speed, highScore]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = GRID * CELL;
    canvas.height = GRID * CELL;
    ctx.fillStyle = '#0d0d12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff007f';
    ctx.shadowColor = '#ff007f'; ctx.shadowBlur = 10;
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#00d4ff' : '#00d4ff80';
      ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = i === 0 ? 8 : 0;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-[400px] mb-2">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <span className="text-xs text-white/30">Best: <span className="font-mono">{highScore}</span></span>
      </div>
      <canvas ref={canvasRef} className="rounded-lg border border-white/5 shadow-lg" />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-1">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-3">Score: {score}</div>
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs hover:bg-[#00d4ff]/30 transition-colors">Play Again</button>
          </div>
        </div>
      )}
      {!gameOver && snake.length === 1 && <div className="text-[10px] text-white/20 mt-2">Arrow keys or WASD to move</div>}
    </div>
  );
}
