import { useState } from 'react';

type Piece = string | null;

const INITIAL: Piece[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const PIECE_ICONS: Record<string, string> = {
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
};

export default function ChessGame() {
  const [board, setBoard] = useState<Piece[][]>(INITIAL.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [message, setMessage] = useState("White's turn");

  const isWhite = (p: Piece) => p && p === p.toUpperCase();
  const isBlack = (p: Piece) => p && p === p.toLowerCase();

  const getMoves = (r: number, c: number): [number, number][] => {
    const p = board[r][c];
    if (!p) return [];
    const white = isWhite(p);
    const piece = p.toLowerCase();
    const moves: [number, number][] = [];

    if (piece === 'p') {
      const dir = white ? -1 : 1;
      const start = white ? 6 : 1;
      if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) moves.push([r + dir, c]);
      if (r === start && !board[r + dir][c] && !board[r + dir * 2][c]) moves.push([r + dir * 2, c]);
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] && (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc]))) moves.push([nr, nc]);
      }
    } else if (piece === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) moves.push([nr, nc]);
      }
    } else if (piece === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])))) moves.push([nr, nc]);
      }
    } else if (piece === 'r' || piece === 'q') {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        for (let d = 1; d < 8; d++) {
          const nr = r + dr * d, nc = c + dc * d;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          if (!board[nr][nc]) moves.push([nr, nc]);
          else { if (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])) moves.push([nr, nc]); break; }
        }
      }
    }
    if (piece === 'b' || piece === 'q') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
        for (let d = 1; d < 8; d++) {
          const nr = r + dr * d, nc = c + dc * d;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          if (!board[nr][nc]) moves.push([nr, nc]);
          else { if (white ? isBlack(board[nr][nc]) : isWhite(board[nr][nc])) moves.push([nr, nc]); break; }
        }
      }
    }
    return moves;
  };

  const handleClick = (r: number, c: number) => {
    if (selected) {
      const [sr, sc] = selected;
      const moves = getMoves(sr, sc);
      if (moves.some(([mr, mc]) => mr === r && mc === c)) {
        const b = board.map(row => [...row]);
        b[r][c] = b[sr][sc];
        b[sr][sc] = null;
        setBoard(b);
        const next = turn === 'white' ? 'black' : 'white';
        setTurn(next);
        setMessage(`${next === 'white' ? "White" : "Black"}'s turn`);
      }
      setSelected(null);
      return;
    }
    const p = board[r][c];
    if (p && (turn === 'white' ? isWhite(p) : isBlack(p))) setSelected([r, c]);
  };

  const moves = selected ? getMoves(selected[0], selected[1]) : [];

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="text-xs text-white/50 mb-2">{message}</div>
      <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden border-2 border-white/10 shadow-xl">
        {board.map((row, r) => row.map((cell, c) => {
          const dark = (r + c) % 2 === 1;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)}
              className={`w-11 h-11 flex items-center justify-center text-xl transition-all
                ${dark ? 'bg-[#769656]' : 'bg-[#eeeed2]'}
                ${isSelected ? 'ring-2 ring-[#00d4ff] z-10' : ''}
                ${isMove ? 'bg-[#00d4ff]/40' : ''}`}>
              {cell && <span className={isWhite(cell) ? 'text-white drop-shadow-md' : 'text-black drop-shadow-md'}>{PIECE_ICONS[cell]}</span>}
            </button>
          );
        }))}
      </div>
      <button onClick={() => { setBoard(INITIAL.map(r => [...r])); setTurn('white'); setSelected(null); setMessage("White's turn"); }}
        className="mt-3 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs hover:bg-white/10">New Game</button>
    </div>
  );
}
