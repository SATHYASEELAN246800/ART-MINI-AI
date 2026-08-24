import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { extractTextApi } from '../../services/ocrApi';
import { OCRResult } from '../../types';
import {
  FileText,
  UploadCloud,
  Loader2,
  Copy,
  Download,
  Trash2,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
  FileCheck,
} from 'lucide-react';

export const ImageToTextView: React.FC = () => {
  const { currentOCR, setCurrentOCR, addHistoryItem } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  );
  const [recognitionMode, setRecognitionMode] = useState<string>('smart');
  const [detectLang, setDetectLang] = useState<boolean>(true);
  const [improveAcc, setImproveAcc] = useState<boolean>(true);
  const [preserveLayout, setPreserveLayout] = useState<boolean>(false);
  const [filterNoise, setFilterNoise] = useState<boolean>(true);

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleExtract = async () => {
    if (!previewUrl) {
      setErrorMsg('Please select an image first.');
      return;
    }

    setIsExtracting(true);
    setErrorMsg(null);

    try {
      const result = await extractTextApi(selectedFile || previewUrl, recognitionMode);
      setCurrentOCR(result);

      addHistoryItem({
        id: result.id,
        type: 'ocr',
        thumbnailUrl: result.imageUrl,
        title: result.extractedText.slice(0, 30) + '...',
        subtitle: `Language: ${result.detectedLanguage} (${(result.languageConfidence * 100).toFixed(0)}%)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        details: result,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopy = () => {
    if (currentOCR) {
      navigator.clipboard.writeText(currentOCR.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-transparent text-white overflow-hidden">
      
      {/* Main Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Controls (Cols 3) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-950/70 backdrop-blur-xl p-4 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Upload Image */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                1
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase">Upload Image</span>
            </div>

            <label className="block border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/50 transition-all">
              <UploadCloud className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">Drag & drop your image here</p>
              <p className="text-[10px] text-slate-500 mt-1">Supports: JPG, PNG, WEBP (Max 10MB)</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Section 2: Recognition Mode */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                2
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase">Recognition Mode</span>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'smart', label: 'Smart OCR (Auto Detect)', desc: 'Detects and extracts text from image' },
                { id: 'handwritten', label: 'Handwritten Text', desc: 'Better for handwritten content' },
                { id: 'printed', label: 'Printed Text', desc: 'Optimized for printed documents' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setRecognitionMode(mode.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    recognitionMode === mode.id
                      ? 'bg-purple-950/60 border-purple-500 text-white font-semibold shadow-md shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{mode.label}</span>
                    {recognitionMode === mode.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Advanced Options */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                3
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase">Advanced Options</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Detect Language</span>
                <input type="checkbox" checked={detectLang} onChange={(e) => setDetectLang(e.target.checked)} className="accent-purple-500" />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Improve Accuracy</span>
                <input type="checkbox" checked={improveAcc} onChange={(e) => setImproveAcc(e.target.checked)} className="accent-purple-500" />
              </label>

              <label className="flex items-center justify-between text-slate-300 cursor-pointer">
                <span>Filter Noise</span>
                <input type="checkbox" checked={filterNoise} onChange={(e) => setFilterNoise(e.target.checked)} className="accent-purple-500" />
              </label>
            </div>
          </div>

          {/* Extract Button */}
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-extrabold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>✦ Extract Text</span>
              </>
            )}
          </button>
        </div>

        {/* MIDDLE COLUMN: Image Preview & Quick Actions (Cols 5) */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl p-4 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                  4
                </span>
                <h3 className="text-xs font-bold text-white uppercase">Image Preview</h3>
              </div>
            </div>

            {/* Main Preview Container */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-2xl">
              {previewUrl ? (
                <img src={previewUrl} alt="OCR Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-slate-500">No image loaded</p>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                  5
                </span>
                <h4 className="text-xs font-bold text-slate-300 uppercase">Quick Actions</h4>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center"
                >
                  <Copy className="w-4 h-4 text-cyan-400 mb-1" />
                  <span>Copy Text</span>
                </button>

                <button className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center">
                  <Download className="w-4 h-4 text-purple-400 mb-1" />
                  <span>Download TXT</span>
                </button>

                <button className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 flex flex-col items-center justify-center">
                  <FileCheck className="w-4 h-4 text-emerald-400 mb-1" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setCurrentOCR(null);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-rose-400 flex flex-col items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mb-1" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Extracted Text & Statistics (Cols 4) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-400 text-[10px] font-extrabold flex items-center justify-center border border-purple-500/40">
                6
              </span>
              <h3 className="text-xs font-bold text-white uppercase">Extracted Text</h3>
            </div>

            <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1">
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy All'}</span>
            </button>
          </div>

          {currentOCR ? (
            <div className="space-y-4">
              {/* Success Banner */}
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
                <span>Text extracted successfully!</span>
                <Check className="w-4 h-4" />
              </div>

              {/* Text Output Box */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                {currentOCR.extractedText}
              </div>

              {/* Detected Language */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Detected Language</span>
                </span>
                <span className="font-bold text-emerald-400">
                  {currentOCR.detectedLanguage} ({(currentOCR.languageConfidence * 100).toFixed(1)}%)
                </span>
              </div>

              {/* Text Statistics */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Characters</span>
                  <span className="text-xs font-extrabold text-white">{currentOCR.characterCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Words</span>
                  <span className="text-xs font-extrabold text-white">{currentOCR.wordCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Lines</span>
                  <span className="text-xs font-extrabold text-white">{currentOCR.lineCount}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Confidence</span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {(currentOCR.overallConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bounding Boxes List */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase">
                  Bounding Boxes ({currentOCR.boundingBoxes.length})
                </h5>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {currentOCR.boundingBoxes.map((box) => (
                    <div key={box.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate pr-2">T {box.text}</span>
                      <span className="text-emerald-400 font-bold text-[10px]">
                        {(box.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Click Extract Text to process document text and confidence metrics.
            </div>
          )}

        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-9 border-t border-slate-800 bg-slate-950 px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center space-x-6">
          <span>Engine: <strong className="text-cyan-300">{currentOCR?.id.startsWith('qwen') ? 'Ollama Qwen2.5-VL' : 'Tesseract Neural OCR (Client Vision)'}</strong></span>
          <span>Accuracy: <strong className="text-emerald-400">High ({(currentOCR?.overallConfidence ? currentOCR.overallConfidence * 100 : 98).toFixed(1)}%) 🟢</strong></span>
        </div>
        <span>Processed in: <strong className="text-emerald-400">{currentOCR ? `${currentOCR.executionTime.toFixed(2)}s` : '1.24s'}</strong></span>
      </div>

    </div>
  );
};
