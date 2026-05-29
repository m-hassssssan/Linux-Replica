import { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  mem: number;
  status: 'running' | 'sleeping' | 'zombie';
}

const MOCK_PROCESSES: Process[] = [
  { pid: 1, name: 'init', user: 'root', cpu: 0.0, mem: 0.1, status: 'running' },
  { pid: 431, name: 'strata-desktop', user: 'user', cpu: 2.3, mem: 4.2, status: 'running' },
  { pid: 512, name: 'strata-wm', user: 'user', cpu: 1.1, mem: 2.8, status: 'running' },
  { pid: 608, name: 'chrome', user: 'user', cpu: 8.5, mem: 12.4, status: 'running' },
  { pid: 723, name: 'node', user: 'user', cpu: 15.2, mem: 8.1, status: 'running' },
  { pid: 834, name: 'python3', user: 'user', cpu: 3.7, mem: 5.6, status: 'running' },
  { pid: 901, name: 'ssh-agent', user: 'user', cpu: 0.1, mem: 0.4, status: 'sleeping' },
  { pid: 1023, name: 'dockerd', user: 'root', cpu: 4.2, mem: 6.8, status: 'running' },
  { pid: 1156, name: 'postgres', user: 'postgres', cpu: 1.8, mem: 3.2, status: 'running' },
  { pid: 1201, name: 'redis-server', user: 'redis', cpu: 0.5, mem: 1.2, status: 'running' },
  { pid: 1345, name: 'nginx', user: 'www-data', cpu: 0.3, mem: 0.8, status: 'sleeping' },
  { pid: 1456, name: 'strata-terminal', user: 'user', cpu: 0.8, mem: 1.5, status: 'running' },
  { pid: 1502, name: 'strata-browser', user: 'user', cpu: 5.4, mem: 9.3, status: 'running' },
  { pid: 1678, name: 'strata-music', user: 'user', cpu: 1.2, mem: 2.1, status: 'running' },
  { pid: 1789, name: 'systemd-journal', user: 'root', cpu: 0.2, mem: 0.6, status: 'running' },
];

export default function TaskManager() {
  const [processes, setProcesses] = useState<Process[]>(MOCK_PROCESSES);
  const [sortBy, setSortBy] = useState<keyof Process>('cpu');
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([20, 22, 18, 25, 21, 23, 19, 24, 22, 20]);
  const [memHistory, setMemHistory] = useState<number[]>([40, 42, 41, 43, 42, 44, 41, 43, 42, 40]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
        mem: Math.max(0.1, p.mem + (Math.random() - 0.5) * 0.5),
      })));
      setCpuHistory(prev => [...prev.slice(1), 15 + Math.random() * 15]);
      setMemHistory(prev => [...prev.slice(1), 38 + Math.random() * 10]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let result = processes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    result.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDesc ? bv - av : av - bv;
      }
      return sortDesc ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
    return result;
  }, [processes, search, sortBy, sortDesc]);

  const totalCpu = processes.reduce((s, p) => s + p.cpu, 0);
  const totalMem = processes.reduce((s, p) => s + p.mem, 0);

  const handleKill = (pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-3">
        <div className="bg-[#1a1a2e] rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">CPU Usage</span>
            <span className="text-lg text-[#00d4ff] font-mono">{totalCpu.toFixed(1)}%</span>
          </div>
          <svg className="w-full h-12" viewBox="0 0 100 30" preserveAspectRatio="none">
            <polyline
              fill="none" stroke="#00d4ff" strokeWidth="0.5"
              points={cpuHistory.map((v, i) => `${i * 10},${30 - v}`).join(' ')}
            />
            <polygon
              fill="rgba(0, 212, 255, 0.1)" stroke="none"
              points={`0,30 ${cpuHistory.map((v, i) => `${i * 10},${30 - v}`).join(' ')} 100,30`}
            />
          </svg>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Memory</span>
            <span className="text-lg text-[#4effa1] font-mono">{totalMem.toFixed(1)} GB</span>
          </div>
          <svg className="w-full h-12" viewBox="0 0 100 30" preserveAspectRatio="none">
            <polyline
              fill="none" stroke="#4effa1" strokeWidth="0.5"
              points={memHistory.map((v, i) => `${i * 10},${30 - v}`).join(' ')}
            />
            <polygon
              fill="rgba(78, 255, 161, 0.1)" stroke="none"
              points={`0,30 ${memHistory.map((v, i) => `${i * 10},${30 - v}`).join(' ')} 100,30`}
            />
          </svg>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text" placeholder="Search processes..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/5 border border-white/5 text-xs text-white
              placeholder:text-white/30 focus:outline-none focus:border-[#00d4ff]/30"
          />
        </div>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto px-3">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-white/40 border-b border-white/5">
              {[
                { key: 'pid' as const, label: 'PID' },
                { key: 'name' as const, label: 'Name' },
                { key: 'user' as const, label: 'User' },
                { key: 'cpu' as const, label: 'CPU %' },
                { key: 'mem' as const, label: 'MEM GB' },
                { key: 'status' as const, label: 'Status' },
              ].map(col => (
                <th key={col.key} className="text-left py-1.5 px-2 cursor-pointer hover:text-white/60"
                  onClick={() => { setSortBy(col.key); setSortDesc(!sortDesc); }}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.key && (
                      <Icons.ChevronDown className={`w-3 h-3 transition-transform ${sortDesc ? '' : 'rotate-180'}`} />
                    )}
                  </div>
                </th>
              ))}
              <th className="text-left py-1.5 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(proc => (
              <tr key={proc.pid}
                className={`text-xs border-b border-white/3 transition-colors
                  ${selectedPid === proc.pid ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onClick={() => setSelectedPid(proc.pid)}>
                <td className="py-1.5 px-2 text-white/60 font-mono">{proc.pid}</td>
                <td className="py-1.5 px-2 text-white/80">{proc.name}</td>
                <td className="py-1.5 px-2 text-white/50">{proc.user}</td>
                <td className="py-1.5 px-2 text-[#00d4ff] font-mono">{proc.cpu.toFixed(1)}</td>
                <td className="py-1.5 px-2 text-[#4effa1] font-mono">{proc.mem.toFixed(1)}</td>
                <td className="py-1.5 px-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                    ${proc.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {proc.status}
                  </span>
                </td>
                <td className="py-1.5 px-2">
                  <button
                    className="p-1 rounded hover:bg-red-500/20 transition-colors"
                    onClick={() => handleKill(proc.pid)}
                  >
                    <Icons.X className="w-3 h-3 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status */}
      <div className="h-7 flex items-center px-3 text-[10px] text-white/30 border-t border-white/5">
        {filtered.length} processes | CPU: {totalCpu.toFixed(1)}% | Mem: {totalMem.toFixed(1)} GB
      </div>
    </div>
  );
}
