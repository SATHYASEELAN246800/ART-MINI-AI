import React from 'react';
import { useApp } from '../../context/AppContext';
import { MODEL_REGISTRY } from '../../config/modelRegistry';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw, Zap, Server, Activity } from 'lucide-react';

export const ModelsView: React.FC = () => {
  const { gpuStatus, gpuMessage, refreshHealth, apiSettings } = useApp();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-white p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">AI Model Registry & Colab Backend</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Confirmed production model architectures, inference parameters, and GPU health metrics
            </p>
          </div>

          <button
            onClick={refreshHealth}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center space-x-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Test API Health</span>
          </button>
        </div>

        {/* Global Backend Status Summary */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Google Colab & Hybrid Cloud Pipeline</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-700 text-slate-300">
                  {apiSettings.useMockApi ? 'Mock Mode Enabled' : 'Live Multi-Engine Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Stack: <span className="text-cyan-300 font-semibold">Managed Cloud AI & Local Hybrid Vision Engine</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">GPU Status</span>
            <span className="text-sm font-extrabold text-emerald-400">{gpuMessage}</span>
          </div>
        </div>

        {/* Models Registry Cards */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Production Models</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODEL_REGISTRY.map((model) => (
              <div
                key={model.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      {model.task}
                    </span>

                    {model.recommended && (
                      <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Primary Model
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl font-extrabold text-white">{model.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Architecture</span>
                    <span className="text-slate-200 font-mono text-[11px]">{model.architecture}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Input Contract</span>
                    <span className="text-slate-300 text-[11px]">{model.inputSpec}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] font-semibold uppercase">Output Contract</span>
                    <span className="text-slate-300 text-[11px]">{model.outputSpec}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 text-[11px]">Average Latency</span>
                    <span className="text-emerald-400 font-bold text-[11px]">{model.avgLatency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
