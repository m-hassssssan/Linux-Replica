import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const CATEGORIES: Record<string, { name: string; units: Record<string, number> }> = {
  length: {
    name: 'Length',
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  },
  weight: {
    name: 'Weight',
    units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 },
  },
  temperature: {
    name: 'Temperature',
    units: { C: 1, F: 1, K: 1 },
  },
  volume: {
    name: 'Volume',
    units: { L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588 },
  },
  speed: {
    name: 'Speed',
    units: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444 },
  },
  data: {
    name: 'Data',
    units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  },
};

function convertTemp(val: number, from: string, to: string): number {
  let c = val;
  if (from === 'F') c = (val - 32) * 5 / 9;
  if (from === 'K') c = val - 273.15;
  if (to === 'F') return c * 9 / 5 + 32;
  if (to === 'K') return c + 273.15;
  return c;
}

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [value, setValue] = useState(1);

  const cat = CATEGORIES[category];
  const units = Object.keys(cat.units);

  useEffect(() => {
    setFrom(units[0]);
    setTo(units[1] || units[0]);
  }, [category]);

  const result = () => {
    if (category === 'temperature') return convertTemp(value, from, to);
    const fromBase = value * cat.units[from];
    return fromBase / cat.units[to];
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Category */}
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <button
            key={key}
            className={`py-2 rounded-lg text-[10px] font-medium transition-all
              ${category === key ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            onClick={() => setCategory(key)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4">
        {/* From */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40">From</span>
            <select value={from} onChange={e => setFrom(e.target.value)} className="bg-white/5 rounded px-2 py-1 text-xs text-white border-none outline-none">
              {units.map(u => <option key={u} value={u} className="bg-[#1a1a2e]">{u}</option>)}
            </select>
          </div>
          <input
            type="number" value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="w-full h-12 px-3 rounded-lg bg-white/5 border border-white/10 text-xl text-white font-mono
              outline-none focus:border-[#00d4ff]/30"
          />
        </div>

        {/* Swap */}
        <div className="flex justify-center my-2">
          <button
            onClick={() => { setFrom(to); setTo(from); }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Icons.ArrowDownUp className="w-4 h-4 text-[#00d4ff]" />
          </button>
        </div>

        {/* To */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-white/40">To</span>
            <select value={to} onChange={e => setTo(e.target.value)} className="bg-white/5 rounded px-2 py-1 text-xs text-white border-none outline-none">
              {units.map(u => <option key={u} value={u} className="bg-[#1a1a2e]">{u}</option>)}
            </select>
          </div>
          <div className="w-full h-12 px-3 rounded-lg bg-[#00d4ff]/5 border border-[#00d4ff]/20
            text-xl text-[#00d4ff] font-mono flex items-center">
            {Number(result().toFixed(6))}
          </div>
        </div>
      </div>
    </div>
  );
}
