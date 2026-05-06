/**
 * Thumbnail generation for media files
 * @module media-engine/thumbnail-generator
 */

/**
 * Generate thumbnail from video or image file
 */
export async function generateThumbnail(
  file: File,
  options: {
    width?: number;
    height?: number;
    time?: number; // For video, time in seconds
  } = {}
): Promise<string> {
  const { width = 160, height = 90, time = 1 } = options;

  if (file.type.startsWith('image/')) {
    return generateImageThumbnail(file, width, height);
  } else if (file.type.startsWith('video/')) {
    return generateVideoThumbnail(file, width, height, time);
  }

  throw new Error('Unsupported file type for thumbnail generation');
}

/**
 * Generate thumbnail from image file
 */
async function generateImageThumbnail(
  file: File,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate dimensions maintaining aspect ratio
      const aspectRatio = img.width / img.height;
      let targetWidth = width;
      let targetHeight = height;

      if (aspectRatio > width / height) {
        targetHeight = width / aspectRatio;
      } else {
        targetWidth = height * aspectRatio;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert to base64
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(img.src);
      resolve(thumbnail);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate thumbnail from video file
 */
async function generateVideoThumbnail(
  file: File,
  width: number,
  height: number,
  time: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;

    video.onloadedmetadata = () => {
      // Seek to specified time
      video.currentTime = Math.min(time, video.duration);
    };

    video.onseeked = () => {
      // Calculate dimensions maintaining aspect ratio
      const aspectRatio = video.videoWidth / video.videoHeight;
      let targetWidth = width;
      let targetHeight = height;

      if (aspectRatio > width / height) {
        targetHeight = width / aspectRatio;
      } else {
        targetWidth = height * aspectRatio;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw video frame
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

      // Convert to base64
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
}
