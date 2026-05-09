/**
 * Video Viewer Component
 * Displays video/image/audio with playback controls and effect preview
 */

import { useEffect, useRef, useState } from 'react';
import { useTimelineStore } from '@omnicut/store';
import { createEffectPreviewRenderer } from '../../utils/effectPreview';
import type { Clip } from '@omnicut/core';
import './VideoViewer.css';

export function VideoViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectRendererRef = useRef(createEffectPreviewRenderer());
  const audioContextRef = useRef<AudioContext | null>(null);
  const [currentMedia, setCurrentMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image' | null>(null);

  const timeline = useTimelineStore((state) => state.timeline);
  const playing = useTimelineStore((state) => state.playing);
  const playhead = timeline?.playhead ?? 0;

  /**
   * Find clip at current playhead position
   */
  const getCurrentClip = (): Clip | null => {
    if (!timeline) return null;

    for (const track of timeline.tracks) {
      for (const clip of track.clips) {
        const clipEnd = clip.startTime + clip.duration;
        if (clip.startTime <= playhead && playhead < clipEnd) {
          return clip;
        }
      }
    }
    return null;
  };

  /**
   * Update video/image based on current clip
   */
  useEffect(() => {
    const clip = getCurrentClip();
    
    if (!clip) {
      setCurrentMedia(null);
      setMediaType(null);
      return;
    }

    // Get media URL from clip
    const mediaUrl = clip.mediaUrl || clip.source;
    if (!mediaUrl) return;

    setCurrentMedia(mediaUrl);
    
    // Determine media type from clip
    if (clip.type === 'video') {
      setMediaType('video');
    } else if (clip.type === 'audio') {
      setMediaType('audio');
    } else if (clip.type === 'image') {
      setMediaType('image');
    }
  }, [playhead, timeline]);

  /**
   * Sync video playback with timeline
   */
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (mediaType === 'video' && video) {
      const clip = getCurrentClip();
      if (!clip) return;

      // Calculate time within clip
      const timeInClip = playhead - clip.startTime;
      const videoTime = clip.trimStart + timeInClip;

      // Sync video time
      if (Math.abs(video.currentTime - videoTime) > 0.1) {
        video.currentTime = videoTime;
      }

      // Enable audio for video
      video.muted = false;
      video.volume = 1.0;

      // Sync play/pause
      if (playing && video.paused) {
        video.play().catch((err) => {
          console.error('Video play error:', err);
        });
      } else if (!playing && !video.paused) {
        video.pause();
      }
    } else if (mediaType === 'audio' && audio) {
      const clip = getCurrentClip();
      if (!clip) return;

      // Calculate time within clip
      const timeInClip = playhead - clip.startTime;
      const audioTime = clip.trimStart + timeInClip;

      // Sync audio time
      if (Math.abs(audio.currentTime - audioTime) > 0.1) {
        audio.currentTime = audioTime;
      }

      // Enable audio
      audio.muted = false;
      audio.volume = 1.0;

      // Sync play/pause
      if (playing && audio.paused) {
        audio.play().catch((err) => {
          console.error('Audio play error:', err);
        });
      } else if (!playing && !audio.paused) {
        audio.pause();
      }
    }
  }, [playhead, playing, mediaType]);

  /**
   * Render to canvas with effects
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || mediaType !== 'video') {
      effectRendererRef.current.stop();
      return;
    }

    const clip = getCurrentClip();
    if (!clip) {
      effectRendererRef.current.stop();
      return;
    }

    // Get effects for current clip
    const effects = clip.effects || [];

    // Start effect rendering
    effectRendererRef.current.start(video, canvas, effects);

    return () => {
      effectRendererRef.current.stop();
    };
  }, [playhead, mediaType, currentMedia, timeline]);

  return (
    <div className="video-viewer">
      {!currentMedia ? (
        <div className="video-viewer__empty">
          <div className="empty-state">
            <div className="empty-state__icon">🎬</div>
            <p className="empty-state__text">No media at playhead</p>
            <p className="empty-state__hint">
              Add clips to timeline to preview
            </p>
          </div>
        </div>
      ) : (
        <>
          {mediaType === 'video' && (
            <>
              <video
                ref={videoRef}
                src={currentMedia}
                className="video-viewer__video"
                style={{ display: 'none' }}
                crossOrigin="anonymous"
              />
              <canvas
                ref={canvasRef}
                className="video-viewer__canvas"
              />
            </>
          )}
          
          {mediaType === 'image' && (
            <img
              src={currentMedia}
              alt="Preview"
              className="video-viewer__image"
            />
          )}
          
          {mediaType === 'audio' && (
            <div className="video-viewer__audio">
              <div className="audio-visualizer">
                <div className="audio-visualizer__icon">🎵</div>
                <p className="audio-visualizer__text">Audio Track</p>
                <p className="audio-visualizer__hint">Playing audio...</p>
              </div>
              <audio
                ref={audioRef}
                src={currentMedia}
                style={{ display: 'none' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
