/**
 * Transition Renderer
 * Applies transitions between video clips during rendering
 */

import type { Transition } from '@omnicut/core';

/**
 * Apply transition between two frames
 */
export function applyTransition(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  transition: Transition,
  progress: number
): void {
  // Progress is 0 to 1 (0 = start, 1 = end)
  switch (transition.type) {
    case 'crossfade':
      applyCrossfade(ctx, canvas, fromFrame, toFrame, progress);
      break;
    case 'fade':
      applyFade(ctx, canvas, fromFrame, toFrame, progress);
      break;
    case 'dip_to_black':
      applyDipToBlack(ctx, canvas, fromFrame, toFrame, progress);
      break;
    case 'dip_to_white':
      applyDipToWhite(ctx, canvas, fromFrame, toFrame, progress);
      break;
    case 'wipe_left':
      applyWipe(ctx, canvas, fromFrame, toFrame, progress, 'left');
      break;
    case 'wipe_right':
      applyWipe(ctx, canvas, fromFrame, toFrame, progress, 'right');
      break;
    case 'wipe_up':
      applyWipe(ctx, canvas, fromFrame, toFrame, progress, 'up');
      break;
    case 'wipe_down':
      applyWipe(ctx, canvas, fromFrame, toFrame, progress, 'down');
      break;
    case 'push_left':
      applyPush(ctx, canvas, fromFrame, toFrame, progress, 'left');
      break;
    case 'push_right':
      applyPush(ctx, canvas, fromFrame, toFrame, progress, 'right');
      break;
    case 'zoom_in':
      applyZoom(ctx, canvas, fromFrame, toFrame, progress, 'in');
      break;
    case 'zoom_out':
      applyZoom(ctx, canvas, fromFrame, toFrame, progress, 'out');
      break;
    default:
      // Default to crossfade
      applyCrossfade(ctx, canvas, fromFrame, toFrame, progress);
  }
}

/**
 * Apply crossfade transition
 */
function applyCrossfade(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw from frame with decreasing opacity
  ctx.globalAlpha = 1 - progress;
  ctx.drawImage(fromFrame, 0, 0, canvas.width, canvas.height);

  // Draw to frame with increasing opacity
  ctx.globalAlpha = progress;
  ctx.drawImage(toFrame, 0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;
}

/**
 * Apply fade transition
 */
function applyFade(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (progress < 0.5) {
    // Fade out from frame
    ctx.globalAlpha = 1 - progress * 2;
    ctx.drawImage(fromFrame, 0, 0, canvas.width, canvas.height);
  } else {
    // Fade in to frame
    ctx.globalAlpha = (progress - 0.5) * 2;
    ctx.drawImage(toFrame, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = 1;
}

/**
 * Apply dip to black transition
 */
function applyDipToBlack(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (progress < 0.5) {
    // Fade to black
    ctx.globalAlpha = 1 - progress * 2;
    ctx.drawImage(fromFrame, 0, 0, canvas.width, canvas.height);
  } else {
    // Fade from black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = (progress - 0.5) * 2;
    ctx.drawImage(toFrame, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = 1;
}

/**
 * Apply dip to white transition
 */
function applyDipToWhite(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (progress < 0.5) {
    // Fade to white
    ctx.globalAlpha = 1 - progress * 2;
    ctx.drawImage(fromFrame, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = progress * 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Fade from white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = (progress - 0.5) * 2;
    ctx.drawImage(toFrame, 0, 0, canvas.width, canvas.height);
  }

  ctx.globalAlpha = 1;
}

/**
 * Apply wipe transition
 */
function applyWipe(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number,
  direction: 'left' | 'right' | 'up' | 'down'
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw from frame
  ctx.drawImage(fromFrame, 0, 0, canvas.width, canvas.height);

  // Draw to frame with clipping
  ctx.save();

  switch (direction) {
    case 'left':
      ctx.rect(0, 0, canvas.width * progress, canvas.height);
      break;
    case 'right':
      ctx.rect(canvas.width * (1 - progress), 0, canvas.width * progress, canvas.height);
      break;
    case 'up':
      ctx.rect(0, 0, canvas.width, canvas.height * progress);
      break;
    case 'down':
      ctx.rect(0, canvas.height * (1 - progress), canvas.width, canvas.height * progress);
      break;
  }

  ctx.clip();
  ctx.drawImage(toFrame, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

/**
 * Apply push transition
 */
function applyPush(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number,
  direction: 'left' | 'right'
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (direction === 'left') {
    // Push from right to left
    const offset = canvas.width * progress;
    ctx.drawImage(fromFrame, -offset, 0, canvas.width, canvas.height);
    ctx.drawImage(toFrame, canvas.width - offset, 0, canvas.width, canvas.height);
  } else {
    // Push from left to right
    const offset = canvas.width * progress;
    ctx.drawImage(fromFrame, offset, 0, canvas.width, canvas.height);
    ctx.drawImage(toFrame, -canvas.width + offset, 0, canvas.width, canvas.height);
  }
}

/**
 * Apply zoom transition
 */
function applyZoom(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fromFrame: HTMLCanvasElement,
  toFrame: HTMLCanvasElement,
  progress: number,
  direction: 'in' | 'out'
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (direction === 'in') {
    // Zoom in from frame, zoom out to frame
    const fromScale = 1 + progress;
    const toScale = progress;

    // Draw from frame (zooming in)
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(fromScale, fromScale);
    ctx.drawImage(fromFrame, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    // Draw to frame (zooming out)
    ctx.save();
    ctx.globalAlpha = progress;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(toScale, toScale);
    ctx.drawImage(toFrame, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
  } else {
    // Zoom out from frame, zoom in to frame
    const fromScale = 1 - progress;
    const toScale = 1 - progress;

    // Draw from frame (zooming out)
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(fromScale, fromScale);
    ctx.drawImage(fromFrame, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    // Draw to frame (zooming in)
    ctx.save();
    ctx.globalAlpha = progress;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1 + (1 - toScale), 1 + (1 - toScale));
    ctx.drawImage(toFrame, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

/**
 * Calculate transition progress at a given time
 */
export function getTransitionProgress(
  currentTime: number,
  transition: Transition
): number {
  // Assuming transition has startTime and duration
  const elapsed = currentTime - (transition as any).startTime;
  const progress = Math.max(0, Math.min(1, elapsed / transition.duration));
  return progress;
}
