/**
 * Keyboard Shortcuts Hook
 */

import { useEffect } from 'react';
import { useTimelineStore, useProjectStore } from '@omnicut/store';

export function useKeyboardShortcuts() {
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const goToStart = useTimelineStore((state) => state.goToStart);
  const goToEnd = useTimelineStore((state) => state.goToEnd);
  const stepForward = useTimelineStore((state) => state.stepForward);
  const stepBackward = useTimelineStore((state) => state.stepBackward);
  const zoomIn = useTimelineStore((state) => state.zoomIn);
  const zoomOut = useTimelineStore((state) => state.zoomOut);
  
  const frameRate = useProjectStore((state) => state.project?.settings.frameRate ?? 30);
  const saveProject = useProjectStore((state) => state.saveProject);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Playback controls
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'Home') {
        e.preventDefault();
        goToStart();
      } else if (e.code === 'End') {
        e.preventDefault();
        goToEnd();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) {
          // 10 frames back
          for (let i = 0; i < 10; i++) {
            stepBackward(frameRate);
          }
        } else {
          // 1 frame back
          stepBackward(frameRate);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) {
          // 10 frames forward
          for (let i = 0; i < 10; i++) {
            stepForward(frameRate);
          }
        } else {
          // 1 frame forward
          stepForward(frameRate);
        }
      }
      // Zoom controls
      else if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        e.preventDefault();
        zoomIn();
      } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        e.preventDefault();
        zoomOut();
      }
      // Project controls
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyS') {
        e.preventDefault();
        saveProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    goToStart,
    goToEnd,
    stepForward,
    stepBackward,
    zoomIn,
    zoomOut,
    frameRate,
    saveProject,
  ]);
}
