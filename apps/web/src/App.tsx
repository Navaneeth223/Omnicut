/**
 * Main Application Component - Complete Integration
 */

import { useEffect, useState } from 'react';
import { useProjectStore, useTimelineStore, useMediaPoolStore, useHistoryStore } from '@omnicut/store';
import { VERSION, createDefaultProject, generateId } from '@omnicut/core';
import { MediaPool } from './components/MediaPool/MediaPool';
import { Timeline } from './components/Timeline/Timeline';
import { ExportDialog } from './components/Export/ExportDialog';
import { SettingsDialog } from './components/Settings/SettingsDialog';
import { EffectsPanel } from './components/Effects/EffectsPanel';
import { usePlayback } from './hooks/usePlayback';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import './styles/App.css';

function App() {
  const [workspace, setWorkspace] = useState<'edit' | 'color' | 'audio' | 'photo'>('edit');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAutoSaveIndicator, setShowAutoSaveIndicator] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30000);

  // Project state
  const project = useProjectStore((state) => state.project);
  const createProject = useProjectStore((state) => state.createProject);
  const isDirty = useProjectStore((state) => state.isDirty);

  // Timeline state
  const timeline = useTimelineStore((state) => state.timeline);
  const playing = useTimelineStore((state) => state.playing);
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const playhead = useTimelineStore((state) => state.timeline?.playhead ?? 0);
  const initTimeline = useTimelineStore((state) => state.initTimeline);
  const addTrack = useTimelineStore((state) => state.addTrack);

  // Media pool state
  const initMediaPool = useMediaPoolStore((state) => state.initMediaPool);

  // History state
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);
  const getUndoDescription = useHistoryStore((state) => state.getUndoDescription);
  const getRedoDescription = useHistoryStore((state) => state.getRedoDescription);

  // Initialize hooks
  usePlayback();
  useKeyboardShortcuts({
    onExport: () => setShowExportDialog(true),
  });

  // Auto-save hook
  const autoSave = useAutoSave({
    interval: autoSaveInterval,
    enabled: true,
    onSave: () => {
      // Show save indicator briefly
      setShowAutoSaveIndicator(true);
      setTimeout(() => setShowAutoSaveIndicator(false), 2000);
    },
    onError: (error) => {
      console.error('Auto-save failed:', error);
    },
  });

  // Initialize default project on mount
  useEffect(() => {
    if (!project) {
      const newProject = {
        ...createDefaultProject('Untitled Project'),
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      createProject(newProject.name);
      
      // Initialize timeline with default tracks
      const newTimeline = {
        ...newProject.timeline,
        id: generateId(),
      };
      initTimeline(newTimeline);
      
      // Add default tracks
      addTrack('video');
      addTrack('video');
      addTrack('audio');
      addTrack('audio');
      
      // Initialize media pool
      initMediaPool(newProject.mediaPool);
    }
  }, [project, createProject, initTimeline, addTrack, initMediaPool]);

  // Format timecode
  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * (project?.settings.frameRate ?? 30));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      {/* Menu Bar */}
      <header className="menu-bar">
        <div className="menu-bar__left">
          <div className="logo">
            <span className="logo__icon">◆</span>
            <span className="logo__text">OmniCut</span>
            <span className="logo__version">{VERSION}</span>
          </div>
          <nav className="menu">
            <button className="menu__item">File</button>
            <button className="menu__item">Edit</button>
            <button className="menu__item">View</button>
            <button className="menu__item">Insert</button>
            <button className="menu__item">Effects</button>
            <button className="menu__item">Tools</button>
            <button className="menu__item">Help</button>
          </nav>
        </div>
        <div className="menu-bar__right">
          <button
            className="icon-button"
            onClick={undo}
            disabled={!canUndo()}
            title={`Undo ${getUndoDescription() || ''} (⌘Z)`}
          >
            ↶
          </button>
          <button
            className="icon-button"
            onClick={redo}
            disabled={!canRedo()}
            title={`Redo ${getRedoDescription() || ''} (⌘⇧Z)`}
          >
            ↷
          </button>
          <button
            className="button button--primary"
            onClick={() => setShowExportDialog(true)}
            disabled={!timeline || timeline.tracks.every((t) => t.clips.length === 0)}
            title="Export video (Cmd+E)"
          >
            Export
          </button>
          <span className="menu__item">
            {project?.name || 'No Project'}
            {isDirty && ' •'}
          </span>
          <button
            className="icon-button"
            onClick={() => setShowSettingsDialog(true)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Workspace Tabs */}
      <div className="workspace-tabs">
        <button
          className={`workspace-tab ${workspace === 'edit' ? 'workspace-tab--active' : ''}`}
          onClick={() => setWorkspace('edit')}
        >
          Edit
        </button>
        <button
          className={`workspace-tab ${workspace === 'color' ? 'workspace-tab--active' : ''}`}
          onClick={() => setWorkspace('color')}
        >
          Color
        </button>
        <button
          className={`workspace-tab ${workspace === 'audio' ? 'workspace-tab--active' : ''}`}
          onClick={() => setWorkspace('audio')}
        >
          Audio
        </button>
        <button
          className={`workspace-tab ${workspace === 'photo' ? 'workspace-tab--active' : ''}`}
          onClick={() => setWorkspace('photo')}
        >
          Photo
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="layout">
          {/* Left Panel - Media Pool */}
          <aside className="panel panel--left">
            <MediaPool />
          </aside>

          {/* Center - Viewer & Timeline */}
          <div className="center-area">
            {/* Viewer */}
            <div className="viewer-container">
              <div className="viewer">
                <div className="viewer__canvas">
                  <div className="empty-state">
                    <div className="empty-state__icon">🎬</div>
                    <p className="empty-state__text">Preview</p>
                    <p className="empty-state__hint">
                      {timeline && timeline.tracks.length > 0
                        ? 'Press Space to play'
                        : 'Add clips to timeline to preview'}
                    </p>
                  </div>
                </div>
                <div className="viewer__controls">
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().goToStart()}
                    title="Go to start (Home)"
                  >
                    ⏮
                  </button>
                  <button
                    className="icon-button"
                    onClick={() =>
                      useTimelineStore
                        .getState()
                        .stepBackward(project?.settings.frameRate ?? 30)
                    }
                    title="Step back (←)"
                  >
                    ⏪
                  </button>
                  <button
                    className="icon-button icon-button--large"
                    onClick={togglePlay}
                    title={playing ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {playing ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className="icon-button"
                    onClick={() =>
                      useTimelineStore
                        .getState()
                        .stepForward(project?.settings.frameRate ?? 30)
                    }
                    title="Step forward (→)"
                  >
                    ⏩
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().goToEnd()}
                    title="Go to end (End)"
                  >
                    ⏭
                  </button>
                  <div className="timecode">{formatTimecode(playhead)}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-container">
              <div className="timeline-toolbar">
                <div className="timeline-toolbar__left">
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().setActiveTool('select')}
                    title="Selection tool (V)"
                  >
                    ↖️
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().setActiveTool('razor')}
                    title="Razor tool (C)"
                  >
                    ✂️
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().setActiveTool('hand')}
                    title="Hand tool (H)"
                  >
                    ✋
                  </button>
                </div>
                <div className="timeline-toolbar__center">
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().zoomOut()}
                    title="Zoom out (-)"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    className="zoom-slider"
                    min="10"
                    max="1000"
                    step="10"
                    value={useTimelineStore.getState().zoomLevel}
                    onChange={(e) =>
                      useTimelineStore.getState().setZoomLevel(Number(e.target.value))
                    }
                  />
                  <button
                    className="icon-button"
                    onClick={() => useTimelineStore.getState().zoomIn()}
                    title="Zoom in (+)"
                  >
                    +
                  </button>
                </div>
                <div className="timeline-toolbar__right">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={timeline?.snapping.enabled ?? true}
                      onChange={() => useTimelineStore.getState().toggleSnapping()}
                    />
                    <span>Snapping</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={useTimelineStore.getState().rippleMode}
                      onChange={() => useTimelineStore.getState().toggleRippleMode()}
                    />
                    <span>Ripple</span>
                  </label>
                </div>
              </div>
              <Timeline />
            </div>
          </div>

          {/* Right Panel - Inspector */}
          <aside className="panel panel--right">
            <div className="panel__header">
              <h2 className="panel__title">Effects</h2>
            </div>
            <div className="panel__content panel__content--no-padding">
              <EffectsPanel />
            </div>
          </aside>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="status-bar">
        <div className="status-bar__left">
          <span className="status-item">
            {playing ? '▶️ Playing' : '⏸️ Ready'}
          </span>
          {timeline && (
            <span className="status-item">
              {timeline.tracks.filter((t) => t.clips.length > 0).length} tracks with clips
            </span>
          )}
          {autoSave.enabled && (
            <span className="status-item">
              {autoSave.isSaving ? (
                <span className="auto-save-indicator auto-save-indicator--saving">
                  💾 Saving...
                </span>
              ) : showAutoSaveIndicator ? (
                <span className="auto-save-indicator auto-save-indicator--saved">
                  ✓ Saved
                </span>
              ) : (
                <span className="auto-save-indicator">
                  💾 Auto-save: {autoSave.formatTimeSinceLastSave()}
                </span>
              )}
            </span>
          )}
        </div>
        <div className="status-bar__right">
          <span className="status-item">
            {project?.settings.resolution.width}×{project?.settings.resolution.height}
          </span>
          <span className="status-item">{project?.settings.frameRate} fps</span>
          <span className="status-item">
            Zoom: {Math.round(useTimelineStore.getState().zoomLevel)}px/s
          </span>
        </div>
      </footer>

      {/* Export Dialog */}
      {showExportDialog && <ExportDialog onClose={() => setShowExportDialog(false)} />}

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <SettingsDialog
          onClose={() => setShowSettingsDialog(false)}
          autoSaveEnabled={autoSave.enabled}
          autoSaveInterval={autoSaveInterval}
          onAutoSaveToggle={autoSave.toggle}
          onAutoSaveIntervalChange={setAutoSaveInterval}
        />
      )}
    </div>
  );
}

export default App;
