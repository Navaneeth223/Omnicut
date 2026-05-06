/**
 * Playback Hook
 * Handles timeline playback with requestAnimationFrame
 */

import { useEffect, useRef } from 'react';
import { useTimelineStore, useProjectStore } from '@omnicut/store';

export function usePlayback() {
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const playing = useTimelineStore((state) => state.playing);
  const playhead = useTimelineStore((state) => state.timeline?.playhead ?? 0);
  const duration = useTimelineStore((state) => state.timeline?.duration ?? 0);
  const playbackSpeed = useTimelineStore((state) => state.playbackSpeed);
  const seek = useTimelineStore((state) => state.seek);
  const pause = useTimelineStore((state) => state.pause);
  
  const frameRate = useProjectStore((state) => state.project?.settings.frameRate ?? 30);

  useEffect(() => {
    if (!playing) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      // Calculate new playhead position
      const newPlayhead = playhead + deltaTime * playbackSpeed;

      // Check if we've reached the end
      if (newPlayhead >= duration) {
        seek(duration);
        pause();
        lastTimeRef.current = 0;
        return;
      }

      // Update playhead
      seek(newPlayhead);

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [playing, playhead, duration, playbackSpeed, frameRate, seek, pause]);
}
