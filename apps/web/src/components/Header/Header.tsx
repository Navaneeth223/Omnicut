/**
 * Application Header - Premium Design
 */

import { useState } from 'react';
import { useProjectStore, useHistoryStore } from '@omnicut/store';
import '../../styles/header.css';

interface HeaderProps {
  workspace: string;
  onWorkspaceChange: (workspace: string) => void;
  onExport: () => void;
  onSettings: () => void;
}

const WORKSPACES = [
  { id: 'shorts', label: 'AI Shorts', icon: '🎬' },
  { id: 'ai-voice', label: 'AI Voice', icon: '🎙️' },
  { id: 'ai-video', label: 'AI Video', icon: '🤖' },
  { id: 'edit', label: 'Edit', icon: '✂️' },
  { id: 'color', label: 'Color', icon: '🎨' },
  { id: 'audio', label: 'Audio', icon: '🎵' },
  { id: 'photo', label: 'Photo', icon: '📷' },
];

export function Header({ workspace, onWorkspaceChange, onExport, onSettings }: HeaderProps) {
  const project = useProjectStore((state) => state.project);
  const updateProject = useProjectStore((state) => state.updateProject);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const canUndo = useHistoryStore((state) => state.canUndo);
  const canRedo = useHistoryStore((state) => state.canRedo);

  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project?.name || 'Untitled Project');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (projectName.trim() && project) {
      updateProject({ name: projectName.trim() });
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setProjectName(project?.name || 'Untitled Project');
      setIsEditingName(false);
    }
  };

  return (
    <header className="app-header">
      {/* Logo Section */}
      <div className="app-header__logo">
        <div className="app-logo" title="OmniCut" />
        <h1 className="app-title">OmniCut</h1>
        <span className="app-version">v2.1.0</span>
      </div>

      {/* Workspace Tabs */}
      <nav className="workspace-tabs">
        {WORKSPACES.map((ws) => (
          <button
            key={ws.id}
            className={`workspace-tab ${workspace === ws.id ? 'workspace-tab--active' : ''}`}
            onClick={() => onWorkspaceChange(ws.id)}
            data-tooltip={ws.label}
          >
            <span className="workspace-tab__icon">{ws.icon}</span>
            <span>{ws.label}</span>
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="app-header__actions">
        {/* Undo/Redo */}
        <button
          className="header-button header-button--undo"
          onClick={undo}
          disabled={!canUndo}
          data-tooltip="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          className="header-button header-button--redo"
          onClick={redo}
          disabled={!canRedo}
          data-tooltip="Redo (Ctrl+Shift+Z)"
        >
          ↷
        </button>

        <div className="header-divider" />

        {/* Project Name */}
        <input
          type="text"
          className="project-name"
          value={projectName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          onFocus={() => setIsEditingName(true)}
          placeholder="Project Name"
        />

        <div className="header-divider" />

        {/* Export Button */}
        <button
          className="export-button"
          onClick={onExport}
          data-tooltip="Export (Ctrl+E)"
        >
          📤 Export
        </button>

        {/* Settings */}
        <button
          className="header-button header-button--settings"
          onClick={onSettings}
          data-tooltip="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
