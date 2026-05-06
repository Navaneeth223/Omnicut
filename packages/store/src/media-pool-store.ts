/**
 * Media pool state management
 * @module store/media-pool
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { MediaPool, MediaItem, MediaBin, SmartBin } from '@omnicut/core';
import { generateId, createDefaultBin } from '@omnicut/core';

/**
 * Media pool store state
 */
interface MediaPoolState {
  /** Media pool data */
  mediaPool: MediaPool | null;
  /** Selected media item IDs */
  selectedItems: string[];
  /** Current bin ID (null = root) */
  currentBinId: string | null;
  /** View mode */
  viewMode: 'grid' | 'list' | 'filmstrip';
  /** Sort by */
  sortBy: 'name' | 'dateImported' | 'duration' | 'size' | 'rating';
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Search query */
  searchQuery: string;
  /** Filter by type */
  filterType: 'all' | 'video' | 'audio' | 'image';
}

/**
 * Media pool store actions
 */
interface MediaPoolActions {
  /** Initialize media pool */
  initMediaPool: (mediaPool: MediaPool) => void;
  /** Add media item */
  addMediaItem: (item: MediaItem) => void;
  /** Add multiple media items */
  addMediaItems: (items: MediaItem[]) => void;
  /** Remove media item */
  removeMediaItem: (itemId: string) => void;
  /** Update media item */
  updateMediaItem: (itemId: string, updates: Partial<MediaItem>) => void;
  /** Select items */
  selectItems: (itemIds: string[]) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Create bin */
  createBin: (name: string, parentId?: string) => void;
  /** Remove bin */
  removeBin: (binId: string) => void;
  /** Move items to bin */
  moveItemsToBin: (itemIds: string[], binId: string) => void;
  /** Set current bin */
  setCurrentBin: (binId: string | null) => void;
  /** Set view mode */
  setViewMode: (mode: MediaPoolState['viewMode']) => void;
  /** Set sort */
  setSort: (sortBy: MediaPoolState['sortBy'], direction: MediaPoolState['sortDirection']) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set filter type */
  setFilterType: (type: MediaPoolState['filterType']) => void;
  /** Increment usage count */
  incrementUsageCount: (itemId: string) => void;
}

/**
 * Media pool store
 */
export const useMediaPoolStore = create<MediaPoolState & MediaPoolActions>()(
  immer((set, get) => ({
    // Initial state
    mediaPool: null,
    selectedItems: [],
    currentBinId: null,
    viewMode: 'grid',
    sortBy: 'dateImported',
    sortDirection: 'desc',
    searchQuery: '',
    filterType: 'all',

    // Actions
    initMediaPool: (mediaPool: MediaPool) => {
      set((state) => {
        state.mediaPool = mediaPool;
      });
    },

    addMediaItem: (item: MediaItem) => {
      set((state) => {
        if (state.mediaPool) {
          state.mediaPool.items.push(item);
          
          // Add to current bin if one is selected
          if (state.currentBinId) {
            const bin = state.mediaPool.bins.find((b) => b.id === state.currentBinId);
            if (bin) {
              bin.itemIds.push(item.id);
            }
          }
        }
      });
    },

    addMediaItems: (items: MediaItem[]) => {
      set((state) => {
        if (state.mediaPool) {
          state.mediaPool.items.push(...items);
          
          // Add to current bin if one is selected
          if (state.currentBinId) {
            const bin = state.mediaPool.bins.find((b) => b.id === state.currentBinId);
            if (bin) {
              bin.itemIds.push(...items.map((item) => item.id));
            }
          }
        }
      });
    },

    removeMediaItem: (itemId: string) => {
      set((state) => {
        if (state.mediaPool) {
          // Remove from items
          state.mediaPool.items = state.mediaPool.items.filter((item) => item.id !== itemId);
          
          // Remove from all bins
          for (const bin of state.mediaPool.bins) {
            bin.itemIds = bin.itemIds.filter((id) => id !== itemId);
          }
          
          // Remove from selection
          state.selectedItems = state.selectedItems.filter((id) => id !== itemId);
        }
      });
    },

    updateMediaItem: (itemId: string, updates: Partial<MediaItem>) => {
      set((state) => {
        if (state.mediaPool) {
          const item = state.mediaPool.items.find((item) => item.id === itemId);
          if (item) {
            Object.assign(item, updates);
          }
        }
      });
    },

    selectItems: (itemIds: string[]) => {
      set((state) => {
        state.selectedItems = itemIds;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedItems = [];
      });
    },

    createBin: (name: string, parentId?: string) => {
      set((state) => {
        if (state.mediaPool) {
          const bin: MediaBin = {
            ...createDefaultBin(name, parentId),
            id: generateId(),
            createdAt: new Date(),
          };
          state.mediaPool.bins.push(bin);
        }
      });
    },

    removeBin: (binId: string) => {
      set((state) => {
        if (state.mediaPool) {
          // Remove bin and all child bins
          const binsToRemove = [binId];
          let i = 0;
          while (i < binsToRemove.length) {
            const currentBinId = binsToRemove[i];
            const childBins = state.mediaPool.bins.filter((b) => b.parentId === currentBinId);
            binsToRemove.push(...childBins.map((b) => b.id));
            i++;
          }
          
          state.mediaPool.bins = state.mediaPool.bins.filter(
            (bin) => !binsToRemove.includes(bin.id)
          );
          
          // Clear current bin if it was removed
          if (state.currentBinId && binsToRemove.includes(state.currentBinId)) {
            state.currentBinId = null;
          }
        }
      });
    },

    moveItemsToBin: (itemIds: string[], binId: string) => {
      set((state) => {
        if (state.mediaPool) {
          const bin = state.mediaPool.bins.find((b) => b.id === binId);
          if (bin) {
            // Remove from all bins
            for (const b of state.mediaPool.bins) {
              b.itemIds = b.itemIds.filter((id) => !itemIds.includes(id));
            }
            
            // Add to target bin
            bin.itemIds.push(...itemIds);
          }
        }
      });
    },

    setCurrentBin: (binId: string | null) => {
      set((state) => {
        state.currentBinId = binId;
      });
    },

    setViewMode: (mode: MediaPoolState['viewMode']) => {
      set((state) => {
        state.viewMode = mode;
      });
    },

    setSort: (sortBy: MediaPoolState['sortBy'], direction: MediaPoolState['sortDirection']) => {
      set((state) => {
        state.sortBy = sortBy;
        state.sortDirection = direction;
      });
    },

    setSearchQuery: (query: string) => {
      set((state) => {
        state.searchQuery = query;
      });
    },

    setFilterType: (type: MediaPoolState['filterType']) => {
      set((state) => {
        state.filterType = type;
      });
    },

    incrementUsageCount: (itemId: string) => {
      set((state) => {
        if (state.mediaPool) {
          const item = state.mediaPool.items.find((item) => item.id === itemId);
          if (item) {
            item.usageCount++;
          }
        }
      });
    },
  }))
);

/**
 * Selectors for common media pool queries
 */
export const mediaPoolSelectors = {
  /** Get all items */
  getAllItems: (state: MediaPoolState) => state.mediaPool?.items ?? [],
  
  /** Get items in current bin */
  getCurrentBinItems: (state: MediaPoolState) => {
    if (!state.mediaPool) return [];
    
    if (!state.currentBinId) {
      // Root: items not in any bin
      const itemsInBins = new Set(
        state.mediaPool.bins.flatMap((bin) => bin.itemIds)
      );
      return state.mediaPool.items.filter((item) => !itemsInBins.has(item.id));
    }
    
    const bin = state.mediaPool.bins.find((b) => b.id === state.currentBinId);
    if (!bin) return [];
    
    return state.mediaPool.items.filter((item) => bin.itemIds.includes(item.id));
  },
  
  /** Get filtered and sorted items */
  getFilteredItems: (state: MediaPoolState) => {
    let items = mediaPoolSelectors.getCurrentBinItems(state);
    
    // Apply type filter
    if (state.filterType !== 'all') {
      items = items.filter((item) => item.type === state.filterType);
    }
    
    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sort
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dateImported':
          comparison = a.importedAt.getTime() - b.importedAt.getTime();
          break;
        case 'duration':
          comparison = (a.duration ?? 0) - (b.duration ?? 0);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return state.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return items;
  },
  
  /** Get selected items */
  getSelectedItems: (state: MediaPoolState) => {
    if (!state.mediaPool) return [];
    return state.mediaPool.items.filter((item) => state.selectedItems.includes(item.id));
  },
};
