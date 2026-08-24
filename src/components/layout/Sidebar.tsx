import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Wand2,
  ScanEye,
  FileText,
  Clock,
  Images,
  Cpu,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'generate', label: 'Generate Art', sublabel: 'Text to Image', icon: Wand2 },
    { id: 'classify', label: 'Image to Style', sublabel: 'Style Detection', icon: ScanEye },
    { id: 'ocr', label: 'Image to Text', sublabel: 'Vision OCR', icon: FileText },
    { id: 'history', label: 'History', sublabel: 'Logs & Details', icon: Clock },
    { id: 'gallery', label: 'Gallery', sublabel: 'Artwork Collection', icon: Images },
    { id: 'models', label: 'Models', sublabel: 'Registry Specs', icon: Cpu },
    { id: 'settings', label: 'Settings', sublabel: 'API & Preferences', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#070913] border-r border-slate-800/80 flex flex-col justify-between p-3 select-none shrink-0 z-30">
      
      {/* Navigation Items */}
      <div className="space-y-1.5 pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/60 to-slate-900 border border-purple-500/60 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-purple-400 scale-110' : 'text-slate-500'
                }`}
              />
              <div className="text-left">
                <span className="block leading-tight font-extrabold">{item.label}</span>
                {item.sublabel && (
                  <span className={`text-[9px] block ${isActive ? 'text-purple-300' : 'text-slate-500'}`}>
                    {item.sublabel}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Powered By Engine Widget (Matching input_file_4 / input_file_3) */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950 border border-purple-500/30 space-y-2 text-center shadow-xl">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300">
          <Zap className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Powered by</span>
          <h5 className="text-xs font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent mt-0.5">
            {activeTab === 'ocr' ? 'Vision AI + OCR Engine' : 'SDXL-Turbo + MobileNetV3'}
          </h5>
        </div>
        <p className="text-[9px] text-slate-500 leading-tight">
          Advanced Multi-Modal Artificial Intelligence
        </p>
      </div>

    </aside>
  );
};
