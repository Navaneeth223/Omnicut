/**
 * Timeline Clip Component
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTimelineStore } from '@omnicut/store';
import type { Clip, MediaItem, Track } from '@omnicut/core';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu/ContextMenu';

interface TimelineClipProps {
  clip: Clip;
  mediaItem?: MediaItem;
  zoomLevel: number;
  trackType: Track['type'];
  trackId: string;
}

type DragMode = 'move' | 'trim-left' | 'trim-right' | null;

export function TimelineClip({ clip, mediaItem, zoomLevel, trackType, trackId }: TimelineClipProps) {
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState({ x: 0, time: 0, duration: 0, trimStart: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [wouldOverlap, setWouldOverlap] = useState(false);
  const clipRef = useRef<HTMLDivElement>(null);

  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const selectClips = useTimelineStore((state) => state.selectClips);
  const updateClip = useTimelineStore((state) => state.updateClip);
  const removeClip = useTimelineStore((state) => state.removeClip);
  const duplicateClip = useTimelineStore((state) => state.duplicateClip);
  const findNearestSnapPoint = useTimelineStore((state) => state.findNearestSnapPoint);
  const timeline = useTimelineStore((state) => state.timeline);
  const checkClipOverlap = useTimelineStore((state) => state.checkClipOverlap);
  const rippleMode = useTimelineStore((state) => state.rippleMode);
  const rippleEdit = useTimelineStore((state) => state.rippleEdit);
  const rippleDelete = useTimelineStore((state) => state.rippleDelete);
  const splitClip = useTimelineStore((state) => state.splitClip);
  const playhead = useTimelineStore((state) => state.timeline?.playhead ?? 0);

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
   * Handle context menu
   */
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Select clip if not already selected
      if (!isSelected) {
        selectClips([clip.id]);
      }

      setContextMenu({ x: e.clientX, y: e.clientY });
    },
    [clip.id, isSelected, selectClips]
  );

  /**
   * Get context menu items
   */
  const getContextMenuItems = (): ContextMenuItem[] => {
    const selectedCount = selectedClips.length;
    const clipEnd = clip.startTime + clip.duration;
    const canSplit = playhead > clip.startTime && playhead < clipEnd;

    return [
      {
        label: 'Cut',
        icon: '✂️',
        shortcut: '⌘X',
        onClick: () => console.log('Cut clip:', clip.id),
      },
      {
        label: 'Copy',
        icon: '📋',
        shortcut: '⌘C',
        onClick: () => console.log('Copy clip:', clip.id),
      },
      {
        label: 'Duplicate',
        icon: '📑',
        shortcut: '⌘D',
        onClick: () => duplicateClip(trackId, clip.id),
      },
      { separator: true },
      {
        label: 'Split at Playhead',
        icon: '✂️',
        shortcut: 'C',
        disabled: !canSplit,
        onClick: () => {
          if (canSplit) {
            splitClip(clip.id, playhead);
          }
        },
      },
      { separator: true },
      {
        label: 'Speed/Duration',
        icon: '⏱️',
        onClick: () => console.log('Change speed:', clip.id),
      },
      {
        label: 'Reset to Original',
        icon: '↩️',
        onClick: () => {
          if (mediaItem) {
            updateClip(clip.id, {
              duration: mediaItem.duration,
              trimStart: 0,
              trimEnd: mediaItem.duration,
              speed: 1,
            });
          }
        },
      },
      { separator: true },
      {
        label: selectedCount > 1 ? `Delete ${selectedCount} Clips` : 'Delete',
        icon: '🗑️',
        shortcut: 'Delete',
        onClick: () => {
          selectedClips.forEach((clipId) => {
            removeClip(clipId);
          });
        },
      },
      {
        label: 'Ripple Delete',
        icon: '🗑️➡️',
        shortcut: 'Shift+Delete',
        onClick: () => {
          rippleDelete(trackId, clip.id);
        },
      },
    ];
  };

  /**
   * Handle clip drag start (move)
   */
  const handleMoveStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDragMode('move');
      setDragStart({ 
        x: e.clientX, 
        time: clip.startTime,
        duration: clip.duration,
        trimStart: clip.trimStart,
      });
    },
    [clip.startTime, clip.duration, clip.trimStart]
  );

  /**
   * Handle trim left start
   */
  const handleTrimLeftStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDragMode('trim-left');
      setDragStart({ 
        x: e.clientX, 
        time: clip.startTime,
        duration: clip.duration,
        trimStart: clip.trimStart,
      });
    },
    [clip.startTime, clip.duration, clip.trimStart]
  );

  /**
   * Handle trim right start
   */
  const handleTrimRightStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setDragMode('trim-right');
      setDragStart({ 
        x: e.clientX, 
        time: clip.startTime,
        duration: clip.duration,
        trimStart: clip.trimStart,
      });
    },
    [clip.startTime, clip.duration, clip.trimStart]
  );

  /**
   * Handle drag
   */
  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragMode) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaTime = deltaX / zoomLevel;

      if (dragMode === 'move') {
        // Move clip
        let newStartTime = Math.max(0, dragStart.time + deltaTime);
        
        // Apply snapping if enabled
        const snapThreshold = 10 / zoomLevel; // 10 pixels in time
        const snapPoint = findNearestSnapPoint(newStartTime, snapThreshold);
        if (snapPoint !== null) {
          newStartTime = snapPoint;
        }
        
        // Check for overlap (unless ripple mode is enabled)
        if (!rippleMode) {
          const wouldOverlap = checkClipOverlap(trackId, clip.id, newStartTime, clip.duration);
          setWouldOverlap(wouldOverlap);
          if (wouldOverlap) {
            // Don't allow the move if it would cause overlap
            return;
          }
        } else {
          // Ripple mode: move all clips after this one
          const timeDelta = newStartTime - clip.startTime;
          if (Math.abs(timeDelta) > 0.01) {
            rippleEdit(trackId, clip.startTime + clip.duration, timeDelta);
          }
        }
        
        updateClip(clip.id, { startTime: newStartTime });
      } else if (dragMode === 'trim-left') {
        // Trim left (adjust start time and trim start)
        let newStartTime = Math.max(0, dragStart.time + deltaTime);
        
        // Apply snapping if enabled
        const snapThreshold = 10 / zoomLevel;
        const snapPoint = findNearestSnapPoint(newStartTime, snapThreshold);
        if (snapPoint !== null) {
          newStartTime = snapPoint;
        }
        
        const timeDiff = newStartTime - dragStart.time;
        const newTrimStart = Math.max(0, dragStart.trimStart + timeDiff);
        const newDuration = Math.max(0.1, dragStart.duration - timeDiff);

        // Don't trim beyond the media duration
        if (mediaItem && newTrimStart <= mediaItem.duration) {
          // Check for overlap with the new position
          if (!rippleMode) {
            const wouldOverlap = checkClipOverlap(trackId, clip.id, newStartTime, newDuration);
            if (wouldOverlap) {
              return;
            }
          }
          
          updateClip(clip.id, { 
            startTime: newStartTime,
            trimStart: newTrimStart,
            duration: newDuration,
          });
          
          // Ripple mode: move clips after this one
          if (rippleMode && timeDiff !== 0) {
            rippleEdit(trackId, dragStart.time + dragStart.duration, timeDiff);
          }
        }
      } else if (dragMode === 'trim-right') {
        // Trim right (adjust duration and trim end)
        const newDuration = Math.max(0.1, dragStart.duration + deltaTime);
        const newEndTime = dragStart.time + newDuration;
        
        // Apply snapping to end position
        const snapThreshold = 10 / zoomLevel;
        const snapPoint = findNearestSnapPoint(newEndTime, snapThreshold);
        const snappedDuration = snapPoint !== null 
          ? snapPoint - dragStart.time 
          : newDuration;
        
        const finalDuration = Math.max(0.1, snappedDuration);
        const newTrimEnd = dragStart.trimStart + finalDuration;

        // Don't trim beyond the media duration
        if (!mediaItem || newTrimEnd <= mediaItem.duration) {
          // Check for overlap
          if (!rippleMode) {
            const wouldOverlap = checkClipOverlap(trackId, clip.id, clip.startTime, finalDuration);
            if (wouldOverlap) {
              return;
            }
          }
          
          updateClip(clip.id, { 
            duration: finalDuration,
            trimEnd: newTrimEnd,
          });
          
          // Ripple mode: move clips after this one
          if (rippleMode) {
            const durationDelta = finalDuration - clip.duration;
            if (Math.abs(durationDelta) > 0.01) {
              rippleEdit(trackId, clip.startTime + clip.duration, durationDelta);
            }
          }
        }
      }
    },
    [
      dragMode, 
      dragStart, 
      zoomLevel, 
      clip.id, 
      clip.startTime,
      clip.duration,
      mediaItem, 
      updateClip, 
      findNearestSnapPoint,
      checkClipOverlap,
      trackId,
      rippleMode,
      rippleEdit,
    ]
  );

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback(() => {
    setDragMode(null);
    setWouldOverlap(false);
  }, []);

  // Add drag listeners
  useEffect(() => {
    if (dragMode) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragMode, handleDrag, handleDragEnd]);

  return (
    <>
      <div
        ref={clipRef}
        className={`timeline-clip ${
          trackType === 'audio' ? 'timeline-clip--audio' : ''
        } ${isSelected ? 'timeline-clip--selected' : ''} ${
          dragMode ? 'timeline-clip--dragging' : ''
        } ${wouldOverlap ? 'timeline-clip--overlap' : ''}`}
        style={{
          left,
          width,
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMoveStart}
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
        <div 
          className="timeline-clip__resize-handle timeline-clip__resize-handle--left"
          onMouseDown={handleTrimLeftStart}
        />
        <div 
          className="timeline-clip__resize-handle timeline-clip__resize-handle--right"
          onMouseDown={handleTrimRightStart}
        />
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
