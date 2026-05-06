/**
 * Timeline Component
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTimelineStore, useProjectStore, useMediaPoolStore } from '@omnicut/store';
import { formatTimecode } from '@omnicut/core';
import { TimelineTrack } from './TimelineTrack';
import { TimelineRuler } from './TimelineRuler';
import { TimelinePlayhead } from './TimelinePlayhead';
import './Timeline.css';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const timeline = useTimelineStore((state) => state.timeline);
  const zoomLevel = useTimelineStore((state) => state.zoomLevel);
  const scrollPosition = useTimelineStore((state) => state.scrollPosition);
  const seek = useTimelineStore((state) => state.seek);
  const scroll = useTimelineStore((state) => state.scroll);
  const toggleTrackMute = useTimelineStore((state) => state.toggleTrackMute);
  const toggleTrackLock = useTimelineStore((state) => state.toggleTrackLock);
  const toggleTrackSolo = useTimelineStore((state) => state.toggleTrackSolo);
  const toggleTrackVisibility = useTimelineStore((state) => state.toggleTrackVisibility);
  const rippleMode = useTimelineStore((state) => state.rippleMode);
  const toggleRippleMode = useTimelineStore((state) => state.toggleRippleMode);
  
  const frameRate = useProjectStore((state) => state.project?.settings.frameRate ?? 30);

  /**
   * Handle click on timeline to seek
   */
  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !timeline) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + scrollPosition;
      const time = x / zoomLevel;

      seek(time);
    },
    [timeline, zoomLevel, scrollPosition, seek]
  );

  /**
   * Handle scroll
   */
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      scroll(target.scrollLeft);
    },
    [scroll]
  );

  if (!timeline) {
    return (
      <div className="timeline-wrapper">
        <div className="timeline-empty">
          <div className="empty-state">
            <div className="empty-state__icon">⏱️</div>
            <p className="empty-state__text">No timeline loaded</p>
          </div>
        </div>
      </div>
    );
  }

  const timelineWidth = Math.max(timeline.duration * zoomLevel, 2000);

  return (
    <div className="timeline-wrapper">
      {/* Ruler */}
      <TimelineRuler
        duration={timeline.duration}
        zoomLevel={zoomLevel}
        scrollPosition={scrollPosition}
      />

      {/* Content */}
      <div className="timeline-content">
        {/* Track Headers */}
        <div className="timeline-tracks-header">
          {timeline.tracks.map((track) => (
            <div key={track.id} className="timeline-track-header">
              <div className="timeline-track-header__name">{track.name}</div>
              <div className="timeline-track-header__controls">
                <button
                  className={`icon-button ${track.muted ? 'icon-button--active' : ''}`}
                  onClick={() => toggleTrackMute(track.id)}
                  title={track.muted ? 'Unmute' : 'Mute'}
                >
                  {track.type === 'audio' ? (track.muted ? '🔇' : '🔊') : (track.visible ? '👁️' : '👁️‍🗨️')}
                </button>
                <button
                  className={`icon-button ${track.solo ? 'icon-button--active' : ''}`}
                  onClick={() => toggleTrackSolo(track.id)}
                  title={track.solo ? 'Unsolo' : 'Solo'}
                >
                  S
                </button>
                <button
                  className={`icon-button ${track.locked ? 'icon-button--active' : ''}`}
                  onClick={() => toggleTrackLock(track.id)}
                  title={track.locked ? 'Unlock' : 'Lock'}
                >
                  {track.locked ? '🔒' : '🔓'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Track Content */}
        <div
          ref={containerRef}
          className="timeline-tracks-content"
          onClick={handleTimelineClick}
          onScroll={handleScroll}
        >
          <div style={{ width: timelineWidth, position: 'relative' }}>
            {timeline.tracks.map((track) => (
              <TimelineTrack
                key={track.id}
                track={track}
                zoomLevel={zoomLevel}
              />
            ))}

            {/* Playhead */}
            <TimelinePlayhead
              position={timeline.playhead}
              zoomLevel={zoomLevel}
              frameRate={frameRate}
            />

            {/* Markers */}
            {timeline.markers.map((marker) => (
              <div
                key={marker.id}
                className="timeline-marker"
                style={{ left: marker.time * zoomLevel }}
                title={marker.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
