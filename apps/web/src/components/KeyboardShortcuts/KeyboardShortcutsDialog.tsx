/**
 * Keyboard Shortcuts Help Dialog
 * Shows all available keyboard shortcuts
 */

import './KeyboardShortcutsDialog.css';

interface KeyboardShortcutsDialogProps {
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'S'], description: 'Save project' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'E'], description: 'Export' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ],
  },
  {
    category: 'Playback',
    shortcuts: [
      { keys: ['Space'], description: 'Play/Pause' },
      { keys: ['Home'], description: 'Go to start' },
      { keys: ['End'], description: 'Go to end' },
      { keys: ['←'], description: 'Step backward' },
      { keys: ['→'], description: 'Step forward' },
      { keys: ['J'], description: 'Play backward' },
      { keys: ['K'], description: 'Pause' },
      { keys: ['L'], description: 'Play forward' },
    ],
  },
  {
    category: 'Timeline',
    shortcuts: [
      { keys: ['V'], description: 'Selection tool' },
      { keys: ['C'], description: 'Razor tool' },
      { keys: ['H'], description: 'Hand tool' },
      { keys: ['Ctrl', 'C'], description: 'Copy clip' },
      { keys: ['Ctrl', 'V'], description: 'Paste clip' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate clip' },
      { keys: ['Delete'], description: 'Delete clip' },
      { keys: ['+'], description: 'Zoom in' },
      { keys: ['-'], description: 'Zoom out' },
    ],
  },
  {
    category: 'Workspaces',
    shortcuts: [
      { keys: ['Ctrl', '1'], description: 'Edit workspace' },
      { keys: ['Ctrl', '2'], description: 'Shorts workspace' },
      { keys: ['Ctrl', '3'], description: 'AI Image workspace' },
      { keys: ['Ctrl', '4'], description: 'AI Voice workspace' },
      { keys: ['Ctrl', '5'], description: 'AI Video workspace' },
      { keys: ['Ctrl', '6'], description: 'Color workspace' },
      { keys: ['Ctrl', '7'], description: 'Audio workspace' },
      { keys: ['Ctrl', '8'], description: 'Photo workspace' },
    ],
  },
];

export function KeyboardShortcutsDialog({ onClose }: KeyboardShortcutsDialogProps) {
  return (
    <div className="keyboard-shortcuts-overlay" onClick={onClose}>
      <div className="keyboard-shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="keyboard-shortcuts-dialog__header">
          <h2 className="keyboard-shortcuts-dialog__title">⌨️ Keyboard Shortcuts</h2>
          <button
            className="keyboard-shortcuts-dialog__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="keyboard-shortcuts-dialog__content">
          {SHORTCUTS.map((section) => (
            <div key={section.category} className="shortcuts-section">
              <h3 className="shortcuts-section__title">{section.category}</h3>
              <div className="shortcuts-list">
                {section.shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <div className="shortcut-item__keys">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="shortcut-key">{key}</kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="shortcut-plus">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="shortcut-item__description">{shortcut.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="keyboard-shortcuts-dialog__footer">
          <p className="keyboard-shortcuts-dialog__hint">
            Press <kbd className="shortcut-key">?</kbd> anytime to show this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
