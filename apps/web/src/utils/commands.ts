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

/**
 * Create a command to split clip
 */
export function createSplitClipCommand(clipId: string, splitTime: number) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get the clip before splitting
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  let originalClip: Clip | undefined;
  let trackId: string | undefined;
  
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) {
      originalClip = { ...clip };
      trackId = track.id;
      break;
    }
  }
  
  if (!originalClip || !trackId) return;

  let newClipId: string | null = null;

  historyStore.executeCommand({
    name: `Split clip "${originalClip.name}"`,
    execute: () => {
      const beforeCount = timelineStore.timeline?.tracks
        .find((t) => t.id === trackId)?.clips.length || 0;
      
      timelineStore.splitClip(clipId, splitTime);
      
      const afterCount = timelineStore.timeline?.tracks
        .find((t) => t.id === trackId)?.clips.length || 0;
      
      // Get the new clip ID (last clip added)
      if (afterCount > beforeCount && timelineStore.timeline) {
        const track = timelineStore.timeline.tracks.find((t) => t.id === trackId);
        if (track) {
          newClipId = track.clips[track.clips.length - 1].id;
        }
      }
    },
    undo: () => {
      // Remove the new clip
      if (newClipId) {
        timelineStore.removeClip(newClipId);
      }
      // Restore original clip
      if (trackId) {
        timelineStore.addClip(trackId, originalClip);
      }
    },
  });
}

/**
 * Create a command to add effect
 */
export function createAddEffectCommand(clipId: string, effect: any) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get current clip state
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  let clip: Clip | undefined;
  for (const track of timeline.tracks) {
    const c = track.clips.find((cl) => cl.id === clipId);
    if (c) {
      clip = c;
      break;
    }
  }
  
  if (!clip) return;

  const previousEffects = [...clip.effects];

  historyStore.executeCommand({
    name: `Add effect "${effect.name}"`,
    execute: () => {
      const updatedEffects = [...previousEffects, effect];
      timelineStore.updateClip(clipId, { effects: updatedEffects });
    },
    undo: () => {
      timelineStore.updateClip(clipId, { effects: previousEffects });
    },
  });
}

/**
 * Create a command to remove effect
 */
export function createRemoveEffectCommand(clipId: string, effectId: string) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get current clip state
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  let clip: Clip | undefined;
  for (const track of timeline.tracks) {
    const c = track.clips.find((cl) => cl.id === clipId);
    if (c) {
      clip = c;
      break;
    }
  }
  
  if (!clip) return;

  const previousEffects = [...clip.effects];
  const effectToRemove = clip.effects.find((e) => e.id === effectId);
  
  if (!effectToRemove) return;

  historyStore.executeCommand({
    name: `Remove effect "${effectToRemove.name}"`,
    execute: () => {
      const updatedEffects = previousEffects.filter((e) => e.id !== effectId);
      timelineStore.updateClip(clipId, { effects: updatedEffects });
    },
    undo: () => {
      timelineStore.updateClip(clipId, { effects: previousEffects });
    },
  });
}

/**
 * Create a command to update effect parameter
 */
export function createUpdateEffectParameterCommand(
  clipId: string,
  effectId: string,
  parameterId: string,
  newValue: any,
  oldValue: any
) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  // Get effect name for description
  const timeline = timelineStore.timeline;
  if (!timeline) return;
  
  let effectName = 'Effect';
  for (const track of timeline.tracks) {
    const clip = track.clips.find((c) => c.id === clipId);
    if (clip) {
      const effect = clip.effects.find((e) => e.id === effectId);
      if (effect) {
        effectName = effect.name;
        break;
      }
    }
  }

  historyStore.executeCommand({
    name: `Adjust ${effectName}`,
    execute: () => {
      const clip = timelineStore.timeline?.tracks
        .flatMap((t) => t.clips)
        .find((c) => c.id === clipId);
      
      if (clip) {
        const updatedEffects = clip.effects.map((effect) => {
          if (effect.id === effectId) {
            return {
              ...effect,
              parameters: effect.parameters.map((param) =>
                param.id === parameterId ? { ...param, value: newValue } : param
              ),
            };
          }
          return effect;
        });
        
        timelineStore.updateClip(clipId, { effects: updatedEffects });
      }
    },
    undo: () => {
      const clip = timelineStore.timeline?.tracks
        .flatMap((t) => t.clips)
        .find((c) => c.id === clipId);
      
      if (clip) {
        const updatedEffects = clip.effects.map((effect) => {
          if (effect.id === effectId) {
            return {
              ...effect,
              parameters: effect.parameters.map((param) =>
                param.id === parameterId ? { ...param, value: oldValue } : param
              ),
            };
          }
          return effect;
        });
        
        timelineStore.updateClip(clipId, { effects: updatedEffects });
      }
    },
  });
}

/**
 * Create a command to add transition
 */
export function createAddTransitionCommand(
  fromClipId: string,
  toClipId: string,
  type: string,
  duration: number
) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  let addedTransitionId: string | null = null;

  historyStore.executeCommand({
    name: `Add transition`,
    execute: () => {
      const beforeCount = timelineStore.transitions.length;
      timelineStore.addTransition(fromClipId, toClipId, type, duration);
      const afterCount = timelineStore.transitions.length;
      
      if (afterCount > beforeCount) {
        addedTransitionId = timelineStore.transitions[afterCount - 1].id;
      }
    },
    undo: () => {
      if (addedTransitionId) {
        timelineStore.removeTransition(addedTransitionId);
      }
    },
  });
}

/**
 * Create a command to remove transition
 */
export function createRemoveTransitionCommand(transitionId: string) {
  const timelineStore = useTimelineStore.getState();
  const historyStore = useHistoryStore.getState();
  
  const transition = timelineStore.transitions.find((t) => t.id === transitionId);
  if (!transition) return;

  const transitionCopy = { ...transition };

  historyStore.executeCommand({
    name: `Remove transition`,
    execute: () => {
      timelineStore.removeTransition(transitionId);
    },
    undo: () => {
      timelineStore.addTransition(
        transitionCopy.fromClipId,
        transitionCopy.toClipId,
        transitionCopy.type,
        transitionCopy.duration
      );
    },
  });
}
