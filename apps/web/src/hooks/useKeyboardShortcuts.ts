/**
 * Keyboard Shortcuts Hook
 */

import { useEffect, useState } from 'react';
import { useTimelineStore, useProjectStore, useMediaPoolStore, useHistoryStore } from '@omnicut/store';
import type { Clip } from '@omnicut/core';

interface KeyboardShortcutsOptions {
  onExport?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const [clipboard, setClipboard] = useState<Clip[]>([]);

  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const goToStart = useTimelineStore((state) => state.goToStart);
  const goToEnd = useTimelineStore((state) => state.goToEnd);
  const stepForward = useTimelineStore((state) => state.stepForward);
  const stepBackward = useTimelineStore((state) => state.stepBackward);
  const zoomIn = useTimelineStore((state) => state.zoomIn);
  const zoomOut = useTimelineStore((state) => state.zoomOut);
  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const removeClip = useTimelineStore((state) => state.removeClip);
  const timeline = useTimelineStore((state) => state.timeline);
  const copyClips = useTimelineStore((state) => state.copyClips);
  const pasteClips = useTimelineStore((state) => state.pasteClips);
  const selectClips = useTimelineStore((state) => state.selectClips);
  
  const frameRate = useProjectStore((state) => state.project?.settings.frameRate ?? 30);
  const saveProject = useProjectStore((state) => state.saveProject);

  const selectedItems = useMediaPoolStore((state) => state.selectedItems);
  const removeItems = useMediaPoolStore((state) => state.removeItems);

  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);
  const getUndoDescription = useHistoryStore((state) => state.getUndoDescription);
  const getRedoDescription = useHistoryStore((state) => state.getRedoDescription);
  const splitClipsAtPlayhead = useTimelineStore((state) => state.splitClipsAtPlayhead);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          const description = getUndoDescription();
          undo();
          console.log(`Undo: ${description}`);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyZ') {
        e.preventDefault();
        if (canRedo()) {
          const description = getRedoDescription();
          redo();
          console.log(`Redo: ${description}`);
        }
      }
      // Delete selected clips or media items
      if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        
        // Delete selected clips from timeline
        if (selectedClips.length > 0 && timeline) {
          selectedClips.forEach((clipId) => {
            // Find which track contains this clip
            const track = timeline.tracks.find((t) =>
              t.clips.some((c) => c.id === clipId)
            );
            if (track) {
              removeClip(clipId);
            }
          });
          selectClips([]); // Clear selection after delete
        }
        // Delete selected media items
        else if (selectedItems.length > 0) {
          removeItems(selectedItems);
        }
      }
      // Copy clips
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyC' && !e.shiftKey) {
        if (selectedClips.length > 0) {
          e.preventDefault();
          const clips = copyClips(selectedClips);
          setClipboard(clips);
          console.log(`Copied ${clips.length} clip(s) to clipboard`);
        }
      }
      // Cut clips
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyX') {
        if (selectedClips.length > 0 && timeline) {
          e.preventDefault();
          const clips = copyClips(selectedClips);
          setClipboard(clips);
          
          // Delete the clips
          selectedClips.forEach((clipId) => {
            removeClip(clipId);
          });
          selectClips([]);
          console.log(`Cut ${clips.length} clip(s) to clipboard`);
        }
      }
      // Paste clips
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyV') {
        if (clipboard.length > 0) {
          e.preventDefault();
          pasteClips(clipboard);
          console.log(`Pasted ${clipboard.length} clip(s) at playhead`);
        }
      }
      // Select all clips
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyA') {
        if (timeline) {
          e.preventDefault();
          const allClipIds = timeline.tracks.flatMap((t) => t.clips.map((c) => c.id));
          selectClips(allClipIds);
          console.log(`Selected ${allClipIds.length} clip(s)`);
        }
      }
      // Playback controls
      else if (e.code === 'Space') {
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
      // Export
      else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyE') {
        e.preventDefault();
        if (options.onExport) {
          options.onExport();
        }
      }
      // Razor tool - Split clips at playhead
      else if (e.code === 'KeyC' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        splitClipsAtPlayhead();
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
    selectedClips,
    selectedItems,
    removeClip,
    removeItems,
    timeline,
    copyClips,
    pasteClips,
    clipboard,
    selectClips,
    options,
    undo,
    redo,
    canUndo,
    canRedo,
    getUndoDescription,
    getRedoDescription,
    splitClipsAtPlayhead,
  ]);
}
