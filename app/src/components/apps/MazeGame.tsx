import { useState, useEffect, useRef } from 'react';

const W = 21;
const H = 15;

function generateMaze(): number[][] {
  const maze = Array.from({ length: H }, () => Array(W).fill(1));
  const stack: [number, number][] = [];
  const start: [number, number] = [1, 1];
  maze[start[1]][start[0]] = 0;
  stack.push(start);

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors: [number, number][] = [];
    if (y > 2 && maze[y - 2][x] === 1) neighbors.push([x, y - 2]);
    if (y < H - 3 && maze[y + 2][x] === 1) neighbors.push([x, y + 2]);
    if (x > 2 && maze[y][x - 2] === 1) neighbors.push([x - 2, y]);
    if (x < W - 3 && maze[y][x + 2] === 1) neighbors.push([x + 2, y]);

    if (neighbors.length === 0) { stack.pop(); continue; }
    const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
    maze[(y + ny) / 2][(x + nx) / 2] = 0;
    maze[ny][nx] = 0;
    stack.push([nx, ny]);
  }
  return maze;
}

export default function MazeGame() {
  const [maze, setMaze] = useState(() => generateMaze());
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [won, setWon] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CELL = 24;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (won) return;
      setPlayer(p => {
        let nx = p.x, ny = p.y;
        if (e.key === 'ArrowUp') ny--;
        if (e.key === 'ArrowDown') ny++;
        if (e.key === 'ArrowLeft') nx--;
        if (e.key === 'ArrowRight') nx++;
        if (ny >= 0 && ny < H && nx >= 0 && nx < W && maze[ny][nx] === 0) {
          if (nx === W - 2 && ny === H - 2) setWon(true);
          return { x: nx, y: ny };
        }
        return p;
      });
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [maze, won]);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    c.width = W * CELL;
    c.height = H * CELL;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        ctx.fillStyle = maze[y][x] === 1 ? '#1a1a3e' : '#0d0d12';
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    // Goal
    ctx.fillStyle = '#4effa1'; ctx.fillRect((W - 2) * CELL + 4, (H - 2) * CELL + 4, CELL - 8, CELL - 8);
    // Player
    ctx.fillStyle = '#00d4ff'; ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 10;
    ctx.fillRect(player.x * CELL + 4, player.y * CELL + 4, CELL - 8, CELL - 8);
    ctx.shadowBlur = 0;
  }, [maze, player]);

  const reset = () => { const m = generateMaze(); setMaze(m); setPlayer({ x: 1, y: 1 }); setWon(false); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      {won && <div className="text-sm text-[#4effa1] font-bold mb-2">You escaped the maze!</div>}
      <canvas ref={canvasRef} className="rounded-lg border border-white/5" />
      <div className="flex items-center gap-4 mt-3">
        <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">New Maze</button>
        <span className="text-[10px] text-white/20">Arrow keys to move</span>
      </div>
    </div>
  );
}
