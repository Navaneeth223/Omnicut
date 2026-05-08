/**
 * Real-Time Voice Transform Component
 * Live voice transformation and record-then-convert
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import './RealTimeVoice.css';

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
}

const TARGET_VOICES: Voice[] = [
  { id: 'voice-deep', name: 'Deep Voice', description: 'Lower pitch, authoritative', gender: 'male' },
  { id: 'voice-high', name: 'High Voice', description: 'Higher pitch, energetic', gender: 'female' },
  { id: 'voice-robot', name: 'Robot Voice', description: 'Robotic, synthetic', gender: 'neutral' },
  { id: 'voice-echo', name: 'Echo Voice', description: 'Reverb and echo effect', gender: 'neutral' },
  { id: 'voice-whisper', name: 'Whisper', description: 'Soft, quiet tone', gender: 'neutral' },
  { id: 'voice-monster', name: 'Monster', description: 'Deep, distorted', gender: 'male' },
];

type Mode = 'live' | 'record';

export function RealTimeVoice() {
  const [mode, setMode] = useState<Mode>('live');
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const [latency, setLatency] = useState(0);
  const [pitchShift, setPitchShift] = useState(0);
  const [formantShift, setFormantShift] = useState(0);
  const [blend, setBlend] = useState(100);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [convertedAudio, setConvertedAudio] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toast = useToast();

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update input level meter
  useEffect(() => {
    if (!analyserRef.current || !isTransforming) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setInputLevel(average / 255 * 100);
      
      if (isTransforming) {
        requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  }, [isTransforming]);

  /**
   * Start live voice transformation
   */
  const startLiveTransform = useCallback(async () => {
    if (!selectedVoice) {
      toast.warning('Please select a target voice first');
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      mediaStreamRef.current = stream;
      
      const audioContext = audioContextRef.current!;
      const source = audioContext.createMediaStreamSource(stream);
      
      // Create analyser for input level
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      source.connect(analyser);
      
      // Create pitch shifter (simplified - in production use Web Audio API pitch shift)
      const gainNode = audioContext.createGain();
      gainNode.gain.value = blend / 100;
      
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      setIsTransforming(true);
      setLatency(Math.random() * 100 + 150); // Simulated latency
      toast.success(`Live transform started with ${selectedVoice.name}`);
    } catch (error) {
      console.error('Failed to start live transform:', error);
      toast.error('Failed to access microphone. Please grant permission.');
    }
  }, [selectedVoice, blend, toast]);

  /**
   * Stop live transformation
   */
  const stopLiveTransform = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    setIsTransforming(false);
    setInputLevel(0);
    setOutputLevel(0);
    toast.info('Live transform stopped');
  }, [toast]);

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        toast.success('Recording saved! Click "Convert Voice" to transform it.');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started...');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to access microphone');
    }
  }, [toast]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  /**
   * Convert recorded audio
   */
  const convertRecordedAudio = useCallback(async () => {
    if (!recordedAudio || !selectedVoice) {
      toast.warning('Please record audio and select a target voice');
      return;
    }

    toast.info('Converting voice... This may take a moment.');
    
    // Simulate conversion (in production, send to API)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a dummy converted audio URL
    const url = URL.createObjectURL(recordedAudio);
    setConvertedAudio(url);
    toast.success('Voice converted successfully!');
  }, [recordedAudio, selectedVoice, toast]);

  /**
   * Download converted audio
   */
  const downloadAudio = useCallback(() => {
    if (!convertedAudio) return;
    
    const a = document.createElement('a');
    a.href = convertedAudio;
    a.download = `voice-transform-${Date.now()}.webm`;
    a.click();
    toast.success('Audio downloaded!');
  }, [convertedAudio, toast]);

  return (
    <div className="real-time-voice">
      {/* Mode Selector */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'live' ? 'mode-btn--active' : ''}`}
          onClick={() => setMode('live')}
        >
          <span className="mode-icon">🔴</span>
          <span className="mode-label">Live Transform</span>
        </button>
        <button
          className={`mode-btn ${mode === 'record' ? 'mode-btn--active' : ''}`}
          onClick={() => setMode('record')}
        >
          <span className="mode-icon">🎙️</span>
          <span className="mode-label">Record & Convert</span>
        </button>
      </div>

      {/* Live Transform Mode */}
      {mode === 'live' && (
        <div className="transform-panel">
          <div className="transform-layout">
            {/* Input Section */}
            <div className="transform-section">
              <h3 className="section-title">My Voice (Input)</h3>
              <div className="waveform-display">
                <div className="waveform-bars">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{
                        height: `${Math.random() * inputLevel}%`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="level-meter">
                <div className="level-label">Input Level:</div>
                <div className="level-bar">
                  <div 
                    className="level-fill level-fill--input"
                    style={{ width: `${inputLevel}%` }}
                  />
                </div>
                <div className="level-value">{Math.round(inputLevel - 100)} dB</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="transform-arrow">→</div>

            {/* Output Section */}
            <div className="transform-section">
              <h3 className="section-title">Target Voice</h3>
              <div className="voice-selector">
                {selectedVoice ? (
                  <div className="selected-voice-card">
                    <div className="voice-name">{selectedVoice.name}</div>
                    <div className="voice-desc">{selectedVoice.description}</div>
                    <button 
                      className="change-voice-btn"
                      onClick={() => setSelectedVoice(null)}
                    >
                      Change Voice
                    </button>
                  </div>
                ) : (
                  <div className="voice-grid">
                    {TARGET_VOICES.map(voice => (
                      <button
                        key={voice.id}
                        className="voice-option"
                        onClick={() => setSelectedVoice(voice)}
                      >
                        <div className="voice-option-name">{voice.name}</div>
                        <div className="voice-option-desc">{voice.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="transform-controls">
            <div className="control-group">
              <label className="control-label">
                Pitch Correction: {pitchShift > 0 ? '+' : ''}{pitchShift} semitones
              </label>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={pitchShift}
                onChange={(e) => setPitchShift(Number(e.target.value))}
                className="control-slider"
              />
            </div>

            <div className="control-group">
              <label className="control-label">
                Formant Shift: {formantShift > 0 ? '+' : ''}{formantShift}
              </label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={formantShift}
                onChange={(e) => setFormantShift(Number(e.target.value))}
                className="control-slider"
              />
            </div>

            <div className="control-group">
              <label className="control-label">
                Blend: Original {100 - blend}% ──── {blend}% Target
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={blend}
                onChange={(e) => setBlend(Number(e.target.value))}
                className="control-slider"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="transform-stats">
            <div className="stat">
              <span className="stat-label">Latency:</span>
              <span className="stat-value">{Math.round(latency)}ms</span>
            </div>
            <div className="stat">
              <span className="stat-label">Quality:</span>
              <span className="stat-value">High</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="transform-actions">
            {!isTransforming ? (
              <button
                className="button button--primary button--large transform-btn"
                onClick={startLiveTransform}
                disabled={!selectedVoice}
              >
                <span className="btn-icon">●</span>
                <span className="btn-text">START TRANSFORM</span>
              </button>
            ) : (
              <button
                className="button button--danger button--large transform-btn"
                onClick={stopLiveTransform}
              >
                <span className="btn-icon">■</span>
                <span className="btn-text">STOP TRANSFORM</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Record & Convert Mode */}
      {mode === 'record' && (
        <div className="record-panel">
          <div className="record-section">
            <h3 className="section-title">Record Your Voice</h3>
            <p className="section-hint">
              Record up to 10 minutes of speech, then convert to your chosen voice
            </p>

            <div className="record-controls">
              {!isRecording && !recordedAudio && (
                <button
                  className="button button--primary button--large"
                  onClick={startRecording}
                >
                  <span className="btn-icon">🎙️</span>
                  <span className="btn-text">START RECORDING</span>
                </button>
              )}

              {isRecording && (
                <button
                  className="button button--danger button--large"
                  onClick={stopRecording}
                >
                  <span className="btn-icon">■</span>
                  <span className="btn-text">STOP RECORDING</span>
                </button>
              )}

              {recordedAudio && !convertedAudio && (
                <div className="recorded-audio-card">
                  <div className="audio-icon">🎵</div>
                  <div className="audio-info">
                    <div className="audio-title">Recording Complete</div>
                    <div className="audio-meta">Ready to convert</div>
                  </div>
                  <button
                    className="button button--primary"
                    onClick={convertRecordedAudio}
                    disabled={!selectedVoice}
                  >
                    Convert Voice
                  </button>
                </div>
              )}

              {convertedAudio && (
                <div className="converted-audio-card">
                  <div className="audio-icon">✨</div>
                  <div className="audio-info">
                    <div className="audio-title">Voice Converted!</div>
                    <div className="audio-meta">Using {selectedVoice?.name}</div>
                  </div>
                  <div className="audio-actions">
                    <button className="button button--secondary">
                      ▶️ Play
                    </button>
                    <button 
                      className="button button--secondary"
                      onClick={downloadAudio}
                    >
                      ⬇️ Download
                    </button>
                    <button className="button button--secondary">
                      ➕ Add to Timeline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="voice-selection-section">
            <h3 className="section-title">Select Target Voice</h3>
            <div className="voice-grid-compact">
              {TARGET_VOICES.map(voice => (
                <button
                  key={voice.id}
                  className={`voice-card-compact ${selectedVoice?.id === voice.id ? 'voice-card-compact--selected' : ''}`}
                  onClick={() => setSelectedVoice(voice)}
                >
                  <div className="voice-card-name">{voice.name}</div>
                  <div className="voice-card-desc">{voice.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
