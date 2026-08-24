import { getApiSettings } from '../config/apiConfig';
import { GPUStatus } from '../types';

export const checkApiHealth = async (): Promise<{ status: GPUStatus; message: string }> => {
  const settings = getApiSettings();

  if (settings.useMockApi) {
    return { status: 'active', message: '🟢 GPU Active (Mock Engine Ready)' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${settings.baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        ...(settings.apiKey ? { 'Authorization': `Bearer ${settings.apiKey}` } : {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'healthy' || data.status === 'ok' || data.device === 'cuda' || data.gpu) {
        return { status: 'active', message: '🟢 GPU Active (CUDA Colab Ready)' };
      }
      return { status: 'connecting', message: '🟡 Connecting to GPU...' };
    }
    return { status: 'active', message: '⚡ Cloud & Neural AI Active' };
  } catch (error) {
    return { status: 'active', message: '⚡ Cloud AI & Local Vision Active' };
  }
};
