/**
 * Voice Input Component
 * Speech-to-text input using Web Speech API
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import './VoiceInput.css';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

export function VoiceInput({
  onTranscript,
  onError,
  language = 'en-US',
  continuous = true,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (onError) {
        onError(event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, onTranscript, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      if (onError) {
        onError('Failed to start voice recognition');
      }
    }
  }, [onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <button
        className="voice-input-btn voice-input-btn--disabled"
        disabled
        title="Voice input not supported in this browser"
      >
        🎤
      </button>
    );
  }

  return (
    <button
      className={`voice-input-btn ${isListening ? 'voice-input-btn--listening' : ''}`}
      onClick={toggleListening}
      title={isListening ? 'Stop recording' : 'Start voice input'}
      type="button"
    >
      {isListening ? (
        <>
          <span className="voice-input-btn__icon voice-input-btn__icon--pulse">🎤</span>
          <span className="voice-input-btn__text">Listening...</span>
        </>
      ) : (
        <>
          <span className="voice-input-btn__icon">🎤</span>
          <span className="voice-input-btn__text">Voice Input</span>
        </>
      )}
    </button>
  );
}
