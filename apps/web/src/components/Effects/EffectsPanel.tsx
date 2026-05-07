/**
 * Effects Panel Component
 * Displays available effects and allows applying them to clips
 */

import { useState } from 'react';
import { useTimelineStore } from '@omnicut/store';
import type { Effect, EffectParameter, EffectCategory } from '@omnicut/core';
import { generateId } from '@omnicut/core';
import {
  createAddEffectCommand,
  createRemoveEffectCommand,
  createUpdateEffectParameterCommand,
} from '../../utils/commands';
import { 
  ALL_EFFECTS, 
  getImplementedEffects,
  type EffectDefinition 
} from './effectDefinitions';
import './EffectsPanel.css';

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

  // Filter effects - show only implemented ones
  const implementedEffects = getImplementedEffects();
  const filteredEffects = implementedEffects.filter((effect) => {
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
    { id: 'time', label: 'Time' },
    { id: 'keying', label: 'Keying' },
    { id: 'noise', label: 'Noise' },
    { id: 'generate', label: 'Generate' },
  ];

  /**
   * Create effect with default parameters from definition
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

    // Convert effect definition parameters to Effect parameters
    if (effectDef.parameters) {
      baseEffect.parameters = effectDef.parameters.map((paramDef) => {
        const param: EffectParameter = {
          id: paramDef.name,
          name: paramDef.label,
          type: paramDef.type as any,
          value: paramDef.default,
          defaultValue: paramDef.default,
          min: paramDef.min,
          max: paramDef.max,
          step: paramDef.step,
          animatable: true,
        };
        return param;
      });
    }

    return baseEffect;
  };

  /**
   * Apply effect to selected clip
   */
  const applyEffect = (effectDef: EffectDefinition) => {
    if (!selectedClip) return;

    const effect = createEffect(effectDef);
    createAddEffectCommand(selectedClip.id, effect);
    console.log(`Applied "${effect.name}" to clip "${selectedClip.name}"`);
  };

  /**
   * Remove effect from selected clip
   */
  const removeEffect = (effectId: string) => {
    if (!selectedClip) return;

    createRemoveEffectCommand(selectedClip.id, effectId);
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

  /**
   * Update effect parameter
   */
  const updateEffectParameter = (effectId: string, parameterId: string, value: any) => {
    if (!selectedClip) return;

    // Get old value for undo
    const effect = selectedClip.effects.find((e) => e.id === effectId);
    if (!effect) return;
    
    const param = effect.parameters.find((p) => p.id === parameterId);
    if (!param) return;
    
    const oldValue = param.value;

    // Only create command if value actually changed
    if (oldValue !== value) {
      createUpdateEffectParameterCommand(selectedClip.id, effectId, parameterId, value, oldValue);
    }
  };

  /**
   * Reset effect parameter to default
   */
  const resetEffectParameter = (effectId: string, parameterId: string) => {
    if (!selectedClip) return;

    const updatedEffects = selectedClip.effects.map((effect) => {
      if (effect.id === effectId) {
        return {
          ...effect,
          parameters: effect.parameters.map((param) =>
            param.id === parameterId ? { ...param, value: param.defaultValue } : param
          ),
        };
      }
      return effect;
    });

    updateClip(selectedClip.id, { effects: updatedEffects });
  };

  /**
   * Render parameter control based on type
   */
  const renderParameterControl = (effect: Effect, param: EffectParameter) => {
    switch (param.type) {
      case 'slider':
      case 'number':
        return (
          <div className="parameter-control">
            <div className="parameter-header">
              <label className="parameter-label">{param.name}</label>
              <div className="parameter-value">
                {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                {param.unit}
              </div>
              <button
                className="parameter-reset"
                onClick={() => resetEffectParameter(effect.id, param.id)}
                title="Reset to default"
              >
                ↺
              </button>
            </div>
            <input
              type="range"
              className="parameter-slider"
              min={param.min}
              max={param.max}
              step={param.step}
              value={param.value as number}
              onChange={(e) =>
                updateEffectParameter(effect.id, param.id, parseFloat(e.target.value))
              }
            />
          </div>
        );

      case 'angle':
        return (
          <div className="parameter-control">
            <div className="parameter-header">
              <label className="parameter-label">{param.name}</label>
              <div className="parameter-value">
                {typeof param.value === 'number' ? param.value.toFixed(0) : param.value}°
              </div>
              <button
                className="parameter-reset"
                onClick={() => resetEffectParameter(effect.id, param.id)}
                title="Reset to default"
              >
                ↺
              </button>
            </div>
            <input
              type="range"
              className="parameter-slider"
              min={param.min}
              max={param.max}
              step={param.step}
              value={param.value as number}
              onChange={(e) =>
                updateEffectParameter(effect.id, param.id, parseFloat(e.target.value))
              }
            />
          </div>
        );

      case 'color':
        return (
          <div className="parameter-control">
            <div className="parameter-header">
              <label className="parameter-label">{param.name}</label>
              <button
                className="parameter-reset"
                onClick={() => resetEffectParameter(effect.id, param.id)}
                title="Reset to default"
              >
                ↺
              </button>
            </div>
            <input
              type="color"
              className="parameter-color"
              value={param.value as string}
              onChange={(e) => updateEffectParameter(effect.id, param.id, e.target.value)}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="parameter-control">
            <label className="parameter-checkbox">
              <input
                type="checkbox"
                checked={param.value as boolean}
                onChange={(e) =>
                  updateEffectParameter(effect.id, param.id, e.target.checked)
                }
              />
              <span>{param.name}</span>
            </label>
          </div>
        );

      case 'choice':
        return (
          <div className="parameter-control">
            <div className="parameter-header">
              <label className="parameter-label">{param.name}</label>
              <button
                className="parameter-reset"
                onClick={() => resetEffectParameter(effect.id, param.id)}
                title="Reset to default"
              >
                ↺
              </button>
            </div>
            <select
              className="parameter-select"
              value={param.value as string | number}
              onChange={(e) => updateEffectParameter(effect.id, param.id, e.target.value)}
            >
              {param.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
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
        <h3 className="effects-panel__section-title">
          Available Effects ({filteredEffects.length} working)
        </h3>
        <div className="effects-grid">
          {filteredEffects.map((effect) => (
            <button
              key={effect.type}
              className="effect-card"
              onClick={() => applyEffect(effect)}
              disabled={!selectedClip}
              title={`${effect.description}\n\n${effect.implemented ? '✅ Working with GPU acceleration' : '⏳ Coming soon'}`}
            >
              <div className="effect-card__icon">{effect.icon}</div>
              <div className="effect-card__name">{effect.name}</div>
              {effect.implemented && (
                <div className="effect-card__badge">✨ GPU</div>
              )}
            </button>
          ))}
        </div>
        {filteredEffects.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__text">No effects found</p>
            <p className="empty-state__hint">Try a different search or category</p>
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
                  {/* Effect Parameters */}
                  {effect.enabled && effect.parameters.length > 0 && (
                    <div className="effect-parameters">
                      {effect.parameters.map((param) => (
                        <div key={param.id}>{renderParameterControl(effect, param)}</div>
                      ))}
                    </div>
                  )}
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
