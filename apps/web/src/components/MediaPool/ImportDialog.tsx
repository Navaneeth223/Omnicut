/**
 * Import Dialog Component
 */

import { useRef } from 'react';
import './ImportDialog.css';

interface ImportDialogProps {
  onImport: (files: File[]) => void;
  onClose: () => void;
}

export function ImportDialog({ onImport, onClose }: ImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImport(files);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="import-dialog-overlay" onClick={onClose}>
      <div className="import-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="import-dialog__header">
          <h2>Import Media</h2>
          <button className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="import-dialog__content">
          <div className="import-dialog__drop-zone">
            <div className="import-dialog__icon">📁</div>
            <p className="import-dialog__text">
              Drag and drop files here
            </p>
            <p className="import-dialog__hint">
              or
            </p>
            <button className="button button--primary" onClick={handleBrowse}>
              Browse Files
            </button>
          </div>

          <div className="import-dialog__info">
            <h3>Supported Formats</h3>
            <ul>
              <li><strong>Video:</strong> MP4, MOV, AVI, MKV, WebM</li>
              <li><strong>Audio:</strong> MP3, WAV, AAC, FLAC, OGG</li>
              <li><strong>Image:</strong> JPG, PNG, GIF, WebP, TIFF</li>
            </ul>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
