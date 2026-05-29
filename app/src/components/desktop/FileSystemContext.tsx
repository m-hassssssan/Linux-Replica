import React, { createContext, useContext } from 'react';
import { useFileSystem } from '@/hooks/useFileSystem';

const FileSystemContext = createContext<ReturnType<typeof useFileSystem> | null>(null);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const fs = useFileSystem();
  return (
    <FileSystemContext.Provider value={fs}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFS() {
  const ctx = useContext(FileSystemContext);
  if (!ctx) throw new Error('useFS must be used within FileSystemProvider');
  return ctx;
}
