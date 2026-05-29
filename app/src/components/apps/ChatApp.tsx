import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import type { Contact } from '@/types/os';

const CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', avatar: 'AC', status: 'online' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'BS', status: 'away' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', avatar: 'CW', status: 'online' },
  { id: '4', name: 'David Kim', email: 'david@example.com', avatar: 'DK', status: 'offline' },
  { id: '5', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW', status: 'online' },
];

const MOCK_MESSAGES: Record<string, { from: string; text: string; time: string }[]> = {
  '1': [
    { from: 'them', text: 'Hey! Have you tried the new Strata OS update?', time: '09:30' },
    { from: 'me', text: 'Yes! The new apps are amazing.', time: '09:32' },
    { from: 'them', text: 'The games section is my favorite. So many to choose from!', time: '09:33' },
  ],
  '2': [
    { from: 'them', text: 'Can you review my PR?', time: '08:15' },
    { from: 'me', text: 'Sure, I\'ll take a look this afternoon.', time: '08:20' },
  ],
  '3': [
    { from: 'them', text: 'Coffee break at 11?', time: '10:00' },
    { from: 'me', text: 'Sounds good! See you then.', time: '10:05' },
  ],
};

export default function ChatApp() {
  const [activeId, setActiveId] = useState('1');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = CONTACTS.find(c => c.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, activeId]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { from: 'me', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
    }));
    setInput('');
    // Auto-reply
    setTimeout(() => {
      const replies = ['Nice!', 'Got it.', 'Interesting...', 'Thanks!', 'Let me check.'];
      setMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), { from: 'them', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
      }));
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="w-full h-full flex bg-[#0d0d12]">
      {/* Contacts */}
      <div className="w-40 border-r border-white/5 flex flex-col">
        <div className="h-10 flex items-center px-3 border-b border-white/5 text-xs text-white/50 font-medium">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {CONTACTS.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all
                ${activeId === c.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#4effa1] flex items-center justify-center text-[10px] text-white font-bold">
                  {c.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d12]
                  ${c.status === 'online' ? 'bg-green-400' : c.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-white/80 truncate">{c.name}</div>
                <div className="text-[9px] text-white/30">{c.status}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-10 flex items-center px-3 border-b border-white/5">
          <span className="text-xs text-white font-medium">{active.name}</span>
          <span className="text-[10px] text-green-400 ml-2">{active.status}</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
          {(messages[activeId] || []).map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs
                ${msg.from === 'me' ? 'bg-[#00d4ff]/20 text-[#00d4ff] rounded-br-sm' : 'bg-white/5 text-white/80 rounded-bl-sm'}`}>
                {msg.text}
                <div className={`text-[9px] mt-1 ${msg.from === 'me' ? 'text-[#00d4ff]/40' : 'text-white/20'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5">
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a message..."
              className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#00d4ff]/30" />
            <button onClick={send} className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff]">
              <Icons.Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
