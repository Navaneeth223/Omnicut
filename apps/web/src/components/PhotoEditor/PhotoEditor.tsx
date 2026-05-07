/**
 * Photo Editor Workspace
 * Professional image editing and enhancement tools
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import './PhotoEditor.css';

interface PhotoAdjustment {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
  sharpness: number;
  vibrance: number;
}

interface PhotoFilter {
  id: string;
  name: string;
  icon: string;
  intensity: number;
}

const DEFAULT_ADJUSTMENTS: PhotoAdjustment = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  vibrance: 0,
};

const PHOTO_FILTERS = [
  { id: 'none', name: 'None', icon: '⊘', description: 'No filter' },
  { id: 'vivid', name: 'Vivid', icon: '🌈', description: 'Boost colors' },
  { id: 'dramatic', name: 'Dramatic', icon: '🎭', description: 'High contrast' },
  { id: 'mono', name: 'Mono', icon: '⚫', description: 'Black & white' },
  { id: 'vintage', name: 'Vintage', icon: '📷', description: 'Retro look' },
  { id: 'warm', name: 'Warm', icon: '🔥', description: 'Warm tones' },
  { id: 'cool', name: 'Cool', icon: '❄️', description: 'Cool tones' },
  { id: 'sepia', name: 'Sepia', icon: '🟤', description: 'Sepia tone' },
  { id: 'fade', name: 'Fade', icon: '🌫️', description: 'Faded look' },
  { id: 'sharpen', name: 'Sharpen', icon: '🔪', description: 'Enhanced detail' },
];

const CROP_PRESETS = [
  { id: 'free', name: 'Free', ratio: null, icon: '⊡' },
  { id: '1:1', name: 'Square', ratio: 1, icon: '⬜' },
  { id: '4:3', name: '4:3', ratio: 4 / 3, icon: '▭' },
  { id: '16:9', name: '16:9', ratio: 16 / 9, icon: '▬' },
  { id: '3:2', name: '3:2', ratio: 3 / 2, icon: '▭' },
  { id: '9:16', name: '9:16', ratio: 9 / 16, icon: '▯' },
];

export function PhotoEditor() {
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'crop' | 'transform'>('adjust');
  const [adjustments, setAdjustments] = useState<PhotoAdjustment>(DEFAULT_ADJUSTMENTS);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [cropPreset, setCropPreset] = useState<string>('free');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [showHistogram, setShowHistogram] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Update adjustment value
   */
  const updateAdjustment = useCallback((key: keyof PhotoAdjustment, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Reset all adjustments
   */
  const resetAdjustments = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setSelectedFilter('none');
    setFilterIntensity(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);

  /**
   * Apply filter
   */
  const applyFilter = useCallback((filterId: string) => {
    setSelectedFilter(filterId);
  }, []);

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        setHasImage(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  /**
   * Trigger file input
   */
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Export image
   */
  const exportImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited-photo-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  /**
   * Draw image on canvas with adjustments
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Apply adjustments using filters
      const filters: string[] = [];
      
      if (adjustments.brightness !== 0) {
        filters.push(`brightness(${100 + adjustments.brightness}%)`);
      }
      if (adjustments.contrast !== 0) {
        filters.push(`contrast(${100 + adjustments.contrast}%)`);
      }
      if (adjustments.saturation !== 0) {
        filters.push(`saturate(${100 + adjustments.saturation}%)`);
      }
      
      ctx.filter = filters.join(' ') || 'none';
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, adjustments, rotation, flipH, flipV]);

  return (
    <div className="photo-editor">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <div className="photo-editor__header">
        <div className="photo-editor__title-section">
          <h2 className="photo-editor__title">📸 Photo Editor</h2>
          <p className="photo-editor__subtitle">Professional image editing and enhancement</p>
        </div>
        <div className="photo-editor__actions">
          <button className="button button--secondary" onClick={openFileDialog}>
            📁 Open Image
          </button>
          <button className="button button--secondary" onClick={resetAdjustments}>
            ↺ Reset
          </button>
          <button
            className="button button--primary"
            onClick={exportImage}
            disabled={!hasImage}
          >
            💾 Export
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="photo-editor__layout">
        {/* Left Panel - Tools */}
        <div className="photo-editor__tools">
          {/* Tabs */}
          <div className="tool-tabs">
            <button
              className={`tool-tab ${activeTab === 'adjust' ? 'tool-tab--active' : ''}`}
              onClick={() => setActiveTab('adjust')}
            >
              <span className="tool-tab__icon">🎨</span>
              <span className="tool-tab__label">Adjust</span>
            </button>
            <button
              className={`tool-tab ${activeTab === 'filters' ? 'tool-tab--active' : ''}`}
              onClick={() => setActiveTab('filters')}
            >
              <span className="tool-tab__icon">✨</span>
              <span className="tool-tab__label">Filters</span>
            </button>
            <button
              className={`tool-tab ${activeTab === 'crop' ? 'tool-tab--active' : ''}`}
              onClick={() => setActiveTab('crop')}
            >
              <span className="tool-tab__icon">✂️</span>
              <span className="tool-tab__label">Crop</span>
            </button>
            <button
              className={`tool-tab ${activeTab === 'transform' ? 'tool-tab--active' : ''}`}
              onClick={() => setActiveTab('transform')}
            >
              <span className="tool-tab__icon">🔄</span>
              <span className="tool-tab__label">Transform</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tool-content">
            {/* Adjust Tab */}
            {activeTab === 'adjust' && (
              <div className="adjust-panel">
                <h3 className="panel-title">Adjustments</h3>
                
                {/* Light Adjustments */}
                <div className="adjustment-group">
                  <h4 className="group-title">Light</h4>
                  
                  <label className="adjustment-control">
                    <span className="adjustment-label">Brightness</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.brightness}
                      onChange={(e) => updateAdjustment('brightness', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.brightness}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Contrast</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.contrast}
                      onChange={(e) => updateAdjustment('contrast', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.contrast}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Exposure</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.exposure}
                      onChange={(e) => updateAdjustment('exposure', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.exposure}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Highlights</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.highlights}
                      onChange={(e) => updateAdjustment('highlights', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.highlights}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Shadows</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.shadows}
                      onChange={(e) => updateAdjustment('shadows', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.shadows}</span>
                  </label>
                </div>

                {/* Color Adjustments */}
                <div className="adjustment-group">
                  <h4 className="group-title">Color</h4>
                  
                  <label className="adjustment-control">
                    <span className="adjustment-label">Temperature</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.temperature}
                      onChange={(e) => updateAdjustment('temperature', Number(e.target.value))}
                      className="adjustment-slider adjustment-slider--temperature"
                    />
                    <span className="adjustment-value">{adjustments.temperature}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Tint</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.tint}
                      onChange={(e) => updateAdjustment('tint', Number(e.target.value))}
                      className="adjustment-slider adjustment-slider--tint"
                    />
                    <span className="adjustment-value">{adjustments.tint}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Saturation</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.saturation}
                      onChange={(e) => updateAdjustment('saturation', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.saturation}</span>
                  </label>

                  <label className="adjustment-control">
                    <span className="adjustment-label">Vibrance</span>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={adjustments.vibrance}
                      onChange={(e) => updateAdjustment('vibrance', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.vibrance}</span>
                  </label>
                </div>

                {/* Detail Adjustments */}
                <div className="adjustment-group">
                  <h4 className="group-title">Detail</h4>
                  
                  <label className="adjustment-control">
                    <span className="adjustment-label">Sharpness</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={adjustments.sharpness}
                      onChange={(e) => updateAdjustment('sharpness', Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{adjustments.sharpness}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="filters-panel">
                <h3 className="panel-title">Filters</h3>
                
                <div className="filters-grid">
                  {PHOTO_FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      className={`filter-card ${selectedFilter === filter.id ? 'filter-card--active' : ''}`}
                      onClick={() => applyFilter(filter.id)}
                    >
                      <div className="filter-card__icon">{filter.icon}</div>
                      <div className="filter-card__name">{filter.name}</div>
                      <div className="filter-card__description">{filter.description}</div>
                    </button>
                  ))}
                </div>

                {selectedFilter !== 'none' && (
                  <div className="filter-intensity">
                    <label className="adjustment-control">
                      <span className="adjustment-label">Intensity</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterIntensity}
                        onChange={(e) => setFilterIntensity(Number(e.target.value))}
                        className="adjustment-slider"
                      />
                      <span className="adjustment-value">{filterIntensity}%</span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Crop Tab */}
            {activeTab === 'crop' && (
              <div className="crop-panel">
                <h3 className="panel-title">Crop</h3>
                
                <div className="crop-presets">
                  {CROP_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      className={`crop-preset ${cropPreset === preset.id ? 'crop-preset--active' : ''}`}
                      onClick={() => setCropPreset(preset.id)}
                    >
                      <span className="crop-preset__icon">{preset.icon}</span>
                      <span className="crop-preset__name">{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="crop-info">
                  <p>Select a crop ratio and drag on the image to crop.</p>
                </div>
              </div>
            )}

            {/* Transform Tab */}
            {activeTab === 'transform' && (
              <div className="transform-panel">
                <h3 className="panel-title">Transform</h3>
                
                <div className="transform-group">
                  <h4 className="group-title">Rotate</h4>
                  
                  <label className="adjustment-control">
                    <span className="adjustment-label">Angle</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="adjustment-slider"
                    />
                    <span className="adjustment-value">{rotation}°</span>
                  </label>

                  <div className="transform-buttons">
                    <button
                      className="button button--secondary button--small"
                      onClick={() => setRotation((rotation - 90 + 360) % 360)}
                    >
                      ↶ 90° Left
                    </button>
                    <button
                      className="button button--secondary button--small"
                      onClick={() => setRotation((rotation + 90) % 360)}
                    >
                      ↷ 90° Right
                    </button>
                  </div>
                </div>

                <div className="transform-group">
                  <h4 className="group-title">Flip</h4>
                  
                  <div className="transform-buttons">
                    <button
                      className={`button button--secondary button--small ${flipH ? 'button--active' : ''}`}
                      onClick={() => setFlipH(!flipH)}
                    >
                      ⇄ Horizontal
                    </button>
                    <button
                      className={`button button--secondary button--small ${flipV ? 'button--active' : ''}`}
                      onClick={() => setFlipV(!flipV)}
                    >
                      ⇅ Vertical
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="photo-editor__canvas-section">
          {!hasImage ? (
            <div className="empty-state">
              <div className="empty-state__icon">📸</div>
              <h3 className="empty-state__title">No Image Loaded</h3>
              <p className="empty-state__text">
                Open an image to start editing
              </p>
              <button className="button button--primary" onClick={openFileDialog}>
                📁 Open Image
              </button>
            </div>
          ) : (
            <div className="canvas-container">
              <canvas ref={canvasRef} className="photo-canvas" />
            </div>
          )}
        </div>

        {/* Right Panel - Info & Histogram */}
        <div className="photo-editor__info">
          <div className="info-section">
            <div className="info-header">
              <h3 className="info-title">Image Info</h3>
              <button
                className="icon-button"
                onClick={() => setShowHistogram(!showHistogram)}
                title={showHistogram ? 'Hide Histogram' : 'Show Histogram'}
              >
                {showHistogram ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {hasImage ? (
              <>
                <div className="info-details">
                  <div className="info-item">
                    <span className="info-label">Format:</span>
                    <span className="info-value">PNG</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Dimensions:</span>
                    <span className="info-value">1920 × 1080</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Size:</span>
                    <span className="info-value">2.4 MB</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Color Space:</span>
                    <span className="info-value">sRGB</span>
                  </div>
                </div>

                {showHistogram && (
                  <div className="histogram-section">
                    <h4 className="histogram-title">Histogram</h4>
                    <div className="histogram-container">
                      <svg viewBox="0 0 256 100" className="histogram-svg">
                        <defs>
                          <linearGradient id="histogramGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="var(--accent-1)" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                        {/* Placeholder histogram bars */}
                        {Array.from({ length: 256 }).map((_, i) => {
                          const height = Math.random() * 80 + 20;
                          return (
                            <rect
                              key={i}
                              x={i}
                              y={100 - height}
                              width="1"
                              height={height}
                              fill="url(#histogramGradient)"
                            />
                          );
                        })}
                      </svg>
                    </div>
                    <div className="histogram-legend">
                      <span className="histogram-legend__item">
                        <span className="histogram-legend__color" style={{ background: '#ef4444' }} />
                        Red
                      </span>
                      <span className="histogram-legend__item">
                        <span className="histogram-legend__color" style={{ background: '#10b981' }} />
                        Green
                      </span>
                      <span className="histogram-legend__item">
                        <span className="histogram-legend__color" style={{ background: '#3b82f6' }} />
                        Blue
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="info-empty">
                <p>No image loaded</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4 className="quick-actions__title">Quick Actions</h4>
            <button className="quick-action-button" onClick={() => applyFilter('vivid')}>
              🌈 Enhance Colors
            </button>
            <button className="quick-action-button" onClick={() => applyFilter('sharpen')}>
              🔪 Sharpen
            </button>
            <button className="quick-action-button" onClick={() => applyFilter('mono')}>
              ⚫ Black & White
            </button>
            <button className="quick-action-button" onClick={() => applyFilter('vintage')}>
              📷 Vintage Look
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
