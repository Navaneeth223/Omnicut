/**
 * Export Dialog Component
 * Allows users to export timeline to video file
 */

import { useState } from 'react';
import { useProjectStore, useTimelineStore } from '@omnicut/store';
import { renderTimeline, estimateFileSize } from '@omnicut/media-engine';
import type { ExportSettings } from '@omnicut/core';
import { useToast } from '../../hooks/useToast';
import { LoadingOverlay } from '../Loading/Loading';
import './ExportDialog.css';

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const project = useProjectStore((state) => state.project);
  const timeline = useTimelineStore((state) => state.timeline);
  const toast = useToast();

  const [settings, setSettings] = useState<ExportSettings>({
    format: 'mp4',
    codec: 'h264',
    resolution: project?.settings.resolution || { width: 1920, height: 1080 },
    frameRate: project?.settings.frameRate || 30,
    bitrate: 8000,
    quality: 'high',
    audioCodec: 'aac',
    audioBitrate: 192,
    startTime: 0,
    endTime: timeline?.duration || 0,
  });

  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { name: 'YouTube 1080p', resolution: { width: 1920, height: 1080 }, bitrate: 8000, quality: 'high' as const },
    { name: 'YouTube 4K', resolution: { width: 3840, height: 2160 }, bitrate: 20000, quality: 'high' as const },
    { name: 'Instagram', resolution: { width: 1080, height: 1080 }, bitrate: 5000, quality: 'medium' as const },
    { name: 'Twitter', resolution: { width: 1280, height: 720 }, bitrate: 5000, quality: 'medium' as const },
    { name: 'Web Optimized', resolution: { width: 1280, height: 720 }, bitrate: 3000, quality: 'medium' as const },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSettings({
      ...settings,
      resolution: preset.resolution,
      bitrate: preset.bitrate,
      quality: preset.quality,
    });
  };

  const handleExport = async () => {
    if (!timeline) return;

    setExporting(true);
    setProgress(0);
    setError(null);
    toast.info('Starting export...');

    try {
      // Render timeline with FFmpeg
      const result = await renderTimeline(timeline, {
        format: settings.format,
        codec: settings.codec,
        resolution: settings.resolution,
        frameRate: settings.frameRate,
        quality: settings.quality,
        audioBitrate: settings.audioBitrate,
        videoBitrate: settings.bitrate,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });

      if (result.success && result.blob) {
        // Download the exported video
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project?.name || 'video'}.${settings.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const duration = (result.duration! / 1000).toFixed(1);
        toast.success(`Export complete! Duration: ${duration}s`);
        onClose();
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (err) {
      console.error('Export error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setError(errorMessage);
      toast.error(`Export failed: ${errorMessage}`);
    } finally {
      setExporting(false);
    }
  };

  const estimatedFileSize = () => {
    if (!timeline) return '0.00';
    
    const sizeInBytes = estimateFileSize(timeline, {
      format: settings.format,
      codec: settings.codec,
      resolution: settings.resolution,
      frameRate: settings.frameRate,
      quality: settings.quality,
      audioBitrate: settings.audioBitrate,
      videoBitrate: settings.bitrate,
    });
    
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2);
  };

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      {/* Loading Overlay */}
      {exporting && (
        <LoadingOverlay 
          message={`Exporting video... ${progress}%`}
        />
      )}

      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-dialog__header">
          <h2>Export Video</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="export-dialog__content">
          {/* Presets */}
          <div className="export-section">
            <h3>Presets</h3>
            <div className="preset-buttons">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-button"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="export-section">
            <h3>Format</h3>
            <div className="form-row">
              <label>
                Container:
                <select
                  value={settings.format}
                  onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
                  disabled={exporting}
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="mov">MOV</option>
                </select>
              </label>
              <label>
                Video Codec:
                <select
                  value={settings.codec}
                  onChange={(e) => setSettings({ ...settings, codec: e.target.value as any })}
                  disabled={exporting}
                >
                  <option value="h264">H.264</option>
                  <option value="h265">H.265 (HEVC)</option>
                  <option value="vp9">VP9</option>
                </select>
              </label>
            </div>
          </div>

          {/* Resolution */}
          <div className="export-section">
            <h3>Resolution</h3>
            <div className="form-row">
              <label>
                Width:
                <input
                  type="number"
                  value={settings.resolution.width}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      resolution: { ...settings.resolution, width: Number(e.target.value) },
                    })
                  }
                  disabled={exporting}
                />
              </label>
              <label>
                Height:
                <input
                  type="number"
                  value={settings.resolution.height}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      resolution: { ...settings.resolution, height: Number(e.target.value) },
                    })
                  }
                  disabled={exporting}
                />
              </label>
            </div>
          </div>

          {/* Quality */}
          <div className="export-section">
            <h3>Quality</h3>
            <div className="form-row">
              <label>
                Frame Rate:
                <select
                  value={settings.frameRate}
                  onChange={(e) => setSettings({ ...settings, frameRate: Number(e.target.value) })}
                  disabled={exporting}
                >
                  <option value={24}>24 fps</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </label>
              <label>
                Bitrate (kbps):
                <input
                  type="number"
                  value={settings.bitrate}
                  onChange={(e) => setSettings({ ...settings, bitrate: Number(e.target.value) })}
                  disabled={exporting}
                  step={1000}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Quality:
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: e.target.value as any })}
                  disabled={exporting}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </label>
            </div>
          </div>

          {/* Audio */}
          <div className="export-section">
            <h3>Audio</h3>
            <div className="form-row">
              <label>
                Audio Codec:
                <select
                  value={settings.audioCodec}
                  onChange={(e) => setSettings({ ...settings, audioCodec: e.target.value as any })}
                  disabled={exporting}
                >
                  <option value="aac">AAC</option>
                  <option value="mp3">MP3</option>
                  <option value="opus">Opus</option>
                </select>
              </label>
              <label>
                Audio Bitrate (kbps):
                <input
                  type="number"
                  value={settings.audioBitrate}
                  onChange={(e) =>
                    setSettings({ ...settings, audioBitrate: Number(e.target.value) })
                  }
                  disabled={exporting}
                  step={32}
                />
              </label>
            </div>
          </div>

          {/* Range */}
          <div className="export-section">
            <h3>Export Range</h3>
            <div className="form-row">
              <label>
                Start Time (s):
                <input
                  type="number"
                  value={settings.startTime}
                  onChange={(e) => setSettings({ ...settings, startTime: Number(e.target.value) })}
                  disabled={exporting}
                  step={0.1}
                  min={0}
                  max={timeline?.duration || 0}
                />
              </label>
              <label>
                End Time (s):
                <input
                  type="number"
                  value={settings.endTime}
                  onChange={(e) => setSettings({ ...settings, endTime: Number(e.target.value) })}
                  disabled={exporting}
                  step={0.1}
                  min={0}
                  max={timeline?.duration || 0}
                />
              </label>
            </div>
          </div>

          {/* Info */}
          <div className="export-info">
            <div className="info-item">
              <span>Duration:</span>
              <span>{(settings.endTime - settings.startTime).toFixed(2)}s</span>
            </div>
            <div className="info-item">
              <span>Estimated Size:</span>
              <span>{estimatedFileSize()} MB</span>
            </div>
          </div>

          {/* Progress */}
          {exporting && (
            <div className="export-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
          )}

          {/* Error */}
          {error && <div className="export-error">{error}</div>}
        </div>

        <div className="export-dialog__footer">
          <button className="button" onClick={onClose} disabled={exporting}>
            Cancel
          </button>
          <button
            className="button button--primary"
            onClick={handleExport}
            disabled={exporting || !timeline}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
