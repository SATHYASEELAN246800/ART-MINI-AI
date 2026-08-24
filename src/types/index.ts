export type ActiveTab = 'home' | 'generate' | 'classify' | 'ocr' | 'history' | 'gallery' | 'models' | 'settings';

export type GPUStatus = 'active' | 'connecting' | 'offline';

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  artStyle: string;
  aspectRatio: string;
  width: number;
  height: number;
  steps: number;
  guidanceScale: number;
  seed: number | null;
  highDetail: boolean;
  enhanceFace: boolean;
}

export interface GenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  artStyle: string;
  model: string;
  steps: number;
  guidanceScale: number;
  resolution: string;
  seed: number;
  executionTime: number;
  timestamp: string;
  isFavorite?: boolean;
}

export interface StylePrediction {
  label: string;
  confidence: number;
}

export interface ClassificationResult {
  id: string;
  imageUrl: string;
  model: string;
  predictedStyle: string;
  confidence: number;
  probabilities: StylePrediction[];
  executionTime: number;
  timestamp: string;
  isFavorite?: boolean;
}

export interface OCRBoundingBox {
  id: string;
  text: string;
  confidence: number;
}

export interface OCRResult {
  id: string;
  imageUrl: string;
  extractedText: string;
  detectedLanguage: string;
  languageConfidence: number;
  characterCount: number;
  wordCount: number;
  lineCount: number;
  overallConfidence: number;
  boundingBoxes: OCRBoundingBox[];
  executionTime: number;
  timestamp: string;
}

export interface AIModel {
  id: string;
  name: string;
  task: 'text-to-image' | 'image-classification' | 'vision-ocr';
  recommended?: boolean;
  description: string;
  architecture: string;
  inputSpec: string;
  outputSpec: string;
  backendRuntime: string;
  status: 'active' | 'ready' | 'offline';
  avgLatency: string;
}

export interface ApiSettings {
  baseUrl: string;
  useMockApi: boolean;
  timeout: number;
  retryCount: number;
  apiKey?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
}

export interface HistoryItem {
  id: string;
  type: 'generation' | 'classification' | 'ocr';
  thumbnailUrl: string;
  title: string;
  subtitle: string;
  timestamp: string;
  details: GenerationResult | ClassificationResult | OCRResult;
}
