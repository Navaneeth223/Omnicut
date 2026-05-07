/**
 * Media Grid View Component
 */

import { useState } from 'react';
import { useMediaPoolStore, useTimelineStore } from '@omnicut/store';
import type { MediaItem, Clip } from '@omnicut/core';
import { formatDuration, formatFileSize, generateId } from '@omnicut/core';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu/ContextMenu';
import './MediaGrid.css';

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    itemId: string;
  } | null>(null);

  const selectedItems = useMediaPoolStore((state) => state.selectedItems);
  const selectItems = useMediaPoolStore((state) => state.selectItems);
  const incrementUsageCount = useMediaPoolStore((state) => state.incrementUsageCount);
  const removeItems = useMediaPoolStore((state) => state.removeItems);

  const timeline = useTimelineStore((state) => state.timeline);
  const addClip = useTimelineStore((state) => state.addClip);

  const handleClick = (itemId: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // Multi-select
      if (selectedItems.includes(itemId)) {
        selectItems(selectedItems.filter((id) => id !== itemId));
      } else {
        selectItems([...selectedItems, itemId]);
      }
    } else if (e.shiftKey && selectedItems.length > 0) {
      // Range select
      const lastSelectedIndex = items.findIndex((item) => item.id === selectedItems[selectedItems.length - 1]);
      const clickedIndex = items.findIndex((item) => item.id === itemId);
      const start = Math.min(lastSelectedIndex, clickedIndex);
      const end = Math.max(lastSelectedIndex, clickedIndex);
      const rangeIds = items.slice(start, end + 1).map((item) => item.id);
      selectItems(rangeIds);
    } else {
      // Single select
      selectItems([itemId]);
    }
  };

  const handleDoubleClick = (item: MediaItem) => {
    if (!timeline || !item.duration) return;

    // Find appropriate track based on media type
    const targetTrack = timeline.tracks.find((track) => {
      if (item.type === 'video' && track.type === 'video') return true;
      if (item.type === 'audio' && track.type === 'audio') return true;
      if (item.type === 'image' && track.type === 'video') return true;
      return false;
    });

    if (!targetTrack) {
      console.warn('No suitable track found for media type:', item.type);
      return;
    }

    // Create new clip at playhead position
    const newClip: Clip = {
      id: generateId(),
      name: item.name,
      mediaItemId: item.id,
      mediaUrl: item.url,
      source: item.url,
      type: item.type === 'image' ? 'video' : item.type,
      trackId: targetTrack.id,
      startTime: timeline.playhead,
      duration: item.duration,
      trimStart: 0,
      trimEnd: item.duration,
      speed: 1,
      volume: 1,
      opacity: 1,
      effects: [],
      keyframes: [],
      metadata: {},
    };

    // Add clip to timeline
    addClip(targetTrack.id, newClip);

    // Increment usage count
    incrementUsageCount(item.id);

    console.log(`Added "${item.name}" to track "${targetTrack.name}" at ${timeline.playhead}s`);
  };

  const handleDragStart = (item: MediaItem, e: React.DragEvent) => {
    // Store media item data for drop
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'media-item',
      item: item,
    }));
  };

  const handleContextMenu = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Select item if not already selected
    if (!selectedItems.includes(itemId)) {
      selectItems([itemId]);
    }

    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      itemId,
    });
  };

  const getContextMenuItems = (itemId: string): ContextMenuItem[] => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return [];

    const selectedCount = selectedItems.length;

    return [
      {
        label: 'Add to Timeline',
        icon: '➕',
        shortcut: 'Double-click',
        onClick: () => handleDoubleClick(item),
      },
      { separator: true },
      {
        label: 'Reveal in Finder',
        icon: '📁',
        onClick: () => console.log('Reveal in Finder:', item.path),
      },
      {
        label: 'Copy',
        icon: '📋',
        shortcut: '⌘C',
        onClick: () => console.log('Copy:', selectedItems),
      },
      { separator: true },
      {
        label: 'Rename',
        icon: '✏️',
        onClick: () => console.log('Rename:', item.name),
      },
      {
        label: 'Set Rating',
        icon: '⭐',
        submenu: [],
      },
      { separator: true },
      {
        label: selectedCount > 1 ? `Delete ${selectedCount} Items` : 'Delete',
        icon: '🗑️',
        shortcut: 'Delete',
        onClick: () => removeItems(selectedItems),
      },
    ];
  };

  return (
    <div className="media-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className={`media-grid__item ${
            selectedItems.includes(item.id) ? 'media-grid__item--selected' : ''
          }`}
          draggable
          onClick={(e) => handleClick(item.id, e)}
          onDoubleClick={() => handleDoubleClick(item)}
          onContextMenu={(e) => handleContextMenu(item.id, e)}
          onDragStart={(e) => handleDragStart(item, e)}
        >
          {/* Thumbnail */}
          <div className="media-grid__thumbnail">
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.name} />
            ) : (
              <div className="media-grid__thumbnail-placeholder">
                {item.type === 'video' && '🎬'}
                {item.type === 'audio' && '🎵'}
                {item.type === 'image' && '🖼️'}
              </div>
            )}
            
            {/* Duration badge */}
            {item.duration && (
              <div className="media-grid__duration">
                {formatDuration(item.duration)}
              </div>
            )}

            {/* Type badge */}
            <div className="media-grid__type">{item.type}</div>
          </div>

          {/* Info */}
          <div className="media-grid__info">
            <div className="media-grid__name" title={item.name}>
              {item.name}
            </div>
            <div className="media-grid__meta">
              {item.width && item.height && (
                <span>{item.width}×{item.height}</span>
              )}
              {item.size && <span>{formatFileSize(item.size)}</span>}
            </div>
          </div>

          {/* Rating */}
          {item.rating > 0 && (
            <div className="media-grid__rating">
              {'⭐'.repeat(item.rating)}
            </div>
          )}
        </div>
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          items={getContextMenuItems(contextMenu.itemId)}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
