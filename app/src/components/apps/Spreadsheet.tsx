import { useState, useCallback } from 'react';

const COLS = 10;
const ROWS = 15;
const COL_LABELS = 'ABCDEFGHIJ';

export default function Spreadsheet() {
  const [cells, setCells] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState({ row: 0, col: 0 });
  const [editValue, setEditValue] = useState('');
  // eslint-disable-next-line
  const [, setEditing] = useState(false);


  const getCellKey = (r: number, c: number) => `${COL_LABELS[c]}${r + 1}`;

  const evaluate = useCallback((val: string): string => {
    if (!val.startsWith('=')) return val;
    try {
      const expr = val.slice(1);
      // Handle SUM(range)
      if (expr.toUpperCase().startsWith('SUM(')) {
        const range = expr.slice(4, -1);
        const [start, end] = range.split(':');
        let sum = 0;
        const sc = COL_LABELS.indexOf(start[0]);
        const ec = COL_LABELS.indexOf(end[0]);
        const sr = parseInt(start.slice(1)) - 1;
        const er = parseInt(end.slice(1)) - 1;
        for (let r = sr; r <= er; r++) {
          for (let c = sc; c <= ec; c++) {
            const v = parseFloat(cells[getCellKey(r, c)] || '0');
            if (!isNaN(v)) sum += v;
          }
        }
        return String(sum);
      }
      // Simple math
      const sanitized = expr.replace(/[^0-9+\-*/.()\s]/g, '');
      return String(new Function('return ' + sanitized)());
    } catch {
      return '#ERROR';
    }
  }, [cells]);

  const handleCellClick = (r: number, c: number) => {
    setSelected({ row: r, col: c });
    setEditValue(cells[getCellKey(r, c)] || '');
    setEditing(true);
  };

  const handleEdit = (val: string) => {
    setEditValue(val);
    setCells(prev => ({ ...prev, [getCellKey(selected.row, selected.col)]: val }));
  };

  const displayValue = (r: number, c: number) => {
    const val = cells[getCellKey(r, c)] || '';
    if (val.startsWith('=')) {
      const result = evaluate(val);
      return result === '#ERROR' ? result : Number(result).toFixed(2).replace(/\.00$/, '');
    }
    return val;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Formula Bar */}
      <div className="h-8 flex items-center px-2 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <span className="text-[10px] text-white/40 w-10 text-center font-mono">
          {getCellKey(selected.row, selected.col)}
        </span>
        <div className="w-px h-4 bg-white/10" />
        <input
          value={editValue}
          onChange={e => handleEdit(e.target.value)}
          className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
          placeholder="=SUM(A1:A5) or enter value"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Header */}
          <div className="flex">
            <div className="w-10 h-7 bg-[#1a1a2e] border-r border-b border-white/5" />
            {Array.from({ length: COLS }, (_, c) => (
              <div key={c} className="w-20 h-7 bg-[#1a1a2e] border-r border-b border-white/5 flex items-center justify-center">
                <span className="text-[10px] text-white/40 font-mono">{COL_LABELS[c]}</span>
              </div>
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: ROWS }, (_, r) => (
            <div key={r} className="flex">
              <div className="w-10 h-7 bg-[#1a1a2e] border-r border-b border-white/5 flex items-center justify-center">
                <span className="text-[10px] text-white/40 font-mono">{r + 1}</span>
              </div>
              {Array.from({ length: COLS }, (_, c) => {
                const isSelected = selected.row === r && selected.col === c;
                return (
                  <div
                    key={c}
                    className={`w-20 h-7 border-r border-b border-white/5 flex items-center px-1 cursor-pointer
                      text-xs font-mono truncate transition-colors
                      ${isSelected ? 'bg-[#00d4ff]/15 ring-1 ring-[#00d4ff]/40 z-10' : 'hover:bg-white/5'}`}
                    onClick={() => handleCellClick(r, c)}
                  >
                    <span className="text-white/70">{displayValue(r, c)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
