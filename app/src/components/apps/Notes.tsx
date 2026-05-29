import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { Note } from '@/types/os';

const COLORS = ['#1a1a2e', '#2d1b1b', '#1b2d1b', '#1b1b2d', '#2d2d1b', '#1b2d2d', '#2d1b2d'];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Shopping List', content: '- Milk\n- Eggs\n- Bread\n- Coffee', color: '#1b2d1b', createdAt: Date.now(), updatedAt: Date.now() },
    { id: '2', title: 'Ideas', content: 'Build a web-based OS with:\n- Window manager\n- File system\n- 50+ apps', color: '#1b1b2d', createdAt: Date.now(), updatedAt: Date.now() },
    { id: '3', title: 'Meeting Notes', content: 'Review Q2 goals\nDiscuss new features\nAssign tasks', color: '#2d1b1b', createdAt: Date.now(), updatedAt: Date.now() },
  ]);
  const [activeId, setActiveId] = useState<string>('1');
  const [showColors, setShowColors] = useState(false);

  const activeNote = notes.find(n => n.id === activeId);

  const updateNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id && notes.length > 1) {
      setActiveId(notes.find(n => n.id !== id)?.id || '');
    }
  };

  return (
    <div className="w-full h-full flex bg-[#0d0d12]">
      {/* Sidebar */}
      <div className="w-40 border-r border-white/5 flex flex-col">
        <div className="h-10 flex items-center justify-between px-3 border-b border-white/5">
          <span className="text-xs text-white/50 font-medium">Notes</span>
          <button onClick={addNote} className="p-1 rounded hover:bg-white/10 transition-colors">
            <Icons.Plus className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <button
              key={note.id}
              className={`w-full text-left p-3 border-b border-white/5 transition-all
                ${activeId === note.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onClick={() => setActiveId(note.id)}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: note.color }} />
                <span className="text-xs text-white/80 truncate font-medium">{note.title || 'Untitled'}</span>
              </div>
              <p className="text-[10px] text-white/30 mt-1 truncate">{note.content || 'No content'}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeNote && (
        <div className="flex-1 flex flex-col" style={{ backgroundColor: activeNote.color }}>
          <div className="h-10 flex items-center justify-between px-3 border-b border-white/5">
            <input
              value={activeNote.title}
              onChange={e => updateNote({ title: e.target.value })}
              className="bg-transparent text-sm text-white outline-none flex-1 font-medium"
            />
            <div className="flex items-center gap-1">
              <div className="relative">
                <button onClick={() => setShowColors(!showColors)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
                  <Icons.Palette className="w-3.5 h-3.5 text-white/50" />
                </button>
                {showColors && (
                  <div className="absolute top-full right-0 mt-1 p-1.5 bg-[#1a1a2e] rounded-lg border border-white/10 shadow-lg flex gap-1">
                    {COLORS.map(c => (
                      <button
                        key={c}
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: c }}
                        onClick={() => { updateNote({ color: c }); setShowColors(false); }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => deleteNote(activeNote.id)} className="p-1.5 rounded hover:bg-red-500/20 transition-colors">
                <Icons.Trash2 className="w-3.5 h-3.5 text-red-400/60" />
              </button>
            </div>
          </div>
          <textarea
            value={activeNote.content}
            onChange={e => updateNote({ content: e.target.value })}
            className="flex-1 bg-transparent text-white p-4 outline-none resize-none text-sm leading-relaxed"
            placeholder="Write your note..."
          />
        </div>
      )}
    </div>
  );
}
