import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Trash2, Wand2, ScanEye, FileText, ExternalLink } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { historyItems, clearHistory, setActiveTab, setCurrentGeneration, setCurrentClassification, setCurrentOCR } = useApp();
  const [filter, setFilter] = useState<'all' | 'generation' | 'classification' | 'ocr'>('all');

  const filteredItems = historyItems.filter((item) => filter === 'all' || item.type === filter);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent text-white p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Creative History & Logs</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Locally persisted records of your text generations, art style classifications, and text extractions
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={clearHistory}
              disabled={historyItems.length === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          {[
            { id: 'all', label: 'All Activities' },
            { id: 'generation', label: 'Generations' },
            { id: 'classification', label: 'Classifications' },
            { id: 'ocr', label: 'Text Extractions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === tab.id
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid / List */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isGen = item.type === 'generation';
              const isCls = item.type === 'classification';
              const isOcr = item.type === 'ocr';

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-4 space-y-3 transition-all hover:scale-[1.01] shadow-xl"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] font-bold text-white backdrop-blur-md flex items-center space-x-1">
                      {isGen && <Wand2 className="w-3 h-3 text-amber-400" />}
                      {isCls && <ScanEye className="w-3 h-3 text-cyan-400" />}
                      {isOcr && <FileText className="w-3 h-3 text-purple-400" />}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.subtitle}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">{item.timestamp}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (isGen) {
                        setCurrentGeneration(item.details as any);
                        setActiveTab('generate');
                      } else if (isCls) {
                        setCurrentClassification(item.details as any);
                        setActiveTab('classify');
                      } else if (isOcr) {
                        setCurrentOCR(item.details as any);
                        setActiveTab('ocr');
                      }
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-cyan-400 flex items-center justify-center space-x-1"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">No History Found</h4>
            <p className="text-xs text-slate-500">Your recent generations and analyses will appear here automatically.</p>
          </div>
        )}

      </div>
    </div>
  );
};
