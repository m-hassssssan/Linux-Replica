import { useState } from 'react';

type CalculatorMode = 'standard' | 'scientific';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [history, setHistory] = useState<string[]>([]);

  const handleNum = (num: string) => {
    if (fresh) {
      setDisplay(num);
      setFresh(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (operation: string) => {
    setPrev(display);
    setOp(operation);
    setFresh(true);
  };

  const handleEquals = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev);
    const b = parseFloat(display);
    let result = 0;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? NaN : a / b; break;
      case '^': result = Math.pow(a, b); break;
      case '%': result = a % b; break;
    }
    const resStr = isNaN(result) ? 'Error' : String(Number(result.toFixed(8)));
    setHistory(prev => [`${a} ${op} ${b} = ${resStr}`, ...prev].slice(0, 10));
    setDisplay(resStr);
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
  };

  const handleSci = (fn: string) => {
    const val = parseFloat(display);
    let result = 0;
    switch (fn) {
      case 'sin': result = Math.sin(val); break;
      case 'cos': result = Math.cos(val); break;
      case 'tan': result = Math.tan(val); break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'square': result = val * val; break;
      case '1/x': result = 1 / val; break;
      case '!':
        let f = 1;
        for (let i = 2; i <= Math.floor(val); i++) f *= i;
        result = f;
        break;
      case 'pi': setDisplay(String(Math.PI)); setFresh(true); return;
      case 'e': setDisplay(String(Math.E)); setFresh(true); return;
    }
    setDisplay(String(Number(result.toFixed(8))));
    setFresh(true);
  };

  const btn = (label: string, onClick: () => void, className = '', colSpan = 1) => (
    <button
      className={`h-11 rounded-lg font-medium text-sm transition-all active:scale-95 ${className}`}
      style={{ gridColumn: `span ${colSpan}` }}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-3">
      {/* Display */}
      <div className="mb-3">
        <div className="bg-[#1a1a2e] rounded-xl p-3 border border-white/5">
          <div className="text-right text-xs text-white/30 h-4">{op ? `${prev} ${op}` : ''}</div>
          <div className="text-right text-2xl text-white font-mono truncate">{display}</div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-2">
        <button
          className={`flex-1 h-7 rounded-lg text-[10px] font-medium transition-all
            ${mode === 'standard' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          onClick={() => setMode('standard')}
        >
          Standard
        </button>
        <button
          className={`flex-1 h-7 rounded-lg text-[10px] font-medium transition-all
            ${mode === 'scientific' ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          onClick={() => setMode('scientific')}
        >
          Scientific
        </button>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 content-start">
        {mode === 'scientific' && (
          <>
            {btn('sin', () => handleSci('sin'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('cos', () => handleSci('cos'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('tan', () => handleSci('tan'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('ln', () => handleSci('ln'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('log', () => handleSci('log'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('x²', () => handleSci('square'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('√', () => handleSci('sqrt'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('1/x', () => handleSci('1/x'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('π', () => handleSci('pi'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('e', () => handleSci('e'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('x!', () => handleSci('!'), 'bg-white/5 text-[#00d4ff] text-xs')}
            {btn('x^y', () => handleOp('^'), 'bg-white/5 text-[#00d4ff] text-xs')}
          </>
        )}
        {btn('C', handleClear, 'bg-red-500/20 text-red-400')}
        {btn('(', () => handleNum('('), 'bg-white/5 text-white/60')}
        {btn(')', () => handleNum(')'), 'bg-white/5 text-white/60')}
        {btn('÷', () => handleOp('/'), 'bg-[#00d4ff]/20 text-[#00d4ff]')}
        {btn('7', () => handleNum('7'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('8', () => handleNum('8'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('9', () => handleNum('9'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('×', () => handleOp('*'), 'bg-[#00d4ff]/20 text-[#00d4ff]')}
        {btn('4', () => handleNum('4'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('5', () => handleNum('5'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('6', () => handleNum('6'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('-', () => handleOp('-'), 'bg-[#00d4ff]/20 text-[#00d4ff]')}
        {btn('1', () => handleNum('1'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('2', () => handleNum('2'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('3', () => handleNum('3'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('+', () => handleOp('+'), 'bg-[#00d4ff]/20 text-[#00d4ff]')}
        {btn('0', () => handleNum('0'), 'bg-white/5 text-white hover:bg-white/10', 2)}
        {btn('.', () => handleNum('.'), 'bg-white/5 text-white hover:bg-white/10')}
        {btn('=', handleEquals, 'bg-[#00d4ff] text-black font-bold')}
      </div>

      {/* Mini History */}
      {history.length > 0 && (
        <div className="mt-2 max-h-16 overflow-y-auto border-t border-white/5 pt-2">
          {history.slice(0, 3).map((h, i) => (
            <div key={i} className="text-[10px] text-white/30 font-mono">{h}</div>
          ))}
        </div>
      )}
    </div>
  );
}
