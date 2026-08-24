/**
 * Procedural Art Canvas Renderer for ART AI MINI
 * Generates dynamic high-resolution creative artworks based on prompt and art style
 */

export const generateMockArtDataUrl = (
  prompt: string,
  artStyle: string,
  width: number = 512,
  height: number = 512
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const lowerPrompt = (prompt + ' ' + artStyle).toLowerCase();

  // Color Palettes based on prompt keywords
  let colors = ['#0f2027', '#203a43', '#2c5364', '#ff7e5f', '#feb47b'];

  if (lowerPrompt.includes('sunset') || lowerPrompt.includes('tamil') || lowerPrompt.includes('village') || lowerPrompt.includes('oil')) {
    colors = ['#1a0500', '#4a1204', '#8c2d19', '#d9531e', '#f39c12', '#f1c40f', '#ffeaa7'];
  } else if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('city') || lowerPrompt.includes('neon')) {
    colors = ['#050515', '#1a0b2e', '#4c1d95', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'];
  } else if (lowerPrompt.includes('water') || lowerPrompt.includes('mountain') || lowerPrompt.includes('lake') || lowerPrompt.includes('serene')) {
    colors = ['#031024', '#0c2340', '#1e4b7a', '#38bdf8', '#7dd3fc', '#a7f3d0', '#ecfdf5'];
  } else if (lowerPrompt.includes('renaissance') || lowerPrompt.includes('baroque') || lowerPrompt.includes('portrait')) {
    colors = ['#180e05', '#331e0b', '#5c3818', '#94602c', '#d4af37', '#f4e0c0'];
  } else if (lowerPrompt.includes('ukiyo') || lowerPrompt.includes('japan') || lowerPrompt.includes('wave')) {
    colors = ['#0b1d3a', '#1e3a8a', '#2563eb', '#38bdf8', '#f8fafc', '#f43f5e'];
  } else if (lowerPrompt.includes('surreal') || lowerPrompt.includes('dali') || lowerPrompt.includes('clock')) {
    colors = ['#1e0a2b', '#4c1d95', '#8b5cf6', '#c084fc', '#fbbf24', '#f43f5e'];
  }

  // Draw Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, colors[0]);
  bgGrad.addColorStop(0.5, colors[1]);
  bgGrad.addColorStop(1, colors[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw Sun / Celestial Orbs
  const sunX = width * 0.5;
  const sunY = height * 0.4;
  const sunRadius = Math.min(width, height) * 0.22;

  const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, sunRadius);
  sunGrad.addColorStop(0, colors[colors.length - 1]);
  sunGrad.addColorStop(0.4, colors[colors.length - 2]);
  sunGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw Mountains / Horizons / Waves
  const drawLayer = (yOffset: number, amp: number, color: string, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 15) {
      const y = height * yOffset + Math.sin(x * 0.015) * amp + Math.cos(x * 0.03) * (amp * 0.5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawLayer(0.65, 30, colors[2], 0.8);
  drawLayer(0.72, 20, colors[1], 0.9);
  drawLayer(0.82, 15, colors[0], 1.0);

  // Draw Brush Strokes / Circuitry Art Overlay
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    const rw = 40 + Math.random() * 120;
    const rh = 4 + Math.random() * 12;
    const angle = (Math.random() - 0.5) * 0.8;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(angle);
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.globalAlpha = 0.15 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 6);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Add Fine Canvas Grain / Texture
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Signature / Stamp watermark
  ctx.save();
  ctx.font = '600 12px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('ART AI MINI • SDXL-TURBO', 16, height - 16);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
