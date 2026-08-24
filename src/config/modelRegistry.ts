import { AIModel } from '../types';

export const MODEL_REGISTRY: AIModel[] = [
  {
    id: 'sdxl-turbo',
    name: 'SDXL-Turbo',
    task: 'text-to-image',
    recommended: true,
    description: 'Ultra-fast single-step real-time text-to-image diffusion model. High fidelity photo & digital art generation.',
    architecture: 'Adversarial Diffusion Distillation (ADD)',
    inputSpec: 'Text Prompt, Style Preset, Seed, Dimensions (512-1024px), Steps (1-4)',
    outputSpec: 'High Resolution Image (Base64 / WebP / PNG)',
    backendRuntime: 'Google Colab (PyTorch + CUDA GPU)',
    status: 'active',
    avgLatency: '~1.8s - 3.5s',
  },
  {
    id: 'mobilenetv3-small',
    name: 'MobileNetV3-Small',
    task: 'image-classification',
    recommended: true,
    description: 'Lightweight deep convolutional neural network fine-tuned for high-accuracy historical & modern art style classification.',
    architecture: 'MobileNetV3-Small + Squeeze-and-Excitation + Hard-Swish',
    inputSpec: 'RGB Image (JPEG, PNG, WEBP - Max 10MB)',
    outputSpec: 'Style Probabilities & Multi-class Confidence Scores',
    backendRuntime: 'Google Colab (PyTorch / ONNX)',
    status: 'active',
    avgLatency: '~0.4s - 0.9s',
  },
  {
    id: 'qwen2.5-vl-7b',
    name: 'Qwen2.5-VL Vision AI (7B)',
    task: 'vision-ocr',
    recommended: true,
    description: 'State-of-the-art vision-language multimodal model fine-tuned for visual document understanding, complex text extraction, and scene reasoning via local Ollama.',
    architecture: 'Qwen2.5-VL-7B-Instruct (qwen2.5-vl:7b-q4_K_M)',
    inputSpec: 'RGB Image (JPEG, PNG, WEBP) + Vision Instruction Prompt',
    outputSpec: 'Transcribed Text, Multilingual Understanding & Spatial Reasoning',
    backendRuntime: 'Local Ollama Engine (qwen2.5-vl:7b-q4_K_M)',
    status: 'active',
    avgLatency: '~1.5s - 3.2s',
  },
];

export const ART_STYLES = [
  'Auto',
  'Oil Painting',
  'Watercolor',
  'Digital Art',
  'Realism',
  'Surrealism',
  'Impressionism',
  'Expressionism',
  'Anime Style',
  'Cinematic',
  'Renaissance',
  'Baroque',
  'Ukiyo-e',
  'Art Nouveau',
  'Cyberpunk',
];

export const ASPECT_RATIOS = [
  { label: '1:1 (Square)', width: 512, height: 512, icon: 'Square' },
  { label: '16:9 (Landscape)', width: 912, height: 512, icon: 'Monitor' },
  { label: '4:3 (Classic)', width: 680, height: 512, icon: 'Tv' },
  { label: '3:4 (Portrait)', width: 512, height: 680, icon: 'Smartphone' },
  { label: '9:16 (Story)', width: 512, height: 912, icon: 'Smartphone' },
];

export const PROMPT_PRESETS = [
  'A beautiful oil painting of a traditional Tamil village at sunset, warm natural lighting, detailed brush strokes, classical fine art composition',
  'Cyberpunk city with neon lights, futuristic skyscrapers, rain-slicked streets, flying vehicles, highly detailed 8k rendering',
  'Watercolor of a serene mountain landscape with a misty lake, soft pastels, ink splatters, masterpiece studio lighting',
  'Renaissance portrait of a noble figure surrounded by floral elements, rich chiaroscuro lighting, museum quality canvas texture',
  'Surrealist clock melting over a desert vista under starry cosmic sky, Salvador Dali style, vibrant dreamscape',
  'Japanese Ukiyo-e woodblock print of Mount Fuji with cherry blossoms and ocean wave, traditional block ink artwork',
];
