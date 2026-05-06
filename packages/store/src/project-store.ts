/**
 * Project state management
 * @module store/project
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { OmniCutProject, ProjectSettings } from '@omnicut/core';
import { generateId, createDefaultProject } from '@omnicut/core';

/**
 * Project store state
 */
interface ProjectState {
  /** Current project (null if no project loaded) */
  project: OmniCutProject | null;
  /** Whether project has unsaved changes */
  isDirty: boolean;
  /** Project file path (null for new projects) */
  filePath: string | null;
  /** Auto-save enabled */
  autoSaveEnabled: boolean;
  /** Last save timestamp */
  lastSaved: Date | null;
}

/**
 * Project store actions
 */
interface ProjectActions {
  /** Create a new project */
  createProject: (name: string) => void;
  /** Load a project from file */
  loadProject: (project: OmniCutProject, filePath: string) => void;
  /** Save the current project */
  saveProject: () => Promise<void>;
  /** Update project settings */
  updateSettings: (settings: Partial<ProjectSettings>) => void;
  /** Update project metadata */
  updateMetadata: (metadata: Record<string, unknown>) => void;
  /** Mark project as dirty (has unsaved changes) */
  markDirty: () => void;
  /** Mark project as clean (no unsaved changes) */
  markClean: () => void;
  /** Close the current project */
  closeProject: () => void;
  /** Toggle auto-save */
  toggleAutoSave: () => void;
}

/**
 * Project store
 */
export const useProjectStore = create<ProjectState & ProjectActions>()(
  immer((set, get) => ({
    // Initial state
    project: null,
    isDirty: false,
    filePath: null,
    autoSaveEnabled: true,
    lastSaved: null,

    // Actions
    createProject: (name: string) => {
      const now = new Date();
      const project: OmniCutProject = {
        ...createDefaultProject(name),
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        state.project = project;
        state.isDirty = true;
        state.filePath = null;
        state.lastSaved = null;
      });
    },

    loadProject: (project: OmniCutProject, filePath: string) => {
      set((state) => {
        state.project = project;
        state.isDirty = false;
        state.filePath = filePath;
        state.lastSaved = new Date();
      });
    },

    saveProject: async () => {
      const { project, filePath } = get();
      if (!project) return;

      // TODO: Implement actual file saving
      // For now, just mark as clean
      set((state) => {
        if (state.project) {
          state.project.updatedAt = new Date();
        }
        state.isDirty = false;
        state.lastSaved = new Date();
      });

      console.log('Project saved:', filePath || 'untitled');
    },

    updateSettings: (settings: Partial<ProjectSettings>) => {
      set((state) => {
        if (state.project) {
          state.project.settings = {
            ...state.project.settings,
            ...settings,
          };
          state.project.updatedAt = new Date();
          state.isDirty = true;
        }
      });
    },

    updateMetadata: (metadata: Record<string, unknown>) => {
      set((state) => {
        if (state.project) {
          state.project.metadata = {
            ...state.project.metadata,
            ...metadata,
          };
          state.project.updatedAt = new Date();
          state.isDirty = true;
        }
      });
    },

    markDirty: () => {
      set((state) => {
        state.isDirty = true;
      });
    },

    markClean: () => {
      set((state) => {
        state.isDirty = false;
      });
    },

    closeProject: () => {
      set((state) => {
        state.project = null;
        state.isDirty = false;
        state.filePath = null;
        state.lastSaved = null;
      });
    },

    toggleAutoSave: () => {
      set((state) => {
        state.autoSaveEnabled = !state.autoSaveEnabled;
      });
    },
  }))
);

/**
 * Selectors for common project queries
 */
export const projectSelectors = {
  /** Get project name */
  getName: (state: ProjectState) => state.project?.name ?? 'Untitled',
  
  /** Get project settings */
  getSettings: (state: ProjectState) => state.project?.settings,
  
  /** Check if project is loaded */
  isLoaded: (state: ProjectState) => state.project !== null,
  
  /** Check if project needs saving */
  needsSaving: (state: ProjectState) => state.isDirty,
  
  /** Get project resolution */
  getResolution: (state: ProjectState) => state.project?.settings.resolution,
  
  /** Get project frame rate */
  getFrameRate: (state: ProjectState) => state.project?.settings.frameRate,
};
