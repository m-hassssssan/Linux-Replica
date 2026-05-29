import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { TodoItem } from '@/types/os';

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Explore all 50+ apps', completed: false, createdAt: Date.now() },
    { id: '2', text: 'Customize the desktop wallpaper', completed: false, createdAt: Date.now() },
    { id: '3', text: 'Play a game of Tetris', completed: true, createdAt: Date.now() },
    { id: '4', text: 'Try the terminal commands', completed: false, createdAt: Date.now() },
    { id: '5', text: 'Create a note in Notes app', completed: true, createdAt: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: `todo-${Date.now()}`, text: input, completed: false, createdAt: Date.now() }]);
    setInput('');
  };

  const toggle = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-4">
      <h2 className="text-sm text-white/80 font-medium mb-3">Tasks ({completed}/{todos.length})</h2>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white
            placeholder:text-white/30 outline-none focus:border-[#00d4ff]/30"
        />
        <button onClick={addTodo} className="h-9 px-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs font-medium">
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-3">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            className={`px-3 py-1 rounded-lg text-[10px] font-medium capitalize transition-all
              ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filtered.map(todo => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group"
          >
            <button
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                ${todo.completed ? 'bg-[#4effa1] border-[#4effa1]' : 'border-white/20 hover:border-[#00d4ff]'}`}
              onClick={() => toggle(todo.id)}
            >
              {todo.completed && <Icons.Check className="w-3 h-3 text-black" />}
            </button>
            <span className={`flex-1 text-xs ${todo.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
              {todo.text}
            </span>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
              onClick={() => deleteTodo(todo.id)}
            >
              <Icons.X className="w-3 h-3 text-red-400" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-white/20">
            <Icons.CheckSquare className="w-8 h-8 mb-2" />
            <span className="text-xs">No tasks</span>
          </div>
        )}
      </div>
    </div>
  );
}
