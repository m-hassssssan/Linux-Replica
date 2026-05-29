import { useState } from 'react';
import * as Icons from 'lucide-react';

const FTP_FILES = [
  { name: 'public_html', type: 'dir', size: '-', date: '2026-05-10 14:22' },
  { name: 'logs', type: 'dir', size: '-', date: '2026-05-10 14:22' },
  { name: 'backup', type: 'dir', size: '-', date: '2026-05-08 09:15' },
  { name: 'index.html', type: 'file', size: '4.2 KB', date: '2026-05-15 08:30' },
  { name: 'style.css', type: 'file', size: '12.1 KB', date: '2026-05-14 16:45' },
  { name: 'app.js', type: 'file', size: '28.5 KB', date: '2026-05-15 10:22' },
  { name: 'config.json', type: 'file', size: '1.8 KB', date: '2026-05-13 11:00' },
  { name: 'README.md', type: 'file', size: '3.4 KB', date: '2026-05-12 09:30' },
];

export default function FTPClient() {
  const [connected, setConnected] = useState(true);
  const [server, setServer] = useState('ftp.strata.dev');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Connection bar */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-white/5 bg-[#1a1a2e]/50">
        <input value={server} onChange={e => setServer(e.target.value)}
          className="flex-1 h-7 px-2 rounded bg-white/5 border border-white/10 text-xs text-white outline-none max-w-48" />
        <button onClick={() => setConnected(!connected)}
          className={`h-7 px-3 rounded text-xs font-medium transition-all
            ${connected ? 'bg-green-500/20 text-green-400' : 'bg-[#00d4ff]/20 text-[#00d4ff]'}`}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
        {connected && <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] text-green-400">Connected</span></div>}
      </div>

      {connected ? (
        <>
          <div className="h-8 flex items-center px-3 text-[10px] text-white/30 border-b border-white/5">
            <span className="flex-[2]">Name</span>
            <span className="flex-1">Size</span>
            <span className="flex-1">Modified</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {FTP_FILES.map(f => (
              <div key={f.name} onClick={() => setSelected(f.name)}
                className={`flex items-center px-3 py-2 border-b border-white/3 cursor-pointer transition-all
                  ${selected === f.name ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                <div className="flex-[2] flex items-center gap-2">
                  {f.type === 'dir' ? <Icons.Folder className="w-4 h-4 text-yellow-400/70" /> : <Icons.File className="w-4 h-4 text-white/40" />}
                  <span className="text-xs text-white/70">{f.name}</span>
                </div>
                <span className="flex-1 text-xs text-white/40">{f.size}</span>
                <span className="flex-1 text-[10px] text-white/30">{f.date}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/20">
          <div className="text-center">
            <Icons.HardDrive className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm">Not connected</span>
          </div>
        </div>
      )}
    </div>
  );
}
