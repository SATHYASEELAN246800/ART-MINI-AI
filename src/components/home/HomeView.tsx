import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wand2, ScanEye, ArrowRight, Zap, Layers, ShieldCheck } from 'lucide-react';

// Custom Dual Brain & Paintbrush Emblem (Matching reference image logo)
const BrainBrushLogo: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    {/* Left Brain Half */}
    <path
      d="M44 18C30 18 20 27 20 40C20 47 24 53 28 57C24 63 24 70 28 76C33 82 42 84 48 84V18H44Z"
      stroke="url(#brainGrad)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="32" cy="34" r="3.5" fill="#06b6d4" />
    <circle cx="28" cy="50" r="3.5" fill="#3b82f6" />
    <circle cx="35" cy="66" r="3.5" fill="#60a5fa" />
    <path d="M32 34L28 50L35 66" stroke="url(#brainGrad)" strokeWidth="2" opacity="0.6" />

    {/* Right Paintbrush Half */}
    <path d="M54 84L76 42L84 26C86 23 83 20 80 22L64 30L54 84Z" fill="url(#brushGrad)" />
    <path d="M80 22C84 18 90 24 86 28L78 36L71 30L80 22Z" fill="#fbbf24" />
  </svg>
);

interface StyleHotspot {
  id: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

const ART_STYLE_HOTSPOTS: StyleHotspot[] = [
  { id: 'renaissance', label: 'Renaissance', top: '4.2%', left: '71.2%', width: '12.8%', height: '18.2%' },
  { id: 'impressionism', label: 'Impressionism', top: '4.2%', left: '84.8%', width: '12.8%', height: '18.2%' },
  { id: 'surrealism', label: 'Surrealism', top: '25.0%', left: '71.2%', width: '12.8%', height: '18.2%' },
  { id: 'expressionism', label: 'Expressionism', top: '25.0%', left: '84.8%', width: '12.8%', height: '18.2%' },
  { id: 'ukiyo-e', label: 'Ukiyo-e', top: '46.2%', left: '70.5%', width: '13.5%', height: '16.5%' },
  { id: 'realism', label: 'Realism', top: '46.2%', left: '84.8%', width: '12.8%', height: '16.5%' },
  { id: 'baroque', label: 'Baroque', top: '64.8%', left: '67.0%', width: '9.8%', height: '16.5%' },
  { id: 'romanticism', label: 'Romanticism', top: '64.8%', left: '77.8%', width: '10.8%', height: '16.5%' },
  { id: 'art-nouveau', label: 'Art Nouveau', top: '64.8%', left: '89.6%', width: '9.0%', height: '16.5%' },
];

export const HomeView: React.FC = () => {
  const { setActiveTab, setSelectedArtStyle } = useApp();

  const handleStyleClick = (label: string) => {
    setSelectedArtStyle(label);
    setActiveTab('generate');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col justify-between select-none">
      
      {/* 
        1. CLEAN ARTWORK BACKGROUND IMAGE (landing-bg.jpg - input_file_1.png)
        Provides the artist figure, paint splashes, palette table, and style cards stack
      */}
      <img
        src="/assets/landing-bg.jpg"
        alt="ART AI MINI Studio Clean Background"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
      />

      {/* 
        ==========================================================
        2. REAL HTML/CSS COMPONENT LAYER (Rebuilt React UI Components)
        ==========================================================
      */}

      {/* TOP LEFT BRANDING & HEADER */}
      <div 
        className="absolute z-10 space-y-4"
        style={{ top: '4.5%', left: '4.5%', width: '50%' }}
      >
        {/* Dual Brain / Brush Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="p-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-md">
            <BrainBrushLogo className="w-14 h-14 xl:w-16 xl:h-16" />
          </div>
          <h1 className="text-5xl xl:text-6xl font-black tracking-[0.15em] bg-gradient-to-r from-amber-100 via-white to-cyan-200 bg-clip-text text-transparent font-serif drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
            ART AI MINI
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xs xl:text-sm font-extrabold tracking-[0.3em] text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text uppercase pl-1">
          Create • Classify • Inspire
        </p>

        {/* Sub-bar Pills */}
        <div className="inline-flex items-center space-x-3 text-xs xl:text-sm font-bold tracking-widest text-slate-200 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/80 shadow-2xl">
          <span className="text-cyan-400 font-extrabold">TEXT TO IMAGE</span>
          <span className="text-slate-500">•</span>
          <span className="text-pink-400 font-extrabold">IMAGE TO STYLE</span>
        </div>

        {/* Quote */}
        <p className="text-sm xl:text-lg italic text-amber-200/95 pl-1 font-serif max-w-xl leading-relaxed drop-shadow-md">
          “From imagination to masterpiece, AI brings your art to life.”
        </p>
      </div>

      {/* DUAL ACTION CARDS (Generate Art & Classify Style) */}
      <div 
        className="absolute z-10 flex items-center space-x-6"
        style={{ top: '42%', left: '4.5%', width: '48%' }}
      >
        {/* Card 1: Generate Art */}
        <div className="w-[230px] xl:w-[265px] rounded-3xl bg-slate-950/85 border-2 border-rose-500/50 p-5 xl:p-6 shadow-[0_10px_40px_rgba(244,63,94,0.3)] backdrop-blur-2xl hover:border-rose-400 hover:scale-[1.03] transition-all group/c1">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/40">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white leading-tight">Generate Art</h3>
              <p className="text-xs xl:text-sm text-slate-300 mt-1">From Text Prompt</p>
            </div>

            <button
              onClick={() => setActiveTab('generate')}
              className="w-full mt-2 py-3 px-4 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white text-xs xl:text-sm font-extrabold tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/40 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Create Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Classify Style */}
        <div className="w-[230px] xl:w-[265px] rounded-3xl bg-slate-950/85 border-2 border-cyan-500/50 p-5 xl:p-6 shadow-[0_10px_40px_rgba(6,182,212,0.3)] backdrop-blur-2xl hover:border-cyan-400 hover:scale-[1.03] transition-all group/c2">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40">
              <ScanEye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white leading-tight">Classify Style</h3>
              <p className="text-xs xl:text-sm text-slate-300 mt-1">From Image</p>
            </div>

            <button
              onClick={() => setActiveTab('classify')}
              className="w-full mt-2 py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white text-xs xl:text-sm font-extrabold tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/40 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Analyze Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE ART STYLE CARDS (Interactive Hotspot Grid over Style Stack) */}
      {ART_STYLE_HOTSPOTS.map((style) => (
        <div
          key={style.id}
          onClick={() => handleStyleClick(style.label)}
          title={`Select ${style.label} Style`}
          className="absolute z-10 cursor-pointer rounded-2xl border-2 border-transparent hover:border-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.85)] hover:scale-105 transition-all duration-300"
          style={{
            top: style.top,
            left: style.left,
            width: style.width,
            height: style.height,
          }}
        />
      ))}

      {/* BOTTOM FEATURE BAR */}
      <div 
        className="absolute z-10 rounded-2xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-2xl p-3 shadow-2xl flex items-center justify-between"
        style={{ bottom: '4.5%', left: '3%', right: '3%' }}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Feature 1 */}
          <div
            onClick={() => setActiveTab('generate')}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-all border border-transparent hover:border-amber-500/30"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white leading-tight">AI Powered Generation</h4>
              <p className="text-[10px] text-slate-400">Create stunning art instantly</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            onClick={() => setActiveTab('classify')}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-all border border-transparent hover:border-cyan-500/30"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <ScanEye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white leading-tight">Smart Style Classification</h4>
              <p className="text-[10px] text-slate-400">Detect art style accurately</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            onClick={() => setActiveTab('models')}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-all border border-transparent hover:border-rose-500/30"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white leading-tight">Fast & Efficient</h4>
              <p className="text-[10px] text-slate-400">Powered by deep learning models</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div
            onClick={() => setActiveTab('classify')}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-all border border-transparent hover:border-purple-500/30"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white leading-tight">Multi Style Recognition</h4>
              <p className="text-[10px] text-slate-400">10+ Artistic Styles Supported</p>
            </div>
          </div>

          {/* Feature 5 */}
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-900/80 cursor-pointer transition-all border border-transparent hover:border-emerald-500/30"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white leading-tight">Secure & Reliable</h4>
              <p className="text-[10px] text-slate-400">Advanced AI Technology</p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER QUOTE */}
      <div className="absolute bottom-1 inset-x-0 text-center z-10 pointer-events-none">
        <p className="text-[11px] text-amber-200/90 font-serif italic tracking-wider">
          “Art is not what you see, but what AI helps you create.”
        </p>
      </div>

    </div>
  );
};
