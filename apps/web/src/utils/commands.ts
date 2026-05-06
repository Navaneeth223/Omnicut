/**
 * Command utilities for undo/redo
 */

import { useTimelineStore, useHistoryStore } from '@omnicut/store';
import type { Clip } from '@omnicut/core';

/**
 * Create a command to add a clip
 */
export function createAddClipCommand(trackId: string, clip: Clip) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();

  historyStore.executeCommand({
    name: `Add clip "${clip.name}"`,
    execute: () => {
      timelineStore.addClip(trackId, clip);
    },
    undo: () => {
      timelineStore.removeClip(clip.id);
    },
  });
}

/**
 * Create a command to remove a clip
 */
export function createRemoveClipCommand(trackId: string, clipId: string) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get the clip before removing
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  const track = timeline.tracks.find((t) => t.id === trackId);
  if (!track) return;
  
  const clip = track.clips.find((c) => c.id === clipId);
  if (!clip) return;

  const clipCopy = { ...clip };

  historyStore.executeCommand({
    name: `Delete clip "${clip.name}"`,
    execute: () => {
      timelineStore.removeClip(clipId);
    },
    undo: () => {
      timelineStore.addClip(trackId, clipCopy);
    },
  });
}

/**
 * Create a command to update a clip
 */
export function createUpdateClipCommand(
  clipId: string,
  updates: Partial<Clip>,
  description: string = 'Update clip'
) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get current clip state
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  let originalClip: Clip | undefined;
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) {
      originalClip = { ...clip };
      break;
    }
  }
  
  if (!originalClip) return;

  const originalState = { ...originalClip };

  historyStore.executeCommand({
    name: description,
    execute: () => {
      timelineStore.updateClip(clipId, updates);
    },
    undo: () => {
      timelineStore.updateClip(clipId, originalState);
    },
  });
}

/**
 * Create a command to move a clip
 */
export function createMoveClipCommand(
  clipId: string,
  fromTrackId: string,
  toTrackId: string,
  fromTime: number,
  toTime: number
) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();

  historyStore.executeCommand({
    name: 'Move clip',
    execute: () => {
      timelineStore.moveClip(clipId, toTrackId, toTime);
    },
    undo: () => {
      timelineStore.moveClip(clipId, fromTrackId, fromTime);
    },
  });
}

/**
 * Create a command to add a track
 */
export function createAddTrackCommand(type: 'video' | 'audio') {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  let addedTrackId: string | null = null;

  historyStore.executeCommand({
    name: `Add ${type} track`,
    execute: () => {
      const beforeCount = timelineStore.timeline?.tracks.length || 0;
      timelineStore.addTrack(type);
      const afterCount = timelineStore.timeline?.tracks.length || 0;
      if (afterCount > beforeCount) {
        addedTrackId = timelineStore.timeline?.tracks[afterCount - 1].id || null;
      }
    },
    undo: () => {
      if (addedTrackId) {
        timelineStore.removeTrack(addedTrackId);
      }
    },
  });
}

/**
 * Create a command to paste clips
 */
export function createPasteClipsCommand(clips: Clip[], trackId?: string) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  const addedClipIds: string[] = [];

  historyStore.executeCommand({
    name: `Paste ${clips.length} clip(s)`,
    execute: () => {
      const beforeClipCount = timelineStore.timeline?.tracks.reduce(
        (sum, t) => sum + t.clips.length,
        0
      ) || 0;
      
      timelineStore.pasteClips(clips, trackId);
      
      const afterClipCount = timelineStore.timeline?.tracks.reduce(
        (sum, t) => sum + t.clips.length,
        0
      ) || 0;
      
      // Store the IDs of newly added clips (last N clips)
      const newClipCount = afterClipCount - beforeClipCount;
      if (newClipCount > 0 && timelineStore.timeline) {
        for (const track of timelineStore.timeline.tracks) {
          const trackClips = track.clips.slice(-newClipCount);
          addedClipIds.push(...trackClips.map((c) => c.id));
        }
      }
    },
    undo: () => {
      addedClipIds.forEach((clipId) => {
        timelineStore.removeClip(clipId);
      });
    },
  });
}
