/**
 * Menu Bar Component with Dropdown Menus
 */

import { useState, useRef, useEffect } from 'react';
import { useProjectStore, useTimelineStore, useHistoryStore } from '@omnicut/store';
import { VERSION } from '@omnicut/core';
import './MenuBar.css';

interface MenuBarProps {
  onExport: () => void;
  onSettings: () => void;
  onImportMedia: () => void;
  onToggleMediaPool?: () => void;
  onToggleEffectsPanel?: () => void;
  onToggleTimeline?: () => void;
  showMediaPool?: boolean;
  showEffectsPanel?: boolean;
  showTimeline?: boolean;
}

export function MenuBar({ 
  onExport, 
  onSettings, 
  onImportMedia,
  onToggleMediaPool,
  onToggleEffectsPanel,
  onToggleTimeline,
  showMediaPool = true,
  showEffectsPanel = true,
  showTimeline = true,
}: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const project = useProjectStore((state) => state.project);
  const isDirty = useProjectStore((state) => state.isDirty);
  const saveProject = useProjectStore((state) => state.saveProject);
  
  const timeline = useTimelineStore((state) => state.timeline);
  const selectedClips = useTimelineStore((state) => state.selectedClips);
  const addTrack = useTimelineStore((state) => state.addTrack);
  const zoomIn = useTimelineStore((state) => state.zoomIn);
  const zoomOut = useTimelineStore((state) => state.zoomOut);
  
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  const handleNewProject = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Create new project?')) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  const handleSave = () => {
    saveProject();
    alert('Project saved!');
  };

  return (
    <div className="menu-bar" ref={menuRef}>
      <div className="menu-bar__left">
        <div className="logo">
          <span className="logo__icon">◆</span>
          <span className="logo__text">OmniCut</span>
          <span className="logo__version">{VERSION}</span>
        </div>

        {/* File Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'file' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('file')}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={() => handleMenuAction(handleNewProject)}>
                <span className="menu-option__label">New Project</span>
                <span className="menu-option__shortcut">⌘N</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(handleSave)}>
                <span className="menu-option__label">Save Project</span>
                <span className="menu-option__shortcut">⌘S</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(onImportMedia)}>
                <span className="menu-option__label">Import Media...</span>
                <span className="menu-option__shortcut">⌘I</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(onExport)}>
                <span className="menu-option__label">Export Video...</span>
                <span className="menu-option__shortcut">⌘E</span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'edit' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('edit')}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="menu-dropdown">
              <button
                className="menu-option"
                onClick={() => handleMenuAction(undo)}
                disabled={!canUndo()}
              >
                <span className="menu-option__label">Undo</span>
                <span className="menu-option__shortcut">⌘Z</span>
              </button>
              <button
                className="menu-option"
                onClick={() => handleMenuAction(redo)}
                disabled={!canRedo()}
              >
                <span className="menu-option__label">Redo</span>
                <span className="menu-option__shortcut">⌘⇧Z</span>
              </button>
              <div className="menu-separator" />
              <button
                className="menu-option"
                onClick={() => handleMenuAction(() => {
                  // Copy functionality already exists via keyboard
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true }));
                })}
                disabled={selectedClips.length === 0}
              >
                <span className="menu-option__label">Copy</span>
                <span className="menu-option__shortcut">⌘C</span>
              </button>
              <button
                className="menu-option"
                onClick={() => handleMenuAction(() => {
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', metaKey: true }));
                })}
              >
                <span className="menu-option__label">Paste</span>
                <span className="menu-option__shortcut">⌘V</span>
              </button>
              <button
                className="menu-option"
                onClick={() => handleMenuAction(() => {
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
                })}
                disabled={selectedClips.length === 0}
              >
                <span className="menu-option__label">Delete</span>
                <span className="menu-option__shortcut">⌫</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(onSettings)}>
                <span className="menu-option__label">Preferences...</span>
                <span className="menu-option__shortcut">⌘,</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'view' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('view')}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={() => handleMenuAction(zoomIn)}>
                <span className="menu-option__label">Zoom In</span>
                <span className="menu-option__shortcut">⌘+</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(zoomOut)}>
                <span className="menu-option__label">Zoom Out</span>
                <span className="menu-option__shortcut">⌘-</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(() => onToggleMediaPool?.())}>
                <span className="menu-option__label">{showMediaPool ? '✓ ' : ''}Media Pool</span>
                <span className="menu-option__shortcut">⌘1</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(() => onToggleEffectsPanel?.())}>
                <span className="menu-option__label">{showEffectsPanel ? '✓ ' : ''}Effects Panel</span>
                <span className="menu-option__shortcut">⌘2</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(() => onToggleTimeline?.())}>
                <span className="menu-option__label">{showTimeline ? '✓ ' : ''}Timeline</span>
                <span className="menu-option__shortcut">⌘3</span>
              </button>
            </div>
          )}
        </div>

        {/* Insert Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'insert' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('insert')}
          >
            Insert
          </button>
          {activeMenu === 'insert' && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={() => handleMenuAction(() => addTrack('video'))}>
                <span className="menu-option__label">Video Track</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(() => addTrack('audio'))}>
                <span className="menu-option__label">Audio Track</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(() => {})}>
                <span className="menu-option__label">Marker</span>
                <span className="menu-option__shortcut">M</span>
              </button>
            </div>
          )}
        </div>

        {/* Tools Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'tools' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('tools')}
          >
            Tools
          </button>
          {activeMenu === 'tools' && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={() => handleMenuAction(() => {})}>
                <span className="menu-option__label">Selection Tool</span>
                <span className="menu-option__shortcut">V</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(() => {})}>
                <span className="menu-option__label">Razor Tool</span>
                <span className="menu-option__shortcut">C</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(() => {})}>
                <span className="menu-option__label">Hand Tool</span>
                <span className="menu-option__shortcut">H</span>
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="menu-item">
          <button
            className={`menu-button ${activeMenu === 'help' ? 'menu-button--active' : ''}`}
            onClick={() => toggleMenu('help')}
          >
            Help
          </button>
          {activeMenu === 'help' && (
            <div className="menu-dropdown">
              <button className="menu-option" onClick={() => handleMenuAction(() => {
                window.open('https://github.com/omnicut/omnicut', '_blank');
              })}>
                <span className="menu-option__label">Documentation</span>
              </button>
              <button className="menu-option" onClick={() => handleMenuAction(onSettings)}>
                <span className="menu-option__label">Keyboard Shortcuts</span>
              </button>
              <div className="menu-separator" />
              <button className="menu-option" onClick={() => handleMenuAction(() => {
                alert(`OmniCut ${VERSION}\n\nA professional video editor built with React, TypeScript, and Vite.\n\n© 2026 Open Source Community`);
              })}>
                <span className="menu-option__label">About OmniCut</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="menu-bar__right">
        <button
          className="icon-button"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (⌘Z)"
        >
          ↶
        </button>
        <button
          className="icon-button"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (⌘⇧Z)"
        >
          ↷
        </button>
        <button
          className="button button--primary"
          onClick={onExport}
          disabled={!timeline || timeline.tracks.every((t) => t.clips.length === 0)}
          title="Export video (⌘E)"
        >
          Export
        </button>
        <span className="menu__item">
          {project?.name || 'Untitled Project'}
          {isDirty && ' •'}
        </span>
        <button
          className="icon-button"
          onClick={onSettings}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
