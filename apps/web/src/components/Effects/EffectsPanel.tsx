/**
 * Effects Panel Component
 * Displays available effects and allows applying them to clips
 */

import { useState } from 'react';
import { useTimelineStore } from '@omnicut/store';
import type { Effect, EffectType, EffectCategory } from '@omnicut/core';
import { generateId } from '@omnicut/core';
import './EffectsPanel.css';

interface EffectDefinition {
  type: EffectType;
  name: string;
  category: EffectCategory;
  icon: string;
  description: string;
}

// 10 Basic Effects
const BASIC_EFFECTS: EffectDefinition[] = [
  // Color Effects
  {
    type: 'brightness_contrast',
    name: 'Brightness & Contrast',
    category: 'color',
    icon: '☀️',
    description: 'Adjust brightness and contrast',
  },
  {
    type: 'hue_saturation',
    name: 'Hue & Saturation',
    category: 'color',
    icon: '🎨',
    description: 'Adjust hue, saturation, and lightness',
  },
  {
    type: 'exposure',
    name: 'Exposure',
    category: 'color',
    icon: '📸',
    description: 'Adjust exposure and gamma',
  },
  
  // Blur Effects
  {
    type: 'gaussian_blur',
    name: 'Gaussian Blur',
    category: 'blur',
    icon: '🌫️',
    description: 'Apply smooth blur effect',
  },
  {
    type: 'sharpen',
    name: 'Sharpen',
    category: 'blur',
    icon: '🔪',
    description: 'Enhance edge definition',
  },
  
  // Stylize Effects
  {
    type: 'vignette',
    name: 'Vignette',
    category: 'stylize',
    icon: '⭕',
    description: 'Darken edges of frame',
  },
  {
    type: 'glow',
    name: 'Glow',
    category: 'stylize',
    icon: '✨',
    description: 'Add soft glow to highlights',
  },
  {
    type: 'film_grain',
    name: 'Film Grain',
    category: 'stylize',
    icon: '🎞️',
    description: 'Add vintage film grain',
  },
  
  // Distortion Effects
  {
    type: 'transform',
    name: 'Transform',
    category: 'distortion',
    icon: '🔄',
    description: 'Scale, rotate, and position',
  },
  {
    type: 'crop',
    name: 'Crop',
    category: 'distortion',
    icon: '✂️',
    description: 'Crop and reframe',
  },
];

export function EffectsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EffectCategory | 'all'>('all');
  
  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const timeline = useTimelineStore((state) => state.timeline);
  const updateClip = useTimelineStore((state) => state.updateClip);

  // Get selected clip
  const selectedClip = timeline?.tracks
    .flatMap((t) => t.clips)
    .find((c) => selectedClips.includes(c.id));

  // Filter effects
  const filteredEffects = BASIC_EFFECTS.filter((effect) => {
    const matchesSearch = effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         effect.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || effect.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories: Array<{ id: EffectCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'color', label: 'Color' },
    { id: 'blur', label: 'Blur' },
    { id: 'stylize', label: 'Stylize' },
    { id: 'distortion', label: 'Distortion' },
  ];

  /**
   * Create effect with default parameters
   */
  const createEffect = (effectDef: EffectDefinition): Effect => {
    const baseEffect: Effect = {
      id: generateId(),
      type: effectDef.type,
      name: effectDef.name,
      enabled: true,
      category: effectDef.category,
      parameters: [],
      opacity: 1,
    };

    // Add default parameters based on effect type
    switch (effectDef.type) {
      case 'brightness_contrast':
        baseEffect.parameters = [
          {
            id: 'brightness',
            name: 'Brightness',
            type: 'slider',
            value: 0,
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
            value: 0,
            defaultValue: 0,
            min: -100,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;

      case 'hue_saturation':
        baseEffect.parameters = [
          {
            id: 'hue',
            name: 'Hue',
            type: 'angle',
            value: 0,
            defaultValue: 0,
            min: -180,
            max: 180,
            step: 1,
            animatable: true,
            unit: '°',
          },
          {
            id: 'saturation',
            name: 'Saturation',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: -100,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'lightness',
            name: 'Lightness',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: -100,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;

      case 'exposure':
        baseEffect.parameters = [
          {
            id: 'exposure',
            name: 'Exposure',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: -5,
            max: 5,
            step: 0.1,
            animatable: true,
            unit: 'EV',
          },
          {
            id: 'gamma',
            name: 'Gamma',
            type: 'slider',
            value: 1,
            defaultValue: 1,
            min: 0.1,
            max: 3,
            step: 0.1,
            animatable: true,
          },
        ];
        break;

      case 'gaussian_blur':
        baseEffect.parameters = [
          {
            id: 'radius',
            name: 'Blur Radius',
            type: 'slider',
            value: 5,
            defaultValue: 5,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: 'px',
          },
        ];
        break;

      case 'sharpen':
        baseEffect.parameters = [
          {
            id: 'amount',
            name: 'Amount',
            type: 'slider',
            value: 50,
            defaultValue: 50,
            min: 0,
            max: 200,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;

      case 'vignette':
        baseEffect.parameters = [
          {
            id: 'amount',
            name: 'Amount',
            type: 'slider',
            value: 50,
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'size',
            name: 'Size',
            type: 'slider',
            value: 50,
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;

      case 'glow':
        baseEffect.parameters = [
          {
            id: 'intensity',
            name: 'Intensity',
            type: 'slider',
            value: 50,
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'threshold',
            name: 'Threshold',
            type: 'slider',
            value: 50,
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;

      case 'film_grain':
        baseEffect.parameters = [
          {
            id: 'amount',
            name: 'Amount',
            type: 'slider',
            value: 25,
            defaultValue: 25,
            min: 0,
            max: 100,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'size',
            name: 'Grain Size',
            type: 'slider',
            value: 1,
            defaultValue: 1,
            min: 0.5,
            max: 3,
            step: 0.1,
            animatable: true,
          },
        ];
        break;

      case 'transform':
        baseEffect.parameters = [
          {
            id: 'scale',
            name: 'Scale',
            type: 'slider',
            value: 100,
            defaultValue: 100,
            min: 0,
            max: 500,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'rotation',
            name: 'Rotation',
            type: 'angle',
            value: 0,
            defaultValue: 0,
            min: -360,
            max: 360,
            step: 1,
            animatable: true,
            unit: '°',
          },
        ];
        break;

      case 'crop':
        baseEffect.parameters = [
          {
            id: 'left',
            name: 'Left',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: 0,
            max: 50,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'right',
            name: 'Right',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: 0,
            max: 50,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'top',
            name: 'Top',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: 0,
            max: 50,
            step: 1,
            animatable: true,
            unit: '%',
          },
          {
            id: 'bottom',
            name: 'Bottom',
            type: 'slider',
            value: 0,
            defaultValue: 0,
            min: 0,
            max: 50,
            step: 1,
            animatable: true,
            unit: '%',
          },
        ];
        break;
    }

    return baseEffect;
  };

  /**
   * Apply effect to selected clip
   */
  const applyEffect = (effectDef: EffectDefinition) => {
    if (!selectedClip) return;

    const effect = createEffect(effectDef);
    const updatedEffects = [...selectedClip.effects, effect];

    updateClip(selectedClip.id, { effects: updatedEffects });
    console.log(`Applied "${effect.name}" to clip "${selectedClip.name}"`);
  };

  /**
   * Remove effect from selected clip
   */
  const removeEffect = (effectId: string) => {
    if (!selectedClip) return;

    const updatedEffects = selectedClip.effects.filter((e) => e.id !== effectId);
    updateClip(selectedClip.id, { effects: updatedEffects });
  };

  /**
   * Toggle effect enabled state
   */
  const toggleEffect = (effectId: string) => {
    if (!selectedClip) return;

    const updatedEffects = selectedClip.effects.map((e) =>
      e.id === effectId ? { ...e, enabled: !e.enabled } : e
    );
    updateClip(selectedClip.id, { effects: updatedEffects });
  };

  return (
    <div className="effects-panel">
      <div className="effects-panel__header">
        <h2 className="effects-panel__title">Effects</h2>
      </div>

      {/* Search */}
      <div className="effects-panel__search">
        <input
          type="text"
          className="search-input"
          placeholder="Search effects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="effects-panel__categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-button ${
              selectedCategory === cat.id ? 'category-button--active' : ''
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Effects Browser */}
      <div className="effects-panel__browser">
        <h3 className="effects-panel__section-title">Available Effects</h3>
        <div className="effects-grid">
          {filteredEffects.map((effect) => (
            <button
              key={effect.type}
              className="effect-card"
              onClick={() => applyEffect(effect)}
              disabled={!selectedClip}
              title={effect.description}
            >
              <div className="effect-card__icon">{effect.icon}</div>
              <div className="effect-card__name">{effect.name}</div>
            </button>
          ))}
        </div>
        {filteredEffects.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__text">No effects found</p>
          </div>
        )}
      </div>

      {/* Applied Effects */}
      {selectedClip && (
        <div className="effects-panel__applied">
          <h3 className="effects-panel__section-title">
            Applied Effects ({selectedClip.effects.length})
          </h3>
          {selectedClip.effects.length > 0 ? (
            <div className="effects-list">
              {selectedClip.effects.map((effect) => (
                <div key={effect.id} className="effect-item">
                  <div className="effect-item__header">
                    <button
                      className={`icon-button ${
                        effect.enabled ? '' : 'icon-button--disabled'
                      }`}
                      onClick={() => toggleEffect(effect.id)}
                      title={effect.enabled ? 'Disable' : 'Enable'}
                    >
                      {effect.enabled ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <span className="effect-item__name">{effect.name}</span>
                    <button
                      className="icon-button"
                      onClick={() => removeEffect(effect.id)}
                      title="Remove effect"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Effect parameters would go here */}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">✨</div>
              <p className="empty-state__text">No effects applied</p>
              <p className="empty-state__hint">Click an effect above to apply</p>
            </div>
          )}
        </div>
      )}

      {/* No Selection State */}
      {!selectedClip && (
        <div className="effects-panel__no-selection">
          <div className="empty-state">
            <div className="empty-state__icon">🎬</div>
            <p className="empty-state__text">No clip selected</p>
            <p className="empty-state__hint">Select a clip to apply effects</p>
          </div>
        </div>
      )}
    </div>
  );
}
