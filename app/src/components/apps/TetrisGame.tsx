import { useState, useEffect, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 24;

const SHAPES = [
  { shape: [[1,1,1,1]], color: '#00d4ff' },
  { shape: [[1,1],[1,1]], color: '#ff007f' },
  { shape: [[0,1,0],[1,1,1]], color: '#4effa1' },
  { shape: [[1,1,0],[0,1,1]], color: '#ff9500' },
  { shape: [[0,1,1],[1,1,0]], color: '#a855f7' },
  { shape: [[1,0,0],[1,1,1]], color: '#3b82f6' },
  { shape: [[0,0,1],[1,1,1]], color: '#ef4444' },
];

function createPiece() {
  const t = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return { shape: t.shape.map(r => [...r]), color: t.color, x: 3, y: 0 };
}

function rotate(shape: number[][]) {
  const N = shape.length;
  const M = shape[0].length;
  return Array.from({ length: M }, (_, i) => Array.from({ length: N }, (_, j) => shape[N - 1 - j][i]));
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<number[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(createPiece);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lines, setLines] = useState(0);
  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  boardRef.current = board;
  pieceRef.current = piece;

  const isValid = (p: typeof piece, b = boardRef.current) => {
    for (let y = 0; y < p.shape.length; y++)
      for (let x = 0; x < p.shape[y].length; x++)
        if (p.shape[y][x]) {
          const nx = p.x + x, ny = p.y + y;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && b[ny][nx]) return false;
        }
    return true;
  };

  const lockPiece = () => {
    const b = boardRef.current.map(r => [...r]);
    const p = pieceRef.current;
    for (let y = 0; y < p.shape.length; y++)
      for (let x = 0; x < p.shape[y].length; x++)
        if (p.shape[y][x] && p.y + y >= 0) b[p.y + y][p.x + x] = 1;
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (b[y].every(c => c)) { b.splice(y, 1); b.unshift(Array(COLS).fill(0)); cleared++; y++; }
    }
    setBoard(b);
    boardRef.current = b;
    setScore(s => s + cleared * 100);
    setLines(l => l + cleared);
    const np = createPiece();
    if (!isValid(np, b)) setGameOver(true);
    else { setPiece(np); pieceRef.current = np; }
  };

  const move = (dx: number, dy: number) => {
    const np = { ...pieceRef.current, x: pieceRef.current.x + dx, y: pieceRef.current.y + dy };
    if (isValid(np)) { setPiece(np); pieceRef.current = np; return true; }
    return false;
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') {
        const np = { ...pieceRef.current, shape: rotate(pieceRef.current.shape) };
        if (isValid(np)) { setPiece(np); pieceRef.current = np; }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const iv = setInterval(() => { if (!move(0, 1)) lockPiece(); }, 500);
    return () => clearInterval(iv);
  }, [gameOver]);

  // Draw
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    c.width = COLS * CELL;
    c.height = ROWS * CELL;
    ctx.fillStyle = '#0d0d12';
    ctx.fillRect(0, 0, c.width, c.height);

    // Board
    board.forEach((row, y) => row.forEach((cell, x) => {
      if (cell) { ctx.fillStyle = '#1a1a3e'; ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1); }
    }));

    // Piece
    piece.shape.forEach((row, y) => row.forEach((cell, x) => {
      if (cell) { ctx.fillStyle = piece.color; ctx.fillRect((piece.x + x) * CELL, (piece.y + y) * CELL, CELL - 1, CELL - 1); }
    }));

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i <= COLS; i++) { ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, c.height); ctx.stroke(); }
    for (let i = 0; i <= ROWS; i++) { ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(c.width, i * CELL); ctx.stroke(); }
  }, [board, piece]);

  const reset = () => {
    const b = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    setBoard(b); boardRef.current = b;
    const p = createPiece(); setPiece(p); pieceRef.current = p;
    setGameOver(false); setScore(0); setLines(0);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-2">
        <span className="text-xs text-white/50">Score: <span className="text-[#00d4ff] font-mono">{score}</span></span>
        <span className="text-xs text-white/50">Lines: <span className="text-[#4effa1] font-mono">{lines}</span></span>
      </div>
      <canvas ref={canvasRef} className="rounded-lg border border-white/5" />
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-white font-bold mb-1">Game Over</div>
            <div className="text-sm text-[#00d4ff] mb-3">Score: {score}</div>
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
          </div>
        </div>
      )}
      {!gameOver && <div className="text-[10px] text-white/20 mt-1">Arrow keys to move/rotate</div>}
    </div>
  );
}
