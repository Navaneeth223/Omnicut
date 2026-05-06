/**
 * Media Grid View Component
 */

import { useMediaPoolStore } from '@omnicut/store';
import type { MediaItem } from '@omnicut/core';
import { formatDuration, formatFileSize } from '@omnicut/core';
import './MediaGrid.css';

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const selectedItems = useMediaPoolStore((state) => state.selectedItems);
  const selectItems = useMediaPoolStore((state) => state.selectItems);

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
    // TODO: Add to timeline
    console.log('Add to timeline:', item.name);
  };

  return (
    <div className="media-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className={`media-grid__item ${
            selectedItems.includes(item.id) ? 'media-grid__item--selected' : ''
          }`}
          onClick={(e) => handleClick(item.id, e)}
          onDoubleClick={() => handleDoubleClick(item)}
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
    </div>
  );
}
