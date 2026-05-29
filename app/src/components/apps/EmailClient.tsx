import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { EmailMessage } from '@/types/os';

const INBOX: EmailMessage[] = [
  { id: '1', from: 'team@strata.dev', to: 'user@strata.local', subject: 'Welcome to Strata OS 2.0', body: 'Welcome! We hope you enjoy the new features. Explore 50+ apps, customize your desktop, and discover what\'s possible.', date: '2026-05-15 09:00', read: false, starred: true },
  { id: '2', from: 'noreply@github.com', to: 'user@strata.local', subject: 'New pull request: Feature/os-update', body: 'A new pull request has been created. Please review the changes.', date: '2026-05-15 08:30', read: false, starred: false },
  { id: '3', from: 'newsletter@devweekly.com', to: 'user@strata.local', subject: 'DevWeekly: WebAssembly in 2026', body: 'This week we cover the latest WebAssembly developments, new browser APIs, and performance benchmarks.', date: '2026-05-14 14:00', read: true, starred: false },
  { id: '4', from: 'alice@example.com', to: 'user@strata.local', subject: 'Meeting notes from yesterday', body: 'Here are the notes from our standup meeting. Let me know if you have any questions.', date: '2026-05-14 10:00', read: true, starred: false },
  { id: '5', from: 'support@strata.dev', to: 'user@strata.local', subject: 'Your feedback is appreciated', body: 'Thank you for using Strata OS. We value your feedback and are constantly working to improve the experience.', date: '2026-05-13 16:00', read: true, starred: true },
];

export default function EmailClient() {
  const [emails, setEmails] = useState<EmailMessage[]>(INBOX);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'inbox' | 'starred' | 'sent'>('inbox');
  const [composing, setComposing] = useState(false);

  const selected = emails.find(e => e.id === selectedId);
  const filtered = filter === 'starred' ? emails.filter(e => e.starred) : filter === 'sent' ? [] : emails;

  const toggleStar = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  return (
    <div className="w-full h-full flex bg-[#0d0d12]">
      {/* Sidebar */}
      <div className="w-44 border-r border-white/5 flex flex-col py-2">
        <button onClick={() => setComposing(true)} className="mx-3 mb-3 h-9 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium hover:bg-[#00d4ff]/30 transition-colors flex items-center justify-center gap-2">
          <Icons.PenSquare className="w-3.5 h-3.5" /> Compose
        </button>
        {(['inbox', 'starred', 'sent'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-3 px-4 py-2 text-left text-xs transition-all
              ${filter === f ? 'bg-white/10 text-[#00d4ff]' : 'text-white/50 hover:bg-white/5 hover:text-white/70'}`}>
            {f === 'inbox' && <Icons.Inbox className="w-4 h-4" />}
            {f === 'starred' && <Icons.Star className="w-4 h-4" />}
            {f === 'sent' && <Icons.Send className="w-4 h-4" />}
            <span className="capitalize">{f}</span>
            {f === 'inbox' && <span className="ml-auto text-[10px] text-white/30">{emails.filter(e => !e.read).length}</span>}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="w-64 border-r border-white/5 overflow-y-auto">
        {filtered.map(email => (
          <button key={email.id} onClick={() => { setSelectedId(email.id); setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e)); }}
            className={`w-full text-left p-3 border-b border-white/5 transition-all
              ${selectedId === email.id ? 'bg-white/10' : 'hover:bg-white/5'}
              ${!email.read ? '' : 'opacity-60'}`}>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); toggleStar(email.id); }} className="shrink-0">
                <Icons.Star className={`w-3 h-3 ${email.starred ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
              </button>
              <span className={`text-xs truncate ${!email.read ? 'text-white font-medium' : 'text-white/60'}`}>{email.from}</span>
            </div>
            <div className={`text-xs truncate mt-0.5 ${!email.read ? 'text-white/80' : 'text-white/40'}`}>{email.subject}</div>
            <div className="text-[9px] text-white/20 mt-0.5">{email.date}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {composing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-white font-medium">New Message</h3>
              <button onClick={() => setComposing(false)} className="p-1 rounded hover:bg-white/10"><Icons.X className="w-4 h-4 text-white/40" /></button>
            </div>
            <input placeholder="To:" className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#00d4ff]/30" />
            <input placeholder="Subject:" className="w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#00d4ff]/30" />
            <textarea placeholder="Write your message..." className="w-full h-48 p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white resize-none outline-none" />
            <button className="h-9 px-4 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium">Send</button>
          </div>
        ) : selected ? (
          <div>
            <h2 className="text-lg text-white font-semibold mb-1">{selected.subject}</h2>
            <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
              <span>From: {selected.from}</span>
              <span>{selected.date}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{selected.body}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <Icons.Mail className="w-12 h-12 mb-2" />
            <span className="text-sm">Select an email to read</span>
          </div>
        )}
      </div>
    </div>
  );
}
