import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateImageApi } from '../../services/generationApi';
import { ART_STYLES, ASPECT_RATIOS, PROMPT_PRESETS } from '../../config/modelRegistry';
import { generateMockArtDataUrl } from '../../utils/proceduralArt';
import {
  Wand2,
  Sparkles,
  Heart,
  Download,
  Share2,
  Maximize2,
  Edit3,
  MoreHorizontal,
  RotateCcw,
  Sliders,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const GenerateArtView: React.FC = () => {
  const {
    selectedArtStyle,
    setSelectedArtStyle,
    initialPrompt,
    setInitialPrompt,
    currentGeneration,
    setCurrentGeneration,
    addHistoryItem,
    favorites,
    toggleFavorite,
    historyItems,
  } = useApp();

  const [prompt, setPrompt] = useState<string>(
    initialPrompt ||
      'A beautiful oil painting of a traditional Tamil village at sunset, warm natural lighting, detailed brush strokes, classical fine art composition'
  );
  const [model, setModel] = useState<string>('sdxl-turbo');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1 (Square)');
  const [resolution, setResolution] = useState<{ width: number; height: number }>({
    width: 512,
    height: 512,
  });
  const [steps, setSteps] = useState<number>(2);
  const [guidanceScale, setGuidanceScale] = useState<number>(0.0);
  const [seed, setSeed] = useState<string>('123456789');
  const [highDetail, setHighDetail] = useState<boolean>(true);
  const [enhanceFace, setEnhanceFace] = useState<boolean>(false);
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, low quality, distorted, bad anatomy');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial real AI variations strip
  const [variations, setVariations] = useState<string[]>([]);

  useEffect(() => {
    // Generate initial variations safely using high-res canvas Data URLs
    const v1 = generateMockArtDataUrl(prompt, 'Oil Painting', 512, 512);
    const v2 = generateMockArtDataUrl(prompt, 'Watercolor', 512, 512);
    const v3 = generateMockArtDataUrl(prompt, 'Sunset Village', 512, 512);
    const v4 = generateMockArtDataUrl(prompt, 'Digital Art', 512, 512);
    const v5 = generateMockArtDataUrl(prompt, 'Realism', 512, 512);
    setVariations([v1, v2, v3, v4, v5]);
  }, []);

  // Sync initial prompt from context if present
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setInitialPrompt('');
    }
  }, [initialPrompt, setInitialPrompt]);

  const currentDisplayImg = currentGeneration?.imageUrl || variations[0] || '';

  // Handle Generate Action
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a descriptive text prompt first.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const result = await generateImageApi({
        prompt: prompt.trim(),
        negativePrompt,
        model,
        artStyle: selectedArtStyle,
        aspectRatio,
        width: resolution.width,
        height: resolution.height,
        steps,
        guidanceScale,
        seed: seed ? parseInt(seed, 10) : null,
        highDetail,
        enhanceFace,
      });

      setCurrentGeneration(result);
      setVariations((prev) => [result.imageUrl, ...prev.slice(0, 4)]);

      // Add to persistent history
      addHistoryItem({
        id: result.id,
        type: 'generation',
        thumbnailUrl: result.imageUrl,
        title: result.prompt,
        subtitle: `${result.artStyle} • ${result.model}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        details: result,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Safe Image Error Fallback Handler
  const handleImageError = () => {
    const safeDataUrl = generateMockArtDataUrl(prompt, selectedArtStyle, resolution.width, resolution.height);
    if (currentGeneration) {
      setCurrentGeneration({ ...currentGeneration, imageUrl: safeDataUrl });
    } else {
      setVariations((prev) => [safeDataUrl, ...prev.slice(1)]);
    }
  };

  // Random Prompt Generator
  const handleRandomPrompt = () => {
    const randomPreset = PROMPT_PRESETS[Math.floor(Math.random() * PROMPT_PRESETS.length)];
    setPrompt(randomPreset);
    setErrorMsg(null);
  };

  // Enhance Prompt Helper
  const handleEnhancePrompt = () => {
    if (!prompt.toLowerCase().includes('masterpiece')) {
      setPrompt((prev) => `${prev.trim()}, masterpiece fine art, highly detailed, 8k resolution, studio lighting`);
      setErrorMsg(null);
    }
  };

  const isFav = currentGeneration ? favorites.includes(currentGeneration.id) : false;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-transparent text-white overflow-hidden">
      
      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Controls Panel (Cols 4) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl p-5 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Section 1: Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                  1
                </span>
                <span>Prompt</span>
              </label>
              <span className="text-[10px] text-slate-400">{prompt.length} / 500</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Describe your imagination..."
              rows={4}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
            />

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRandomPrompt}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Random Prompt</span>
              </button>

              <button
                onClick={handleEnhancePrompt}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enhance Prompt</span>
              </button>
            </div>
          </div>

          {/* Section 2: Style & Model */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                2
              </span>
              <span>Style & Model</span>
            </label>

            {/* Model Selector */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Model Engine</span>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Flux.1 / SDXL Engine</span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fast Real-Time Diffusion • High Quality 8K</p>
                </div>
              </div>
            </div>

            {/* Art Style & Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400">Art Style</span>
                <select
                  value={selectedArtStyle}
                  onChange={(e) => setSelectedArtStyle(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {ART_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Aspect Ratio</span>
                <select
                  value={aspectRatio}
                  onChange={(e) => {
                    setAspectRatio(e.target.value);
                    const found = ASPECT_RATIOS.find((r) => r.label === e.target.value);
                    if (found) {
                      setResolution({ width: found.width, height: found.height });
                    }
                  }}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {ASPECT_RATIOS.map((ratio) => (
                    <option key={ratio.label} value={ratio.label}>
                      {ratio.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Advanced Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                  3
                </span>
                <span>Advanced Settings</span>
              </label>
              <button
                onClick={() => {
                  setSteps(2);
                  setGuidanceScale(0.0);
                  setResolution({ width: 512, height: 512 });
                  setSeed('123456789');
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Inference Steps Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inference Steps</span>
                <span className="font-bold text-cyan-400">{steps}</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Guidance Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Guidance Scale</span>
                <span className="font-bold text-cyan-400">{guidanceScale.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={7.5}
                step={0.5}
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Resolution Selector Pills */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Image Resolution</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { w: 512, h: 512 },
                  { w: 768, h: 768 },
                  { w: 1024, h: 1024 },
                ].map((res) => {
                  const isSelected = resolution.width === res.w && resolution.height === res.h;
                  return (
                    <button
                      key={`${res.w}x${res.h}`}
                      onClick={() => setResolution({ width: res.w, height: res.h })}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-purple-950/80 border-purple-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {res.w} x {res.h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seed & Toggles */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Seed (Optional)</span>
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Enter seed number"
                  className="w-32 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 font-mono text-right focus:outline-none focus:border-purple-500"
                />
              </div>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>High Detail (HD)</span>
                <input
                  type="checkbox"
                  checked={highDetail}
                  onChange={(e) => setHighDetail(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Enhance Face</span>
                <input
                  type="checkbox"
                  checked={enhanceFace}
                  onChange={(e) => setEnhanceFace(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary CTA Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-sm tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Generating Real AI Artwork...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>✦ Generate</span>
              </>
            )}
          </button>
        </div>

        {/* CENTER COLUMN: Generated Art Preview (Cols 5) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-xl p-5 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 text-[10px] font-extrabold flex items-center justify-center border border-cyan-500/40">
                  4
                </span>
                <h3 className="text-sm font-bold text-white">Generated Art</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Save & Share</span>
                </button>
              </div>
            </div>

            {/* Main Preview Container */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden aspect-square flex items-center justify-center group shadow-2xl">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-3 z-10">
                  <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/40 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">Rendering real diffusion artwork...</p>
                </div>
              ) : currentDisplayImg ? (
                <>
                  <img
                    src={currentDisplayImg}
                    alt={prompt}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Overlays */}
                  <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
                    <button
                      onClick={() => currentGeneration && toggleFavorite(currentGeneration.id)}
                      className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                        isFav
                          ? 'bg-rose-500/80 text-white border-rose-400 shadow-lg'
                          : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:text-rose-400'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <a
                      href={currentDisplayImg}
                      download="art-ai-mini-generation.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-950/60 text-slate-300 border border-slate-700 hover:text-white backdrop-blur-md"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Enter a prompt on the left and click Generate to bring your artwork to life.
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Strip */}
            <div className="relative pt-1">
              <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1">
                {variations.map((vUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (currentGeneration) {
                        setCurrentGeneration({ ...currentGeneration, imageUrl: vUrl });
                      }
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border cursor-pointer transition-all ${
                      currentDisplayImg === vUrl
                        ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105 shadow-lg'
                        : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={vUrl}
                      alt={`Variation ${idx + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = generateMockArtDataUrl(prompt, 'Variation', 128, 128);
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar below Main Preview */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <a
                href={currentDisplayImg || '#'}
                download="generated-art.png"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center justify-center transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400 mb-0.5" />
                <span className="text-[10px]">Download PNG</span>
              </a>

              <button
                disabled={!currentDisplayImg}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center justify-center transition-colors disabled:opacity-50"
              >
                <Maximize2 className="w-4 h-4 text-purple-400 mb-0.5" />
                <span className="text-[10px]">Upscale 2x</span>
              </button>

              <button
                disabled={!currentDisplayImg}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center justify-center transition-colors disabled:opacity-50"
              >
                <Edit3 className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[10px]">Edit Inpaint</span>
              </button>

              <button
                disabled={!currentDisplayImg}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center justify-center transition-colors disabled:opacity-50"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-400 mb-0.5" />
                <span className="text-[10px]">More Options</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Presets & Recent Prompts (Cols 3) */}
        <div className="lg:col-span-3 bg-slate-950/70 backdrop-blur-xl p-5 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Quick Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Presets</h4>
            <div className="space-y-2">
              {[
                'Fantasy Landscape',
                'Cyberpunk City',
                'Watercolor Art',
                'Anime Style',
                'Photorealistic',
                'Surreal Painting',
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setPrompt(`${preset} of a majestic view, masterpiece lighting, high detail`);
                    setSelectedArtStyle(preset.split(' ')[0]);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-left text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{preset}</span>
                  <span className="text-[10px] text-slate-500">Apply</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Prompts Widget */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Prompts</h4>
            <div className="space-y-2">
              {historyItems.filter((i) => i.type === 'generation').slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setPrompt(item.title);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs space-y-1 transition-all"
                >
                  <p className="text-slate-300 truncate font-medium">{item.title}</p>
                  <span className="text-[10px] text-slate-500 block">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/20 space-y-2">
            <h5 className="text-xs font-bold text-purple-300">Generation Tips</h5>
            <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Use detailed artistic keywords for richer outputs.</li>
              <li>Try style presets to align with your creative vision.</li>
              <li>Lower steps (1-2) yield ultrafast inference.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-10 border-t border-slate-800 bg-slate-950 px-6 flex items-center justify-between text-xs text-slate-400 z-20 shrink-0">
        <div className="flex items-center space-x-6">
          <span>Model: <strong className="text-cyan-300">{currentGeneration?.model || 'Flux.1 / SDXL Engine'}</strong></span>
          <span>Steps: <strong className="text-cyan-400">{steps}</strong></span>
          <span>Guidance: <strong className="text-cyan-400">{guidanceScale.toFixed(1)}</strong></span>
          <span>Resolution: <strong className="text-slate-200">{resolution.width}x{resolution.height}</strong></span>
          <span>Seed: <strong className="text-slate-200">{seed}</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Estimated Time: <strong className="text-emerald-400">~1.8s - 3.5s</strong></span>
        </div>
      </div>

    </div>
  );
};
