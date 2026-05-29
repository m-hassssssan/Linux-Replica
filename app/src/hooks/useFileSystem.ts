import { useState, useCallback, useEffect } from 'react';
import type { FileSystemItem } from '@/types/os';

const FS_KEY = 'strata_fs';
const DEFAULT_ITEMS: FileSystemItem[] = [
  { id: 'root', name: 'Home', type: 'directory', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'docs', name: 'Documents', type: 'directory', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'downloads', name: 'Downloads', type: 'directory', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'music', name: 'Music', type: 'directory', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'pictures', name: 'Pictures', type: 'directory', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'videos', name: 'Videos', type: 'directory', parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'welcome', name: 'welcome.txt', type: 'file', parentId: 'root', content: 'Welcome to Strata OS!\n\nThis is a fully functional web-based operating system simulation.\n\nExplore the applications and features.\n\n- Double-click icons on the desktop to open apps\n- Right-click the desktop for context menu\n- Use the Start Menu to find all applications\n- Try the Terminal for fun commands!', mimeType: 'text/plain', size: 256, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'todo', name: 'tasks.txt', type: 'file', parentId: 'docs', content: '- [ ] Explore all apps\n- [ ] Play some games\n- [ ] Customize the desktop\n- [ ] Try the terminal', mimeType: 'text/plain', size: 78, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'note1', name: 'ideas.txt', type: 'file', parentId: 'docs', content: 'Project ideas:\n1. Web-based OS\n2. Retro game collection\n3. Code editor in browser', mimeType: 'text/plain', size: 62, createdAt: Date.now(), updatedAt: Date.now() },
];

function loadFS(): FileSystemItem[] {
  try {
    const stored = localStorage.getItem(FS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_ITEMS;
}

function saveFS(items: FileSystemItem[]) {
  localStorage.setItem(FS_KEY, JSON.stringify(items));
}

export function useFileSystem() {
  const [items, setItems] = useState<FileSystemItem[]>(loadFS);
  const [currentDir, setCurrentDir] = useState<string>('root');

  useEffect(() => {
    saveFS(items);
  }, [items]);

  const getChildren = useCallback((parentId: string) => {
    return items.filter(i => i.parentId === parentId);
  }, [items]);

  const getItem = useCallback((id: string) => {
    return items.find(i => i.id === id) ?? null;
  }, [items]);

  const getPath = useCallback((id: string): FileSystemItem[] => {
    const path: FileSystemItem[] = [];
    let current = items.find(i => i.id === id);
    while (current) {
      path.unshift(current);
      current = current.parentId ? items.find(i => i.id === current!.parentId) : undefined;
    }
    return path;
  }, [items]);

  const createFile = useCallback((name: string, parentId: string, content?: string, mimeType?: string) => {
    const newFile: FileSystemItem = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      parentId,
      content: content ?? '',
      mimeType: mimeType ?? 'text/plain',
      size: (content ?? '').length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems(prev => [...prev, newFile]);
    return newFile;
  }, []);

  const createDirectory = useCallback((name: string, parentId: string) => {
    const newDir: FileSystemItem = {
      id: `dir-${Date.now()}`,
      name,
      type: 'directory',
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setItems(prev => [...prev, newDir]);
    return newDir;
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const toDelete = new Set<string>();
      const collect = (itemId: string) => {
        toDelete.add(itemId);
        prev.filter(i => i.parentId === itemId).forEach(i => collect(i.id));
      };
      collect(id);
      return prev.filter(i => !toDelete.has(i.id));
    });
  }, []);

  const renameItem = useCallback((id: string, newName: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, name: newName, updatedAt: Date.now() } : i
    ));
  }, []);

  const updateFile = useCallback((id: string, content: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, content, size: content.length, updatedAt: Date.now() } : i
    ));
  }, []);

  const navigateUp = useCallback(() => {
    const current = items.find(i => i.id === currentDir);
    if (current?.parentId) {
      setCurrentDir(current.parentId);
    }
  }, [currentDir, items]);

  const navigateTo = useCallback((id: string) => {
    setCurrentDir(id);
  }, []);

  return {
    items,
    currentDir,
    getChildren,
    getItem,
    getPath,
    createFile,
    createDirectory,
    deleteItem,
    renameItem,
    updateFile,
    navigateUp,
    navigateTo,
    setCurrentDir,
  };
}
