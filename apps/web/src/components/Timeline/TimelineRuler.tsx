/**
 * Timeline Ruler Component
 */

import { formatTimecode } from '@omnicut/core';

interface TimelineRulerProps {
  duration: number;
  zoomLevel: number;
  scrollPosition: number;
}

export function TimelineRuler({ duration, zoomLevel, scrollPosition }: TimelineRulerProps) {
  // Calculate tick interval based on zoom level
  const getTickInterval = () => {
    const pixelsPerSecond = zoomLevel;
    
    if (pixelsPerSecond > 100) return 0.1; // 100ms
    if (pixelsPerSecond > 50) return 0.5; // 500ms
    if (pixelsPerSecond > 20) return 1; // 1s
    if (pixelsPerSecond > 10) return 5; // 5s
    if (pixelsPerSecond > 5) return 10; // 10s
    return 30; // 30s
  };

  const tickInterval = getTickInterval();
  const numTicks = Math.ceil(duration / tickInterval);

  return (
    <div className="timeline-ruler">
      <div className="timeline-ruler__ticks">
        {Array.from({ length: numTicks + 1 }).map((_, i) => {
          const time = i * tickInterval;
          const left = time * zoomLevel;
          const isMajor = i % 5 === 0;

          return (
            <div
              key={i}
              className={`timeline-ruler__tick ${
                isMajor ? 'timeline-ruler__tick--major' : ''
              }`}
              style={{ left }}
            >
              {isMajor && formatTimecode(time, 30)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
