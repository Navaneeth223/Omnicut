/**
 * AI Shorts Studio Component
 * Automated workflow for creating short-form content (TikTok, YouTube Shorts, Instagram Reels)
 */

import { useState, useCallback } from 'react';
import { useTimelineStore, useMediaPoolStore, useProjectStore } from '@omnicut/store';
import { generateId } from '@omnicut/core';
import type { MediaItem } from '@omnicut/core';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../Loading/Loading';
import './ShortsStudio.css';

interface ShortsTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  aspectRatio: '9:16' | '1:1' | '16:9';
  transitions: string[];
  effects: string[];
  musicStyle: string;
}

const SHORTS_TEMPLATES: ShortsTemplate[] = [
  {
    id: 'ai-slideshow',
    name: '🤖 AI Image Slideshow',
    description: 'Perfect for AI-generated images with smooth transitions',
    duration: 60,
    aspectRatio: '9:16',
    transitions: ['cross_dissolve', 'zoom_in', 'zoom_out'],
    effects: ['brightness_contrast', 'vignette'],
    musicStyle: 'upbeat',
  },
  {
    id: 'quick-montage',
    name: '⚡ Quick Montage',
    description: 'Fast-paced montage with dynamic transitions',
    duration: 30,
    aspectRatio: '9:16',
    transitions: ['wipe_left', 'wipe_right', 'push_left'],
    effects: ['sharpen', 'film_grain'],
    musicStyle: 'energetic',
  },
  {
    id: 'smooth-story',
    name: '✨ Smooth Story',
    description: 'Elegant storytelling with gentle transitions',
    duration: 60,
    aspectRatio: '9:16',
    transitions: ['fade', 'cross_dissolve'],
    effects: ['brightness_contrast', 'hue_saturation'],
    musicStyle: 'ambient',
  },
  {
    id: 'instagram-square',
    name: '📱 Instagram Feed',
    description: 'Square format for Instagram posts',
    duration: 60,
    aspectRatio: '1:1',
    transitions: ['cross_dissolve', 'dip_to_black'],
    effects: ['vignette', 'film_grain'],
    musicStyle: 'chill',
  },
];

type ContentType = 'image' | 'video';

export function ShortsStudio() {
  const [contentType, setContentType] = useState<ContentType>('image');
  const [selectedTemplate, setSelectedTemplate] = useState<ShortsTemplate | null>(null);
  const [selectedImages, setSelectedImages] = useState<MediaItem[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<MediaItem[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MediaItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'type' | 'template' | 'content' | 'music' | 'preview'>('type');
  const [showImportDialog, setShowImportDialog] = useState(false);

  const toast = useToast();

  const mediaItems = useMediaPoolStore((state) => state.mediaPool?.items ?? []);
  const addClip = useTimelineStore((state) => state.addClip);
  const addTransition = useTimelineStore((state) => state.addTransition);
  const updateClip = useTimelineStore((state) => state.updateClip);
  const timeline = useTimelineStore((state) => state.timeline);
  const updateSettings = useProjectStore((state) => state.updateSettings);

  const images = mediaItems.filter((item) => item.type === 'image');
  const videos = mediaItems.filter((item) => item.type === 'video');
  const audioFiles = mediaItems.filter((item) => item.type === 'audio');

  /**
   * Generate shorts video automatically
   */
  const generateShorts = useCallback(async () => {
    if (!selectedTemplate || !timeline) return;
    
    const selectedContent = contentType === 'image' ? selectedImages : selectedVideos;
    if (selectedContent.length === 0) return;

    setIsGenerating(true);
    toast.info('Generating your shorts video...');

    try {
      // Step 1: Update project settings for shorts format
      const resolution = getResolutionForAspectRatio(selectedTemplate.aspectRatio);
      updateSettings({
        resolution,
        frameRate: 30,
      });

      // Step 2: Calculate timing
      const contentDuration = selectedTemplate.duration / selectedContent.length;
      const transitionDuration = 0.5; // 0.5 seconds

      // Step 3: Find or create video track
      let videoTrack = timeline.tracks.find((t) => t.type === 'video');
      if (!videoTrack) {
        videoTrack = timeline.tracks[0];
      }

      // Step 4: Add content to timeline with transitions
      let currentTime = 0;
      const clipIds: string[] = [];

      for (let i = 0; i < selectedContent.length; i++) {
        const content = selectedContent[i];
        const clipId = generateId();

        // Add content clip
        addClip(videoTrack.id, {
          id: clipId,
          trackId: videoTrack.id,
          mediaId: content.id,
          mediaItemId: content.id,
          mediaUrl: content.path,
          source: content.path,
          type: contentType,
          name: content.name,
          startTime: currentTime,
          duration: contentType === 'image' ? contentDuration : (content.duration || contentDuration),
          mediaStart: 0,
          mediaEnd: contentType === 'image' ? contentDuration : (content.duration || contentDuration),
          trimStart: 0,
          trimEnd: contentType === 'image' ? contentDuration : (content.duration || contentDuration),
          speed: 1,
          effects: [],
          keyframes: [],
          transform: {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            anchorX: 0.5,
            anchorY: 0.5,
            opacity: 1,
          },
          crop: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        });

        clipIds.push(clipId);

        // Add transition between clips
        if (i < selectedContent.length - 1) {
          const transitionType = selectedTemplate.transitions[i % selectedTemplate.transitions.length];
          const nextClipId = generateId();
          
          // Add transition
          setTimeout(() => {
            addTransition(clipId, nextClipId, transitionType, transitionDuration);
          }, 100);
        }

        currentTime += contentType === 'image' ? contentDuration : (content.duration || contentDuration);
      }

      // Step 5: Apply effects to all clips
      setTimeout(() => {
        clipIds.forEach((clipId) => {
          const effects = selectedTemplate.effects.map((effectType) => ({
            id: generateId(),
            type: effectType,
            name: getEffectName(effectType),
            enabled: true,
            category: 'color' as const,
            parameters: getDefaultEffectParameters(effectType),
            opacity: 1,
          }));

          updateClip(clipId, { effects });
        });
      }, 200);

      // Step 6: Add music if selected
      if (selectedMusic) {
        const audioTrack = timeline.tracks.find((t) => t.type === 'audio');
        if (audioTrack) {
          setTimeout(() => {
            addClip(audioTrack.id, {
              id: generateId(),
              trackId: audioTrack.id,
              mediaId: selectedMusic.id,
              mediaItemId: selectedMusic.id,
              mediaUrl: selectedMusic.path,
              source: selectedMusic.path,
              type: 'audio',
              name: selectedMusic.name,
              startTime: 0,
              duration: Math.min(selectedMusic.duration || selectedTemplate.duration, selectedTemplate.duration),
              mediaStart: 0,
              mediaEnd: selectedTemplate.duration,
              trimStart: 0,
              trimEnd: selectedTemplate.duration,
              speed: 1,
              effects: [],
              keyframes: [],
              transform: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                anchorX: 0.5,
                anchorY: 0.5,
                opacity: 1,
              },
              crop: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              },
            });
          }, 300);
        }
      }

      // Success!
      setTimeout(() => {
        setIsGenerating(false);
        setStep('preview');
        toast.success('Shorts video generated successfully!');
      }, 500);
    } catch (error) {
      console.error('Failed to generate shorts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate shorts: ${errorMessage}`);
      setIsGenerating(false);
    }
  }, [selectedTemplate, selectedImages, selectedVideos, selectedMusic, contentType, timeline, addClip, addTransition, updateClip, updateSettings, toast]);

  /**
   * Handle file import
   */
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = contentType === 'image' ? 'image/*' : 'video/*';
    
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      const addMediaItem = useMediaPoolStore.getState().addMediaItem;
      let importedCount = 0;
      
      for (const file of Array.from(files)) {
        const item: MediaItem = {
          id: generateId(),
          name: file.name,
          type: contentType,
          path: URL.createObjectURL(file),
          size: file.size,
          duration: contentType === 'video' ? 5 : undefined, // Default 5s for videos
          thumbnail: URL.createObjectURL(file),
          importedAt: new Date(),
          tags: [],
          rating: 0,
          usageCount: 0,
        };
        
        addMediaItem(item);
        importedCount++;
      }
      
      toast.success(`Imported ${importedCount} ${contentType === 'image' ? 'image' : 'video'}${importedCount > 1 ? 's' : ''}!`);
      setShowImportDialog(false);
    };
    
    input.click();
  }, [contentType, toast]);

  /**
   * Reset wizard
   */
  const reset = () => {
    setContentType('image');
    setSelectedTemplate(null);
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedMusic(null);
    setStep('type');
  };

  return (
    <div className="shorts-studio">
      {/* Loading Overlay */}
      {isGenerating && (
        <LoadingOverlay 
          message="Generating your shorts video..."
        />
      )}

      <div className="shorts-studio__header">
        <h2 className="shorts-studio__title">🎬 AI Shorts Studio</h2>
        <p className="shorts-studio__subtitle">
          Create viral shorts in 3 clicks - No editing required!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="shorts-studio__steps">
        <div className={`step ${step === 'type' ? 'step--active' : step !== 'type' ? 'step--complete' : ''}`}>
          <div className="step__number">1</div>
          <div className="step__label">Type</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'template' ? 'step--active' : !['type', 'template'].includes(step) ? 'step--complete' : ''}`}>
          <div className="step__number">2</div>
          <div className="step__label">Template</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'content' ? 'step--active' : ['music', 'preview'].includes(step) ? 'step--complete' : ''}`}>
          <div className="step__number">3</div>
          <div className="step__label">{contentType === 'image' ? 'Images' : 'Videos'}</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'music' ? 'step--active' : step === 'preview' ? 'step--complete' : ''}`}>
          <div className="step__number">4</div>
          <div className="step__label">Music</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'preview' ? 'step--active' : ''}`}>
          <div className="step__number">✓</div>
          <div className="step__label">Done</div>
        </div>
      </div>

      {/* Content */}
      <div className="shorts-studio__content">
        {/* Step 1: Choose Content Type */}
        {step === 'type' && (
          <div className="shorts-studio__step">
            <h3 className="step-title">Choose Content Type</h3>
            <p className="step-hint">What type of content do you want to create?</p>
            <div className="content-type-grid">
              <button
                className={`content-type-card ${contentType === 'image' ? 'content-type-card--selected' : ''}`}
                onClick={() => setContentType('image')}
              >
                <div className="content-type-card__icon">🖼️</div>
                <div className="content-type-card__name">Image Shorts</div>
                <div className="content-type-card__description">
                  Create videos from multiple images with transitions and effects
                </div>
                <div className="content-type-card__examples">
                  Perfect for: AI art, photo slideshows, portfolios
                </div>
              </button>
              <button
                className={`content-type-card ${contentType === 'video' ? 'content-type-card--selected' : ''}`}
                onClick={() => setContentType('video')}
              >
                <div className="content-type-card__icon">🎥</div>
                <div className="content-type-card__name">Video Shorts</div>
                <div className="content-type-card__description">
                  Combine multiple short video clips into one viral short
                </div>
                <div className="content-type-card__examples">
                  Perfect for: Highlights, montages, compilations
                </div>
              </button>
            </div>
            <div className="shorts-studio__actions">
              <button
                className="button button--primary"
                onClick={() => setStep('template')}
                disabled={!contentType}
              >
                Next: Choose Template →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Template */}
        {step === 'template' && (
          <div className="shorts-studio__step">
            <h3 className="step-title">Choose a Template</h3>
            <div className="templates-grid">
              {SHORTS_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'template-card--selected' : ''}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="template-card__header">
                    <div className="template-card__name">{template.name}</div>
                    <div className="template-card__badge">{template.aspectRatio}</div>
                  </div>
                  <div className="template-card__description">{template.description}</div>
                  <div className="template-card__meta">
                    <span>⏱️ {template.duration}s</span>
                    <span>🎬 {template.transitions.length} transitions</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="shorts-studio__actions">
              <button className="button" onClick={() => setStep('type')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={() => setStep('content')}
                disabled={!selectedTemplate}
              >
                Next: Select {contentType === 'image' ? 'Images' : 'Videos'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Content (Images or Videos) */}
        {step === 'content' && (
          <div className="shorts-studio__step">
            <h3 className="step-title">
              Select {contentType === 'image' ? 'Images' : 'Videos'} (
              {contentType === 'image' ? selectedImages.length : selectedVideos.length} selected)
            </h3>
            <p className="step-hint">
              Click {contentType === 'image' ? 'images' : 'videos'} to add them to your shorts. 
              Recommended: {contentType === 'image' ? '5-10 images' : '3-8 video clips'} for {selectedTemplate?.duration}s video
            </p>
            
            {/* Import Button */}
            <div className="import-section">
              <button className="button button--secondary" onClick={handleImport}>
                📁 Import {contentType === 'image' ? 'Images' : 'Videos'}
              </button>
              <span className="import-hint">
                Or import from Media Pool in the left panel
              </span>
            </div>

            <div className="images-grid">
              {contentType === 'image' && images.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">📁</div>
                  <p className="empty-state__text">No images imported</p>
                  <p className="empty-state__hint">Click "Import Images" button above to get started</p>
                  <button className="button button--primary" onClick={handleImport} style={{ marginTop: '20px' }}>
                    📁 Import Images Now
                  </button>
                </div>
              ) : contentType === 'video' && videos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🎥</div>
                  <p className="empty-state__text">No videos imported</p>
                  <p className="empty-state__hint">Click "Import Videos" button above to get started</p>
                  <button className="button button--primary" onClick={handleImport} style={{ marginTop: '20px' }}>
                    📁 Import Videos Now
                  </button>
                </div>
              ) : contentType === 'image' ? (
                images.map((image) => {
                  const isSelected = selectedImages.some((img) => img.id === image.id);
                  return (
                    <button
                      key={image.id}
                      className={`image-card ${isSelected ? 'image-card--selected' : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
                        } else {
                          setSelectedImages([...selectedImages, image]);
                        }
                      }}
                    >
                      <img
                        src={image.thumbnail || image.url || image.path}
                        alt={image.name}
                        className="image-card__thumbnail"
                      />
                      {isSelected && (
                        <div className="image-card__badge">
                          {selectedImages.findIndex((img) => img.id === image.id) + 1}
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                videos.map((video) => {
                  const isSelected = selectedVideos.some((v) => v.id === video.id);
                  return (
                    <button
                      key={video.id}
                      className={`image-card ${isSelected ? 'image-card--selected' : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedVideos(selectedVideos.filter((v) => v.id !== video.id));
                        } else {
                          setSelectedVideos([...selectedVideos, video]);
                        }
                      }}
                    >
                      <img
                        src={video.thumbnail || video.path}
                        alt={video.name}
                        className="image-card__thumbnail"
                      />
                      <div className="image-card__duration">
                        {video.duration ? `${Math.floor(video.duration)}s` : '?'}
                      </div>
                      {isSelected && (
                        <div className="image-card__badge">
                          {selectedVideos.findIndex((v) => v.id === video.id) + 1}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
            <div className="shorts-studio__actions">
              <button className="button" onClick={() => setStep('template')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={() => setStep('music')}
                disabled={contentType === 'image' ? selectedImages.length === 0 : selectedVideos.length === 0}
              >
                Next: Add Music →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Select Music */}
        {step === 'music' && (
          <div className="shorts-studio__step">
            <h3 className="step-title">Add Background Music (Optional)</h3>
            <p className="step-hint">Choose a music track or skip to generate without music</p>
            
            {/* Import Button */}
            <div className="import-section">
              <button className="button button--secondary" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'audio/*';
                input.onchange = async (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (!files) return;
                  const addMediaItem = useMediaPoolStore.getState().addMediaItem;
                  for (const file of Array.from(files)) {
                    const item: MediaItem = {
                      id: generateId(),
                      name: file.name,
                      type: 'audio',
                      path: URL.createObjectURL(file),
                      size: file.size,
                      duration: undefined,
                      thumbnail: undefined,
                      importedAt: new Date(),
                      tags: [],
                      rating: 0,
                      usageCount: 0,
                    };
                    addMediaItem(item);
                  }
                };
                input.click();
              }}>
                🎵 Import Music
              </button>
              <span className="import-hint">
                Or import from Media Pool in the left panel
              </span>
            </div>
            <div className="music-list">
              {audioFiles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🎵</div>
                  <p className="empty-state__text">No audio files imported</p>
                  <p className="empty-state__hint">You can skip this step or click "Import Music" above</p>
                </div>
              ) : (
                audioFiles.map((audio) => (
                  <button
                    key={audio.id}
                    className={`music-card ${selectedMusic?.id === audio.id ? 'music-card--selected' : ''}`}
                    onClick={() => setSelectedMusic(audio)}
                  >
                    <div className="music-card__icon">🎵</div>
                    <div className="music-card__info">
                      <div className="music-card__name">{audio.name}</div>
                      <div className="music-card__duration">
                        {audio.duration ? `${Math.floor(audio.duration)}s` : 'Unknown'}
                      </div>
                    </div>
                    {selectedMusic?.id === audio.id && (
                      <div className="music-card__check">✓</div>
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="shorts-studio__actions">
              <button className="button" onClick={() => setStep('content')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={generateShorts}
                disabled={isGenerating}
              >
                {isGenerating ? '⏳ Generating...' : '✨ Generate Shorts!'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Preview & Export */}
        {step === 'preview' && (
          <div className="shorts-studio__step">
            <div className="success-message">
              <div className="success-message__icon">🎉</div>
              <h3 className="success-message__title">Your Shorts is Ready!</h3>
              <p className="success-message__text">
                Your video has been created on the timeline. Preview it and export when ready!
              </p>
            </div>

            <div className="shorts-info">
              <div className="shorts-info__item">
                <div className="shorts-info__label">Template</div>
                <div className="shorts-info__value">{selectedTemplate?.name}</div>
              </div>
              <div className="shorts-info__item">
                <div className="shorts-info__label">{contentType === 'image' ? 'Images' : 'Videos'}</div>
                <div className="shorts-info__value">
                  {contentType === 'image' ? `${selectedImages.length} images` : `${selectedVideos.length} videos`}
                </div>
              </div>
              <div className="shorts-info__item">
                <div className="shorts-info__label">Duration</div>
                <div className="shorts-info__value">{selectedTemplate?.duration}s</div>
              </div>
              <div className="shorts-info__item">
                <div className="shorts-info__label">Music</div>
                <div className="shorts-info__value">{selectedMusic ? selectedMusic.name : 'None'}</div>
              </div>
            </div>

            <div className="shorts-studio__actions">
              <button className="button" onClick={reset}>
                🔄 Create Another
              </button>
              <button
                className="button button--primary"
                onClick={() => {
                  // Navigate to edit workspace to show timeline
                  const event = new CustomEvent('omnicut:open-export');
                  window.dispatchEvent(event);
                  toast.info('Opening export dialog...');
                }}
              >
                📤 Export Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get resolution for aspect ratio
 */
function getResolutionForAspectRatio(aspectRatio: string) {
  switch (aspectRatio) {
    case '9:16':
      return { width: 1080, height: 1920 }; // Vertical (TikTok, Reels)
    case '1:1':
      return { width: 1080, height: 1080 }; // Square (Instagram)
    case '16:9':
      return { width: 1920, height: 1080 }; // Horizontal (YouTube)
    default:
      return { width: 1080, height: 1920 };
  }
}

/**
 * Get effect name from type
 */
function getEffectName(type: string): string {
  const names: Record<string, string> = {
    brightness_contrast: 'Brightness/Contrast',
    hue_saturation: 'Hue/Saturation',
    vignette: 'Vignette',
    sharpen: 'Sharpen',
    film_grain: 'Film Grain',
  };
  return names[type] || type;
}

/**
 * Get default effect parameters
 */
function getDefaultEffectParameters(type: string): any[] {
  switch (type) {
    case 'brightness_contrast':
      return [
        {
          id: 'brightness',
          name: 'Brightness',
          type: 'slider',
          value: 10,
          defaultValue: 0,
          min: -100,
          max: 100,
          step: 1,
          animatable: true,
          unit: '%',
        },
        {
          id: 'contrast',
          name: 'Contrast',
          type: 'slider',
          value: 10,
          defaultValue: 0,
          min: -100,
          max: 100,
          step: 1,
          animatable: true,
          unit: '%',
        },
      ];
    case 'vignette':
      return [
        {
          id: 'amount',
          name: 'Amount',
          type: 'slider',
          value: 30,
          defaultValue: 50,
          min: 0,
          max: 100,
          step: 1,
          animatable: true,
          unit: '%',
        },
      ];
    case 'sharpen':
      return [
        {
          id: 'amount',
          name: 'Amount',
          type: 'slider',
          value: 30,
          defaultValue: 50,
          min: 0,
          max: 200,
          step: 1,
          animatable: true,
          unit: '%',
        },
      ];
    default:
      return [];
  }
}
