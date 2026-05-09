/**
 * AI Image Generator Component
 * Generate images from text prompts using free AI backends
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore } from '@omnicut/store';
import { generateId } from '@omnicut/core';
import type { MediaItem } from '@omnicut/core';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../Loading/Loading';
import { VoiceInput } from '../VoiceInput/VoiceInput';
import './AIImage.css';

interface ImageBackend {
  id: string;
  name: string;
  description: string;
  free: boolean;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'great' | 'excellent';
  requiresApiKey: boolean;
}

const IMAGE_BACKENDS: ImageBackend[] = [
  {
    id: 'pollinations',
    name: 'Pollinations AI',
    description: 'Fast, free, no API key required',
    free: true,
    speed: 'fast',
    quality: 'great',
    requiresApiKey: false,
  },
  {
    id: 'huggingface',
    name: 'HuggingFace (SDXL)',
    description: 'High quality, free tier available',
    free: true,
    speed: 'medium',
    quality: 'excellent',
    requiresApiKey: true,
  },
  {
    id: 'replicate',
    name: 'Replicate (Free Tier)',
    description: 'Multiple models, free credits',
    free: true,
    speed: 'medium',
    quality: 'excellent',
    requiresApiKey: true,
  },
  {
    id: 'craiyon',
    name: 'Craiyon (DALL-E Mini)',
    description: 'Free, no signup required',
    free: true,
    speed: 'slow',
    quality: 'good',
    requiresApiKey: false,
  },
  {
    id: 'deepai',
    name: 'DeepAI',
    description: 'Free tier with API key',
    free: true,
    speed: 'fast',
    quality: 'great',
    requiresApiKey: true,
  },
  {
    id: 'stability',
    name: 'Stability AI (Free Trial)',
    description: 'Stable Diffusion, free credits',
    free: true,
    speed: 'medium',
    quality: 'excellent',
    requiresApiKey: true,
  },
];

interface AspectRatio {
  id: string;
  label: string;
  ratio: string;
  width: number;
  height: number;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { id: 'square', label: 'Square (1:1)', ratio: '1:1', width: 1024, height: 1024 },
  { id: 'portrait', label: 'Portrait (9:16)', ratio: '9:16', width: 768, height: 1344 },
  { id: 'landscape', label: 'Landscape (16:9)', ratio: '16:9', width: 1344, height: 768 },
  { id: 'wide', label: 'Wide (21:9)', ratio: '21:9', width: 1536, height: 640 },
];

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  backend: string;
  timestamp: Date;
  aspectRatio: string;
}

export function AIImage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedBackend, setSelectedBackend] = useState<ImageBackend>(IMAGE_BACKENDS[0]!);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]!);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [step, setStep] = useState<'prompt' | 'settings' | 'generate' | 'results'>('prompt');
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const addMediaItem = useMediaPoolStore((state) => state.addMediaItem);
  const toast = useToast();

  /**
   * Generate image using selected backend
   */
  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;

    // Check if API key is required
    if (selectedBackend.requiresApiKey && !apiKeys[selectedBackend.id]) {
      setShowApiKeyInput(true);
      toast.warning('API key required for this backend');
      return;
    }

    setIsGenerating(true);
    setStep('generate');
    toast.info('Generating image...');

    try {
      let imageUrl = '';

      switch (selectedBackend.id) {
        case 'pollinations':
          // Pollinations AI - completely free, no API key
          imageUrl = await generateWithPollinations(prompt, selectedAspectRatio);
          break;

        case 'huggingface':
          // HuggingFace Inference API
          imageUrl = await generateWithHuggingFace(
            prompt,
            negativePrompt,
            selectedAspectRatio,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        case 'replicate':
          // Replicate API
          imageUrl = await generateWithReplicate(
            prompt,
            negativePrompt,
            selectedAspectRatio,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        case 'craiyon':
          // Craiyon (DALL-E Mini)
          imageUrl = await generateWithCraiyon(prompt);
          break;

        case 'deepai':
          // DeepAI
          imageUrl = await generateWithDeepAI(prompt, apiKeys[selectedBackend.id] || '');
          break;

        case 'stability':
          // Stability AI
          imageUrl = await generateWithStability(
            prompt,
            negativePrompt,
            selectedAspectRatio,
            apiKeys[selectedBackend.id] || ''
          );
          break;

        default:
          throw new Error('Unknown backend');
      }

      // Add to generated images
      const newImage: GeneratedImage = {
        id: generateId(),
        prompt,
        url: imageUrl,
        backend: selectedBackend.name,
        timestamp: new Date(),
        aspectRatio: selectedAspectRatio.label,
      };

      setGeneratedImages([newImage, ...generatedImages]);
      setSelectedImage(newImage);
      setStep('results');
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Failed to generate image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate image: ${errorMessage}`);
      setStep('settings');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, negativePrompt, selectedBackend, selectedAspectRatio, apiKeys, generatedImages, toast]);

  /**
   * Save image to media pool
   */
  const saveToMediaPool = useCallback(
    (image: GeneratedImage) => {
      const item: MediaItem = {
        id: generateId(),
        name: `AI Image - ${image.prompt.substring(0, 30)}...`,
        type: 'image',
        path: image.url,
        url: image.url,
        size: 0,
        mimeType: 'image/png',
        thumbnail: image.url,
        importedAt: new Date(),
        tags: ['ai-generated', 'image', selectedBackend.id],
        rating: 0,
        usageCount: 0,
        metadata: {},
      };

      addMediaItem(item);
      toast.success('Image saved to Media Pool!');
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
      // Store in localStorage
      localStorage.setItem(`ai-image-api-key-${backendId}`, key);
      toast.success('API key saved successfully!');
    },
    [apiKeys, toast]
  );

  /**
   * Load API keys from localStorage
   */
  useState(() => {
    const keys: Record<string, string> = {};
    IMAGE_BACKENDS.forEach((backend) => {
      const stored = localStorage.getItem(`ai-image-api-key-${backend.id}`);
      if (stored) keys[backend.id] = stored;
    });
    setApiKeys(keys);
  });

  return (
    <div className="ai-image">
      {/* Loading Overlay */}
      {isGenerating && (
        <LoadingOverlay 
          message={`Generating your image with ${selectedBackend.name}...`}
        />
      )}

      <div className="ai-image__header">
        <h2 className="ai-image__title">🎨 AI Image Generator</h2>
        <p className="ai-image__subtitle">
          Generate stunning images from text using free AI backends
        </p>
      </div>

      {/* Progress Steps */}
      <div className="ai-image__steps">
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
      <div className="ai-image__content">
        {/* Step 1: Enter Prompt */}
        {step === 'prompt' && (
          <div className="ai-image__step">
            <h3 className="step-title">Describe Your Image</h3>
            <p className="step-hint">
              Be specific and descriptive. Include style, mood, colors, and details.
            </p>
            <div className="prompt-input-wrapper">
              <textarea
                className="prompt-input"
                placeholder="Example: A majestic dragon flying over a medieval castle at sunset, cinematic lighting, highly detailed, fantasy art style, vibrant colors..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={2000}
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
              <span>{prompt.length} / 2000 characters</span>
            </div>

            <h4 className="step-subtitle">Negative Prompt (Optional)</h4>
            <p className="step-hint">
              Describe what you DON'T want in the image
            </p>
            <div className="prompt-input-wrapper">
              <textarea
                className="prompt-input prompt-input--small"
                placeholder="Example: blurry, low quality, distorted, ugly, bad anatomy..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <div className="prompt-input-actions">
                <VoiceInput
                  onTranscript={(text) => setNegativePrompt(prev => prev + ' ' + text)}
                  onError={(error) => toast.error(`Voice input error: ${error}`)}
                />
              </div>
            </div>

            <div className="ai-image__actions">
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
          <div className="ai-image__step">
            <h3 className="step-title">Generation Settings</h3>

            {/* Backend Selection */}
            <h4 className="step-subtitle">AI Backend</h4>
            <div className="backends-grid">
              {IMAGE_BACKENDS.map((backend) => (
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
                  </div>
                </button>
              ))}
            </div>

            {/* API Key Input */}
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

            {/* Aspect Ratio */}
            <h4 className="step-subtitle">Aspect Ratio</h4>
            <div className="aspect-ratios-grid">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  className={`aspect-ratio-card ${selectedAspectRatio.id === ratio.id ? 'aspect-ratio-card--selected' : ''}`}
                  onClick={() => setSelectedAspectRatio(ratio)}
                >
                  <div className="aspect-ratio-card__preview" style={{ aspectRatio: ratio.ratio }} />
                  <div className="aspect-ratio-card__label">{ratio.label}</div>
                  <div className="aspect-ratio-card__size">
                    {ratio.width}×{ratio.height}
                  </div>
                </button>
              ))}
            </div>

            <div className="ai-image__actions">
              <button className="button" onClick={() => setStep('prompt')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={generateImage}
                disabled={isGenerating || (selectedBackend.requiresApiKey && !apiKeys[selectedBackend.id])}
              >
                ✨ Generate Image
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {step === 'generate' && (
          <div className="ai-image__step">
            <div className="generating-state">
              <div className="generating-state__spinner" />
              <h3 className="generating-state__title">Generating Your Image...</h3>
              <p className="generating-state__text">
                Using {selectedBackend.name} to create your masterpiece
              </p>
              <p className="generating-state__hint">
                This may take {selectedBackend.speed === 'fast' ? '10-30' : selectedBackend.speed === 'medium' ? '30-60' : '60-120'} seconds
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 'results' && (
          <div className="ai-image__step">
            <div className="success-message">
              <div className="success-message__icon">🎉</div>
              <h3 className="success-message__title">Image Generated!</h3>
              <p className="success-message__text">
                Your AI-generated image is ready
              </p>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="image-preview">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="image-preview__img"
                />
                <div className="image-preview__info">
                  <div className="image-preview__prompt">{selectedImage.prompt}</div>
                  <div className="image-preview__meta">
                    <span>🤖 {selectedImage.backend}</span>
                    <span>📐 {selectedImage.aspectRatio}</span>
                    <span>🕐 {selectedImage.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="image-preview__actions">
                  <button
                    className="button button--primary"
                    onClick={() => saveToMediaPool(selectedImage)}
                  >
                    💾 Save to Media Pool
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedImage.url;
                      a.download = `ai-image-${Date.now()}.png`;
                      a.click();
                      toast.success('Image downloaded!');
                    }}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            )}

            {/* Generated Images Gallery */}
            {generatedImages.length > 1 && (
              <div className="images-gallery">
                <h4 className="step-subtitle">Previous Generations</h4>
                <div className="images-grid">
                  {generatedImages.slice(1).map((image) => (
                    <button
                      key={image.id}
                      className="image-thumbnail"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image.url} alt={image.prompt} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ai-image__actions">
              <button
                className="button"
                onClick={() => {
                  setStep('prompt');
                  setPrompt('');
                  setNegativePrompt('');
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
      <div className="ai-image__info">
        <div className="info-panel-header">
          <h4>💡 Pro Tips</h4>
          <button
            className="info-close-btn"
            onClick={() => {
              const infoPanel = document.querySelector('.ai-image__info') as HTMLElement;
              if (infoPanel) infoPanel.style.display = 'none';
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
        <ul>
          <li>Be specific and descriptive in your prompts</li>
          <li>Include art style (e.g., "digital art", "oil painting")</li>
          <li>Mention lighting and mood</li>
          <li>Use negative prompts to avoid unwanted elements</li>
          <li>Try different backends for different styles</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Backend Implementation Functions
 */

async function generateWithPollinations(prompt: string, aspectRatio: AspectRatio): Promise<string> {
  // Pollinations AI - completely free, no API key required
  // Using the public anonymous endpoint
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Add seed for uniqueness and model parameter
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${aspectRatio.width}&height=${aspectRatio.height}&seed=${seed}&model=flux&nologo=true&enhance=true`;
  
  // Test the URL by fetching it
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Pollinations API returned ${response.status}`);
    }
  } catch (error) {
    console.error('Pollinations fetch error:', error);
    // Still return the URL as it might work in img tag
  }
  
  // Pollinations returns the image directly
  return url;
}

async function generateWithHuggingFace(
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio,
  apiKey: string
): Promise<string> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt,
          width: aspectRatio.width,
          height: aspectRatio.height,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.statusText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

async function generateWithReplicate(
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio,
  apiKey: string
): Promise<string> {
  // Replicate API - SDXL model
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: {
        prompt: prompt,
        negative_prompt: negativePrompt,
        width: aspectRatio.width,
        height: aspectRatio.height,
        num_outputs: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`);
  }

  const prediction = await response.json();
  
  // Poll for completion
  let result = prediction;
  while (result.status !== 'succeeded' && result.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
    });
    result = await pollResponse.json();
  }

  if (result.status === 'failed') {
    throw new Error('Replicate generation failed');
  }

  return result.output[0];
}

async function generateWithCraiyon(prompt: string): Promise<string> {
  // Craiyon (DALL-E Mini) API
  const response = await fetch('https://backend.craiyon.com/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Craiyon API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Craiyon returns base64 images
  if (data.images && data.images.length > 0) {
    return `data:image/jpeg;base64,${data.images[0]}`;
  }
  
  throw new Error('No image generated');
}

async function generateWithDeepAI(prompt: string, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('text', prompt);

  const response = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`DeepAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.output_url;
}

async function generateWithStability(
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio,
  apiKey: string
): Promise<string> {
  // Stability AI - SDXL
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
        {
          text: negativePrompt,
          weight: -1,
        },
      ],
      cfg_scale: 7,
      height: aspectRatio.height,
      width: aspectRatio.width,
      samples: 1,
      steps: 30,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stability AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.artifacts && data.artifacts.length > 0) {
    return `data:image/png;base64,${data.artifacts[0].base64}`;
  }
  
  throw new Error('No image generated');
}
