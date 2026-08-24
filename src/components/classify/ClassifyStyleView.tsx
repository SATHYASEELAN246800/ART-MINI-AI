import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { classifyImageApi } from '../../services/classificationApi';
import { ClassificationResult } from '../../types';
import {
  UploadCloud,
  ScanEye,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export const ClassifyStyleView: React.FC = () => {
  const { currentClassification, setCurrentClassification, addHistoryItem, setActiveTab, setSelectedArtStyle } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  );
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleClassify = async () => {
    if (!previewUrl) {
      setErrorMsg('Please select or upload an image first.');
      return;
    }

    setIsClassifying(true);
    setErrorMsg(null);

    try {
      const result: ClassificationResult = await classifyImageApi(selectedFile || previewUrl);
      setCurrentClassification(result);

      addHistoryItem({
        id: result.id,
        type: 'classification',
        thumbnailUrl: result.imageUrl,
        title: `Style: ${result.predictedStyle}`,
        subtitle: `MobileNetV3 • ${(result.confidence * 100).toFixed(1)}% Confidence`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        details: result,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to classify image style');
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-transparent text-white overflow-hidden">
      
      {/* Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Input & Upload (Cols 4) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl p-5 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Upload Artwork */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 text-[10px] font-extrabold flex items-center justify-center border border-cyan-500/40">
                1
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Upload Artwork</span>
            </div>

            <label className="block border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 text-center cursor-pointer bg-[#0b0f19] transition-all">
              <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300">Drag & drop your artwork here</p>
              <p className="text-[10px] text-slate-500 mt-1">Supports: JPG, PNG, WEBP (Max 10MB)</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Section 2: Model Configuration */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 text-[10px] font-extrabold flex items-center justify-center border border-cyan-500/40">
                2
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Classification Engine</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">MobileNetV3-Small</span>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Ultra Fast
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Deep convolutional neural network trained on 10+ classical art styles</p>
            </div>
          </div>

          {/* Error Display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleClassify}
            disabled={isClassifying}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-extrabold text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95 disabled:opacity-50"
          >
            {isClassifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Art Features...</span>
              </>
            ) : (
              <>
                <ScanEye className="w-4 h-4" />
                <span>✦ Classify Art Style</span>
              </>
            )}
          </button>

        </div>

        {/* MIDDLE COLUMN: Image Preview (Cols 4) */}
        <div className="lg:col-span-4 border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-xl p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 text-[10px] font-extrabold flex items-center justify-center border border-cyan-500/40">
                3
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Image Preview</h3>
            </div>

            <div className="relative rounded-2xl bg-[#0b0f19] border border-slate-800 overflow-hidden aspect-square flex items-center justify-center shadow-2xl">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-slate-500">No image loaded</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Style Predictions & Probability (Cols 4) */}
        <div className="lg:col-span-4 bg-slate-950/70 backdrop-blur-xl p-5 space-y-5 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-cyan-600/30 text-cyan-400 text-[10px] font-extrabold flex items-center justify-center border border-cyan-500/40">
              4
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Style Analysis Results</h3>
          </div>

          {currentClassification ? (
            <div className="space-y-4">
              
              {/* Primary Style Result Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/40 space-y-2 shadow-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Detected Style</span>
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-black text-cyan-300">{currentClassification.predictedStyle}</h4>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-extrabold">
                    {(currentClassification.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
              </div>

              {/* Ranked Probability Distribution */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Style Probabilities</h5>
                <div className="space-y-2.5">
                  {currentClassification.probabilities.map((item, idx) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-cyan-400 font-bold">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Generate in this style */}
              <button
                onClick={() => {
                  setSelectedArtStyle(currentClassification.predictedStyle);
                  setActiveTab('generate');
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex items-center justify-center space-x-2 transition-colors"
              >
                <span>Generate Art in {currentClassification.predictedStyle} Style</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="p-8 text-center bg-[#0b0f19] rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Upload an image and click Classify Art Style to analyze features and ranked probability distributions.
            </div>
          )}

        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-10 border-t border-slate-800/80 bg-[#060810] px-6 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center space-x-6">
          <span>Model: <strong className="text-cyan-300">{currentClassification?.model || 'Vision Neural Classifier (Feature Engine)'}</strong></span>
          <span>Task: <strong className="text-cyan-400">Art Style Classification</strong></span>
          <span>Classes: <strong className="text-slate-200">10 Styles</strong></span>
        </div>
        <span>Inference Time: <strong className="text-emerald-400">{currentClassification ? `${currentClassification.executionTime.toFixed(2)}s` : '0.45s'}</strong></span>
      </div>

    </div>
  );
};
