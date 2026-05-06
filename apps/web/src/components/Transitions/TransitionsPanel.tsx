/**
 * Transitions Panel Component
 * Displays available transitions and allows applying them between clips
 */

import { useState } from 'react';
import { useTimelineStore } from '@omnicut/store';
import './TransitionsPanel.css';

interface TransitionDefinition {
  type: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

// Transition definitions
const TRANSITIONS: TransitionDefinition[] = [
  // Dissolve
  {
    type: 'cross_dissolve',
    name: 'Cross Dissolve',
    category: 'dissolve',
    icon: '⚡',
    description: 'Smooth fade between clips',
  },
  {
    type: 'fade',
    name: 'Fade',
    category: 'dissolve',
    icon: '🌫️',
    description: 'Simple fade transition',
  },
  {
    type: 'dip_to_black',
    name: 'Dip to Black',
    category: 'dissolve',
    icon: '⬛',
    description: 'Fade through black',
  },
  {
    type: 'dip_to_white',
    name: 'Dip to White',
    category: 'dissolve',
    icon: '⬜',
    description: 'Fade through white',
  },
  
  // Wipe
  {
    type: 'wipe_left',
    name: 'Wipe Left',
    category: 'wipe',
    icon: '⬅️',
    description: 'Wipe from right to left',
  },
  {
    type: 'wipe_right',
    name: 'Wipe Right',
    category: 'wipe',
    icon: '➡️',
    description: 'Wipe from left to right',
  },
  {
    type: 'wipe_up',
    name: 'Wipe Up',
    category: 'wipe',
    icon: '⬆️',
    description: 'Wipe from bottom to top',
  },
  {
    type: 'wipe_down',
    name: 'Wipe Down',
    category: 'wipe',
    icon: '⬇️',
    description: 'Wipe from top to bottom',
  },
  
  // Push
  {
    type: 'push_left',
    name: 'Push Left',
    category: 'push',
    icon: '◀️',
    description: 'Push clip to the left',
  },
  {
    type: 'push_right',
    name: 'Push Right',
    category: 'push',
    icon: '▶️',
    description: 'Push clip to the right',
  },
  
  // Zoom
  {
    type: 'zoom_in',
    name: 'Zoom In',
    category: 'zoom',
    icon: '🔍',
    description: 'Zoom into next clip',
  },
  {
    type: 'zoom_out',
    name: 'Zoom Out',
    category: 'zoom',
    icon: '🔎',
    description: 'Zoom out to next clip',
  },
];

export function TransitionsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [duration, setDuration] = useState(1);

  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const timeline = useTimelineStore((state) => state.timeline);
  const addTransition = useTimelineStore((state) => state.addTransition);
  const transitions = useTimelineStore((state) => state.transitions);
  const removeTransition = useTimelineStore((state) => state.removeTransition);

  // Filter transitions
  const filteredTransitions = TRANSITIONS.filter((transition) => {
    const matchesSearch = transition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transition.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transition.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'dissolve', label: 'Dissolve' },
    { id: 'wipe', label: 'Wipe' },
    { id: 'push', label: 'Push' },
    { id: 'zoom', label: 'Zoom' },
  ];

  /**
   * Apply transition between selected clips
   */
  const applyTransition = (transitionDef: TransitionDefinition) => {
    if (selectedClips.length !== 2) {
      alert('Please select exactly 2 adjacent clips to add a transition');
      return;
    }

    // Get the two selected clips
    const clips = timeline?.tracks
      .flatMap((t) => t.clips)
      .filter((c) => selectedClips.includes(c.id))
      .sort((a, b) => a.startTime - b.startTime);

    if (!clips || clips.length !== 2) return;

    const [clip1, clip2] = clips;

    // Check if clips are adjacent
    const gap = clip2.startTime - (clip1.startTime + clip1.duration);
    if (Math.abs(gap) > 0.1) {
      alert('Clips must be adjacent to add a transition');
      return;
    }

    addTransition(clip1.id, clip2.id, transitionDef.type, duration);
    console.log(`Applied "${transitionDef.name}" transition (${duration}s)`);
  };

  return (
    <div className="transitions-panel">
      <div className="transitions-panel__header">
        <h2 className="transitions-panel__title">Transitions</h2>
      </div>

      {/* Search */}
      <div className="transitions-panel__search">
        <input
          type="text"
          className="search-input"
          placeholder="Search transitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="transitions-panel__categories">
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

      {/* Duration Control */}
      <div className="transitions-panel__duration">
        <label className="duration-label">
          <span>Duration:</span>
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="duration-input"
          />
          <span>seconds</span>
        </label>
      </div>

      {/* Transitions Browser */}
      <div className="transitions-panel__browser">
        <h3 className="transitions-panel__section-title">Available Transitions</h3>
        <div className="transitions-grid">
          {filteredTransitions.map((transition) => (
            <button
              key={transition.type}
              className="transition-card"
              onClick={() => applyTransition(transition)}
              disabled={selectedClips.length !== 2}
              title={transition.description}
            >
              <div className="transition-card__icon">{transition.icon}</div>
              <div className="transition-card__name">{transition.name}</div>
            </button>
          ))}
        </div>
        {filteredTransitions.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__text">No transitions found</p>
          </div>
        )}
      </div>

      {/* Applied Transitions */}
      <div className="transitions-panel__applied">
        <h3 className="transitions-panel__section-title">
          Applied Transitions ({transitions.length})
        </h3>
        {transitions.length > 0 ? (
          <div className="transitions-list">
            {transitions.map((transition) => (
              <div key={transition.id} className="transition-item">
                <div className="transition-item__header">
                  <span className="transition-item__name">{transition.name}</span>
                  <span className="transition-item__duration">{transition.duration}s</span>
                  <button
                    className="icon-button"
                    onClick={() => removeTransition(transition.id)}
                    title="Remove transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">✨</div>
            <p className="empty-state__text">No transitions applied</p>
            <p className="empty-state__hint">Select 2 adjacent clips and click a transition</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      {selectedClips.length !== 2 && (
        <div className="transitions-panel__instructions">
          <div className="empty-state">
            <div className="empty-state__icon">ℹ️</div>
            <p className="empty-state__text">Select 2 adjacent clips</p>
            <p className="empty-state__hint">
              {selectedClips.length === 0
                ? 'No clips selected'
                : selectedClips.length === 1
                ? '1 clip selected - select 1 more'
                : `${selectedClips.length} clips selected - select only 2`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
