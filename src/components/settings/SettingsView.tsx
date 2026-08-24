import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, RefreshCw, Trash2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { apiSettings, updateApiSettings, clearHistory, refreshHealth, gpuStatus, gpuMessage } = useApp();

  const [baseUrl, setBaseUrl] = useState<string>(apiSettings.baseUrl);
  const [useMockApi, setUseMockApi] = useState<boolean>(apiSettings.useMockApi);
  const [apiKey, setApiKey] = useState<string>(apiSettings.apiKey || '');
  const [timeout, setTimeoutVal] = useState<number>(apiSettings.timeout / 1000);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    updateApiSettings({
      baseUrl: baseUrl.trim(),
      useMockApi,
      apiKey: apiKey.trim(),
      timeout: timeout * 1000,
      retryCount: apiSettings.retryCount,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Settings className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Application & API Configuration</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure Google Colab inference endpoints, API adapters, timeout boundaries, and data preferences
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          
          {/* Section: Backend Endpoint */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Google Colab / Inference Endpoint
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">API Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://xxxx-colab.ngrok-free.app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[10px] text-slate-500">
                Paste your ngrok/localtunnel URL provided by the Google Colab backend script.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">API Secret Key (Optional)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Bearer token or API Key"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Local Ollama Vision AI Model</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Ollama Host URL</label>
                  <input
                    type="text"
                    value={apiSettings.ollamaUrl || 'http://localhost:11434'}
                    onChange={(e) => updateApiSettings({ ...apiSettings, ollamaUrl: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Vision AI Model</label>
                  <input
                    type="text"
                    value={apiSettings.ollamaModel || 'qwen2.5-vl:7b-q4_K_M'}
                    onChange={(e) => updateApiSettings({ ...apiSettings, ollamaModel: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Health Status */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-400">Current Health:</span>
              <span className="text-xs font-bold text-emerald-400">{gpuMessage}</span>
            </div>

            <button
              onClick={refreshHealth}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping /health</span>
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved & adapter re-initialized!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

        </div>

        {/* Privacy & Cache Management */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Local History & Cache</h4>
            <p className="text-xs text-slate-400 mt-0.5">Clear stored generations, thumbnails, and preference logs</p>
          </div>

          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Storage</span>
          </button>
        </div>

      </div>
    </div>
  );
};
