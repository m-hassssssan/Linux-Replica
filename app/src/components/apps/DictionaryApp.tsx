import { useState } from 'react';
import * as Icons from 'lucide-react';

const DICTIONARY: Record<string, { definition: string; type: string; example: string }> = {
  'algorithm': { definition: 'A step-by-step procedure for solving a problem or accomplishing a task.', type: 'noun', example: 'The search algorithm found the result in O(log n) time.' },
  'browser': { definition: 'A software application used to access and view websites on the internet.', type: 'noun', example: 'Chrome and Firefox are popular web browsers.' },
  'cache': { definition: 'A hardware or software component that stores data for faster future access.', type: 'noun', example: 'The browser cached the page for quicker loading.' },
  'database': { definition: 'An organized collection of structured information stored electronically.', type: 'noun', example: 'The application uses a PostgreSQL database.' },
  'encryption': { definition: 'The process of encoding information so that only authorized parties can access it.', type: 'noun', example: 'End-to-end encryption protects your messages.' },
  'framework': { definition: 'A platform for developing software applications that provides a foundation.', type: 'noun', example: 'React is a popular JavaScript framework.' },
  'gateway': { definition: 'A node that connects two networks with different protocols.', type: 'noun', example: 'The API gateway routes requests to microservices.' },
  'hardware': { definition: 'The physical components of a computer system.', type: 'noun', example: 'The new hardware upgrade improved performance.' },
  'interface': { definition: 'A point where two systems meet and interact.', type: 'noun', example: 'The user interface is clean and intuitive.' },
  'kernel': { definition: 'The core component of an operating system that manages system resources.', type: 'noun', example: 'The Linux kernel powers millions of servers.' },
  'latency': { definition: 'The delay before a transfer of data begins following an instruction.', type: 'noun', example: 'Low latency is critical for real-time gaming.' },
  'middleware': { definition: 'Software that connects different applications or services.', type: 'noun', example: 'Middleware handles authentication between services.' },
  'network': { definition: 'A group of interconnected computers that can share resources.', type: 'noun', example: 'The office network connects 50 workstations.' },
  'protocol': { definition: 'A set of rules governing the exchange of data between devices.', type: 'noun', example: 'HTTP is the protocol used for web communication.' },
  'query': { definition: 'A request for data or information from a database.', type: 'noun', example: 'The SQL query returned 1,000 records.' },
  'repository': { definition: 'A central location where data or code is stored and managed.', type: 'noun', example: 'The code is stored in a Git repository.' },
  'server': { definition: 'A computer or program that provides functionality to other computers.', type: 'noun', example: 'The web server handles 10,000 requests per second.' },
  'token': { definition: 'A piece of data used for authentication or authorization.', type: 'noun', example: 'The access token expires after 24 hours.' },
  'virtual': { definition: 'Not physically existing but made by software to appear to do so.', type: 'adjective', example: 'The virtual machine runs isolated from the host.' },
  'widget': { definition: 'A small GUI application or component with limited functionality.', type: 'noun', example: 'The weather widget displays current conditions.' },
};

export default function DictionaryApp() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof DICTIONARY[string] | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const search = () => {
    const key = query.toLowerCase().trim();
    if (!key) return;
    const found = DICTIONARY[key];
    setResult(found || null);
    if (found && !history.includes(key)) {
      setHistory(prev => [key, ...prev].slice(0, 10));
    }
  };

  const randomWord = () => {
    const keys = Object.keys(DICTIONARY);
    const word = keys[Math.floor(Math.random() * keys.length)];
    setQuery(word);
    setResult(DICTIONARY[word]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search word..."
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white
            placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
        />
        <button onClick={search} className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff]">
          <Icons.Search className="w-4 h-4" />
        </button>
        <button onClick={randomWord} className="h-9 px-3 rounded-lg bg-white/5 text-white/50 hover:bg-white/10" title="Random word">
          <Icons.Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Result */}
      {result ? (
        <div className="bg-[#1a1a2e] rounded-xl border border-white/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg text-white font-semibold capitalize">{query}</h2>
            <span className="text-[10px] text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded-full">{result.type}</span>
          </div>
          <p className="text-sm text-white/70 mb-3">{result.definition}</p>
          <div className="border-l-2 border-[#4effa1]/30 pl-3">
            <p className="text-xs text-white/40 italic">&ldquo;{result.example}&rdquo;</p>
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-6 text-white/30 text-sm mb-4">No definition found for &ldquo;{query}&rdquo;</div>
      ) : null}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="text-xs text-white/30 mb-2">Recent searches</div>
          <div className="flex flex-wrap gap-1.5">
            {history.map(word => (
              <button
                key={word}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-white/50 hover:bg-white/10 transition-colors capitalize"
                onClick={() => { setQuery(word); setResult(DICTIONARY[word] || null); }}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Browse */}
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="text-xs text-white/30 mb-2">Browse</div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(DICTIONARY).map(([word, data]) => (
            <button
              key={word}
              className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              onClick={() => { setQuery(word); setResult(data); }}
            >
              <span className="text-xs text-white/70 capitalize font-medium">{word}</span>
              <span className="text-[9px] text-white/30 ml-1">{data.type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
