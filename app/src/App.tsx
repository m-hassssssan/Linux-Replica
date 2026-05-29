import { OSProvider } from '@/hooks/useOSStore';
import BootSequence from '@/components/desktop/BootSequence';

function AppContent() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black select-none">
      <BootSequence />
    </div>
  );
}

function App() {
  return (
    <OSProvider>
      <AppContent />
    </OSProvider>
  );
}

export default App;
