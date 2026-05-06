/**
 * Timeline state management
 * @module store/timeline
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Timeline, Track, Clip, Marker } from '@omnicut/core';
import { generateId, createDefaultTrack, createDefaultClip } from '@omnicut/core';

/**
 * Timeline store state
 */
interface TimelineState {
  /** Timeline data */
  timeline: Timeline | null;
  /** Whether timeline is playing */
  playing: boolean;
  /** Playback speed (1.0 = normal) */
  playbackSpeed: number;
  /** Selected clip IDs */
  selectedClips: string[];
  /** Selected track IDs */
  selectedTracks: string[];
  /** Active tool */
  activeTool: 'select' | 'razor' | 'hand' | 'zoom';
  /** Zoom level (pixels per second) */
  zoomLevel: number;
  /** Scroll position (seconds) */
  scrollPosition: number;
  /** Ripple edit mode enabled */
  rippleMode: boolean;
}

/**
 * Timeline store actions
 */
interface TimelineActions {
  /** Initialize timeline */
  initTimeline: (timeline: Timeline) => void;
  /** Play timeline */
  play: () => void;
  /** Pause timeline */
  pause: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Seek to time */
  seek: (time: number) => void;
  /** Step forward one frame */
  stepForward: (frameRate: number) => void;
  /** Step backward one frame */
  stepBackward: (frameRate: number) => void;
  /** Go to start */
  goToStart: () => void;
  /** Go to end */
  goToEnd: () => void;
  /** Set playback speed */
  setPlaybackSpeed: (speed: number) => void;
  /** Add track */
  addTrack: (type: Track['type']) => void;
  /** Remove track */
  removeTrack: (trackId: string) => void;
  /** Add clip */
  addClip: (trackId: string, clip: Omit<Clip, 'id'>) => void;
  /** Remove clip */
  removeClip: (clipId: string) => void;
  /** Update clip */
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  /** Move clip */
  moveClip: (clipId: string, trackId: string, startTime: number) => void;
  /** Select clips */
  selectClips: (clipIds: string[]) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Add marker */
  addMarker: (marker: Omit<Marker, 'id'>) => void;
  /** Remove marker */
  removeMarker: (markerId: string) => void;
  /** Set active tool */
  setActiveTool: (tool: TimelineState['activeTool']) => void;
  /** Zoom in */
  zoomIn: () => void;
  /** Zoom out */
  zoomOut: () => void;
  /** Set zoom level */
  setZoomLevel: (level: number) => void;
  /** Scroll timeline */
  scroll: (position: number) => void;
  /** Toggle snapping */
  toggleSnapping: () => void;
  /** Get snap points for a given time */
  getSnapPoints: () => number[];
  /** Find nearest snap point */
  findNearestSnapPoint: (time: number, threshold: number) => number | null;
  /** Duplicate clip */
  duplicateClip: (trackId: string, clipId: string) => void;
  /** Copy clips to clipboard */
  copyClips: (clipIds: string[]) => Clip[];
  /** Paste clips at playhead */
  pasteClips: (clips: Clip[], trackId?: string) => void;
  /** Toggle track mute */
  toggleTrackMute: (trackId: string) => void;
  /** Toggle track lock */
  toggleTrackLock: (trackId: string) => void;
  /** Toggle track solo */
  toggleTrackSolo: (trackId: string) => void;
  /** Toggle track visibility */
  toggleTrackVisibility: (trackId: string) => void;
  /** Check if clip overlaps with others */
  checkClipOverlap: (trackId: string, clipId: string, startTime: number, duration: number) => boolean;
  /** Find available space on track */
  findAvailableSpace: (trackId: string, duration: number, preferredTime?: number) => number;
  /** Ripple edit - move all clips after a point */
  rippleEdit: (trackId: string, fromTime: number, delta: number) => void;
  /** Ripple delete - remove clip and close gap */
  rippleDelete: (trackId: string, clipId: string) => void;
  /** Toggle ripple mode */
  toggleRippleMode: () => void;
  /** Split clip at time */
  splitClip: (clipId: string, splitTime: number) => void;
  /** Split all clips at playhead */
  splitClipsAtPlayhead: () => void;
}

/**
 * Timeline store
 */
export const useTimelineStore = create<TimelineState & TimelineActions>()(
  immer((set, get) => ({
    // Initial state
    timeline: null,
    playing: false,
    playbackSpeed: 1.0,
    selectedClips: [],
    selectedTracks: [],
    activeTool: 'select',
    zoomLevel: 100, // pixels per second
    scrollPosition: 0,
    rippleMode: false,

    // Actions
    initTimeline: (timeline: Timeline) => {
      set((state) => {
        state.timeline = timeline;
      });
    },

    play: () => {
      set((state) => {
        state.playing = true;
      });
    },

    pause: () => {
      set((state) => {
        state.playing = false;
      });
    },

    togglePlay: () => {
      set((state) => {
        state.playing = !state.playing;
      });
    },

    seek: (time: number) => {
      set((state) => {
        if (state.timeline) {
          state.timeline.playhead = Math.max(0, Math.min(time, state.timeline.duration));
        }
      });
    },

    stepForward: (frameRate: number) => {
      const { timeline } = get();
      if (!timeline) return;
      
      const frameDuration = 1 / frameRate;
      const newTime = timeline.playhead + frameDuration;
      get().seek(newTime);
    },

    stepBackward: (frameRate: number) => {
      const { timeline } = get();
      if (!timeline) return;
      
      const frameDuration = 1 / frameRate;
      const newTime = timeline.playhead - frameDuration;
      get().seek(newTime);
    },

    goToStart: () => {
      get().seek(0);
    },

    goToEnd: () => {
      const { timeline } = get();
      if (timeline) {
        get().seek(timeline.duration);
      }
    },

    setPlaybackSpeed: (speed: number) => {
      set((state) => {
        state.playbackSpeed = Math.max(0.1, Math.min(speed, 4));
      });
    },

    addTrack: (type: Track['type']) => {
      set((state) => {
        if (state.timeline) {
          const index = state.timeline.tracks.length;
          const track: Track = {
            ...createDefaultTrack(type, index),
            id: generateId(),
          };
          state.timeline.tracks.push(track);
        }
      });
    },

    removeTrack: (trackId: string) => {
      set((state) => {
        if (state.timeline) {
          state.timeline.tracks = state.timeline.tracks.filter((t) => t.id !== trackId);
          // Reindex tracks
          state.timeline.tracks.forEach((track, index) => {
            track.index = index;
          });
        }
      });
    },

    addClip: (trackId: string, clipData: Omit<Clip, 'id'>) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (track) {
            const clip: Clip = {
              ...clipData,
              id: generateId(),
            };
            track.clips.push(clip);
            
            // Update timeline duration if needed
            const clipEnd = clip.startTime + clip.duration;
            if (clipEnd > state.timeline.duration) {
              state.timeline.duration = clipEnd;
            }
          }
        }
      });
    },

    removeClip: (clipId: string) => {
      set((state) => {
        if (state.timeline) {
          for (const track of state.timeline.tracks) {
            track.clips = track.clips.filter((c) => c.id !== clipId);
          }
        }
      });
    },

    updateClip: (clipId: string, updates: Partial<Clip>) => {
      set((state) => {
        if (state.timeline) {
          for (const track of state.timeline.tracks) {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
              Object.assign(clip, updates);
              break;
            }
          }
        }
      });
    },

    moveClip: (clipId: string, trackId: string, startTime: number) => {
      set((state) => {
        if (state.timeline) {
          // Find and remove clip from current track
          let clip: Clip | undefined;
          for (const track of state.timeline.tracks) {
            const index = track.clips.findIndex((c) => c.id === clipId);
            if (index !== -1) {
              clip = track.clips.splice(index, 1)[0];
              break;
            }
          }

          // Add to new track
          if (clip) {
            const newTrack = state.timeline.tracks.find((t) => t.id === trackId);
            if (newTrack) {
              clip.trackId = trackId;
              clip.startTime = startTime;
              newTrack.clips.push(clip);
            }
          }
        }
      });
    },

    selectClips: (clipIds: string[]) => {
      set((state) => {
        state.selectedClips = clipIds;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedClips = [];
        state.selectedTracks = [];
      });
    },

    addMarker: (markerData: Omit<Marker, 'id'>) => {
      set((state) => {
        if (state.timeline) {
          const marker: Marker = {
            ...markerData,
            id: generateId(),
          };
          state.timeline.markers.push(marker);
        }
      });
    },

    removeMarker: (markerId: string) => {
      set((state) => {
        if (state.timeline) {
          state.timeline.markers = state.timeline.markers.filter((m) => m.id !== markerId);
        }
      });
    },

    setActiveTool: (tool: TimelineState['activeTool']) => {
      set((state) => {
        state.activeTool = tool;
      });
    },

    zoomIn: () => {
      set((state) => {
        state.zoomLevel = Math.min(state.zoomLevel * 1.5, 10000);
      });
    },

    zoomOut: () => {
      set((state) => {
        state.zoomLevel = Math.max(state.zoomLevel / 1.5, 10);
      });
    },

    setZoomLevel: (level: number) => {
      set((state) => {
        state.zoomLevel = Math.max(10, Math.min(level, 10000));
      });
    },

    scroll: (position: number) => {
      set((state) => {
        state.scrollPosition = Math.max(0, position);
      });
    },

    toggleSnapping: () => {
      set((state) => {
        if (state.timeline) {
          state.timeline.snapping.enabled = !state.timeline.snapping.enabled;
        }
      });
    },

    getSnapPoints: () => {
      const { timeline } = get();
      if (!timeline) return [];

      const points: number[] = [
        0, // Start of timeline
        timeline.playhead, // Playhead position
        timeline.duration, // End of timeline
      ];

      // Add marker positions
      for (const marker of timeline.markers) {
        points.push(marker.time);
      }

      // Add clip start and end positions
      for (const track of timeline.tracks) {
        for (const clip of track.clips) {
          points.push(clip.startTime);
          points.push(clip.startTime + clip.duration);
        }
      }

      // Remove duplicates and sort
      return [...new Set(points)].sort((a, b) => a - b);
    },

    findNearestSnapPoint: (time: number, threshold: number) => {
      const { timeline } = get();
      if (!timeline || !timeline.snapping.enabled) return null;

      const snapPoints = get().getSnapPoints();
      let nearest: number | null = null;
      let minDistance = threshold;

      for (const point of snapPoints) {
        const distance = Math.abs(point - time);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = point;
        }
      }

      return nearest;
    },

    duplicateClip: (trackId: string, clipId: string) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (!track) return;

          const clip = track.clips.find((c) => c.id === clipId);
          if (!clip) return;

          // Create duplicate with new ID and offset position
          const duplicate: Clip = {
            ...clip,
            id: generateId(),
            startTime: clip.startTime + clip.duration, // Place after original
          };

          track.clips.push(duplicate);

          // Update timeline duration if needed
          const clipEnd = duplicate.startTime + duplicate.duration;
          if (clipEnd > state.timeline.duration) {
            state.timeline.duration = clipEnd;
          }
        }
      });
    },

    copyClips: (clipIds: string[]) => {
      const { timeline } = get();
      if (!timeline) return [];

      const clips: Clip[] = [];
      for (const track of timeline.tracks) {
        for (const clip of track.clips) {
          if (clipIds.includes(clip.id)) {
            clips.push({ ...clip });
          }
        }
      }
      return clips;
    },

    pasteClips: (clips: Clip[], trackId?: string) => {
      set((state) => {
        if (!state.timeline || clips.length === 0) return;

        // Find the earliest clip start time to calculate offset
        const minStartTime = Math.min(...clips.map((c) => c.startTime));
        const offset = state.timeline.playhead - minStartTime;

        for (const clipData of clips) {
          // Determine target track
          let targetTrack: Track | undefined;
          
          if (trackId) {
            targetTrack = state.timeline.tracks.find((t) => t.id === trackId);
          } else {
            // Try to find track with same type as original
            const originalTrack = state.timeline.tracks.find((t) =>
              t.clips.some((c) => c.id === clipData.id)
            );
            if (originalTrack) {
              targetTrack = state.timeline.tracks.find(
                (t) => t.type === originalTrack.type
              );
            }
          }

          if (!targetTrack) {
            // Default to first track of appropriate type
            targetTrack = state.timeline.tracks[0];
          }

          if (targetTrack) {
            const newClip: Clip = {
              ...clipData,
              id: generateId(),
              startTime: clipData.startTime + offset,
            };

            targetTrack.clips.push(newClip);

            // Update timeline duration if needed
            const clipEnd = newClip.startTime + newClip.duration;
            if (clipEnd > state.timeline.duration) {
              state.timeline.duration = clipEnd;
            }
          }
        }
      });
    },

    toggleTrackMute: (trackId: string) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (track) {
            track.muted = !track.muted;
          }
        }
      });
    },

    toggleTrackLock: (trackId: string) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (track) {
            track.locked = !track.locked;
          }
        }
      });
    },

    toggleTrackSolo: (trackId: string) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (!track) return;

          // If this track is already solo, unsolo it
          if (track.solo) {
            track.solo = false;
            // Unmute all tracks
            state.timeline.tracks.forEach((t) => {
              t.muted = false;
            });
          } else {
            // Solo this track and mute others
            state.timeline.tracks.forEach((t) => {
              if (t.id === trackId) {
                t.solo = true;
                t.muted = false;
              } else {
                t.solo = false;
                t.muted = true;
              }
            });
          }
        }
      });
    },

    toggleTrackVisibility: (trackId: string) => {
      set((state) => {
        if (state.timeline) {
          const track = state.timeline.tracks.find((t) => t.id === trackId);
          if (track) {
            track.visible = !track.visible;
          }
        }
      });
    },

    checkClipOverlap: (trackId: string, clipId: string, startTime: number, duration: number) => {
      const { timeline } = get();
      if (!timeline) return false;

      const track = timeline.tracks.find((t) => t.id === trackId);
      if (!track) return false;

      const endTime = startTime + duration;

      // Check if this clip overlaps with any other clip on the same track
      for (const clip of track.clips) {
        // Skip the clip we're checking (for updates)
        if (clip.id === clipId) continue;

        const clipEnd = clip.startTime + clip.duration;

        // Check for overlap
        if (
          (startTime >= clip.startTime && startTime < clipEnd) ||
          (endTime > clip.startTime && endTime <= clipEnd) ||
          (startTime <= clip.startTime && endTime >= clipEnd)
        ) {
          return true; // Overlap detected
        }
      }

      return false; // No overlap
    },

    findAvailableSpace: (trackId: string, duration: number, preferredTime: number = 0) => {
      const { timeline } = get();
      if (!timeline) return preferredTime;

      const track = timeline.tracks.find((t) => t.id === trackId);
      if (!track || track.clips.length === 0) return preferredTime;

      // Sort clips by start time
      const sortedClips = [...track.clips].sort((a, b) => a.startTime - b.startTime);

      // Try preferred time first
      if (!get().checkClipOverlap(trackId, '', preferredTime, duration)) {
        return preferredTime;
      }

      // Find gaps between clips
      for (let i = 0; i < sortedClips.length - 1; i++) {
        const currentClipEnd = sortedClips[i].startTime + sortedClips[i].duration;
        const nextClipStart = sortedClips[i + 1].startTime;
        const gap = nextClipStart - currentClipEnd;

        if (gap >= duration) {
          return currentClipEnd;
        }
      }

      // No gap found, place at end
      const lastClip = sortedClips[sortedClips.length - 1];
      return lastClip.startTime + lastClip.duration;
    },

    rippleEdit: (trackId: string, fromTime: number, delta: number) => {
      set((state) => {
        if (!state.timeline) return;

        const track = state.timeline.tracks.find((t) => t.id === trackId);
        if (!track) return;

        // Move all clips that start at or after fromTime
        for (const clip of track.clips) {
          if (clip.startTime >= fromTime) {
            clip.startTime = Math.max(0, clip.startTime + delta);
          }
        }

        // Update timeline duration
        const maxEnd = Math.max(
          ...state.timeline.tracks.flatMap((t) =>
            t.clips.map((c) => c.startTime + c.duration)
          ),
          state.timeline.duration
        );
        state.timeline.duration = maxEnd;
      });
    },

    rippleDelete: (trackId: string, clipId: string) => {
      set((state) => {
        if (!state.timeline) return;

        const track = state.timeline.tracks.find((t) => t.id === trackId);
        if (!track) return;

        const clip = track.clips.find((c) => c.id === clipId);
        if (!clip) return;

        const clipDuration = clip.duration;
        const clipStartTime = clip.startTime;

        // Remove the clip
        track.clips = track.clips.filter((c) => c.id !== clipId);

        // Move all clips after this one backward by the clip's duration
        for (const c of track.clips) {
          if (c.startTime > clipStartTime) {
            c.startTime = Math.max(0, c.startTime - clipDuration);
          }
        }

        // Update timeline duration
        const maxEnd = Math.max(
          ...state.timeline.tracks.flatMap((t) =>
            t.clips.map((c) => c.startTime + c.duration)
          ),
          0
        );
        state.timeline.duration = Math.max(maxEnd, 60); // Minimum 60 seconds
      });
    },

    toggleRippleMode: () => {
      set((state) => {
        state.rippleMode = !state.rippleMode;
      });
    },

    splitClip: (clipId: string, splitTime: number) => {
      set((state) => {
        if (!state.timeline) return;

        // Find the clip and its track
        let targetTrack: Track | undefined;
        let targetClip: Clip | undefined;

        for (const track of state.timeline.tracks) {
          const clip = track.clips.find((c) => c.id === clipId);
          if (clip) {
            targetTrack = track;
            targetClip = clip;
            break;
          }
        }

        if (!targetTrack || !targetClip) return;

        // Check if split time is within clip bounds
        const clipEnd = targetClip.startTime + targetClip.duration;
        if (splitTime <= targetClip.startTime || splitTime >= clipEnd) {
          return; // Split time is outside clip
        }

        // Calculate durations for the two new clips
        const firstDuration = splitTime - targetClip.startTime;
        const secondDuration = targetClip.duration - firstDuration;

        // Create the second clip (right side)
        const secondClip: Clip = {
          ...targetClip,
          id: generateId(),
          startTime: splitTime,
          duration: secondDuration,
          trimStart: targetClip.trimStart + firstDuration,
          trimEnd: targetClip.trimEnd,
        };

        // Update the first clip (left side)
        targetClip.duration = firstDuration;
        targetClip.trimEnd = targetClip.trimStart + firstDuration;

        // Add the second clip to the track
        targetTrack.clips.push(secondClip);

        console.log(`Split clip "${targetClip.name}" at ${splitTime.toFixed(2)}s`);
      });
    },

    splitClipsAtPlayhead: () => {
      const { timeline } = get();
      if (!timeline) return;

      const playhead = timeline.playhead;
      const clipsToSplit: string[] = [];

      // Find all clips that intersect with the playhead
      for (const track of timeline.tracks) {
        if (track.locked) continue; // Skip locked tracks

        for (const clip of track.clips) {
          const clipEnd = clip.startTime + clip.duration;
          if (clip.startTime < playhead && playhead < clipEnd) {
            clipsToSplit.push(clip.id);
          }
        }
      }

      // Split all clips
      clipsToSplit.forEach((clipId) => {
        get().splitClip(clipId, playhead);
      });

      if (clipsToSplit.length > 0) {
        console.log(`Split ${clipsToSplit.length} clip(s) at playhead (${playhead.toFixed(2)}s)`);
      }
    },
  }))
);

/**
 * Selectors for common timeline queries
 */
export const timelineSelectors = {
  /** Get current playhead time */
  getPlayhead: (state: TimelineState) => state.timeline?.playhead ?? 0,
  
  /** Get timeline duration */
  getDuration: (state: TimelineState) => state.timeline?.duration ?? 0,
  
  /** Check if playing */
  isPlaying: (state: TimelineState) => state.playing,
  
  /** Get selected clips */
  getSelectedClips: (state: TimelineState) => state.selectedClips,
  
  /** Get all tracks */
  getTracks: (state: TimelineState) => state.timeline?.tracks ?? [],
  
  /** Get clips at time */
  getClipsAtTime: (state: TimelineState, time: number) => {
    if (!state.timeline) return [];
    
    const clips: Clip[] = [];
    for (const track of state.timeline.tracks) {
      for (const clip of track.clips) {
        if (clip.startTime <= time && clip.startTime + clip.duration >= time) {
          clips.push(clip);
        }
      }
    }
    return clips;
  },
};
