import { useState, useEffect } from 'react';
import { useOSStore } from '@/hooks/useOSStore';
import Desktop from './Desktop';

const BIOS_LINES = [
  'BIOS DATE 05/15/2026 14:22:54 VER 2.1.0',
  'CPU: STRATA CORE i9 14900K @ 6.0GHz',
  ' Detecting primary master ... STRATA SSD 2TB',
  ' Detecting primary slave  ... None',
  ' Checking NVRAM ........................ OK',
  ' Initializing USB controllers .......... OK',
  ' Loading kernel strata-linux-6.8.0-generic',
  ' Mounting root filesystem .............. OK',
  ' Starting system services .............. OK',
  ' Loading desktop environment ...........',
];

export default function BootSequence() {
  const { state, dispatch } = useOSStore();
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (state.bootPhase === 'desktop') return;

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < BIOS_LINES.length) {
        setLines(prev => [...prev, BIOS_LINES[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setShowProgress(true);
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            dispatch({ type: 'SET_BOOT_PHASE', phase: 'desktop' });
          }, 600);
        }, 100);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [state.bootPhase, dispatch]);

  if (state.bootPhase === 'desktop') {
    return <Desktop />;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-start p-8 font-mono text-xs">
      <div className="text-green-400 space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">{line}</div>
        ))}
      </div>
      {showProgress && (
        <div className="mt-6 w-80">
          <div className="text-green-400 mb-2">Loading Strata OS...</div>
          <div className="w-full h-3 border border-green-400 p-0.5">
            <div
              className="h-full bg-green-400 transition-all duration-2000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
