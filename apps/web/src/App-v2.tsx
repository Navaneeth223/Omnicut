/**
 * Main Application Component (Enhanced with State Management)
 */

import { useEffect, useState } from 'react';
import { useProjectStore, useTimelineStore, useMediaPoolStore } from '@omnicut/store';
import { VERSION, createDefaultProject } from '@omnicut/core';
import { MediaPool } from './components/MediaPool/MediaPool';
import './styles/App.css';

function App() {
  const [workspace, setWorkspace] = useState<'edit' | 'color' | 'audio' | 'photo'>('edit');

  // Project state
  const project = useProjectStore((state) => state.project);
  const createProject = useProjectStore((state) => state.createProject);

  // Timeline state
  const timeline = useTimelineStore((state) => state.timeline);
  const playing = useTimelineStore((state) => state.playing);
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const playhead = useTimelineStore((state) => state.timeline?.playhead ?? 0);

  // Initialize default project on mount
  useEffect(() => {
    if (!project) {
      createProject('Untitled Project');
    }
  }, [project, createProject]);

  // Format timecode
  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 30); // Assuming 30fps
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
          <span className="menu__item">{project?.name || 'No Project'}</span>
          <button className="icon-button" title="Settings">
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

          {/* Center - Viewer */}
          <div className="center-area">
            <div className="viewer-container">
              <div className="viewer">
                <div className="viewer__canvas">
                  <div className="empty-state">
                    <div className="empty-state__icon">🎬</div>
                    <p className="empty-state__text">No sequence loaded</p>
                    <button className="button button--primary">New Sequence</button>
                  </div>
                </div>
                <div className="viewer__controls">
                  <button className="icon-button" title="Go to start">⏮</button>
                  <button className="icon-button" title="Step back">⏪</button>
                  <button
                    className="icon-button icon-button--large"
                    onClick={togglePlay}
                    title={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? '⏸️' : '▶️'}
                  </button>
                  <button className="icon-button" title="Step forward">⏩</button>
                  <button className="icon-button" title="Go to end">⏭</button>
                  <div className="timecode">{formatTimecode(playhead)}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-container">
              <div className="timeline-toolbar">
                <div className="timeline-toolbar__left">
                  <button className="icon-button" title="Selection tool">↖️</button>
                  <button className="icon-button" title="Razor tool">✂️</button>
                  <button className="icon-button" title="Hand tool">✋</button>
                </div>
                <div className="timeline-toolbar__center">
                  <button className="icon-button" title="Zoom out">-</button>
                  <input
                    type="range"
                    className="zoom-slider"
                    min="0.01"
                    max="100"
                    step="0.01"
                    defaultValue="1"
                  />
                  <button className="icon-button" title="Zoom in">+</button>
                </div>
                <div className="timeline-toolbar__right">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Snapping</span>
                  </label>
                </div>
              </div>
              <div className="timeline">
                {timeline && timeline.tracks.length > 0 ? (
                  <div>Timeline with {timeline.tracks.length} tracks</div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state__icon">⏱️</div>
                    <p className="empty-state__text">Timeline is empty</p>
                    <p className="empty-state__hint">Drag media from the pool to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Inspector */}
          <aside className="panel panel--right">
            <div className="panel__header">
              <h2 className="panel__title">Inspector</h2>
            </div>
            <div className="panel__content">
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <p className="empty-state__text">No clip selected</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="status-bar">
        <div className="status-bar__left">
          <span className="status-item">Ready</span>
        </div>
        <div className="status-bar__right">
          <span className="status-item">
            {project?.settings.resolution.width}x{project?.settings.resolution.height}
          </span>
          <span className="status-item">{project?.settings.frameRate} fps</span>
          <span className="status-item">CPU: 0%</span>
          <span className="status-item">RAM: 0 MB</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
