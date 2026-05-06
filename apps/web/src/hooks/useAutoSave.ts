/**
 * Auto-Save Hook
 * Automatically saves project at regular intervals
 */

import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@omnicut/store';

interface AutoSaveOptions {
  /** Auto-save interval in milliseconds (default: 30000 = 30 seconds) */
  interval?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
  /** Callback when save occurs */
  onSave?: () => void;
  /** Callback when save fails */
  onError?: (error: Error) => void;
}

interface AutoSaveState {
  /** Whether auto-save is currently enabled */
  enabled: boolean;
  /** Last save timestamp */
  lastSaveTime: number | null;
  /** Whether currently saving */
  isSaving: boolean;
  /** Last save error */
  lastError: Error | null;
}

export function useAutoSave(options: AutoSaveOptions = {}) {
  const {
    interval = 30000, // 30 seconds
    enabled: initialEnabled = true,
    onSave,
    onError,
  } = options;

  const [state, setState] = useState<AutoSaveState>({
    enabled: initialEnabled,
    lastSaveTime: null,
    isSaving: false,
    lastError: null,
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const project = useProjectStore((state) => state.project);
  const isDirty = useProjectStore((state) => state.isDirty);
  const saveProject = useProjectStore((state) => state.saveProject);

  /**
   * Perform save operation
   */
  const performSave = async () => {
    if (!project || !isDirty || state.isSaving) return;

    setState((prev) => ({ ...prev, isSaving: true, lastError: null }));

    try {
      // Save project
      await saveProject();

      setState((prev) => ({
        ...prev,
        isSaving: false,
        lastSaveTime: Date.now(),
      }));

      if (onSave) {
        onSave();
      }

      console.log('Auto-save: Project saved successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Save failed');
      
      setState((prev) => ({
        ...prev,
        isSaving: false,
        lastError: err,
      }));

      if (onError) {
        onError(err);
      }

      console.error('Auto-save: Failed to save project', err);
    }
  };

  /**
   * Enable auto-save
   */
  const enable = () => {
    setState((prev) => ({ ...prev, enabled: true }));
  };

  /**
   * Disable auto-save
   */
  const disable = () => {
    setState((prev) => ({ ...prev, enabled: false }));
  };

  /**
   * Toggle auto-save
   */
  const toggle = () => {
    setState((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  /**
   * Manually trigger save
   */
  const saveNow = () => {
    performSave();
  };

  /**
   * Get time since last save
   */
  const getTimeSinceLastSave = (): number | null => {
    if (!state.lastSaveTime) return null;
    return Date.now() - state.lastSaveTime;
  };

  /**
   * Format time since last save
   */
  const formatTimeSinceLastSave = (): string => {
    const time = getTimeSinceLastSave();
    if (time === null) return 'Never';

    const seconds = Math.floor(time / 1000);
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Set up auto-save interval
  useEffect(() => {
    if (!state.enabled || !project) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (isDirty) {
        performSave();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.enabled, project, isDirty, interval]);

  // Save on unmount if dirty
  useEffect(() => {
    return () => {
      if (isDirty && project) {
        // Use timeout to allow async save
        saveTimeoutRef.current = setTimeout(() => {
          saveProject();
        }, 0);
      }
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    enable,
    disable,
    toggle,
    saveNow,
    getTimeSinceLastSave,
    formatTimeSinceLastSave,
  };
}
