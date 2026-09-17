import React, { useState } from 'react';
import { VoterPathProvider, useVoterPath } from './context/VoterPathContext';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/layout/HeroSection';
import { Footer } from './components/layout/Footer';
import { AskMitraModal } from './components/layout/AskMitraModal';
import { FloatingMitraWidget } from './components/layout/FloatingMitraWidget';
import { EvmSimulator } from './components/evm/EvmSimulator';
import { ElectionLifecycle } from './components/lifecycle/ElectionLifecycle';
import { ReadinessWizard } from './components/readiness/ReadinessWizard';
import { MythBuster } from './components/myths/MythBuster';

const MainContent: React.FC = () => {
  const { activeTab } = useVoterPath();

  return (
    <main id="main-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-20">
      {activeTab === 'simulator' && <EvmSimulator />}
      {activeTab === 'lifecycle' && <ElectionLifecycle />}
      {activeTab === 'readiness' && <ReadinessWizard />}
      {activeTab === 'myths' && <MythBuster />}
    </main>
  );
};

export default function App() {
  const [isMitraOpen, setIsMitraOpen] = useState(false);

  return (
    <VoterPathProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-200">
        <Header onOpenMitra={() => setIsMitraOpen(true)} />
        <HeroSection />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
        <FloatingMitraWidget onClick={() => setIsMitraOpen(true)} />
        <AskMitraModal isOpen={isMitraOpen} onClose={() => setIsMitraOpen(false)} />
      </div>
    </VoterPathProvider>
  );
}
