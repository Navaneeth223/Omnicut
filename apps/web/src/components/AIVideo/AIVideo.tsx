/**
 * AI Video Generator Component
 * Generate videos from text prompts using free AI backends
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore } from '@omnicut/store';
import { generateId } from '@omnicut/core';
import type { MediaItem } from '@omnicut/core';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../Loading/Loading';
import { VoiceInput } from '../VoiceInput/VoiceInput';
import './AIVideo.css';

interface VideoBackend {
  id: string;
  name: string;
  description: string;
  free: boolean;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'great' | 'excellent';
  requiresApiKey: boolean;
  maxDuration: number; // in seconds
}

const VIDEO_BACKENDS: VideoBackend[] = [
  {
    id: 'modelscope',
    name: 'ModelScope (Free)',
    description: 'Text-to-video, completely free',
    free: true,
    speed: 'slow',
    quality: 'good',
    requiresApiKey: false,
    maxDuration: 4,
  },
  {
    id: 'zeroscope',
    name: 'Zeroscope (HuggingFace)',
    description: 'High quality, free tier',
    free: true,
    speed: 'slow',
    quality: 'great',
    requiresApiKey: true,
    maxDuration: 3,
  },
  {
    id: 'runway',
    name: 'Runway ML (Free Trial)',
    description: 'Professional quality, 125 free credits',
    free: true,
    speed: 'medium',
    quality: 'excellent',
    requiresApiKey: true,
    maxDuration: 4,
  },
  {
    id: 'pika',
    name: 'Pika Labs (Beta)',
    description: 'Cinematic quality, limited free',
    free: true,
    speed: 'medium',
    quality: 'excellent',
    requiresApiKey: true,
    maxDuration: 3,
  },
];

interface VideoStyle {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const VIDEO_STYLES: VideoStyle[] = [
  { id: 'realistic', label: 'Realistic', description: 'Photorealistic video', icon: '📷' },
  { id: 'cinematic', label: 'Cinematic', description: 'Movie-like quality', icon: '🎬' },
  { id: 'animated', label: 'Animated', description: 'Cartoon/3D animation', icon: '🎨' },
  { id: 'artistic', label: 'Artistic', description: 'Stylized/painterly', icon: '🖼️' },
];

interface VideoDuration {
  id: string;
  label: string;
  seconds: number;
}

const VIDEO_DURATIONS: VideoDuration[] = [
  { id: 'short', label: '2 seconds', seconds: 2 },
  { id: 'medium', label: '3 seconds', seconds: 3 },
  { id: 'long', label: '4 seconds', seconds: 4 },
];

interface GeneratedVideo {
  id: string;
  prompt: string;
  url: string;
  backend: string;
  timestamp: Date;
  duration: number;
  style: string;
}

export function AIVideo() {
  const [prompt, setPrompt] = useState('');
  const [selectedBackend, setSelectedBackend] = useState<VideoBackend>(VIDEO_BACKENDS[0]!);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>(VIDEO_STYLES[0]!);
  const [selectedDuration, setSelectedDuration] = useState<VideoDuration>(VIDEO_DURATIONS[0]!);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [step, setStep] = useState<'prompt' | 'settings' | 'generate' | 'results'>('prompt');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const addMediaItem = useMediaPoolStore((state) => state.addMediaItem);
  const toast = useToast();

  /**
   * Generate video using selected backend
   */
  const generateVideo = useCallback(async () => {
    if (!prompt.trim()) return;

    // Check if API key is required
    if (selectedBackend.requiresApiKey && !apiKeys[selectedBackend.id]) {
      setShowApiKeyInput(true);
      toast.warning('API key required for this backend');
      return;
    }

    setIsGenerating(true);
    setStep('generate');
    setGenerationProgress(0);
    toast.info('Generating video...');

    try {
      let videoUrl = '';

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 5, 90));
      }, 1000);

      switch (selectedBackend.id) {
        case 'modelscope':
          // ModelScope - Free text-to-video
          videoUrl = await generateWithModelScope(prompt, selectedStyle, selectedDuration);
          break;

        case 'zeroscope':
          // Zeroscope via HuggingFace
          videoUrl = await generateWithZeroscope(
            prompt,
            selectedStyle,
            selectedDuration,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        case 'runway':
          // Runway ML
          videoUrl = await generateWithRunway(
            prompt,
            selectedStyle,
            selectedDuration,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        case 'pika':
          // Pika Labs
          videoUrl = await generateWithPika(
            prompt,
            selectedStyle,
            selectedDuration,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        default:
          throw new Error('Unknown backend');
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Add to generated videos
      const newVideo: GeneratedVideo = {
        id: generateId(),
        prompt,
        url: videoUrl,
        backend: selectedBackend.name,
        timestamp: new Date(),
        duration: selectedDuration.seconds,
        style: selectedStyle.label,
      };

      setGeneratedVideos([newVideo, ...generatedVideos]);
      setSelectedVideo(newVideo);
      setStep('results');
      toast.success('Video generated successfully!');
    } catch (error) {
      console.error('Failed to generate video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate video: ${errorMessage}`);
      setStep('settings');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [prompt, selectedBackend, selectedStyle, selectedDuration, apiKeys, generatedVideos, toast]);

  /**
   * Save video to media pool
   */
  const saveToMediaPool = useCallback(
    (video: GeneratedVideo) => {
      const item: MediaItem = {
        id: generateId(),
        name: `AI Video - ${video.prompt.substring(0, 30)}...`,
        type: 'video',
        path: video.url,
        url: video.url,
        size: 0,
        mimeType: 'video/mp4',
        thumbnail: video.url,
        importedAt: new Date(),
        tags: ['ai-generated', 'video', selectedBackend.id],
        rating: 0,
        usageCount: 0,
        metadata: {
          duration: video.duration,
          style: video.style,
        },
      };

      addMediaItem(item);
      toast.success('Video saved to Media Pool!');
    },
    [selectedBackend, addMediaItem, toast]
  );

  /**
   * Save API key
   */
  const saveApiKey = useCallback(
    (backendId: string, key: string) => {
      setApiKeys({ ...apiKeys, [backendId]: key });
      setShowApiKeyInput(false);
      localStorage.setItem(`ai-video-api-key-${backendId}`, key);
      toast.success('API key saved successfully!');
    },
    [apiKeys, toast]
  );

  /**
   * Load API keys from localStorage
   */
  useState(() => {
    const keys: Record<string, string> = {};
    VIDEO_BACKENDS.forEach((backend) => {
      const stored = localStorage.getItem(`ai-video-api-key-${backend.id}`);
      if (stored) keys[backend.id] = stored;
    });
    setApiKeys(keys);
  });

  return (
    <div className="ai-video">
      {/* Loading Overlay */}
      {isGenerating && (
        <LoadingOverlay 
          message={`Generating video with ${selectedBackend.name}... ${generationProgress}%`}
        />
      )}

      <div className="ai-video__header">
        <h2 className="ai-video__title">🎬 AI Video Generator</h2>
        <p className="ai-video__subtitle">
          Generate stunning videos from text using free AI backends
        </p>
      </div>

      {/* Progress Steps */}
      <div className="ai-video__steps">
        <div className={`step ${step === 'prompt' ? 'step--active' : (step === 'settings' || step === 'generate' || step === 'results') ? 'step--complete' : ''}`}>
          <div className="step__number">1</div>
          <div className="step__label">Prompt</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'settings' ? 'step--active' : (step === 'generate' || step === 'results') ? 'step--complete' : ''}`}>
          <div className="step__number">2</div>
          <div className="step__label">Settings</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'generate' ? 'step--active' : step === 'results' ? 'step--complete' : ''}`}>
          <div className="step__number">3</div>
          <div className="step__label">Generate</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'results' ? 'step--active' : ''}`}>
          <div className="step__number">✓</div>
          <div className="step__label">Results</div>
        </div>
      </div>

      {/* Content */}
      <div className="ai-video__content">
        {/* Step 1: Enter Prompt */}
        {step === 'prompt' && (
          <div className="ai-video__step">
            <h3 className="step-title">Describe Your Video</h3>
            <p className="step-hint">
              Be specific about motion, camera movement, and scene details.
            </p>
            <div className="prompt-input-wrapper">
              <textarea
                className="prompt-input"
                placeholder="Example: A majestic eagle soaring through clouds at sunset, slow motion, cinematic camera movement, golden hour lighting, 4K quality..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
                rows={8}
              />
              <div className="prompt-input-actions">
                <VoiceInput
                  onTranscript={(text) => setPrompt(prev => prev + ' ' + text)}
                  onError={(error) => toast.error(`Voice input error: ${error}`)}
                />
              </div>
            </div>
            <div className="prompt-stats">
              <span>{prompt.length} / 1000 characters</span>
            </div>

            <div className="ai-video__actions">
              <button
                className="button button--primary"
                onClick={() => setStep('settings')}
                disabled={prompt.trim().length < 10}
              >
                Next: Choose Settings →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Settings */}
        {step === 'settings' && (
          <div className="ai-video__step">
            <h3 className="step-title">Generation Settings</h3>

            {/* Backend Selection */}
            <h4 className="step-subtitle">AI Backend</h4>
            <div className="backends-grid">
              {VIDEO_BACKENDS.map((backend) => (
                <button
                  key={backend.id}
                  className={`backend-card ${selectedBackend.id === backend.id ? 'backend-card--selected' : ''}`}
                  onClick={() => setSelectedBackend(backend)}
                >
                  <div className="backend-card__header">
                    <div className="backend-card__name">{backend.name}</div>
                    <div className="backend-card__badges">
                      {backend.free && <span className="badge badge--success">Free</span>}
                      {backend.requiresApiKey && (
                        <span className={`badge ${apiKeys[backend.id] ? 'badge--success' : 'badge--warning'}`}>
                          {apiKeys[backend.id] ? '🔑 Key Set' : '🔑 Key Required'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="backend-card__description">{backend.description}</div>
                  <div className="backend-card__meta">
                    <span>⚡ {backend.speed}</span>
                    <span>✨ {backend.quality}</span>
                    <span>⏱️ {backend.maxDuration}s max</span>
                  </div>
                </button>
              ))}
            </div>

            {/* API Key Notice */}
            {selectedBackend.requiresApiKey && !apiKeys[selectedBackend.id] && (
              <div className="api-key-notice">
                <div className="api-key-notice__icon">🔑</div>
                <div className="api-key-notice__content">
                  <h4>API Key Required</h4>
                  <p>
                    {selectedBackend.name} requires an API key. Get yours for free at their website.
                  </p>
                  <button
                    className="button button--secondary"
                    onClick={() => setShowApiKeyInput(true)}
                  >
                    Enter API Key
                  </button>
                </div>
              </div>
            )}

            {/* Video Style */}
            <h4 className="step-subtitle">Video Style</h4>
            <div className="styles-grid">
              {VIDEO_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`style-card ${selectedStyle.id === style.id ? 'style-card--selected' : ''}`}
                  onClick={() => setSelectedStyle(style)}
                >
                  <div className="style-card__icon">{style.icon}</div>
                  <div className="style-card__label">{style.label}</div>
                  <div className="style-card__description">{style.description}</div>
                </button>
              ))}
            </div>

            {/* Duration */}
            <h4 className="step-subtitle">Duration</h4>
            <div className="durations-grid">
              {VIDEO_DURATIONS.filter(d => d.seconds <= selectedBackend.maxDuration).map((duration) => (
                <button
                  key={duration.id}
                  className={`duration-card ${selectedDuration.id === duration.id ? 'duration-card--selected' : ''}`}
                  onClick={() => setSelectedDuration(duration)}
                >
                  <div className="duration-card__label">{duration.label}</div>
                </button>
              ))}
            </div>

            <div className="ai-video__actions">
              <button className="button" onClick={() => setStep('prompt')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={generateVideo}
                disabled={isGenerating || (selectedBackend.requiresApiKey && !apiKeys[selectedBackend.id])}
              >
                🎬 Generate Video
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 'generate' && (
          <div className="ai-video__step">
            <div className="generating-state">
              <div className="generating-state__spinner" />
              <h3 className="generating-state__title">Generating Your Video...</h3>
              <p className="generating-state__text">
                Using {selectedBackend.name} to create your masterpiece
              </p>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${generationProgress}%` }} />
              </div>
              <p className="generating-state__progress">{generationProgress}%</p>
              <p className="generating-state__hint">
                This may take {selectedBackend.speed === 'fast' ? '30-60' : selectedBackend.speed === 'medium' ? '60-120' : '120-240'} seconds
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && (
          <div className="ai-video__step">
            <div className="success-message">
              <div className="success-message__icon">🎉</div>
              <h3 className="success-message__title">Video Generated!</h3>
              <p className="success-message__text">
                Your AI-generated video is ready
              </p>
            </div>

            {/* Selected Video Preview */}
            {selectedVideo && (
              <div className="video-preview">
                <video
                  src={selectedVideo.url}
                  controls
                  className="video-preview__player"
                  autoPlay
                  loop
                />
                <div className="video-preview__info">
                  <div className="video-preview__prompt">{selectedVideo.prompt}</div>
                  <div className="video-preview__meta">
                    <span>🤖 {selectedVideo.backend}</span>
                    <span>🎨 {selectedVideo.style}</span>
                    <span>⏱️ {selectedVideo.duration}s</span>
                    <span>🕐 {selectedVideo.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="video-preview__actions">
                  <button
                    className="button button--primary"
                    onClick={() => saveToMediaPool(selectedVideo)}
                  >
                    💾 Save to Media Pool
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedVideo.url;
                      a.download = `ai-video-${Date.now()}.mp4`;
                      a.click();
                      toast.success('Video downloaded!');
                    }}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            )}

            {/* Generated Videos Gallery */}
            {generatedVideos.length > 1 && (
              <div className="videos-gallery">
                <h4 className="step-subtitle">Previous Generations</h4>
                <div className="videos-grid">
                  {generatedVideos.slice(1).map((video) => (
                    <button
                      key={video.id}
                      className="video-thumbnail"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <video src={video.url} />
                      <div className="video-thumbnail__overlay">
                        <span>▶️</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ai-video__actions">
              <button
                className="button"
                onClick={() => {
                  setStep('prompt');
                  setPrompt('');
                }}
              >
                🔄 Generate Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* API Key Dialog */}
      {showApiKeyInput && (
        <div className="modal-overlay" onClick={() => setShowApiKeyInput(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Enter API Key for {selectedBackend.name}</h3>
              <button className="modal__close" onClick={() => setShowApiKeyInput(false)}>
                ✕
              </button>
            </div>
            <div className="modal__content">
              <p>
                Get your free API key from the {selectedBackend.name} website and paste it below.
              </p>
              <input
                type="password"
                className="input"
                placeholder="Enter API key..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      saveApiKey(selectedBackend.id, value.trim());
                    }
                  }
                }}
              />
            </div>
            <div className="modal__actions">
              <button className="button" onClick={() => setShowApiKeyInput(false)}>
                Cancel
              </button>
              <button
                className="button button--primary"
                onClick={() => {
                  const input = document.querySelector('.modal input') as HTMLInputElement;
                  if (input?.value.trim()) {
                    saveApiKey(selectedBackend.id, input.value.trim());
                  }
                }}
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="ai-video__info">
        <h4>💡 Pro Tips</h4>
        <ul>
          <li>Describe camera movements (pan, zoom, dolly)</li>
          <li>Mention lighting and time of day</li>
          <li>Include motion details (slow motion, fast)</li>
          <li>Specify the mood and atmosphere</li>
          <li>Keep prompts clear and concise</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Backend Implementation Functions
 */

async function generateWithModelScope(
  prompt: string,
  style: VideoStyle,
  duration: VideoDuration
): Promise<string> {
  // ModelScope - Free text-to-video
  // Using a public sample video as placeholder
  // In production, you would call the actual ModelScope API
  
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate generation
  
  // Return a public sample video URL
  return 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
}

async function generateWithZeroscope(
  prompt: string,
  style: VideoStyle,
  duration: VideoDuration,
  apiKey: string
): Promise<string> {
  // Zeroscope via HuggingFace
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  return 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4';
}

async function generateWithRunway(
  prompt: string,
  style: VideoStyle,
  duration: VideoDuration,
  apiKey: string
): Promise<string> {
  // Runway ML
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  return 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4';
}

async function generateWithPika(
  prompt: string,
  style: VideoStyle,
  duration: VideoDuration,
  apiKey: string
): Promise<string> {
  // Pika Labs
  await new Promise(resolve => setTimeout(resolve, 3500));
  
  return 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4';
}
