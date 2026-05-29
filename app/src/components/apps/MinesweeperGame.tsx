import { useState, useCallback } from 'react';
import * as Icons from 'lucide-react';

const ROWS = 10;
const COLS = 10;
const MINES = 15;

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; adjacent: number };

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine) { board[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!board[r][c].mine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++)
            if (dr || dc) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].mine) count++;
            }
        board[r][c].adjacent = count;
      }
  return board;
}

export default function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const reveal = useCallback((r: number, c: number, b: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = b[r][c];
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr || dc) reveal(r + dr, c + dc, b);
    }
  }, []);

  const handleClick = (r: number, c: number) => {
    if (gameOver || won || board[r][c].flagged) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    if (b[r][c].mine) {
      b.forEach(row => row.forEach(c => { if (c.mine) c.revealed = true; }));
      setBoard(b);
      setGameOver(true);
      return;
    }
    reveal(r, c, b);
    setBoard(b);
    if (b.every(row => row.every(c => c.revealed || c.mine))) setWon(true);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].revealed) return;
    const b = board.map(row => row.map(cell => ({ ...cell })));
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  };

  const reset = () => { setBoard(createBoard()); setGameOver(false); setWon(false); };

  const unrevealed = board.reduce((s, r) => s + r.filter(c => !c.revealed && !c.mine).length, 0);
  const flags = MINES - board.reduce((s, r) => s + r.filter(c => c.flagged).length, 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-3">
        <span className="text-xs text-white/50">Mines: <span className="text-[#ff007f] font-mono">{flags}</span></span>
        <button onClick={reset} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
          <Icons.RefreshCw className="w-4 h-4 text-white/50" />
        </button>
        <span className="text-xs text-white/50">Cells: <span className="font-mono">{unrevealed}</span></span>
      </div>
      <div className="grid gap-px bg-white/5 rounded-lg overflow-hidden" style={{ gridTemplateColumns: `repeat(${COLS}, 30px)` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`}
            onClick={() => handleClick(r, c)}
            onContextMenu={e => handleRightClick(e, r, c)}
            className={`w-[30px] h-[30px] flex items-center justify-center text-xs font-bold transition-all
              ${cell.revealed ? (cell.mine ? 'bg-red-500/30 text-red-400' : 'bg-white/5 text-white/60') : 'bg-white/10 hover:bg-white/15'}
              ${cell.flagged ? 'text-[#ff007f]' : ''}`}>
            {cell.revealed ? (cell.mine ? <Icons.Bomb className="w-3.5 h-3.5" /> : cell.adjacent || '') : (cell.flagged ? <Icons.Flag className="w-3.5 h-3.5" /> : '')}
          </button>
        )))}
      </div>
      {(gameOver || won) && (
        <div className="mt-3 text-sm font-bold text-center">
          {won ? <span className="text-[#4effa1]">You Win!</span> : <span className="text-red-400">Game Over</span>}
        </div>
      )}
      <div className="text-[10px] text-white/20 mt-2">Left click to reveal, right click to flag</div>
    </div>
  );
}
