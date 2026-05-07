/**
 * Timeline Track Component
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore, useTimelineStore } from '@omnicut/store';
import type { Track, Clip, MediaItem as MediaItemType } from '@omnicut/core';
import { generateId } from '@omnicut/core';
import { TimelineClip } from './TimelineClip';

interface TimelineTrackProps {
  track: Track;
  zoomLevel: number;
}

export function TimelineTrack({ track, zoomLevel }: TimelineTrackProps) {
  const [dragOver, setDragOver] = useState(false);
  
  const mediaItems = useMediaPoolStore((state) => state.mediaPool?.items ?? []);
  const addClip = useTimelineStore((state) => state.addClip);
  const incrementUsageCount = useMediaPoolStore((state) => state.incrementUsageCount);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'media-item' && data.item) {
        const mediaItem: MediaItemType = data.item;
        
        // Check if media type matches track type
        const isCompatible = 
          (track.type === 'video' && (mediaItem.type === 'video' || mediaItem.type === 'image')) ||
          (track.type === 'audio' && mediaItem.type === 'audio');

        if (!isCompatible) {
          console.warn(`Cannot add ${mediaItem.type} to ${track.type} track`);
          return;
        }

        // Calculate drop position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = x / zoomLevel;

        // Create new clip
        const newClip: Clip = {
          id: generateId(),
          name: mediaItem.name,
          mediaItemId: mediaItem.id,
          mediaUrl: mediaItem.url,
          source: mediaItem.url,
          type: mediaItem.type === 'image' ? 'video' : mediaItem.type,
          trackId: track.id,
          startTime: Math.max(0, time),
          duration: mediaItem.duration || 5,
          trimStart: 0,
          trimEnd: mediaItem.duration || 5,
          speed: 1,
          volume: 1,
          opacity: 1,
          effects: [],
          keyframes: [],
          metadata: {},
        };

        addClip(track.id, newClip);
        incrementUsageCount(mediaItem.id);
        
        console.log(`Dropped "${mediaItem.name}" on track "${track.name}" at ${time.toFixed(2)}s`);
      }
    } catch (error) {
      console.error('Failed to handle drop:', error);
    }
  }, [track, zoomLevel, addClip, incrementUsageCount]);

  return (
    <div
      className={`timeline-track timeline-track--${track.type} ${dragOver ? 'timeline-track--drag-over' : ''}`}
      style={{
        height: track.height,
        opacity: track.visible ? 1 : 0.5,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {track.clips.map((clip) => {
        const mediaItem = mediaItems.find((item) => item.id === clip.mediaItemId);
        
        return (
          <TimelineClip
            key={clip.id}
            clip={clip}
            mediaItem={mediaItem}
            zoomLevel={zoomLevel}
            trackType={track.type}
            trackId={track.id}
          />
        );
      })}
    </div>
  );
}
