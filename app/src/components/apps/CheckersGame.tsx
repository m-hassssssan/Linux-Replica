import { useState } from 'react';

type Piece = null | 'B' | 'R' | 'BK' | 'RK';

const INITIAL: Piece[][] = [
  [null, 'B', null, 'B', null, 'B', null, 'B'],
  ['B', null, 'B', null, 'B', null, 'B', null],
  [null, 'B', null, 'B', null, 'B', null, 'B'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['R', null, 'R', null, 'R', null, 'R', null],
  [null, 'R', null, 'R', null, 'R', null, 'R'],
  ['R', null, 'R', null, 'R', null, 'R', null],
];

export default function CheckersGame() {
  const [board, setBoard] = useState<Piece[][]>(INITIAL.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'B' | 'R'>('R');
  const [message, setMessage] = useState("Red's turn");

  const isValid = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  const getMoves = (r: number, c: number): [number, number][] => {
    const p = board[r][c];
    if (!p) return [];
    const moves: [number, number][] = [];
    const dirs = p === 'B' || p === 'BK' ? [[1, -1], [1, 1]] : [];
    const redDirs = p === 'R' || p === 'RK' ? [[-1, -1], [-1, 1]] : [];
    const allDirs = [...dirs, ...redDirs];
    for (const [dr, dc] of allDirs) {
      const nr = r + dr, nc = c + dc;
      if (isValid(nr, nc) && !board[nr][nc]) moves.push([nr, nc]);
      // Jump
      const jr = r + dr * 2, jc = c + dc * 2;
      if (isValid(jr, jc) && !board[jr][jc] && board[nr][nc] && !board[nr][nc]?.startsWith(p.charAt(0)))
        moves.push([jr, jc]);
    }
    return moves;
  };

  const handleClick = (r: number, c: number) => {
    if (selected) {
      const [sr, sc] = selected;
      const moves = getMoves(sr, sc);
      if (moves.some(([mr, mc]) => mr === r && mc === c)) {
        const b = board.map(row => [...row]);
        const piece = b[sr][sc];
        b[r][c] = piece;
        b[sr][sc] = null;
        // Remove jumped piece
        if (Math.abs(r - sr) === 2) {
          const jr = (r + sr) / 2, jc = (c + sc) / 2;
          b[jr][jc] = null;
        }
        // King me
        if (piece === 'B' && r === 7) b[r][c] = 'BK';
        if (piece === 'R' && r === 0) b[r][c] = 'RK';
        setBoard(b);
        setTurn(t => t === 'B' ? 'R' : 'B');
        setMessage(`${turn === 'B' ? "Red" : "Black"}'s turn`);
      }
      setSelected(null);
      return;
    }
    const p = board[r][c];
    if (p && p.startsWith(turn)) {
      setSelected([r, c]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="text-xs text-white/50 mb-3">{message}</div>
      <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden border border-white/10">
        {board.map((row, r) => row.map((cell, c) => {
          const dark = (r + c) % 2 === 1;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          return (
            <button key={`${r}-${c}`} onClick={() => dark && handleClick(r, c)}
              className={`w-10 h-10 flex items-center justify-center transition-all
                ${dark ? 'bg-white/5' : 'bg-white/[0.02]'} ${isSelected ? 'ring-2 ring-[#00d4ff]' : ''}`}>
              {cell?.startsWith('B') && <div className={`w-7 h-7 rounded-full ${cell === 'BK' ? 'bg-gray-400 ring-2 ring-yellow-400' : 'bg-gray-500'}`} />}
              {cell?.startsWith('R') && <div className={`w-7 h-7 rounded-full ${cell === 'RK' ? 'bg-red-400 ring-2 ring-yellow-400' : 'bg-red-500'}`} />}
            </button>
          );
        }))}
      </div>
      <button onClick={() => { setBoard(INITIAL.map(r => [...r])); setTurn('R'); setSelected(null); setMessage("Red's turn"); }}
        className="mt-3 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">New Game</button>
    </div>
  );
}
