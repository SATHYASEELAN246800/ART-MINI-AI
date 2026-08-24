import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTab, GPUStatus, GenerationResult, ClassificationResult, OCRResult, HistoryItem, ApiSettings } from '../types';
import { getApiSettings, saveApiSettings as persistApiSettings } from '../config/apiConfig';
import { checkApiHealth } from '../services/apiService';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  gpuStatus: GPUStatus;
  gpuMessage: string;
  refreshHealth: () => Promise<void>;
  apiSettings: ApiSettings;
  updateApiSettings: (newSettings: ApiSettings) => void;
  historyItems: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  currentGeneration: GenerationResult | null;
  setCurrentGeneration: (gen: GenerationResult | null) => void;
  currentClassification: ClassificationResult | null;
  setCurrentClassification: (cls: ClassificationResult | null) => void;
  currentOCR: OCRResult | null;
  setCurrentOCR: (ocr: OCRResult | null) => void;
  selectedArtStyle: string;
  setSelectedArtStyle: (style: string) => void;
  initialPrompt: string;
  setInitialPrompt: (prompt: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'art_ai_mini_history';
const FAVORITES_STORAGE_KEY = 'art_ai_mini_favorites';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [gpuStatus, setGpuStatus] = useState<GPUStatus>('active');
  const [gpuMessage, setGpuMessage] = useState<string>('🟢 GPU Active');
  const [apiSettings, setApiSettingsState] = useState<ApiSettings>(getApiSettings());
  const [selectedArtStyle, setSelectedArtStyle] = useState<string>('Auto');
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  const [currentGeneration, setCurrentGeneration] = useState<GenerationResult | null>(null);
  const [currentClassification, setCurrentClassification] = useState<ClassificationResult | null>(null);
  const [currentOCR, setCurrentOCR] = useState<OCRResult | null>(null);

  // Load history from LocalStorage
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load favorites from LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (e) {
      console.error('Failed to store history:', e);
    }
  }, [historyItems]);

  // Save favorites on change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to store favorites:', e);
    }
  }, [favorites]);

  const refreshHealth = async () => {
    setGpuStatus('connecting');
    setGpuMessage('🟡 Connecting...');
    const health = await checkApiHealth();
    setGpuStatus(health.status);
    setGpuMessage(health.message);
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 35000);
    return () => clearInterval(interval);
  }, [apiSettings]);

  const updateApiSettings = (newSettings: ApiSettings) => {
    setApiSettingsState(newSettings);
    persistApiSettings(newSettings);
    refreshHealth();
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistoryItems((prev) => [item, ...prev.slice(0, 49)]); // keep max 50 items
  };

  const clearHistory = () => {
    setHistoryItems([]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        gpuStatus,
        gpuMessage,
        refreshHealth,
        apiSettings,
        updateApiSettings,
        historyItems,
        addHistoryItem,
        clearHistory,
        favorites,
        toggleFavorite,
        currentGeneration,
        setCurrentGeneration,
        currentClassification,
        setCurrentClassification,
        currentOCR,
        setCurrentOCR,
        selectedArtStyle,
        setSelectedArtStyle,
        initialPrompt,
        setInitialPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
