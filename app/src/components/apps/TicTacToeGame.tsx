import { useState, useEffect } from 'react';

export default function TicTacToeGame() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [wins, setWins] = useState({ x: 0, o: 0 });
  const [mode, setMode] = useState<'pvp' | 'ai'>('pvp');

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const checkWin = (b: (string | null)[]) => {
    for (const [a, c, d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    if (b.every(Boolean)) return 'draw';
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const b = [...board];
    b[i] = xIsNext ? 'X' : 'O';
    setBoard(b);
    const w = checkWin(b);
    if (w) { setWinner(w); if (w === 'X') setWins(p => ({ ...p, x: p.x + 1 })); if (w === 'O') setWins(p => ({ ...p, o: p.o + 1 })); }
    else setXIsNext(!xIsNext);
  };

  // AI
  useEffect(() => {
    if (mode !== 'ai' || xIsNext || winner) return;
    const timeout = setTimeout(() => {
      const empty = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
      if (empty.length === 0) return;
      // Try to win
      for (const i of empty) {
        const test = [...board]; test[i] = 'O';
        if (checkWin(test) === 'O') { handleClick(i); return; }
      }
      // Block
      for (const i of empty) {
        const test = [...board]; test[i] = 'X';
        if (checkWin(test) === 'X') { handleClick(i); return; }
      }
      // Center
      if (empty.includes(4)) { handleClick(4); return; }
      // Random
      handleClick(empty[Math.floor(Math.random() * empty.length)]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [board, xIsNext, winner, mode]);

  const reset = () => { setBoard(Array(9).fill(null)); setXIsNext(true); setWinner(null); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex gap-2 mb-4">
        {(['pvp', 'ai'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); reset(); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all
              ${mode === m ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
            {m === 'ai' ? 'vs AI' : '2 Players'}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-6 mb-3">
        <span className="text-xs text-white/50">X: <span className="text-[#00d4ff] font-mono">{wins.x}</span></span>
        <span className="text-xs text-white/50">O: <span className="text-[#ff007f] font-mono">{wins.o}</span></span>
      </div>
      <div className="text-xs text-white/40 mb-3">{winner ? (winner === 'draw' ? "It's a draw!" : `${winner} wins!`) : `${xIsNext ? 'X' : 'O'}'s turn`}</div>
      <div className="grid grid-cols-3 gap-1.5">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className="w-20 h-20 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-3xl font-bold transition-all">
            {cell === 'X' ? <span className="text-[#00d4ff]">X</span> : cell === 'O' ? <span className="text-[#ff007f]">O</span> : ''}
          </button>
        ))}
      </div>
      <button onClick={reset} className="mt-4 px-4 py-2 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">New Game</button>
    </div>
  );
}
