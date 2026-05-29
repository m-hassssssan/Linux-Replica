import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as Icons from 'lucide-react';
import type { ChatMessage } from '@/types/os';

const API_KEY_PLACEHOLDER = 'YOUR_API_KEY';

// Pre-defined responses for demo mode
const DEMO_RESPONSES: Record<string, string> = {
  'hello': 'Hello! Welcome to Strata OS. How can I assist you today?',
  'hi': 'Hi there! I\'m your AI assistant in Strata OS. What can I help you with?',
  'help': 'I can help you with:\n- General questions about Strata OS\n- Coding and programming help\n- Writing and editing assistance\n- Math and calculations\n- Information and research',
  'what is strata os': 'Strata OS is a fully functional web-based operating system simulation built entirely in the browser. It features a desktop environment with window management, a virtual file system, and over 50 integrated applications including games, productivity tools, creative apps, and developer utilities.',
  'tell me a joke': 'Why do programmers prefer dark mode? Because light attracts bugs!',
  'who are you': 'I\'m Gemini AI, integrated into Strata OS as your personal assistant. I can help answer questions, write code, analyze data, and much more!',
  'how does this work': 'Strata OS uses React for the UI, a custom window manager for app lifecycle, localStorage for file persistence, and HTML5 Canvas for games. Each app is a modular component that runs inside a managed window.',
};

function getDemoResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(key)) return value;
  }
  const fallback = [
    'That\'s an interesting question! In Strata OS, I can help you explore the system, answer questions, or assist with tasks. Try asking about specific apps or features.',
    'Great question! Strata OS has 50+ apps to explore. Try the Terminal for commands, play some games, or check out the developer tools.',
    'I\'m here to help! You can ask me about Strata OS features, get coding help, or just chat. What would you like to know?',
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', content: 'Hello! I\'m Gemini AI. How can I help you today?', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (apiKey && apiKey !== API_KEY_PLACEHOLDER) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(input);
        const text = result.response.text();
        setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'ai', content: text, timestamp: Date.now() }]);
      } else {
        // Demo mode
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'ai', content: getDemoResponse(userMsg.content), timestamp: Date.now() }]);
          setLoading(false);
        }, 600 + Math.random() * 800);
        return;
      }
    } catch {
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'ai', content: getDemoResponse(userMsg.content), timestamp: Date.now() }]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12]">
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-3 border-b border-white/5 bg-[#1a1a2e]/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#4effa1] flex items-center justify-center">
            <Icons.Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-white/80 font-medium">Gemini AI</span>
          <span className="text-[9px] text-white/30 px-1.5 py-0.5 rounded-full bg-[#4effa1]/10 text-[#4effa1]">
            {apiKey ? 'Live' : 'Demo'}
          </span>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
          <Icons.Settings className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="p-3 bg-[#1a1a2e] border-b border-white/5">
          <label className="text-[10px] text-white/40 block mb-1">API Key (optional)</label>
          <input
            type="password" value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter Gemini API key for live mode"
            className="w-full h-8 px-2 rounded bg-white/5 border border-white/10 text-xs text-white
              placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
          />
          <p className="text-[9px] text-white/20 mt-1">Leave empty to use demo mode with pre-programmed responses.</p>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed
              ${msg.role === 'user'
                ? 'bg-[#00d4ff]/20 text-[#00d4ff] rounded-br-sm'
                : 'bg-white/5 text-white/80 rounded-bl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 px-3 py-2 rounded-xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white
              placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] disabled:opacity-30 transition-all"
          >
            <Icons.Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
