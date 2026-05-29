import { useState } from 'react';

const WORDS = ['STRATA', 'LINUX', 'WINDOW', 'DESKTOP', 'BROWSER', 'TERMINAL', 'CODE', 'SYSTEM', 'KERNEL', 'PYTHON', 'REACT', 'SERVER', 'MEMORY', 'PROCESS', 'NETWORK'];

export default function HangmanGame() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const maxWrong = 6;

  const guess = (ch: string) => {
    if (gameOver || guessed.has(ch)) return;
    const g = new Set(guessed); g.add(ch);
    setGuessed(g);
    if (!word.includes(ch)) {
      const nw = wrong + 1;
      setWrong(nw);
      if (nw >= maxWrong) setGameOver(true);
    } else if (word.split('').every(c => g.has(c))) {
      setGameOver(true);
    }
  };

  const reset = () => { setWord(WORDS[Math.floor(Math.random() * WORDS.length)]); setGuessed(new Set()); setWrong(0); setGameOver(false); };

  const won = word.split('').every(c => guessed.has(c));

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      {/* Hangman figure */}
      <svg className="w-32 h-40 mb-4" viewBox="0 0 100 120">
        <line x1="10" y1="110" x2="90" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="30" y1="110" x2="30" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="30" y1="10" x2="70" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="70" y1="10" x2="70" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        {wrong >= 1 && <circle cx="70" cy="35" r="10" stroke="#ff007f" strokeWidth="2" fill="none" />}
        {wrong >= 2 && <line x1="70" y1="45" x2="70" y2="80" stroke="#ff007f" strokeWidth="2" />}
        {wrong >= 3 && <line x1="70" y1="55" x2="50" y2="65" stroke="#ff007f" strokeWidth="2" />}
        {wrong >= 4 && <line x1="70" y1="55" x2="90" y2="65" stroke="#ff007f" strokeWidth="2" />}
        {wrong >= 5 && <line x1="70" y1="80" x2="55" y2="100" stroke="#ff007f" strokeWidth="2" />}
        {wrong >= 6 && <line x1="70" y1="80" x2="85" y2="100" stroke="#ff007f" strokeWidth="2" />}
      </svg>

      <div className="text-xs text-white/30 mb-2">{wrong}/{maxWrong} wrong guesses</div>

      {/* Word */}
      <div className="flex gap-2 mb-4">
        {word.split('').map((ch, i) => (
          <div key={i} className="w-10 h-12 border-b-2 border-white/20 flex items-center justify-center text-2xl font-bold text-white">
            {guessed.has(ch) ? ch : ''}
          </div>
        ))}
      </div>

      {gameOver && <div className={`text-sm font-bold mb-3 ${won ? 'text-[#4effa1]' : 'text-red-400'}`}>{won ? 'You won!' : `The word was: ${word}`}</div>}

      {/* Keyboard */}
      <div className="grid grid-cols-9 gap-1 max-w-[350px]">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(ch => {
          const isGuessed = guessed.has(ch);
          const isCorrect = word.includes(ch);
          return (
            <button key={ch} onClick={() => guess(ch)} disabled={isGuessed || gameOver}
              className={`w-8 h-8 rounded text-xs font-bold transition-all
                ${isGuessed ? (isCorrect ? 'bg-[#4effa1]/20 text-[#4effa1]' : 'bg-red-500/20 text-red-400') : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
              {ch}
            </button>
          );
        })}
      </div>

      <button onClick={reset} className="mt-4 px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">New Game</button>
    </div>
  );
}
