/**
 * Media Pool Component
 */

import { useState, useCallback } from 'react';
import { useMediaPoolStore, mediaPoolSelectors } from '@omnicut/store';
import { createMediaImporter } from '@omnicut/media-engine';
import { useToast } from '../../hooks/useToast';
import { Spinner } from '../Loading/Loading';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { ImportDialog } from './ImportDialog';
import './MediaPool.css';

const mediaImporter = createMediaImporter();

export function MediaPool() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  const toast = useToast();

  const viewMode = useMediaPoolStore((state) => state.viewMode);
  const searchQuery = useMediaPoolStore((state) => state.searchQuery);
  const filterType = useMediaPoolStore((state) => state.filterType);
  const items = useMediaPoolStore(mediaPoolSelectors.getFilteredItems);
  
  const setViewMode = useMediaPoolStore((state) => state.setViewMode);
  const setSearchQuery = useMediaPoolStore((state) => state.setSearchQuery);
  const setFilterType = useMediaPoolStore((state) => state.setFilterType);
  const addMediaItems = useMediaPoolStore((state) => state.addMediaItems);

  /**
   * Handle file import
   */
  const handleImport = useCallback(async (files: File[]) => {
    setImporting(true);
    setImportProgress({ current: 0, total: files.length });
    toast.info(`Importing ${files.length} file${files.length > 1 ? 's' : ''}...`);

    try {
      const results = await mediaImporter.importFiles(
        files,
        {
          generateThumbnail: true,
          generateWaveform: true,
        },
        (current, total) => {
          setImportProgress({ current, total });
        }
      );

      // Add successfully imported items
      const successfulItems = results
        .filter((result) => result.item && result.errors.length === 0)
        .map((result) => result.item);

      if (successfulItems.length > 0) {
        addMediaItems(successfulItems);
        toast.success(`Successfully imported ${successfulItems.length} file${successfulItems.length > 1 ? 's' : ''}!`);
      }

      // Show errors if any
      const errors = results.filter((result) => result.errors.length > 0);
      if (errors.length > 0) {
        console.error('Import errors:', errors);
        toast.error(`Failed to import ${errors.length} file${errors.length > 1 ? 's' : ''}`);
      }

      // If all failed
      if (successfulItems.length === 0 && errors.length > 0) {
        toast.error('All files failed to import');
      }
    } catch (error) {
      console.error('Import failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Import failed: ${errorMessage}`);
    } finally {
      setImporting(false);
      setShowImportDialog(false);
    }
  }, [addMediaItems, toast]);

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleImport(files);
      }
    },
    [handleImport]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className="media-pool" 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <div className="media-pool__header">
        <h2 className="media-pool__title">Media Pool</h2>
        <div className="media-pool__actions">
          <button
            className="icon-button"
            onClick={() => setShowImportDialog(true)}
            title="Import Media"
          >
            📁
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="media-pool__toolbar">
        {/* Search */}
        <input
          type="search"
          className="media-pool__search"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter */}
        <select
          className="media-pool__filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="image">Image</option>
        </select>

        {/* View Mode */}
        <div className="media-pool__view-mode">
          <button
            className={`icon-button ${viewMode === 'grid' ? 'icon-button--active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            ⊞
          </button>
          <button
            className={`icon-button ${viewMode === 'list' ? 'icon-button--active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="media-pool__content">
        {importing ? (
          <div className="media-pool__importing">
            <Spinner size="large" />
            <p>
              Importing {importProgress.current} of {importProgress.total}...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📁</div>
            <p className="empty-state__text">No media imported</p>
            <p className="empty-state__hint">
              Drag files here or click Import Media
            </p>
            <button
              className="button button--primary"
              onClick={() => setShowImportDialog(true)}
            >
              Import Media
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <MediaGrid items={items} />
        ) : (
          <MediaList items={items} />
        )}
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <ImportDialog
          onImport={handleImport}
          onClose={() => setShowImportDialog(false)}
        />
      )}
    </div>
  );
}
