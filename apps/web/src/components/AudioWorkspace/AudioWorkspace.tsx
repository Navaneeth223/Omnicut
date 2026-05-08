/**
 * Audio Workspace
 * Professional audio editing and mixing tools
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import './AudioWorkspace.css';

interface AudioTrack {
  id: string;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  color: string;
}

interface AudioEffect {
  id: string;
  name: string;
  type: 'eq' | 'compressor' | 'reverb' | 'delay' | 'limiter' | 'gate';
  enabled: boolean;
  parameters: Record<string, number>;
}

const AUDIO_EFFECTS = [
  {
    id: 'eq',
    name: 'Equalizer',
    icon: '🎚️',
    description: '3-band EQ',
    parameters: {
      low: 0,
      mid: 0,
      high: 0,
    },
  },
  {
    id: 'compressor',
    name: 'Compressor',
    icon: '🔊',
    description: 'Dynamic range compression',
    parameters: {
      threshold: -20,
      ratio: 4,
      attack: 10,
      release: 100,
    },
  },
  {
    id: 'reverb',
    name: 'Reverb',
    icon: '🌊',
    description: 'Room reverb',
    parameters: {
      size: 50,
      decay: 50,
      mix: 30,
    },
  },
  {
    id: 'delay',
    name: 'Delay',
    icon: '⏱️',
    description: 'Echo effect',
    parameters: {
      time: 250,
      feedback: 30,
      mix: 25,
    },
  },
  {
    id: 'limiter',
    name: 'Limiter',
    icon: '🛡️',
    description: 'Peak limiter',
    parameters: {
      threshold: -1,
      release: 50,
    },
  },
  {
    id: 'gate',
    name: 'Noise Gate',
    icon: '🚪',
    description: 'Noise reduction',
    parameters: {
      threshold: -40,
      attack: 5,
      release: 50,
    },
  },
];

const DEFAULT_TRACKS: AudioTrack[] = [
  { id: '1', name: 'Master', volume: 0, pan: 0, muted: false, solo: false, armed: false, color: '#3b82f6' },
  { id: '2', name: 'Music', volume: -6, pan: 0, muted: false, solo: false, armed: false, color: '#10b981' },
  { id: '3', name: 'Dialogue', volume: -3, pan: 0, muted: false, solo: false, armed: false, color: '#f59e0b' },
  { id: '4', name: 'SFX', volume: -12, pan: 0, muted: false, solo: false, armed: false, color: '#ef4444' },
];

export function AudioWorkspace() {
  const [tracks, setTracks] = useState<AudioTrack[]>(DEFAULT_TRACKS);
  const [selectedTrack, setSelectedTrack] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'mixer' | 'effects' | 'automation'>('mixer');
  const [appliedEffects, setAppliedEffects] = useState<AudioEffect[]>([]);
  const [showMeters, setShowMeters] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const waveformRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  /**
   * Update track property
   */
  const updateTrack = useCallback((trackId: string, property: keyof AudioTrack, value: any) => {
    setTracks(prev => prev.map(track =>
      track.id === trackId ? { ...track, [property]: value } : track
    ));
  }, []);

  /**
   * Add effect to track
   */
  const addEffect = useCallback((effectId: string) => {
    const effect = AUDIO_EFFECTS.find(e => e.id === effectId);
    if (!effect) return;

    const newEffect: AudioEffect = {
      id: `${effectId}-${Date.now()}`,
      name: effect.name,
      type: effectId as any,
      enabled: true,
      parameters: { ...effect.parameters },
    };

    setAppliedEffects(prev => [...prev, newEffect]);
    toast.success(`Added ${effect.name} effect`);
  }, [toast]);

  /**
   * Remove effect
   */
  const removeEffect = useCallback((effectId: string) => {
    const effect = appliedEffects.find(e => e.id === effectId);
    setAppliedEffects(prev => prev.filter(e => e.id !== effectId));
    if (effect) {
      toast.success(`Removed ${effect.name} effect`);
    }
  }, [appliedEffects, toast]);

  /**
   * Toggle effect
   */
  const toggleEffect = useCallback((effectId: string) => {
    setAppliedEffects(prev => prev.map(e =>
      e.id === effectId ? { ...e, enabled: !e.enabled } : e
    ));
  }, []);

  /**
   * Update effect parameter
   */
  const updateEffectParameter = useCallback((effectId: string, param: string, value: number) => {
    setAppliedEffects(prev => prev.map(e =>
      e.id === effectId ? {
        ...e,
        parameters: { ...e.parameters, [param]: value },
      } : e
    ));
  }, []);

  /**
   * Add new track
   */
  const addTrack = useCallback(() => {
    const newTrack: AudioTrack = {
      id: `${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      volume: -6,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    setTracks(prev => [...prev, newTrack]);
    toast.success(`Added ${newTrack.name}`);
  }, [tracks.length, toast]);

  /**
   * Export audio mix
   */
  const exportAudio = useCallback(() => {
    toast.info('Exporting audio mix...');
    
    // Simulate export process
    setTimeout(() => {
      toast.success('Audio mix exported successfully!');
    }, 1500);
  }, [toast]);

  /**
   * Clear all automation
   */
  const clearAutomation = useCallback(() => {
    toast.success('Automation cleared');
  }, [toast]);

  /**
   * Draw waveform
   */
  useEffect(() => {
    const canvas = waveformRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw waveform (placeholder)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.3;
    const frequency = 0.02;

    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + Math.sin(x * frequency) * amplitude * Math.random();
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }, []);

  return (
    <div className="audio-workspace">
      {/* Header */}
      <div className="audio-workspace__header">
        <div className="audio-workspace__title-section">
          <h2 className="audio-workspace__title">🎵 Audio Workspace</h2>
          <p className="audio-workspace__subtitle">Professional audio editing and mixing</p>
        </div>
        <div className="audio-workspace__actions">
          <button
            className={`button ${isPlaying ? 'button--danger' : 'button--primary'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button className="button button--secondary" onClick={exportAudio}>
            Export Mix
          </button>
          <button className="button button--secondary" onClick={() => setShowMeters(!showMeters)}>
            {showMeters ? 'Hide' : 'Show'} Meters
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="audio-workspace__layout">
        {/* Left Panel - Waveform & Timeline */}
        <div className="audio-workspace__waveform-section">
          {/* Waveform Display */}
          <div className="waveform-container">
            <div className="waveform-header">
              <h3 className="waveform-title">Waveform</h3>
              <div className="waveform-controls">
                <button className="icon-button" title="Zoom In">+</button>
                <button className="icon-button" title="Zoom Out">-</button>
                <button className="icon-button" title="Fit">⊡</button>
              </div>
            </div>
            <canvas ref={waveformRef} className="waveform-canvas" />
            <div className="waveform-timeline">
              <div className="timeline-marker">0:00</div>
              <div className="timeline-marker">0:10</div>
              <div className="timeline-marker">0:20</div>
              <div className="timeline-marker">0:30</div>
              <div className="timeline-marker">0:40</div>
              <div className="timeline-marker">0:50</div>
              <div className="timeline-marker">1:00</div>
            </div>
          </div>

          {/* Track List */}
          <div className="track-list">
            <div className="track-list__header">
              <h3 className="track-list__title">Tracks</h3>
              <button className="button button--small" onClick={addTrack}>+ Add Track</button>
            </div>
            <div className="track-list__items">
              {tracks.map(track => (
                <div
                  key={track.id}
                  className={`track-item ${selectedTrack === track.id ? 'track-item--selected' : ''}`}
                  onClick={() => setSelectedTrack(track.id)}
                >
                  <div className="track-item__color" style={{ background: track.color }} />
                  <div className="track-item__name">{track.name}</div>
                  <div className="track-item__controls">
                    <button
                      className={`track-button ${track.muted ? 'track-button--active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTrack(track.id, 'muted', !track.muted);
                      }}
                      title="Mute"
                    >
                      M
                    </button>
                    <button
                      className={`track-button ${track.solo ? 'track-button--active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTrack(track.id, 'solo', !track.solo);
                      }}
                      title="Solo"
                    >
                      S
                    </button>
                    <button
                      className={`track-button ${track.armed ? 'track-button--active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTrack(track.id, 'armed', !track.armed);
                      }}
                      title="Arm for Recording"
                    >
                      R
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Mixer & Effects */}
        <div className="audio-workspace__controls">
          {/* Tabs */}
          <div className="control-tabs">
            <button
              className={`control-tab ${activeTab === 'mixer' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('mixer')}
            >
              Mixer
            </button>
            <button
              className={`control-tab ${activeTab === 'effects' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('effects')}
            >
              Effects
            </button>
            <button
              className={`control-tab ${activeTab === 'automation' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('automation')}
            >
              Automation
            </button>
          </div>

          {/* Tab Content */}
          <div className="control-content">
            {/* Mixer */}
            {activeTab === 'mixer' && (
              <div className="mixer-panel">
                {tracks.map(track => (
                  <div key={track.id} className="mixer-channel">
                    <div className="mixer-channel__header">
                      <div className="mixer-channel__name">{track.name}</div>
                      <div className="mixer-channel__color" style={{ background: track.color }} />
                    </div>

                    {/* Meter */}
                    {showMeters && (
                      <div className="audio-meter">
                        <div className="audio-meter__bar">
                          <div
                            className="audio-meter__level"
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                          />
                        </div>
                        <div className="audio-meter__scale">
                          <span>0</span>
                          <span>-6</span>
                          <span>-12</span>
                          <span>-18</span>
                          <span>-∞</span>
                        </div>
                      </div>
                    )}

                    {/* Fader */}
                    <div className="mixer-fader">
                      <input
                        type="range"
                        min="-60"
                        max="12"
                        step="0.1"
                        value={track.volume}
                        onChange={(e) => updateTrack(track.id, 'volume', Number(e.target.value))}
                        className="fader-slider"
                        orient="vertical"
                      />
                      <div className="fader-value">{track.volume.toFixed(1)} dB</div>
                    </div>

                    {/* Pan */}
                    <div className="mixer-pan">
                      <label className="pan-label">Pan</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={track.pan}
                        onChange={(e) => updateTrack(track.id, 'pan', Number(e.target.value))}
                        className="pan-slider"
                      />
                      <div className="pan-value">
                        {track.pan === 0 ? 'C' : track.pan > 0 ? `R${track.pan}` : `L${Math.abs(track.pan)}`}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="mixer-controls">
                      <button
                        className={`mixer-button ${track.muted ? 'mixer-button--active' : ''}`}
                        onClick={() => updateTrack(track.id, 'muted', !track.muted)}
                      >
                        M
                      </button>
                      <button
                        className={`mixer-button ${track.solo ? 'mixer-button--active' : ''}`}
                        onClick={() => updateTrack(track.id, 'solo', !track.solo)}
                      >
                        S
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Effects */}
            {activeTab === 'effects' && (
              <div className="effects-panel">
                <div className="effects-browser">
                  <h4 className="effects-browser__title">Available Effects</h4>
                  <div className="effects-grid">
                    {AUDIO_EFFECTS.map(effect => (
                      <button
                        key={effect.id}
                        className="effect-card"
                        onClick={() => addEffect(effect.id)}
                      >
                        <div className="effect-card__icon">{effect.icon}</div>
                        <div className="effect-card__name">{effect.name}</div>
                        <div className="effect-card__description">{effect.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="effects-chain">
                  <h4 className="effects-chain__title">Effect Chain</h4>
                  {appliedEffects.length === 0 ? (
                    <div className="effects-empty">
                      <p>No effects applied</p>
                      <p className="effects-empty__hint">Click an effect above to add it</p>
                    </div>
                  ) : (
                    <div className="effects-list">
                      {appliedEffects.map(effect => (
                        <div key={effect.id} className="applied-effect">
                          <div className="applied-effect__header">
                            <div className="applied-effect__name">{effect.name}</div>
                            <div className="applied-effect__actions">
                              <button
                                className={`effect-toggle ${effect.enabled ? 'effect-toggle--on' : ''}`}
                                onClick={() => toggleEffect(effect.id)}
                              >
                                {effect.enabled ? 'ON' : 'OFF'}
                              </button>
                              <button
                                className="effect-remove"
                                onClick={() => removeEffect(effect.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <div className="applied-effect__parameters">
                            {Object.entries(effect.parameters).map(([param, value]) => (
                              <label key={param} className="parameter-control">
                                <span className="parameter-label">{param}</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={value}
                                  onChange={(e) => updateEffectParameter(effect.id, param, Number(e.target.value))}
                                  className="parameter-slider"
                                />
                                <span className="parameter-value">{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Automation */}
            {activeTab === 'automation' && (
              <div className="automation-panel">
                <div className="automation-info">
                  <h4>Volume Automation</h4>
                  <p>Draw automation curves on the timeline to control volume over time.</p>
                </div>
                <div className="automation-controls">
                  <button className="button button--secondary">Add Keyframe</button>
                  <button className="button button--secondary" onClick={clearAutomation}>Clear Automation</button>
                </div>
                <div className="automation-graph">
                  <svg viewBox="0 0 400 200" className="automation-svg">
                    <defs>
                      <linearGradient id="automationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent-1)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 100 L 100 80 L 200 120 L 300 60 L 400 100"
                      stroke="var(--accent-1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M 0 100 L 100 80 L 200 120 L 300 60 L 400 100 L 400 200 L 0 200 Z"
                      fill="url(#automationGradient)"
                    />
                    <circle cx="0" cy="100" r="4" fill="var(--accent-1)" />
                    <circle cx="100" cy="80" r="4" fill="var(--accent-1)" />
                    <circle cx="200" cy="120" r="4" fill="var(--accent-1)" />
                    <circle cx="300" cy="60" r="4" fill="var(--accent-1)" />
                    <circle cx="400" cy="100" r="4" fill="var(--accent-1)" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
