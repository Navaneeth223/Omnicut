/**
 * AI Voice Studio Component
 * Text-to-speech and voice generation (like ElevenLabs)
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore } from '@omnicut/store';
import { generateId } from '@omnicut/core';
import type { MediaItem } from '@omnicut/core';
import './AIVoice.css';

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  preview: string;
}

const VOICES: Voice[] = [
  {
    id: 'voice-1',
    name: 'Alex - Professional',
    description: 'Clear, professional voice perfect for narration',
    gender: 'male',
    accent: 'American',
    preview: 'Hello, I am Alex. I have a professional and clear voice.',
  },
  {
    id: 'voice-2',
    name: 'Sarah - Friendly',
    description: 'Warm and friendly voice for engaging content',
    gender: 'female',
    accent: 'American',
    preview: 'Hi there! I am Sarah, and I love creating friendly content.',
  },
  {
    id: 'voice-3',
    name: 'James - Deep',
    description: 'Deep, authoritative voice for serious content',
    gender: 'male',
    accent: 'British',
    preview: 'Good day. I am James, with a deep and authoritative tone.',
  },
  {
    id: 'voice-4',
    name: 'Emma - Energetic',
    description: 'Energetic and upbeat voice for exciting content',
    gender: 'female',
    accent: 'Australian',
    preview: 'Hey! I am Emma, and I bring energy to every word!',
  },
  {
    id: 'voice-5',
    name: 'David - Calm',
    description: 'Calm and soothing voice for relaxing content',
    gender: 'male',
    accent: 'Canadian',
    preview: 'Hello. I am David, and my voice is calm and soothing.',
  },
  {
    id: 'voice-6',
    name: 'Olivia - Elegant',
    description: 'Elegant and sophisticated voice for premium content',
    gender: 'female',
    accent: 'British',
    preview: 'Greetings. I am Olivia, bringing elegance to your content.',
  },
];

export function AIVoice() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [step, setStep] = useState<'text' | 'voice' | 'preview'>('text');

  const addMediaItem = useMediaPoolStore((state) => state.addMediaItem);

  /**
   * Generate voice from text
   */
  const generateVoice = useCallback(async () => {
    if (!text || !selectedVoice) return;

    setIsGenerating(true);

    try {
      // Simulate AI voice generation
      // In production, this would call an API like ElevenLabs
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a dummy audio URL (in production, this would be the generated audio)
      const audioUrl = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      
      setGeneratedAudio(audioUrl);
      setStep('preview');
    } catch (error) {
      console.error('Failed to generate voice:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [text, selectedVoice]);

  /**
   * Save to media pool
   */
  const saveToMediaPool = useCallback(() => {
    if (!generatedAudio || !selectedVoice) return;

    const item: MediaItem = {
      id: generateId(),
      name: `AI Voice - ${selectedVoice.name} - ${new Date().toLocaleTimeString()}`,
      type: 'audio',
      path: generatedAudio,
      size: 0,
      duration: text.split(' ').length * 0.5, // Rough estimate
      thumbnail: undefined,
      importedAt: new Date(),
      tags: ['ai-generated', 'voice', selectedVoice.name],
      rating: 0,
      usageCount: 0,
    };

    addMediaItem(item);

    // Reset
    setText('');
    setSelectedVoice(null);
    setGeneratedAudio(null);
    setStep('text');
  }, [generatedAudio, selectedVoice, text, addMediaItem]);

  /**
   * Reset wizard
   */
  const reset = () => {
    setText('');
    setSelectedVoice(null);
    setGeneratedAudio(null);
    setStep('text');
  };

  return (
    <div className="ai-voice">
      <div className="ai-voice__header">
        <h2 className="ai-voice__title">🎙️ AI Voice Studio</h2>
        <p className="ai-voice__subtitle">
          Generate professional voiceovers with AI - Like ElevenLabs
        </p>
      </div>

      {/* Progress Steps */}
      <div className="ai-voice__steps">
        <div className={`step ${step === 'text' ? 'step--active' : step !== 'text' ? 'step--complete' : ''}`}>
          <div className="step__number">1</div>
          <div className="step__label">Text</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'voice' ? 'step--active' : step === 'preview' ? 'step--complete' : ''}`}>
          <div className="step__number">2</div>
          <div className="step__label">Voice</div>
        </div>
        <div className="step__line" />
        <div className={`step ${step === 'preview' ? 'step--active' : ''}`}>
          <div className="step__number">✓</div>
          <div className="step__label">Preview</div>
        </div>
      </div>

      {/* Content */}
      <div className="ai-voice__content">
        {/* Step 1: Enter Text */}
        {step === 'text' && (
          <div className="ai-voice__step">
            <h3 className="step-title">Enter Your Text</h3>
            <p className="step-hint">
              Type or paste the text you want to convert to speech (max 5000 characters)
            </p>
            <textarea
              className="text-input"
              placeholder="Enter your text here... For example: Welcome to my channel! Today we're going to explore amazing AI tools..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={5000}
              rows={12}
            />
            <div className="text-stats">
              <span>{text.length} / 5000 characters</span>
              <span>{text.split(' ').filter(w => w).length} words</span>
              <span>~{Math.ceil(text.split(' ').filter(w => w).length * 0.5)}s duration</span>
            </div>
            <div className="ai-voice__actions">
              <button
                className="button button--primary"
                onClick={() => setStep('voice')}
                disabled={text.trim().length < 10}
              >
                Next: Choose Voice →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Voice */}
        {step === 'voice' && (
          <div className="ai-voice__step">
            <h3 className="step-title">Choose a Voice</h3>
            <p className="step-hint">
              Select the voice that best fits your content
            </p>
            <div className="voices-grid">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  className={`voice-card ${selectedVoice?.id === voice.id ? 'voice-card--selected' : ''}`}
                  onClick={() => setSelectedVoice(voice)}
                >
                  <div className="voice-card__header">
                    <div className="voice-card__icon">
                      {voice.gender === 'male' ? '👨' : voice.gender === 'female' ? '👩' : '🧑'}
                    </div>
                    <div className="voice-card__info">
                      <div className="voice-card__name">{voice.name}</div>
                      <div className="voice-card__meta">
                        {voice.gender} • {voice.accent}
                      </div>
                    </div>
                  </div>
                  <div className="voice-card__description">{voice.description}</div>
                  <div className="voice-card__preview">
                    <span className="preview-icon">🔊</span>
                    <span className="preview-text">{voice.preview}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="ai-voice__actions">
              <button className="button" onClick={() => setStep('text')}>
                ← Back
              </button>
              <button
                className="button button--primary"
                onClick={generateVoice}
                disabled={!selectedVoice || isGenerating}
              >
                {isGenerating ? '⏳ Generating Voice...' : '✨ Generate Voice'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Save */}
        {step === 'preview' && (
          <div className="ai-voice__step">
            <div className="success-message">
              <div className="success-message__icon">🎉</div>
              <h3 className="success-message__title">Voice Generated!</h3>
              <p className="success-message__text">
                Your AI voice is ready. Preview it and save to media pool.
              </p>
            </div>

            <div className="preview-card">
              <div className="preview-card__header">
                <div className="preview-card__icon">🎙️</div>
                <div className="preview-card__info">
                  <div className="preview-card__title">
                    AI Voice - {selectedVoice?.name}
                  </div>
                  <div className="preview-card__meta">
                    {text.split(' ').filter(w => w).length} words • ~{Math.ceil(text.split(' ').filter(w => w).length * 0.5)}s
                  </div>
                </div>
              </div>
              <div className="preview-card__text">
                {text.substring(0, 200)}{text.length > 200 ? '...' : ''}
              </div>
              <div className="preview-card__controls">
                <button className="button button--secondary">
                  ▶️ Play Preview
                </button>
                <button className="button button--secondary">
                  🔄 Regenerate
                </button>
              </div>
            </div>

            <div className="ai-voice__actions">
              <button className="button" onClick={reset}>
                🔄 Create Another
              </button>
              <button className="button button--primary" onClick={saveToMediaPool}>
                💾 Save to Media Pool
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="ai-voice__info">
        <h4>💡 Pro Tips</h4>
        <ul>
          <li>Use punctuation for natural pauses</li>
          <li>Write in a conversational tone</li>
          <li>Break long sentences into shorter ones</li>
          <li>Preview different voices to find the best fit</li>
          <li>Add emphasis with CAPS or *asterisks*</li>
        </ul>
        <div className="info-note">
          <strong>Note:</strong> This is a demo. In production, this would integrate with services like ElevenLabs, Google Cloud TTS, or Azure Speech.
        </div>
      </div>
    </div>
  );
}
