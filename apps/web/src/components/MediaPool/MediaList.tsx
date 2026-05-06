/**
 * Media List View Component
 */

import { useMediaPoolStore } from '@omnicut/store';
import type { MediaItem } from '@omnicut/core';
import { formatDuration, formatFileSize } from '@omnicut/core';
import './MediaList.css';

interface MediaListProps {
  items: MediaItem[];
}

export function MediaList({ items }: MediaListProps) {
  const selectedItems = useMediaPoolStore((state) => state.selectedItems);
  const selectItems = useMediaPoolStore((state) => state.selectItems);

  const handleClick = (itemId: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (selectedItems.includes(itemId)) {
        selectItems(selectedItems.filter((id) => id !== itemId));
      } else {
        selectItems([...selectedItems, itemId]);
      }
    } else {
      selectItems([itemId]);
    }
  };

  return (
    <div className="media-list">
      <table className="media-list__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Duration</th>
            <th>Resolution</th>
            <th>Size</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`media-list__row ${
                selectedItems.includes(item.id) ? 'media-list__row--selected' : ''
              }`}
              onClick={(e) => handleClick(item.id, e)}
            >
              <td className="media-list__name">
                <div className="media-list__name-cell">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="media-list__thumbnail"
                    />
                  )}
                  <span>{item.name}</span>
                </div>
              </td>
              <td>{item.type}</td>
              <td>{item.duration ? formatDuration(item.duration) : '-'}</td>
              <td>
                {item.width && item.height ? `${item.width}×${item.height}` : '-'}
              </td>
              <td>{formatFileSize(item.size)}</td>
              <td>
                {item.rating > 0 ? '⭐'.repeat(item.rating) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
