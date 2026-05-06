/**
 * History state management (Undo/Redo)
 * @module store/history
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Command interface for undo/redo operations
 */
export interface Command {
  /** Unique identifier */
  id: string;
  /** Command name/description */
  name: string;
  /** Execute the command */
  execute: () => void;
  /** Undo the command */
  undo: () => void;
  /** Timestamp */
  timestamp: number;
}

/**
 * History store state
 */
interface HistoryState {
  /** Command history stack */
  history: Command[];
  /** Current position in history */
  currentIndex: number;
  /** Maximum history size */
  maxHistorySize: number;
  /** Whether currently executing a command */
  isExecuting: boolean;
}

/**
 * History store actions
 */
interface HistoryActions {
  /** Execute a command and add to history */
  executeCommand: (command: Omit<Command, 'id' | 'timestamp'>) => void;
  /** Undo last command */
  undo: () => void;
  /** Redo next command */
  redo: () => void;
  /** Clear all history */
  clearHistory: () => void;
  /** Check if can undo */
  canUndo: () => boolean;
  /** Check if can redo */
  canRedo: () => boolean;
  /** Get undo description */
  getUndoDescription: () => string | null;
  /** Get redo description */
  getRedoDescription: () => string | null;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * History store
 */
export const useHistoryStore = create<HistoryState & HistoryActions>()(
  immer((set, get) => ({
    // Initial state
    history: [],
    currentIndex: -1,
    maxHistorySize: 200,
    isExecuting: false,

    // Actions
    executeCommand: (commandData) => {
      const { isExecuting } = get();
      
      // Prevent recursive command execution
      if (isExecuting) return;

      set((state) => {
        state.isExecuting = true;
      });

      try {
        const command: Command = {
          ...commandData,
          id: generateId(),
          timestamp: Date.now(),
        };

        // Execute the command
        command.execute();

        set((state) => {
          // Remove any commands after current index (when undoing then doing new action)
          state.history = state.history.slice(0, state.currentIndex + 1);

          // Add new command
          state.history.push(command);

          // Limit history size
          if (state.history.length > state.maxHistorySize) {
            state.history.shift();
          } else {
            state.currentIndex++;
          }

          state.isExecuting = false;
        });
      } catch (error) {
        console.error('Command execution failed:', error);
        set((state) => {
          state.isExecuting = false;
        });
      }
    },

    undo: () => {
      const { history, currentIndex, isExecuting } = get();

      if (isExecuting || currentIndex < 0) return;

      set((state) => {
        state.isExecuting = true;
      });

      try {
        const command = history[currentIndex];
        command.undo();

        set((state) => {
          state.currentIndex--;
          state.isExecuting = false;
        });

        console.log(`Undid: ${command.name}`);
      } catch (error) {
        console.error('Undo failed:', error);
        set((state) => {
          state.isExecuting = false;
        });
      }
    },

    redo: () => {
      const { history, currentIndex, isExecuting } = get();

      if (isExecuting || currentIndex >= history.length - 1) return;

      set((state) => {
        state.isExecuting = true;
      });

      try {
        const command = history[currentIndex + 1];
        command.execute();

        set((state) => {
          state.currentIndex++;
          state.isExecuting = false;
        });

        console.log(`Redid: ${command.name}`);
      } catch (error) {
        console.error('Redo failed:', error);
        set((state) => {
          state.isExecuting = false;
        });
      }
    },

    clearHistory: () => {
      set((state) => {
        state.history = [];
        state.currentIndex = -1;
      });
    },

    canUndo: () => {
      const { currentIndex, isExecuting } = get();
      return !isExecuting && currentIndex >= 0;
    },

    canRedo: () => {
      const { history, currentIndex, isExecuting } = get();
      return !isExecuting && currentIndex < history.length - 1;
    },

    getUndoDescription: () => {
      const { history, currentIndex } = get();
      if (currentIndex < 0) return null;
      return history[currentIndex].name;
    },

    getRedoDescription: () => {
      const { history, currentIndex } = get();
      if (currentIndex >= history.length - 1) return null;
      return history[currentIndex + 1].name;
    },
  }))
);
