import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, History, User, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, gpuStatus, gpuMessage } = useApp();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return { title: 'Home', subtitle: 'Create • Classify • Inspire' };
      case 'generate':
        return { title: 'Generate Art', subtitle: 'Turn your ideas into stunning masterpieces' };
      case 'classify':
        return { title: 'Image to Style', subtitle: 'Identify art styles with MobileNetV3-Small' };
      case 'ocr':
        return { title: 'Image to Text', subtitle: 'Extract text and descriptions with Vision AI' };
      case 'history':
        return { title: 'History', subtitle: 'Your creative generation log' };
      case 'gallery':
        return { title: 'Gallery', subtitle: 'Explore and organize your art collection' };
      case 'models':
        return { title: 'AI Models', subtitle: 'Model registry and Colab GPU backend status' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Configure Colab API endpoints and preferences' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand / Title Header */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-amber-200 bg-clip-text text-transparent">
              ART AI MINI
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {activeTab === 'home' ? 'AI Creative Studio' : title}
            </p>
          </div>
        </div>

        {activeTab !== 'home' && (
          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800">
            <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
            <span className="text-slate-600">•</span>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        )}
      </div>

      {/* Header Controls & Health Badge */}
      <div className="flex items-center space-x-4">
        {/* GPU Health Badge */}
        <div
          onClick={() => setActiveTab('models')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md cursor-pointer transition-all ${
            gpuStatus === 'active'
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 shadow-md shadow-emerald-500/10 hover:border-emerald-500/60'
              : gpuStatus === 'connecting'
              ? 'bg-amber-950/40 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/10'
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30 shadow-md shadow-rose-500/10'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{gpuMessage}</span>
        </div>

        {/* History Quick Access */}
        <button
          onClick={() => setActiveTab('history')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all hover:border-slate-700"
        >
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>History</span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-inner">
          <User className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </header>
  );
};
