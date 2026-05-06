/**
 * Timeline Playhead Component
 */

import { formatTimecode } from '@omnicut/core';

interface TimelinePlayheadProps {
  position: number;
  zoomLevel: number;
  frameRate: number;
}

export function TimelinePlayhead({ position, zoomLevel, frameRate }: TimelinePlayheadProps) {
  const left = position * zoomLevel;

  return (
    <div className="timeline-playhead" style={{ left }}>
      <div className="timeline-playhead__time">
        {formatTimecode(position, frameRate)}
      </div>
    </div>
  );
}
