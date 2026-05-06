/**
 * Timeline Clip Component
 */

import { useState, useCallback } from 'react';
import { useTimelineStore } from '@omnicut/store';
import type { Clip, MediaItem, Track } from '@omnicut/core';

interface TimelineClipProps {
  clip: Clip;
  mediaItem?: MediaItem;
  zoomLevel: number;
  trackType: Track['type'];
}

export function TimelineClip({ clip, mediaItem, zoomLevel, trackType }: TimelineClipProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, time: 0 });

  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const selectClips = useTimelineStore((state) => state.selectClips);
  const updateClip = useTimelineStore((state) => state.updateClip);

  const isSelected = selectedClips.includes(clip.id);

  const left = clip.startTime * zoomLevel;
  const width = clip.duration * zoomLevel;

  /**
   * Handle clip selection
   */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (e.metaKey || e.ctrlKey) {
        // Multi-select
        if (isSelected) {
          selectClips(selectedClips.filter((id) => id !== clip.id));
        } else {
          selectClips([...selectedClips, clip.id]);
        }
      } else {
        // Single select
        selectClips([clip.id]);
      }
    },
    [clip.id, isSelected, selectedClips, selectClips]
  );

  /**
   * Handle clip drag start
   */
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, time: clip.startTime });
    },
    [clip.startTime]
  );

  /**
   * Handle clip drag
   */
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaTime = deltaX / zoomLevel;
      const newStartTime = Math.max(0, dragStart.time + deltaTime);

      updateClip(clip.id, { startTime: newStartTime });
    },
    [isDragging, dragStart, zoomLevel, clip.id, updateClip]
  );

  /**
   * Handle clip drag end
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add drag listeners
  useCallback(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  return (
    <div
      className={`timeline-clip ${
        trackType === 'audio' ? 'timeline-clip--audio' : ''
      } ${isSelected ? 'timeline-clip--selected' : ''}`}
      style={{
        left,
        width,
      }}
      onClick={handleClick}
      onMouseDown={handleDragStart}
    >
      {/* Thumbnail (for video clips) */}
      {trackType === 'video' && mediaItem?.thumbnail && (
        <img
          src={mediaItem.thumbnail}
          alt={clip.name}
          className="timeline-clip__thumbnail"
        />
      )}

      {/* Waveform (for audio clips) */}
      {trackType === 'audio' && mediaItem?.waveform && (
        <canvas className="timeline-clip__waveform" />
      )}

      {/* Content */}
      <div className="timeline-clip__content">
        <div className="timeline-clip__name">{clip.name}</div>
      </div>

      {/* Resize handles */}
      <div className="timeline-clip__resize-handle timeline-clip__resize-handle--left" />
      <div className="timeline-clip__resize-handle timeline-clip__resize-handle--right" />
    </div>
  );
}
