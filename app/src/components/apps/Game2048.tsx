import { useState, useEffect, useCallback } from 'react';


function addRandom(board: (number | null)[]): (number | null)[] {
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
  if (empty.length === 0) return board;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  const b = [...board];
  b[idx] = Math.random() < 0.9 ? 2 : 4;
  return b;
}

function createBoard() {
  let b = Array(16).fill(null);
  b = addRandom(b);
  b = addRandom(b);
  return b;
}

function slideLine(line: (number | null)[]): (number | null)[] {
  const filtered = line.filter(v => v !== null) as number[];
  const result: (number | null)[] = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      result.push(filtered[i] * 2);
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while (result.length < 4) result.push(null);
  return result;
}

function getLine(_board: (number | null)[], row: number, col: number, dx: number, dy: number): number[] {
  const line: number[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = (row + i * dy) * 4 + (col + i * dx);
    line.push(idx);
  }
  return line;
}

function moveBoard(board: (number | null)[], dir: 'up' | 'down' | 'left' | 'right'): (number | null)[] {
  const b = [...board];
  const configs: { row: number; col: number; dx: number; dy: number; reverse: boolean }[] =
    dir === 'left' ? [{ row: 0, col: 0, dx: 1, dy: 0, reverse: false }] :
    dir === 'right' ? [{ row: 0, col: 0, dx: 1, dy: 0, reverse: true }] :
    dir === 'up' ? [{ row: 0, col: 0, dx: 0, dy: 1, reverse: false }] :
    [{ row: 0, col: 0, dx: 0, dy: 1, reverse: true }];

  for (let i = 0; i < 4; i++) {
    for (const cfg of configs) {
      const line = getLine(b, cfg.row + i * (cfg.dy ? 0 : 1), cfg.col + i * (cfg.dx ? 0 : 1), cfg.dx, cfg.dy);
      const values = line.map(idx => b[idx]);
      const processed = cfg.reverse ? slideLine(values.reverse()).reverse() : slideLine(values);
      line.forEach((idx, j) => { b[idx] = processed[j]; });
    }
  }
  return b;
}

const COLORS: Record<number, string> = {
  2: 'bg-white/10 text-white/80',
  4: 'bg-white/15 text-white/80',
  8: 'bg-orange-500/30 text-orange-300',
  16: 'bg-orange-500/40 text-orange-200',
  32: 'bg-red-500/30 text-red-300',
  64: 'bg-red-500/40 text-red-200',
  128: 'bg-yellow-500/30 text-yellow-300',
  256: 'bg-yellow-500/40 text-yellow-200',
  512: 'bg-green-500/30 text-green-300',
  1024: 'bg-green-500/40 text-green-200',
  2048: 'bg-[#00d4ff]/40 text-[#00d4ff]',
};

export default function Game2048() {
  const [board, setBoard] = useState<(number | null)[]>(createBoard);
  const [score, setScore] = useState(0);

  const move = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    setBoard(prev => {
      const next = moveBoard(prev, dir);
      if (JSON.stringify(next) !== JSON.stringify(prev)) {
        const withRandom = addRandom(next);
        const newScore = withRandom.reduce((s: number, v) => s + (v || 0), 0);
        setScore(() => newScore);
        return withRandom;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [move]);

  const reset = () => { setBoard(createBoard()); setScore(0); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-4">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">New Game</button>
      </div>
      <div className="grid grid-cols-4 gap-2 p-3 bg-white/5 rounded-xl">
        {board.map((val, i) => (
          <div key={i} className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold transition-all
            ${val ? (COLORS[val] || 'bg-[#00d4ff]/50 text-[#00d4ff]') : 'bg-white/3'}`}>
            {val || ''}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {(['up', 'left', 'down', 'right'] as const).map(d => (
          <button key={d} onClick={() => move(d)} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs flex items-center justify-center">
            {d === 'up' ? '▲' : d === 'down' ? '▼' : d === 'left' ? '◀' : '▶'}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-white/20 mt-2">Arrow keys or buttons to move</div>
    </div>
  );
}
