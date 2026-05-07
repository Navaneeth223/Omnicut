/**
 * Effect Renderer
 * Applies effects to video frames during rendering
 */

import type { Effect, EffectParameter } from '@omnicut/core';

/**
 * Apply effects to a video frame
 */
export function applyEffectsToFrame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  effects: Effect[]
): void {
  // Apply each enabled effect in order
  for (const effect of effects) {
    if (!effect.enabled) continue;

    switch (effect.type) {
      case 'brightness_contrast':
        applyBrightnessContrast(ctx, canvas, effect.parameters);
        break;
      case 'hue_saturation':
        applyHueSaturation(ctx, canvas, effect.parameters);
        break;
      case 'gaussian_blur':
        applyGaussianBlur(ctx, canvas, effect.parameters);
        break;
      case 'sharpen':
        applySharpen(ctx, canvas, effect.parameters);
        break;
      case 'vignette':
        applyVignette(ctx, canvas, effect.parameters);
        break;
      case 'transform':
        applyTransform(ctx, canvas, effect.parameters);
        break;
      // Add more effects as needed
      default:
        console.warn(`[EffectRenderer] Unknown effect type: ${effect.type}`);
    }
  }
}

/**
 * Apply brightness and contrast
 */
function applyBrightnessContrast(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const brightness = getParameterValue(parameters, 'brightness', 0);
  const contrast = getParameterValue(parameters, 'contrast', 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    // Apply brightness
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;

    // Apply contrast
    data[i] = contrastFactor * (data[i] - 128) + 128;
    data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
    data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;

    // Clamp values
    data[i] = Math.max(0, Math.min(255, data[i]));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply hue and saturation
 */
function applyHueSaturation(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const hue = getParameterValue(parameters, 'hue', 0);
  const saturation = getParameterValue(parameters, 'saturation', 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert RGB to HSL
    const hsl = rgbToHsl(r, g, b);

    // Adjust hue and saturation
    hsl[0] = (hsl[0] + hue / 360) % 1;
    hsl[1] = Math.max(0, Math.min(1, hsl[1] + saturation / 100));

    // Convert back to RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply Gaussian blur
 */
function applyGaussianBlur(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const radius = getParameterValue(parameters, 'radius', 0);

  if (radius > 0) {
    ctx.filter = `blur(${radius}px)`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';
  }
}

/**
 * Apply sharpen
 */
function applySharpen(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const amount = getParameterValue(parameters, 'amount', 100) / 100;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sharpen kernel
  const kernel = [
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0,
  ];

  const output = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            sum += data[idx] * kernel[kernelIdx];
          }
        }
        const idx = (y * width + x) * 4 + c;
        output[idx] = Math.max(0, Math.min(255, sum));
      }
      // Copy alpha
      const idx = (y * width + x) * 4;
      output[idx + 3] = data[idx + 3];
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply vignette
 */
function applyVignette(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const amount = getParameterValue(parameters, 'amount', 50) / 100;
  const size = getParameterValue(parameters, 'size', 50) / 100;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    maxRadius * size,
    centerX,
    centerY,
    maxRadius
  );

  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${amount})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Apply transform
 */
function applyTransform(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  parameters: EffectParameter[]
): void {
  const scale = getParameterValue(parameters, 'scale', 100) / 100;
  const rotation = getParameterValue(parameters, 'rotation', 0);
  const x = getParameterValue(parameters, 'x', 0);
  const y = getParameterValue(parameters, 'y', 0);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(canvas, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2 + x, canvas.height / 2 + y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);
  ctx.restore();
}

/**
 * Get parameter value by ID
 */
function getParameterValue(
  parameters: EffectParameter[],
  id: string,
  defaultValue: number
): number {
  const param = parameters.find((p) => p.id === id);
  return param ? Number(param.value) : defaultValue;
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h, s, l];
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
