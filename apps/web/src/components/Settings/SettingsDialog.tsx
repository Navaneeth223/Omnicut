/**
 * Settings Dialog Component
 */

import { useState } from 'react';
import './SettingsDialog.css';

interface SettingsDialogProps {
  onClose: () => void;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  onAutoSaveToggle: () => void;
  onAutoSaveIntervalChange: (interval: number) => void;
}

export function SettingsDialog({
  onClose,
  autoSaveEnabled,
  autoSaveInterval,
  onAutoSaveToggle,
  onAutoSaveIntervalChange,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'shortcuts' | 'advanced'>('general');

  const intervalOptions = [
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '2 minutes', value: 120000 },
    { label: '5 minutes', value: 300000 },
  ];

  return (
    <div className="settings-dialog-overlay" onClick={onClose}>
      <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="settings-dialog__header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-dialog__content">
          {/* Tabs */}
          <div className="settings-tabs">
            <button
              className={`settings-tab ${activeTab === 'general' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`settings-tab ${activeTab === 'shortcuts' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('shortcuts')}
            >
              Shortcuts
            </button>
            <button
              className={`settings-tab ${activeTab === 'advanced' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </button>
          </div>

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>Auto-Save</h3>
                <div className="settings-row">
                  <label className="settings-label">
                    <input
                      type="checkbox"
                      checked={autoSaveEnabled}
                      onChange={onAutoSaveToggle}
                    />
                    <span>Enable auto-save</span>
                  </label>
                  <p className="settings-description">
                    Automatically save your project at regular intervals
                  </p>
                </div>
                {autoSaveEnabled && (
                  <div className="settings-row">
                    <label className="settings-label">
                      <span>Auto-save interval:</span>
                      <select
                        value={autoSaveInterval}
                        onChange={(e) => onAutoSaveIntervalChange(Number(e.target.value))}
                      >
                        {intervalOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              </div>

              <div className="settings-section">
                <h3>Appearance</h3>
                <div className="settings-row">
                  <label className="settings-label">
                    <span>Theme:</span>
                    <select disabled>
                      <option>Dark (default)</option>
                    </select>
                  </label>
                  <p className="settings-description">More themes coming soon</p>
                </div>
              </div>

              <div className="settings-section">
                <h3>Performance</h3>
                <div className="settings-row">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Hardware acceleration</span>
                  </label>
                  <p className="settings-description">Use GPU for better performance</p>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>Playback</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span>Play/Pause</span>
                    <kbd>Space</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Go to Start</span>
                    <kbd>Home</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Go to End</span>
                    <kbd>End</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Step Forward 1 Frame</span>
                    <kbd>→</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Step Backward 1 Frame</span>
                    <kbd>←</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Step Forward 10 Frames</span>
                    <kbd>Shift + →</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Step Backward 10 Frames</span>
                    <kbd>Shift + ←</kbd>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Editing</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span>Copy</span>
                    <kbd>⌘C</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Cut</span>
                    <kbd>⌘X</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Paste</span>
                    <kbd>⌘V</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Select All</span>
                    <kbd>⌘A</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Delete</span>
                    <kbd>Delete</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Split Clips at Playhead</span>
                    <kbd>C</kbd>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Timeline</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span>Zoom In</span>
                    <kbd>+</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Zoom Out</span>
                    <kbd>-</kbd>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Project</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span>Undo</span>
                    <kbd>⌘Z</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Redo</span>
                    <kbd>⌘⇧Z</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Save</span>
                    <kbd>⌘S</kbd>
                  </div>
                  <div className="shortcut-item">
                    <span>Export</span>
                    <kbd>⌘E</kbd>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <p className="settings-description">
                  💡 Tip: On Windows, use Ctrl instead of ⌘ (Command)
                </p>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="settings-panel">
              <div className="settings-section">
                <h3>History</h3>
                <div className="settings-row">
                  <label className="settings-label">
                    <span>Undo history size:</span>
                    <input type="number" defaultValue={200} disabled />
                  </label>
                  <p className="settings-description">
                    Maximum number of undo/redo steps (default: 200)
                  </p>
                </div>
              </div>

              <div className="settings-section">
                <h3>Timeline</h3>
                <div className="settings-row">
                  <label className="settings-label">
                    <input type="checkbox" defaultChecked />
                    <span>Snap to clips</span>
                  </label>
                </div>
                <div className="settings-row">
                  <label className="settings-label">
                    <input type="checkbox" />
                    <span>Ripple edit by default</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>About</h3>
                <div className="about-info">
                  <p><strong>OmniCut</strong></p>
                  <p>Version 1.0.0-alpha</p>
                  <p>Open-source video editor</p>
                  <p className="settings-description">
                    Built with React, TypeScript, and FFmpeg.wasm
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="settings-dialog__footer">
          <button className="button button--primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
