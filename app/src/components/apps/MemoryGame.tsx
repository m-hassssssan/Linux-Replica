import { useState, useEffect } from 'react';

const ICONS = ['★', '♦', '♠', '♥', '♣', '◆', '●', '▲'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<{ icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const all = shuffle([...ICONS, ...ICONS]).map(icon => ({ icon, flipped: false, matched: false }));
    setCards(all);
  }, []);

  const handleClick = (i: number) => {
    if (cards[i].flipped || cards[i].matched || flipped.length >= 2) return;
    const c = cards.map(c => ({ ...c }));
    c[i].flipped = true;
    setCards(c);
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves(m => m + 1);
      if (c[nf[0]].icon === c[nf[1]].icon) {
        setTimeout(() => {
          setCards(prev => {
            const nc = prev.map(c => ({ ...c }));
            nc[nf[0]].matched = true;
            nc[nf[1]].matched = true;
            return nc;
          });
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const nc = prev.map(c => ({ ...c }));
            nc[nf[0]].flipped = false;
            nc[nf[1]].flipped = false;
            return nc;
          });
          setFlipped([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) setGameWon(true);
  }, [cards]);

  const reset = () => {
    const all = shuffle([...ICONS, ...ICONS]).map(icon => ({ icon, flipped: false, matched: false }));
    setCards(all); setFlipped([]); setMoves(0); setGameWon(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-4">
        <span className="text-xs text-white/50">Moves: <span className="text-[#00d4ff] font-mono">{moves}</span></span>
        <button onClick={reset} className="px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10">New Game</button>
      </div>
      {gameWon && <div className="text-sm text-[#4effa1] font-bold mb-2">You Won!</div>}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-300
              ${card.flipped || card.matched ? 'bg-[#00d4ff]/10 rotate-0' : 'bg-white/10 rotate-y-180'}
              ${card.matched ? 'ring-1 ring-[#4effa1] opacity-50' : ''}`}>
            {card.flipped || card.matched ? <span className={card.matched ? 'text-[#4effa1]' : 'text-[#00d4ff]'}>{card.icon}</span> : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
