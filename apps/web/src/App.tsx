/**
 * Main Application Component - Complete Integration
 * With Performance Optimization: Route-based code splitting
 */

import { useEffect, useState, lazy, Suspense } from 'react';
import { useProjectStore, useTimelineStore, useMediaPoolStore, useHistoryStore } from '@omnicut/store';
import { VERSION, createDefaultProject, generateId } from '@omnicut/core';
import { Header } from './components/Header/Header';
import { MenuBar } from './components/Menu/MenuBar';
import { MediaPool } from './components/MediaPool/MediaPool';
import { Timeline } from './components/Timeline/Timeline';
import { ExportDialog } from './components/Export/ExportDialog';
import { SettingsDialog } from './components/Settings/SettingsDialog';
import { EffectsPanel } from './components/Effects/EffectsPanel';
import { TransitionsPanel } from './components/Transitions/TransitionsPanel';
import { VideoViewer } from './components/Viewer/VideoViewer';
import { ToastContainer } from './components/Toast/Toast';
import { KeyboardShortcutsDialog } from './components/KeyboardShortcuts/KeyboardShortcutsDialog';
import { Loading } from './components/Loading/Loading';
import { SkipNav } from './components/SkipNav/SkipNav';
import { ResizeHandle } from './components/ResizeHandle/ResizeHandle';
import { usePlayback } from './hooks/usePlayback';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { useToast } from './hooks/useToast';
import { performanceMonitor } from './utils/performance';
import { announceToScreenReader } from './utils/accessibility';
import './styles/App.css';
import './styles/bug-fixes.css';

// Lazy load workspace components for better performance
const ShortsStudio = lazy(() => import('./components/ShortsStudio/ShortsStudio').then(m => ({ default: m.ShortsStudio })));
const AIVoice = lazy(() => import('./components/AIVoice/AIVoice').then(m => ({ default: m.AIVoice })));
const AIImage = lazy(() => import('./components/AIImage/AIImage').then(m => ({ default: m.AIImage })));
const AIVideo = lazy(() => import('./components/AIVideo/AIVideo').then(m => ({ default: m.AIVideo })));
const ColorGrading = lazy(() => import('./components/ColorGrading/ColorGrading').then(m => ({ default: m.ColorGrading })));
const AudioWorkspace = lazy(() => import('./components/AudioWorkspace/AudioWorkspace').then(m => ({ default: m.AudioWorkspace })));
const PhotoEditor = lazy(() => import('./components/PhotoEditor/PhotoEditor').then(m => ({ default: m.PhotoEditor })));

// Load saved panel widths from localStorage
const getSavedRightPanelWidth = () => {
  const saved = localStorage.getItem('rightPanelWidth');
  return saved ? parseInt(saved, 10) : 340;
};

function App() {
  const [workspace, setWorkspace] = useState<'edit' | 'shorts' | 'ai-voice' | 'ai-image' | 'ai-video' | 'color' | 'audio' | 'photo'>('shorts');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showAutoSaveIndicator, setShowAutoSaveIndicator] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30000);
  const [rightPanelTab, setRightPanelTab] = useState<'effects' | 'transitions'>('effects');
  const [isInitialized, setIsInitialized] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(getSavedRightPanelWidth());

  // Toast notifications
  const toast = useToast();

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
      toast.success('Project saved');
    },
    onError: (error) => {
      console.error('Auto-save failed:', error);
      toast.error('Failed to save project');
    },
  });

  // Keyboard shortcut for help dialog (?)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if ? key is pressed (Shift + /)
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
      
      // Mark as initialized
      setIsInitialized(true);
      
      // Announce to screen readers
      announceToScreenReader('OmniCut loaded successfully. Press question mark for keyboard shortcuts.');
    } else {
      setIsInitialized(true);
    }
  }, [project, createProject, initTimeline, addTrack, initMediaPool]);

  // Log performance metrics on workspace change
  useEffect(() => {
    announceToScreenReader(`Switched to ${workspace} workspace`);
  }, [workspace]);

  // Format timecode
  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * (project?.settings.frameRate ?? 30));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  // Handle right panel resize
  const handleRightPanelResize = (delta: number) => {
    setRightPanelWidth((prev) => {
      const newWidth = Math.max(280, Math.min(500, prev - delta)); // Subtract delta for left-side resize
      localStorage.setItem('rightPanelWidth', newWidth.toString());
      return newWidth;
    });
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="app">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#1a1a1a',
          color: 'white',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>🎬 OmniCut</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Loading AI Shorts Studio...</p>
          <div style={{
            width: '200px',
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #9333ea)',
              animation: 'loading 1.5s ease-in-out infinite'
            }} />
          </div>
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="app" role="application" aria-label="OmniCut Video Editor">
      {/* Skip Navigation for Accessibility */}
      <SkipNav />
      
      {/* New Premium Header */}
      <Header
        workspace={workspace}
        onWorkspaceChange={(ws) => setWorkspace(ws as any)}
        onExport={() => setShowExportDialog(true)}
        onSettings={() => setShowSettingsDialog(true)}
      />

      {/* Menu Bar (File, Edit, View, Help, About) */}
      {workspace === 'edit' && (
        <MenuBar
          onExport={() => setShowExportDialog(true)}
          onSettings={() => setShowSettingsDialog(true)}
          onImportMedia={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'video/*,audio/*,image/*';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files) {
                // Handle file import
                console.log('Import files:', files);
              }
            };
            input.click();
          }}
        />
      )}

      {/* Main Content */}
      <main className="main-content" id="main-content" role="main" aria-label="Main workspace">
        <Suspense fallback={<Loading variant="spinner" message={`Loading ${workspace} workspace...`} />}>
          {workspace === 'shorts' ? (
            <ShortsStudio />
          ) : workspace === 'ai-voice' ? (
            <AIVoice />
          ) : workspace === 'ai-image' ? (
            <AIImage />
          ) : workspace === 'ai-video' ? (
            <AIVideo />
          ) : workspace === 'color' ? (
            <ColorGrading />
          ) : workspace === 'audio' ? (
            <AudioWorkspace />
          ) : workspace === 'photo' ? (
            <PhotoEditor />
          ) : (
          <div className="layout">
          {/* Left Panel - Media Pool */}
          <aside className="panel panel--left" id="media-pool" role="complementary" aria-label="Media Pool">
            <MediaPool />
          </aside>

          {/* Center - Viewer & Timeline */}
          <div className="center-area">
            {/* Viewer */}
            <div className="viewer-container" role="region" aria-label="Video Preview">
              <div className="viewer">
                <div className="viewer__canvas">
                  <VideoViewer />
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
            <div className="timeline-container" id="timeline" role="region" aria-label="Timeline Editor">
              <div className="timeline-toolbar" role="toolbar" aria-label="Timeline Tools">
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

          {/* Right Panel - Effects & Transitions */}
          <aside 
            className="panel panel--right" 
            role="complementary" 
            aria-label="Effects and Transitions"
            style={{ width: `${rightPanelWidth}px` }}
          >
            {/* Resize Handle */}
            <ResizeHandle
              panelId="right-panel"
              direction="horizontal"
              side="left"
              onResize={handleRightPanelResize}
              minSize={280}
              maxSize={500}
            />
            <div className="panel__header">
              <div className="panel__tabs">
                <button
                  className={`panel__tab ${rightPanelTab === 'effects' ? 'panel__tab--active' : ''}`}
                  onClick={() => setRightPanelTab('effects')}
                >
                  Effects
                </button>
                <button
                  className={`panel__tab ${rightPanelTab === 'transitions' ? 'panel__tab--active' : ''}`}
                  onClick={() => setRightPanelTab('transitions')}
                >
                  Transitions
                </button>
              </div>
            </div>
            <div className="panel__content panel__content--no-padding">
              {rightPanelTab === 'effects' ? <EffectsPanel /> : <TransitionsPanel />}
            </div>
          </aside>
        </div>
        )}
        </Suspense>
      </main>

      {/* Status Bar */}
      <footer className="status-bar">
        <div className="status-bar__left">
          <span className="status-item">
            {playing ? '▶️ Playing' : '⏸️ Ready'}
          </span>
          {timeline && (
            <span className="status-item">
              {timeline.tracks.filter((t: any) => t.clips.length > 0).length} tracks with clips
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

      {/* Keyboard Shortcuts Dialog */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsDialog onClose={() => setShowKeyboardShortcuts(false)} />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}

export default App;
