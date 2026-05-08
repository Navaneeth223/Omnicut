/**
 * AI Voice Studio Component
 * Text-to-speech and Real-Time Voice Transform
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore } from '@omnicut/store';
import { generateId } from '@omnicut/core';
import type { MediaItem } from '@omnicut/core';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../Loading/Loading';
import { VoiceInput } from '../VoiceInput/VoiceInput';
import { RealTimeVoice } from './RealTimeVoice';
import './AIVoice.css';

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  preview: string;
}

type Tab = 'text-to-speech' | 'real-time';

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
  const [activeTab, setActiveTab] = useState<Tab>('text-to-speech');
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [step, setStep] = useState<'text' | 'voice' | 'preview'>('text');

  const addMediaItem = useMediaPoolStore((state) => state.addMediaItem);
  const toast = useToast();

  /**
   * Generate voice from text using Web Speech API
   */
  const generateVoice = useCallback(async () => {
    if (!text || !selectedVoice) return;

    setIsGenerating(true);
    toast.info(`Generating voice with ${selectedVoice.name}...`);

    try {
      // Use Web Speech Synthesis API
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Map our voice selection to available system voices
      let selectedSystemVoice = voices.find(v => {
        if (selectedVoice.gender === 'male') {
          return v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('james');
        } else if (selectedVoice.gender === 'female') {
          return v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria');
        }
        return false;
      });
      
      // Fallback to first available voice
      if (!selectedSystemVoice && voices.length > 0) {
        selectedSystemVoice = voices[0];
      }
      
      if (selectedSystemVoice) {
        utterance.voice = selectedSystemVoice;
      }
      
      // Configure speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Create audio blob for saving
      // Note: Web Speech API doesn't provide direct audio output, so we'll create a placeholder
      // In production, you'd use a service like ElevenLabs or Google Cloud TTS
      
      // For now, we'll speak it and create a reference
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
      
      // Create a data URL as placeholder (in production, this would be actual audio file)
      const audioUrl = `data:audio/wav;base64,${btoa(text)}`; // Placeholder
      
      setGeneratedAudio(audioUrl);
      setStep('preview');
      toast.success('Voice generated successfully!');
    } catch (error) {
      console.error('Failed to generate voice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate voice: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  }, [text, selectedVoice, toast]);

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
    toast.success('Voice saved to Media Pool!');

    // Reset
    setText('');
    setSelectedVoice(null);
    setGeneratedAudio(null);
    setStep('text');
  }, [generatedAudio, selectedVoice, text, addMediaItem, toast]);

  /**
   * Preview voice
   */
  const previewVoice = useCallback((voice: Voice) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance with preview text
    const utterance = new SpeechSynthesisUtterance(voice.preview);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to match voice
    let selectedSystemVoice = voices.find(v => {
      if (voice.gender === 'male') {
        return v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('james');
      } else if (voice.gender === 'female') {
        return v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria');
      }
      return false;
    });
    
    if (!selectedSystemVoice && voices.length > 0) {
      selectedSystemVoice = voices[0];
    }
    
    if (selectedSystemVoice) {
      utterance.voice = selectedSystemVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
    toast.info(`Playing preview: ${voice.name}`);
  }, [toast]);

  /**
   * Play generated audio
   */
  const playGeneratedAudio = useCallback(() => {
    if (!text || !selectedVoice) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance with full text
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to match voice
    let selectedSystemVoice = voices.find(v => {
      if (selectedVoice.gender === 'male') {
        return v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('james');
      } else if (selectedVoice.gender === 'female') {
        return v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria');
      }
      return false;
    });
    
    if (!selectedSystemVoice && voices.length > 0) {
      selectedSystemVoice = voices[0];
    }
    
    if (selectedSystemVoice) {
      utterance.voice = selectedSystemVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
    toast.info('Playing voice...');
  }, [text, selectedVoice, toast]);

  return (
    <div className="ai-voice">
      {/* Loading Overlay */}
      {isGenerating && (
        <LoadingOverlay 
          message={`Generating voice with ${selectedVoice?.name}...`}
        />
      )}

      <div className="ai-voice__header">
        <h2 className="ai-voice__title">🎙️ AI Voice Studio</h2>
        <p className="ai-voice__subtitle">
          Generate professional voiceovers with AI - Like ElevenLabs
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="ai-voice__tabs">
        <button
          className={`tab-btn ${activeTab === 'text-to-speech' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('text-to-speech')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-label">Text-to-Speech</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'real-time' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('real-time')}
        >
          <span className="tab-icon">🎤</span>
          <span className="tab-label">Real-Time Voice</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'text-to-speech' ? (
        <>
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
            <div className="text-input-wrapper">
              <textarea
                className="text-input"
                placeholder="Enter your text here... For example: Welcome to my channel! Today we're going to explore amazing AI tools..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
                rows={12}
              />
              <div className="text-input-actions">
                <VoiceInput
                  onTranscript={(transcript) => setText(prev => prev + ' ' + transcript)}
                  onError={(error) => toast.error(`Voice input error: ${error}`)}
                />
              </div>
            </div>
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
                    <button 
                      className="preview-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        previewVoice(voice);
                      }}
                      type="button"
                    >
                      <span className="preview-icon">🔊</span>
                    </button>
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
                <button className="button button--secondary" onClick={playGeneratedAudio}>
                  ▶️ Play Preview
                </button>
                <button className="button button--secondary" onClick={() => {
                  setStep('voice');
                  setGeneratedAudio(null);
                }}>
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
        </>
      ) : (
        <RealTimeVoice />
      )}
    </div>
  );
}
