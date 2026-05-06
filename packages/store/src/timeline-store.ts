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
