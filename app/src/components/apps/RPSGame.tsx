import { useState } from 'react';
import * as Icons from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';

const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

const ICONS: Record<Choice, any> = {
  rock: Icons.Circle,
  paper: Icons.FileText,
  scissors: Icons.Scissors,
};

function getWinner(p: Choice, a: Choice): 'win' | 'lose' | 'draw' {
  if (p === a) return 'draw';
  if ((p === 'rock' && a === 'scissors') || (p === 'paper' && a === 'rock') || (p === 'scissors' && a === 'paper')) return 'win';
  return 'lose';
}

export default function RPSGame() {
  const [player, setPlayer] = useState<Choice | null>(null);
  const [ai, setAi] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);

  const play = (choice: Choice) => {
    setPlayer(choice);
    const aiChoice = CHOICES[Math.floor(Math.random() * 3)];
    setAi(aiChoice);
    const r = getWinner(choice, aiChoice);
    if (r === 'win') { setResult('You win!'); setWins(w => w + 1); }
    else if (r === 'lose') { setResult('You lose!'); setLosses(l => l + 1); }
    else { setResult("It's a draw!"); setDraws(d => d + 1); }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="flex items-center gap-6 mb-6 text-xs text-white/50">
        <span>Wins: <span className="text-[#4effa1] font-mono">{wins}</span></span>
        <span>Draws: <span className="text-yellow-400 font-mono">{draws}</span></span>
        <span>Losses: <span className="text-red-400 font-mono">{losses}</span></span>
      </div>

      {/* Battle area */}
      <div className="flex items-center gap-8 mb-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center mb-2">
            {player && (() => { const I = ICONS[player]; return <I className="w-10 h-10 text-[#00d4ff]" />; })()}
          </div>
          <span className="text-xs text-white/40">You</span>
        </div>
        <span className="text-2xl text-white/20 font-bold">VS</span>
        <div className="text-center">
          <div className="w-20 h-20 rounded-xl bg-[#ff007f]/10 flex items-center justify-center mb-2">
            {ai && (() => { const I = ICONS[ai]; return <I className="w-10 h-10 text-[#ff007f]" />; })()}
          </div>
          <span className="text-xs text-white/40">AI</span>
        </div>
      </div>

      {result && <div className="text-sm font-bold mb-4 text-white">{result}</div>}

      {/* Choices */}
      <div className="flex gap-3">
        {CHOICES.map(c => {
          const I = ICONS[c];
          return (
            <button key={c} onClick={() => play(c)}
              className="w-20 h-20 rounded-xl bg-white/5 hover:bg-[#00d4ff]/10 border border-white/10 hover:border-[#00d4ff]/20
                flex flex-col items-center justify-center gap-1 transition-all active:scale-95">
              <I className="w-6 h-6 text-white/50" />
              <span className="text-[10px] text-white/40 capitalize">{c}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
