/**
 * Timeline Track Component
 */

import { useMediaPoolStore } from '@omnicut/store';
import type { Track } from '@omnicut/core';
import { TimelineClip } from './TimelineClip';

interface TimelineTrackProps {
  track: Track;
  zoomLevel: number;
}

export function TimelineTrack({ track, zoomLevel }: TimelineTrackProps) {
  const mediaItems = useMediaPoolStore((state) => state.mediaPool?.items ?? []);

  return (
    <div
      className={`timeline-track timeline-track--${track.type}`}
      style={{
        height: track.height,
        opacity: track.visible ? 1 : 0.5,
      }}
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
