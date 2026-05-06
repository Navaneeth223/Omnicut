/**
 * Timeline Transition Component
 * Displays transitions between clips
 */

import { useState, useCallback } from 'react';
import type { Transition } from '@omnicut/core';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu/ContextMenu';
import './TimelineTransition.css';

interface TimelineTransitionProps {
  transition: Transition;
  zoomLevel: number;
  onRemove: (transitionId: string) => void;
  onUpdate: (transitionId: string, updates: Partial<Transition>) => void;
}

export function TimelineTransition({
  transition,
  zoomLevel,
  onRemove,
  onUpdate,
}: TimelineTransitionProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const width = transition.duration * zoomLevel;

  /**
   * Get transition icon
   */
  const getTransitionIcon = (): string => {
    switch (transition.type) {
      case 'cross_dissolve':
        return '⚡';
      case 'dip_to_black':
        return '⬛';
      case 'dip_to_white':
        return '⬜';
      case 'wipe_left':
        return '⬅️';
      case 'wipe_right':
        return '➡️';
      case 'wipe_up':
        return '⬆️';
      case 'wipe_down':
        return '⬇️';
      case 'push_left':
        return '◀️';
      case 'push_right':
        return '▶️';
      case 'zoom_in':
        return '🔍';
      case 'zoom_out':
        return '🔎';
      case 'fade':
        return '🌫️';
      default:
        return '✨';
    }
  };

  /**
   * Handle context menu
   */
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    []
  );

  /**
   * Get context menu items
   */
  const getContextMenuItems = (): ContextMenuItem[] => {
    return [
      {
        label: 'Change Duration',
        icon: '⏱️',
        onClick: () => {
          const newDuration = prompt('Enter duration (seconds):', transition.duration.toString());
          if (newDuration) {
            const duration = parseFloat(newDuration);
            if (!isNaN(duration) && duration > 0) {
              onUpdate(transition.id, { duration });
            }
          }
        },
      },
      {
        label: 'Change Type',
        icon: '🔄',
        onClick: () => console.log('Change transition type'),
      },
      { separator: true },
      {
        label: 'Delete Transition',
        icon: '🗑️',
        onClick: () => onRemove(transition.id),
      },
    ];
  };

  return (
    <>
      <div
        className="timeline-transition"
        style={{ width }}
        onContextMenu={handleContextMenu}
        title={`${transition.name} (${transition.duration}s)`}
      >
        <div className="timeline-transition__icon">{getTransitionIcon()}</div>
        <div className="timeline-transition__name">{transition.name}</div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={getContextMenuItems()}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
