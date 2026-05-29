import { useState, useEffect } from 'react';

const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

const SOLUTION = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

export default function SudokuGame() {
  const [grid, setGrid] = useState(() => PUZZLE.map(r => [...r]));
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [solved, setSolved] = useState(false);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());

  const isFixed = (r: number, c: number) => PUZZLE[r][c] !== 0;

  const checkConflicts = (g: number[][]) => {
    const cs = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === 0) continue;
        for (let i = 0; i < 9; i++) {
          if (i !== c && g[r][i] === g[r][c]) { cs.add(`${r},${c}`); cs.add(`${r},${i}`); }
          if (i !== r && g[i][c] === g[r][c]) { cs.add(`${r},${c}`); cs.add(`${i},${c}`); }
        }
        const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
        for (let dr = 0; dr < 3; dr++)
          for (let dc = 0; dc < 3; dc++) {
            const nr = br + dr, nc = bc + dc;
            if ((nr !== r || nc !== c) && g[nr][nc] === g[r][c]) { cs.add(`${r},${c}`); cs.add(`${nr},${nc}`); }
          }
      }
    }
    setConflicts(cs);
  };

  const setCell = (val: number) => {
    if (isFixed(selected.r, selected.c)) return;
    const g = grid.map(r => [...r]);
    g[selected.r][selected.c] = val;
    setGrid(g);
    checkConflicts(g);
    if (g.every((row, r) => row.every((v, c) => v === SOLUTION[r][c]))) setSolved(true);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') setCell(Number(e.key));
      if (e.key === 'Backspace' || e.key === '0' || e.key === 'Delete') setCell(0);
      if (e.key === 'ArrowUp') setSelected(s => ({ ...s, r: Math.max(0, s.r - 1) }));
      if (e.key === 'ArrowDown') setSelected(s => ({ ...s, r: Math.min(8, s.r + 1) }));
      if (e.key === 'ArrowLeft') setSelected(s => ({ ...s, c: Math.max(0, s.c - 1) }));
      if (e.key === 'ArrowRight') setSelected(s => ({ ...s, c: Math.min(8, s.c + 1) }));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selected]);

  const reset = () => { setGrid(PUZZLE.map(r => [...r])); setConflicts(new Set()); setSolved(false); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      {solved && <div className="text-sm text-[#4effa1] font-bold mb-2">Solved!</div>}
      <div className="grid grid-cols-9 gap-px bg-white/10 rounded-lg overflow-hidden mb-3" style={{ border: '2px solid rgba(255,255,255,0.1)' }}>
        {grid.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => setSelected({ r, c })}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium transition-all
              ${selected.r === r && selected.c === c ? 'bg-[#00d4ff]/20 ring-1 ring-[#00d4ff]' : ''}
              ${isFixed(r, c) ? 'bg-white/5 text-white/80' : 'bg-white/[0.02] text-[#00d4ff]'}
              ${conflicts.has(`${r},${c}`) ? 'text-red-400' : ''}
              ${(Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0 ? '' : 'bg-white/[0.03]'}`}>
            {cell || ''}
          </button>
        )))}
      </div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} onClick={() => setCell(n)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 transition-colors">
            {n}
          </button>
        ))}
        <button onClick={() => setCell(0)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-xs text-red-400 transition-colors">X</button>
      </div>
      <button onClick={reset} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">Reset</button>
    </div>
  );
}
