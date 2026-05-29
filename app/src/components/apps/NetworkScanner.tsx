import { useState } from 'react';
import * as Icons from 'lucide-react';

interface ScanResult {
  ip: string;
  hostname: string;
  status: 'open' | 'closed' | 'filtered';
  ports: { port: number; service: string; state: string }[];
  latency: number;
}

const MOCK_RESULTS: ScanResult[] = [
  { ip: '192.168.1.1', hostname: 'router.local', status: 'open', latency: 0.5, ports: [{ port: 80, service: 'HTTP', state: 'open' }, { port: 443, service: 'HTTPS', state: 'open' }, { port: 22, service: 'SSH', state: 'filtered' }] },
  { ip: '192.168.1.2', hostname: 'desktop-pc', status: 'open', latency: 1.2, ports: [{ port: 445, service: 'SMB', state: 'open' }, { port: 3389, service: 'RDP', state: 'closed' }] },
  { ip: '192.168.1.5', hostname: 'nas-server', status: 'open', latency: 0.8, ports: [{ port: 80, service: 'HTTP', state: 'open' }, { port: 21, service: 'FTP', state: 'open' }, { port: 22, service: 'SSH', state: 'open' }] },
  { ip: '192.168.1.10', hostname: 'printer', status: 'open', latency: 3.5, ports: [{ port: 9100, service: 'RAW', state: 'open' }] },
  { ip: '192.168.1.15', hostname: 'iot-device', status: 'open', latency: 5.2, ports: [{ port: 8080, service: 'HTTP-ALT', state: 'open' }] },
  { ip: '192.168.1.20', hostname: 'laptop', status: 'closed', latency: 0, ports: [] },
  { ip: '192.168.1.25', hostname: 'phone', status: 'open', latency: 2.1, ports: [{ port: 62078, service: 'LOCKDOWN', state: 'filtered' }] },
];

export default function NetworkScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);

  const startScan = () => {
    setScanning(true);
    setResults([]);
    setProgress(0);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= MOCK_RESULTS.length) {
        clearInterval(interval);
        setScanning(false);
        return;
      }
      setResults(prev => [...prev, MOCK_RESULTS[i]]);
      setProgress(Math.round(((i + 1) / MOCK_RESULTS.length) * 100));
      i++;
    }, 400);
  };

  const selected = results.find(r => r.ip === selectedIp);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 flex items-center text-xs text-white/50">
          192.168.1.0/24
        </div>
        <button onClick={startScan} disabled={scanning}
          className="h-9 px-4 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium disabled:opacity-50 hover:bg-[#00d4ff]/30 transition-colors">
          {scanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>

      {/* Progress */}
      {scanning && (
        <div className="mb-3">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#00d4ff] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[10px] text-white/30 mt-1">{progress}% complete</div>
        </div>
      )}

      {/* Results */}
      <div className="flex-1 flex overflow-hidden gap-3">
        <div className="flex-1 overflow-y-auto">
          {results.map(r => (
            <div key={r.ip} onClick={() => setSelectedIp(r.ip)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 cursor-pointer transition-all
                ${selectedIp === r.ip ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <div className={`w-2 h-2 rounded-full ${r.status === 'open' ? 'bg-green-400' : 'bg-red-400'}`} />
              <div className="flex-1">
                <div className="text-xs text-white/70">{r.hostname}</div>
                <div className="text-[10px] text-white/30 font-mono">{r.ip}</div>
              </div>
              <span className="text-[10px] text-white/30">{r.latency > 0 ? `${r.latency}ms` : '-'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40">{r.ports.length} ports</span>
            </div>
          ))}
          {results.length === 0 && !scanning && (
            <div className="flex flex-col items-center justify-center h-full text-white/20">
              <Icons.Scan className="w-10 h-10 mb-2" />
              <span className="text-xs">Click Start Scan to begin</span>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="w-48 border-l border-white/5 pl-3">
            <div className="text-xs text-white font-medium mb-2">{selected.hostname}</div>
            <div className="text-[10px] text-white/30 font-mono mb-3">{selected.ip}</div>
            <div className="text-[10px] text-white/30 mb-2">Open Ports</div>
            {selected.ports.map(p => (
              <div key={p.port} className="flex items-center justify-between py-1 border-b border-white/3">
                <span className="text-[10px] text-white/50 font-mono">{p.port}</span>
                <span className="text-[10px] text-white/30">{p.service}</span>
                <span className={`text-[9px] px-1 rounded ${p.state === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.state}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
