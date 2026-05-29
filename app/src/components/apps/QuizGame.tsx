import { useState } from 'react';

const QUESTIONS = [
  { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Mark Language', 'Home Tool Markup Language'], correct: 0 },
  { q: 'Which language runs in a web browser?', options: ['Java', 'C', 'Python', 'JavaScript'], correct: 3 },
  { q: 'What does CSS stand for?', options: ['Central Style Sheets', 'Cascading Style Sheets', 'Cascading Simple Sheets', 'Cars SUVs Sailboats'], correct: 1 },
  { q: 'What year was JavaScript created?', options: ['1995', '1990', '2000', '1985'], correct: 0 },
  { q: 'What does DOM stand for?', options: ['Digital Object Model', 'Document Object Model', 'Desktop Object Mode', 'Data Object Manager'], correct: 1 },
  { q: 'Which HTML tag is used for JavaScript?', options: ['<js>', '<script>', '<javascript>', '<code>'], correct: 1 },
  { q: 'What is React?', options: ['A database', 'A programming language', 'A JavaScript library', 'An operating system'], correct: 2 },
  { q: 'What does API stand for?', options: ['Application Programming Interface', 'Apple Pie Inside', 'Advanced Protocol Integration', 'Application Process Integration'], correct: 0 },
  { q: 'Which symbol is used for jQuery?', options: ['&', '%', '$', '#'], correct: 2 },
  { q: 'What is the result of 2 + "2" in JavaScript?', options: ['4', '22', 'NaN', 'Error'], correct: 1 },
];

export default function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];

  const answer = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setAnswered(false);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const reset = () => { setCurrent(0); setScore(0); setAnswered(false); setSelected(null); setFinished(false); };

  if (finished) {
    return (
      <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
        <div className="text-2xl text-white font-bold mb-2">Quiz Complete!</div>
        <div className="text-lg text-[#00d4ff] mb-1">{score} / {QUESTIONS.length}</div>
        <div className="text-sm text-white/40 mb-4">{score >= 8 ? 'Excellent!' : score >= 5 ? 'Good job!' : 'Keep learning!'}</div>
        <button onClick={reset} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">Play Again</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] items-center justify-center p-4">
      <div className="text-xs text-white/30 mb-1">Question {current + 1} of {QUESTIONS.length}</div>
      <div className="w-full max-w-sm bg-[#1a1a2e] rounded-xl border border-white/5 p-4 mb-4">
        <div className="text-sm text-white font-medium mb-4">{q.q}</div>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => answer(i)} disabled={answered}
              className={`w-full text-left p-3 rounded-lg text-xs transition-all
                ${answered ? (i === q.correct ? 'bg-green-500/20 text-green-400' : i === selected ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40') :
                  'bg-white/5 hover:bg-white/10 text-white/70'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      {answered && (
        <button onClick={next} className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">
          {current < QUESTIONS.length - 1 ? 'Next' : 'Finish'}
        </button>
      )}
    </div>
  );
}
