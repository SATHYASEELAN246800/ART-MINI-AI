import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomeView } from './components/home/HomeView';
import { GenerateArtView } from './components/generate/GenerateArtView';
import { ClassifyStyleView } from './components/classify/ClassifyStyleView';
import { ImageToTextView } from './components/ocr/ImageToTextView';
import { HistoryView } from './components/history/HistoryView';
import { GalleryView } from './components/gallery/GalleryView';
import { ModelsView } from './components/models/ModelsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'generate':
        return <GenerateArtView />;
      case 'classify':
        return <ClassifyStyleView />;
      case 'ocr':
        return <ImageToTextView />;
      case 'history':
        return <HistoryView />;
      case 'gallery':
        return <GalleryView />;
      case 'models':
        return <ModelsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {activeTab !== 'home' && <Sidebar />}

        <main className={`flex-1 overflow-y-auto min-w-0 relative ${
          activeTab !== 'home' ? 'animated-multigradient-bg' : ''
        }`}>
          {/* Floating Animated Multi-Color Mesh Orbs for non-home tabs */}
          {activeTab !== 'home' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {/* Cyan & Violet Floating Mesh Orb */}
              <div className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/20 to-purple-600/20 blur-[100px] orb-float-1" />
              {/* Neon Pink & Magenta Floating Mesh Orb */}
              <div className="absolute top-[30%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-pink-600/25 via-rose-500/20 to-purple-800/20 blur-[120px] orb-float-2" />
              {/* Amber & Electric Blue Floating Mesh Orb */}
              <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/20 via-teal-500/20 to-blue-600/20 blur-[110px] orb-float-3" />
            </div>
          )}

          <div className="relative z-10 w-full h-full">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
