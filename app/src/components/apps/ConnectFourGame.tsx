import { useState } from 'react';

const ROWS = 6;
const COLS = 7;

export default function ConnectFourGame() {
  const [board, setBoard] = useState<(null | 'R' | 'Y')[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [current, setCurrent] = useState<'R' | 'Y'>('R');
  const [winner, setWinner] = useState<string | null>(null);

  const checkWin = (b: (null | 'R' | 'Y')[][], r: number, c: number) => {
    const p = b[r][c];
    if (!p) return false;
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr, dc] of dirs) {
      let count = 1;
      for (let d = 1; d < 4; d++) {
        const nr = r + dr * d, nc = c + dc * d;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === p) count++; else break;
      }
      for (let d = 1; d < 4; d++) {
        const nr = r - dr * d, nc = c - dc * d;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === p) count++; else break;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const drop = (col: number) => {
    if (winner) return;
    const b = board.map(r => [...r]);
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) if (!b[r][col]) { row = r; break; }
    if (row === -1) return;
    b[row][col] = current;
    setBoard(b);
    if (checkWin(b, row, col)) setWinner(current);
    else setCurrent(c => c === 'R' ? 'Y' : 'R');
  };

  const reset = () => { setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null))); setCurrent('R'); setWinner(null); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="text-xs text-white/50 mb-3">
        {winner ? <span className={winner === 'R' ? 'text-red-400 font-bold' : 'text-yellow-400 font-bold'}>Player {winner} wins!</span>
          : <span>Player <span className={current === 'R' ? 'text-red-400' : 'text-yellow-400'}>{current}</span>&apos;s turn</span>}
      </div>
      <div className="grid gap-1 p-3 bg-white/5 rounded-xl" style={{ gridTemplateColumns: `repeat(${COLS}, 40px)` }}>
        {Array.from({ length: COLS }, (_, c) => (
          <button key={c} onClick={() => drop(c)} className="h-6 rounded bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/20">▼</button>
        ))}
        {board.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center">
            {cell === 'R' ? <div className="w-8 h-8 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
              : cell === 'Y' ? <div className="w-8 h-8 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30" />
                : <div className="w-8 h-8 rounded-full bg-white/5" />}
          </div>
        )))}
      </div>
      <button onClick={reset} className="mt-3 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">New Game</button>
    </div>
  );
}
