import { useState } from 'react';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
  const deck = SUITS.flatMap(s => RANKS.map(r => ({ rank: r, suit: s, red: s === '♥' || s === '♦' })));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}

export default function SolitaireGame() {
  const [deck] = useState(createDeck);
  const [waste, setWaste] = useState<typeof deck>([]);
  const [tableau] = useState(() => {
    const t: (typeof deck)[] = [];
    let idx = 0;
    for (let i = 0; i < 7; i++) { t.push(deck.slice(idx, idx + i + 1).map((c, j) => ({ ...c, faceUp: j === i }))); idx += i + 1; }
    return t;
  });
  

  const draw = () => {
    if (waste.length < deck.length - 28) setWaste(prev => [...prev, deck[28 + prev.length]]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1a3a1a] p-4">
      {/* Top row */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={draw} className="w-14 h-20 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <span className="text-white/30 text-lg">🂠</span>
        </button>
        <div className="w-14 h-20 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
          {waste.length > 0 && <span className={`text-lg font-bold ${waste[waste.length - 1].red ? 'text-red-600' : 'text-black'}`}>{waste[waste.length - 1].rank}{waste[waste.length - 1].suit}</span>}
        </div>
        <div className="flex-1" />
        {SUITS.map(s => (
          <div key={s} className="w-14 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-2xl text-white/20">{s}</span>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex gap-2 flex-1">
        {tableau.map((col, ci) => (
          <div key={ci} className="flex-1">
            {col.map((card, ri) => (
              <div key={ri}
                className={`w-14 h-5 rounded-t-lg border border-gray-300 flex items-center justify-center text-[10px] font-bold -mt-3 first:mt-0
                  ${(card as any).faceUp ? 'bg-white ' + (card.red ? 'text-red-600' : 'text-black') : 'bg-blue-800 border-blue-900'}`}
                style={{ height: ri === col.length - 1 ? '80px' : '20px' }}>
                {(card as any).faceUp ? `${card.rank}${card.suit}` : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
