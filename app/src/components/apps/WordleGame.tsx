import { useState, useEffect } from 'react';

const WORDS = ['STRATA', 'LINUX', 'REACT', 'VITE', 'CODE', 'DESK', 'APP', 'WEB', 'OS', 'FILE', 'EDIT', 'VIEW', 'HELP', 'OPEN', 'SAVE', 'PLAY', 'GAME', 'NODE', 'JAVA', 'PYTHON'];

function getTarget() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function WordleGame() {
  const [target, setTarget] = useState(getTarget);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'Backspace') { setCurrent(c => c.slice(0, -1)); return; }
      if (e.key === 'Enter' && current.length === target.length) {
        const g = [...guesses, current.toUpperCase()];
        setGuesses(g);
        if (current.toUpperCase() === target) { setWon(true); setGameOver(true); }
        else if (g.length >= 6) setGameOver(true);
        setCurrent('');
        return;
      }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key) && current.length < target.length) {
        setCurrent(c => c + e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [current, gameOver, guesses, target]);

  const getColor = (guess: string, pos: number) => {
    const ch = guess[pos];
    if (target[pos] === ch) return 'bg-[#4effa1] text-black';
    if (target.includes(ch)) return 'bg-yellow-400 text-black';
    return 'bg-white/10 text-white/40';
  };

  const reset = () => { setTarget(getTarget()); setGuesses([]); setCurrent(''); setGameOver(false); setWon(false); };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="text-xs text-white/30 mb-1">Guess the {target.length}-letter word</div>
      <div className="text-xs text-white/20 mb-4">{guesses.length}/6 guesses</div>

      <div className="space-y-1.5">
        {guesses.map((g, i) => (
          <div key={i} className="flex gap-1.5">
            {g.split('').map((ch, j) => (
              <div key={j} className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${getColor(g, j)}`}>
                {ch}
              </div>
            ))}
          </div>
        ))}
        {!gameOver && (
          <div className="flex gap-1.5">
            {Array.from({ length: target.length }, (_, i) => (
              <div key={i} className="w-10 h-10 rounded-lg border-2 border-white/20 flex items-center justify-center text-lg font-bold text-white">
                {current[i] || ''}
              </div>
            ))}
          </div>
        )}
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          {won ? <div className="text-[#4effa1] font-bold mb-1">You got it!</div> : <div className="text-red-400 font-bold mb-1">The word was: {target}</div>}
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
        </div>
      )}

      {/* Keyboard */}
      <div className="mt-4 space-y-1">
        {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.split('').map(ch => {
              const used = guesses.some(g => g.includes(ch));
              const correct = guesses.some(g => g.split('').some((c, j) => c === ch && target[j] === ch));
              return (
                <button key={ch} onClick={() => { if (!gameOver && current.length < target.length) setCurrent(c => c + ch); }}
                  className={`w-7 h-8 rounded text-xs font-medium transition-colors
                    ${correct ? 'bg-[#4effa1] text-black' : used ? 'bg-white/10 text-white/40' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                  {ch}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
