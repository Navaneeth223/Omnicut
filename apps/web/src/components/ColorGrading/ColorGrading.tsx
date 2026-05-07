/**
 * Color Grading Workspace
 * Professional color correction and grading tools
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import './ColorGrading.css';

interface ColorWheelValues {
  lift: { hue: number; saturation: number; luminance: number };
  gamma: { hue: number; saturation: number; luminance: number };
  gain: { hue: number; saturation: number; luminance: number };
}

interface CurvePoint {
  x: number;
  y: number;
}

interface ColorAdjustments {
  temperature: number;
  tint: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  saturation: number;
  vibrance: number;
}

interface HSLAdjustments {
  hue: number;
  saturation: number;
  luminance: number;
}

const DEFAULT_COLOR_WHEELS: ColorWheelValues = {
  lift: { hue: 0, saturation: 0, luminance: 0 },
  gamma: { hue: 0, saturation: 0, luminance: 0 },
  gain: { hue: 0, saturation: 0, luminance: 0 },
};

const DEFAULT_ADJUSTMENTS: ColorAdjustments = {
  temperature: 0,
  tint: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  saturation: 0,
  vibrance: 0,
};

const DEFAULT_HSL: HSLAdjustments = {
  hue: 0,
  saturation: 0,
  luminance: 0,
};

const COLOR_PRESETS = [
  { id: 'none', name: 'None', description: 'No color grading' },
  { id: 'cinematic', name: 'Cinematic', description: 'Teal & Orange look' },
  { id: 'vintage', name: 'Vintage', description: 'Warm vintage film' },
  { id: 'cool', name: 'Cool Blue', description: 'Cool blue tones' },
  { id: 'warm', name: 'Warm Sunset', description: 'Warm golden tones' },
  { id: 'bw', name: 'Black & White', description: 'High contrast B&W' },
  { id: 'bleach', name: 'Bleach Bypass', description: 'Desaturated look' },
  { id: 'film', name: 'Film Emulation', description: 'Classic film stock' },
];

export function ColorGrading() {
  const [activeTab, setActiveTab] = useState<'wheels' | 'curves' | 'primary' | 'hsl' | 'scopes'>('wheels');
  const [colorWheels, setColorWheels] = useState<ColorWheelValues>(DEFAULT_COLOR_WHEELS);
  const [adjustments, setAdjustments] = useState<ColorAdjustments>(DEFAULT_ADJUSTMENTS);
  const [hslAdjustments, setHslAdjustments] = useState<HSLAdjustments>(DEFAULT_HSL);
  const [selectedPreset, setSelectedPreset] = useState('none');
  const [showScopes, setShowScopes] = useState(true);
  const [activeScope, setActiveScope] = useState<'waveform' | 'vectorscope' | 'histogram' | 'parade'>('waveform');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Apply preset
   */
  const applyPreset = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    
    switch (presetId) {
      case 'cinematic':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          temperature: 10,
          contrast: 15,
          highlights: -10,
          shadows: 10,
          saturation: -10,
        });
        break;
      case 'vintage':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          temperature: 20,
          exposure: 5,
          contrast: -10,
          highlights: -15,
          saturation: -20,
        });
        break;
      case 'cool':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          temperature: -20,
          tint: 5,
          contrast: 10,
          saturation: 10,
        });
        break;
      case 'warm':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          temperature: 30,
          tint: -5,
          exposure: 10,
          saturation: 15,
        });
        break;
      case 'bw':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          contrast: 25,
          saturation: -100,
        });
        break;
      case 'bleach':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          contrast: 30,
          saturation: -40,
          highlights: 10,
        });
        break;
      case 'film':
        setAdjustments({
          ...DEFAULT_ADJUSTMENTS,
          temperature: 5,
          contrast: 10,
          highlights: -5,
          shadows: 5,
          saturation: -5,
        });
        break;
      default:
        setAdjustments(DEFAULT_ADJUSTMENTS);
        setColorWheels(DEFAULT_COLOR_WHEELS);
        setHslAdjustments(DEFAULT_HSL);
    }
  }, []);

  /**
   * Reset all adjustments
   */
  const resetAll = useCallback(() => {
    setColorWheels(DEFAULT_COLOR_WHEELS);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setHslAdjustments(DEFAULT_HSL);
    setSelectedPreset('none');
  }, []);

  /**
   * Update color wheel value
   */
  const updateColorWheel = useCallback((
    wheel: 'lift' | 'gamma' | 'gain',
    property: 'hue' | 'saturation' | 'luminance',
    value: number
  ) => {
    setColorWheels(prev => ({
      ...prev,
      [wheel]: {
        ...prev[wheel],
        [property]: value,
      },
    }));
  }, []);

  /**
   * Update adjustment value
   */
  const updateAdjustment = useCallback((key: keyof ColorAdjustments, value: number) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Update HSL value
   */
  const updateHSL = useCallback((key: keyof HSLAdjustments, value: number) => {
    setHslAdjustments(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return (
    <div className="color-grading">
      {/* Header */}
      <div className="color-grading__header">
        <div className="color-grading__title-section">
          <h2 className="color-grading__title">🎨 Color Grading</h2>
          <p className="color-grading__subtitle">Professional color correction and grading tools</p>
        </div>
        <div className="color-grading__actions">
          <button className="button button--secondary" onClick={resetAll}>
            Reset All
          </button>
          <button className="button button--secondary" onClick={() => setShowScopes(!showScopes)}>
            {showScopes ? 'Hide' : 'Show'} Scopes
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="color-grading__layout">
        {/* Left Panel - Viewer & Scopes */}
        <div className="color-grading__viewer-section">
          {/* Viewer */}
          <div className="color-grading__viewer">
            <canvas ref={canvasRef} className="color-grading__canvas" />
            <div className="color-grading__viewer-overlay">
              <div className="viewer-info">
                <span>1920×1080</span>
                <span>•</span>
                <span>00:00:05:12</span>
              </div>
            </div>
          </div>

          {/* Scopes */}
          {showScopes && (
            <div className="color-grading__scopes">
              <div className="scopes-tabs">
                <button
                  className={`scope-tab ${activeScope === 'waveform' ? 'scope-tab--active' : ''}`}
                  onClick={() => setActiveScope('waveform')}
                >
                  Waveform
                </button>
                <button
                  className={`scope-tab ${activeScope === 'vectorscope' ? 'scope-tab--active' : ''}`}
                  onClick={() => setActiveScope('vectorscope')}
                >
                  Vectorscope
                </button>
                <button
                  className={`scope-tab ${activeScope === 'histogram' ? 'scope-tab--active' : ''}`}
                  onClick={() => setActiveScope('histogram')}
                >
                  Histogram
                </button>
                <button
                  className={`scope-tab ${activeScope === 'parade' ? 'scope-tab--active' : ''}`}
                  onClick={() => setActiveScope('parade')}
                >
                  RGB Parade
                </button>
              </div>
              <div className="scope-display">
                <div className="scope-placeholder">
                  {activeScope === 'waveform' && '📊 Waveform Monitor'}
                  {activeScope === 'vectorscope' && '🎯 Vectorscope'}
                  {activeScope === 'histogram' && '📈 Histogram'}
                  {activeScope === 'parade' && '🌈 RGB Parade'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Controls */}
        <div className="color-grading__controls">
          {/* Presets */}
          <div className="control-section">
            <h3 className="control-section__title">Presets</h3>
            <div className="presets-grid">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`preset-card ${selectedPreset === preset.id ? 'preset-card--active' : ''}`}
                  onClick={() => applyPreset(preset.id)}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="control-tabs">
            <button
              className={`control-tab ${activeTab === 'wheels' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('wheels')}
            >
              Wheels
            </button>
            <button
              className={`control-tab ${activeTab === 'curves' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('curves')}
            >
              Curves
            </button>
            <button
              className={`control-tab ${activeTab === 'primary' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('primary')}
            >
              Primary
            </button>
            <button
              className={`control-tab ${activeTab === 'hsl' ? 'control-tab--active' : ''}`}
              onClick={() => setActiveTab('hsl')}
            >
              HSL
            </button>
          </div>

          {/* Tab Content */}
          <div className="control-content">
            {/* Color Wheels */}
            {activeTab === 'wheels' && (
              <div className="wheels-panel">
                <div className="color-wheel-group">
                  <h4 className="wheel-title">Lift (Shadows)</h4>
                  <div className="color-wheel">
                    <div className="color-wheel__circle" />
                    <div className="color-wheel__center" />
                  </div>
                  <div className="wheel-controls">
                    <label className="control-label">
                      <span>Luminance</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={colorWheels.lift.luminance}
                        onChange={(e) => updateColorWheel('lift', 'luminance', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="control-value">{colorWheels.lift.luminance}</span>
                    </label>
                  </div>
                </div>

                <div className="color-wheel-group">
                  <h4 className="wheel-title">Gamma (Midtones)</h4>
                  <div className="color-wheel">
                    <div className="color-wheel__circle" />
                    <div className="color-wheel__center" />
                  </div>
                  <div className="wheel-controls">
                    <label className="control-label">
                      <span>Luminance</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={colorWheels.gamma.luminance}
                        onChange={(e) => updateColorWheel('gamma', 'luminance', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="control-value">{colorWheels.gamma.luminance}</span>
                    </label>
                  </div>
                </div>

                <div className="color-wheel-group">
                  <h4 className="wheel-title">Gain (Highlights)</h4>
                  <div className="color-wheel">
                    <div className="color-wheel__circle" />
                    <div className="color-wheel__center" />
                  </div>
                  <div className="wheel-controls">
                    <label className="control-label">
                      <span>Luminance</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={colorWheels.gain.luminance}
                        onChange={(e) => updateColorWheel('gain', 'luminance', Number(e.target.value))}
                        className="slider"
                      />
                      <span className="control-value">{colorWheels.gain.luminance}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Curves */}
            {activeTab === 'curves' && (
              <div className="curves-panel">
                <div className="curve-editor">
                  <div className="curve-canvas">
                    <svg viewBox="0 0 256 256" className="curve-svg">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#000" />
                          <stop offset="100%" stopColor="#fff" />
                        </linearGradient>
                      </defs>
                      <rect width="256" height="256" fill="url(#curveGradient)" opacity="0.1" />
                      <line x1="0" y1="256" x2="256" y2="0" stroke="var(--text-tertiary)" strokeWidth="2" />
                      <circle cx="0" cy="256" r="6" fill="var(--accent-1)" />
                      <circle cx="256" cy="0" r="6" fill="var(--accent-1)" />
                    </svg>
                  </div>
                  <div className="curve-controls">
                    <button className="curve-button curve-button--active">RGB</button>
                    <button className="curve-button">Red</button>
                    <button className="curve-button">Green</button>
                    <button className="curve-button">Blue</button>
                    <button className="curve-button">Luma</button>
                  </div>
                </div>
                <p className="curve-hint">Click on the curve to add control points</p>
              </div>
            )}

            {/* Primary Corrections */}
            {activeTab === 'primary' && (
              <div className="primary-panel">
                <div className="control-group">
                  <h4 className="control-group__title">Temperature & Tint</h4>
                  <label className="control-label">
                    <span>Temperature</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.temperature}
                      onChange={(e) => updateAdjustment('temperature', Number(e.target.value))}
                      className="slider slider--temperature"
                    />
                    <span className="control-value">{adjustments.temperature}</span>
                  </label>
                  <label className="control-label">
                    <span>Tint</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.tint}
                      onChange={(e) => updateAdjustment('tint', Number(e.target.value))}
                      className="slider slider--tint"
                    />
                    <span className="control-value">{adjustments.tint}</span>
                  </label>
                </div>

                <div className="control-group">
                  <h4 className="control-group__title">Tone</h4>
                  <label className="control-label">
                    <span>Exposure</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.exposure}
                      onChange={(e) => updateAdjustment('exposure', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.exposure}</span>
                  </label>
                  <label className="control-label">
                    <span>Contrast</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.contrast}
                      onChange={(e) => updateAdjustment('contrast', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.contrast}</span>
                  </label>
                  <label className="control-label">
                    <span>Highlights</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.highlights}
                      onChange={(e) => updateAdjustment('highlights', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.highlights}</span>
                  </label>
                  <label className="control-label">
                    <span>Shadows</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.shadows}
                      onChange={(e) => updateAdjustment('shadows', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.shadows}</span>
                  </label>
                  <label className="control-label">
                    <span>Whites</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.whites}
                      onChange={(e) => updateAdjustment('whites', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.whites}</span>
                  </label>
                  <label className="control-label">
                    <span>Blacks</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.blacks}
                      onChange={(e) => updateAdjustment('blacks', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.blacks}</span>
                  </label>
                </div>

                <div className="control-group">
                  <h4 className="control-group__title">Color</h4>
                  <label className="control-label">
                    <span>Saturation</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.saturation}
                      onChange={(e) => updateAdjustment('saturation', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.saturation}</span>
                  </label>
                  <label className="control-label">
                    <span>Vibrance</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.vibrance}
                      onChange={(e) => updateAdjustment('vibrance', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{adjustments.vibrance}</span>
                  </label>
                </div>
              </div>
            )}

            {/* HSL */}
            {activeTab === 'hsl' && (
              <div className="hsl-panel">
                <div className="control-group">
                  <h4 className="control-group__title">Global HSL</h4>
                  <label className="control-label">
                    <span>Hue</span>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={hslAdjustments.hue}
                      onChange={(e) => updateHSL('hue', Number(e.target.value))}
                      className="slider slider--hue"
                    />
                    <span className="control-value">{hslAdjustments.hue}°</span>
                  </label>
                  <label className="control-label">
                    <span>Saturation</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={hslAdjustments.saturation}
                      onChange={(e) => updateHSL('saturation', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{hslAdjustments.saturation}</span>
                  </label>
                  <label className="control-label">
                    <span>Luminance</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={hslAdjustments.luminance}
                      onChange={(e) => updateHSL('luminance', Number(e.target.value))}
                      className="slider"
                    />
                    <span className="control-value">{hslAdjustments.luminance}</span>
                  </label>
                </div>

                <div className="hsl-color-bars">
                  <div className="hsl-bar hsl-bar--red">
                    <span className="hsl-bar__label">Red</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--orange">
                    <span className="hsl-bar__label">Orange</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--yellow">
                    <span className="hsl-bar__label">Yellow</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--green">
                    <span className="hsl-bar__label">Green</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--cyan">
                    <span className="hsl-bar__label">Cyan</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--blue">
                    <span className="hsl-bar__label">Blue</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--purple">
                    <span className="hsl-bar__label">Purple</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                  <div className="hsl-bar hsl-bar--magenta">
                    <span className="hsl-bar__label">Magenta</span>
                    <div className="hsl-bar__controls">
                      <input type="range" min="-100" max="100" defaultValue="0" className="slider slider--small" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
