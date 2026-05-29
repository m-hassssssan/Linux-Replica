import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  windowId: string;
}

interface Command {
  input: string;
  output: string[];
}

const HELP_TEXT = `Available commands:
  help          Show this help message
  clear         Clear the terminal
  echo <text>   Print text to terminal
  date          Show current date and time
  whoami        Show current user
  uname -a      Show system info
  ls            List directory contents
  cd <dir>      Change directory
  pwd           Print working directory
  cat <file>    Show file contents
  touch <file>  Create a new file
  mkdir <dir>   Create a directory
  rm <file>     Remove a file
  neofetch      Display system info with ASCII art
  cmatrix       Run Matrix rain effect
  weather <city> Get weather info
  calc <expr>   Simple calculator
  joke          Get a random joke
  fortune       Get a random fortune`;

export default function Terminal(_props: Props) {
  void _props; // suppress unused warning
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [history, setHistory] = useState<string[]>([]);
  const [, setHistoryIndex] = useState(-1);
  const [showMatrix, setShowMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commands]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    const output: string[] = [];

    switch (cmd) {
      case 'help':
        output.push(HELP_TEXT);
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'echo':
        output.push(args.join(' '));
        break;
      case 'date':
        output.push(new Date().toString());
        break;
      case 'whoami':
        output.push('user');
        break;
      case 'uname':
        if (args.includes('-a')) {
          output.push('Linux strata-os 6.8.0-generic #1 SMP x86_64 GNU/Linux');
        } else {
          output.push('Linux');
        }
        break;
      case 'pwd':
        output.push(currentDir);
        break;
      case 'ls': {
        const mockFiles = ['Documents', 'Downloads', 'Music', 'Pictures', 'Videos', '.bashrc', '.profile', 'README.md'];
        output.push(mockFiles.join('  '));
        break;
      }
      case 'cd':
        if (args[0] === '..') {
          setCurrentDir('/home');
        } else if (args[0]) {
          setCurrentDir(`${currentDir}/${args[0]}`);
        } else {
          setCurrentDir('/home/user');
        }
        break;
      case 'cat':
        if (args[0] === 'README.md') {
          output.push('# Welcome to Strata OS', '', 'This is a web-based operating system simulation.');
        } else {
          output.push(`cat: ${args[0] || ''}: No such file or directory`);
        }
        break;
      case 'touch':
        output.push(`Created file: ${args[0] || 'untitled'}`);
        break;
      case 'mkdir':
        output.push(`Created directory: ${args[0] || 'untitled'}`);
        break;
      case 'rm':
        output.push(`Removed: ${args[0] || ''}`);
        break;
      case 'neofetch':
        output.push(
          '     _.-;;-._     user@strata-os',
          '  \'-..-\'  |\   \\    OS: Strata OS 2.0',
          '  |.-\      |   \\   Kernel: 6.8.0-generic',
          '  |   \'-..-\\_.-\\   Shell: strata-sh',
          '  |._         |    Uptime: 2h 15m',
          '  |  \'-..-.-./    Memory: 4.2GB / 16GB',
          '  |._         |    Resolution: 1920x1080',
          '  |  \'-._.-\'     DE: Strata Desktop',
          '  \'-._.-\'        WM: Strata Window Manager',
        );
        break;
      case 'cmatrix':
        setShowMatrix(true);
        setTimeout(() => setShowMatrix(false), 8000);
        output.push('Starting Matrix rain... (press any key to stop)');
        break;
      case 'weather': {
        const city = args.join(' ') || 'London';
        output.push(`Weather in ${city}:`, '  Temperature: 22\u00B0C', '  Condition: Partly Cloudy', '  Humidity: 65%', '  Wind: 12 km/h');
        break;
      }
      case 'calc': {
        try {
          const expr = args.join(' ');
          const result = new Function('return ' + expr.replace(/[^0-9+\-*/.()\s]/g, ''))();
          output.push(`${expr} = ${result}`);
        } catch {
          output.push('Error: Invalid expression');
        }
        break;
      }
      case 'joke': {
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs!',
          'Why did the developer go broke? Because he used up all his cache!',
          'How many programmers does it take to change a light bulb? None, that\'s a hardware problem!',
          'Why do Java developers wear glasses? Because they don\'t C#!',
        ];
        output.push(jokes[Math.floor(Math.random() * jokes.length)]);
        break;
      }
      case 'fortune': {
        const fortunes = [
          'A journey of a thousand miles begins with a single step.',
          'The only way to do great work is to love what you do.',
          'Innovation distinguishes between a leader and a follower.',
          'Stay hungry, stay foolish.',
          'Your limitation is only your imagination.',
        ];
        output.push(fortunes[Math.floor(Math.random() * fortunes.length)]);
        break;
      }
      default:
        output.push(`Command not found: ${cmd}. Type 'help' for available commands.`);
    }

    setCommands(prev => [...prev, { input: trimmed, output }]);
  }, [currentDir]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const newIdx = Math.min(prev + 1, history.length - 1);
        if (newIdx >= 0) setCurrentInput(history[history.length - 1 - newIdx]);
        return newIdx;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIndex(prev => {
        const newIdx = Math.max(prev - 1, -1);
        setCurrentInput(newIdx >= 0 ? history[history.length - 1 - newIdx] : '');
        return newIdx;
      });
    }
  };

  return (
    <div
      className="w-full h-full bg-[#0d0d0d] text-[#4effa1] font-mono text-xs p-3 overflow-hidden relative flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {showMatrix && <MatrixRain />}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1">
        <div className="text-[#00d4ff] mb-2">Welcome to Strata OS Terminal v2.0</div>
        <div className="text-white/40 mb-3">Type 'help' for available commands</div>
        {commands.map((cmd, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[#00d4ff]">user@strata</span>
              <span className="text-white/40">:</span>
              <span className="text-[#ff007f]">{currentDir}</span>
              <span className="text-white/40">$</span>
              <span className="ml-1">{cmd.input}</span>
            </div>
            {cmd.output.map((line, j) => (
              <div key={j} className="text-white/80 whitespace-pre-wrap pl-0">{line}</div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="text-[#00d4ff]">user@strata</span>
          <span className="text-white/40">:</span>
          <span className="text-[#ff007f]">{currentDir}</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none ml-1 text-white/80 caret-[#4effa1]"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cols = Math.floor(canvas.width / 14);
    const drops = new Array(cols).fill(1);
    const chars = '0123456789ABCDEF';

    let frame: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#4effa1';
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
