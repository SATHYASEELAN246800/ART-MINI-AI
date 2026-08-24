import { ApiSettings } from '../types';

const STORAGE_KEY = 'art_ai_mini_api_settings';

export const DEFAULT_COLAB_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
export const DEFAULT_OLLAMA_VISION_MODEL = (import.meta.env.VITE_OLLAMA_VISION_MODEL as string) || 'qwen2.5-vl:7b-q4_K_M';
export const DEFAULT_OLLAMA_URL = (import.meta.env.VITE_OLLAMA_BASE_URL as string) || 'http://localhost:11434';

export const DEFAULT_API_SETTINGS: ApiSettings = {
  baseUrl: DEFAULT_COLAB_URL,
  useMockApi: false,
  timeout: 8000,
  retryCount: 2,
  ollamaUrl: DEFAULT_OLLAMA_URL,
  ollamaModel: DEFAULT_OLLAMA_VISION_MODEL,
};

export const getApiSettings = (): ApiSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_API_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to read API settings from localStorage:', e);
  }
  return DEFAULT_API_SETTINGS;
};

export const saveApiSettings = (settings: ApiSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save API settings to localStorage:', e);
  }
};
