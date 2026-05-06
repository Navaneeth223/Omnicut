/**
 * Snap Indicator Component
 * Shows visual feedback when snapping to points
 */

import { useEffect, useState } from 'react';
import './SnapIndicator.css';

interface SnapIndicatorProps {
  position: number | null;
  zoomLevel: number;
}

export function SnapIndicator({ position, zoomLevel }: SnapIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (position !== null) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 150);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [position]);

  if (!visible || position === null) return null;

  return (
    <div
      className="snap-indicator"
      style={{
        left: position * zoomLevel,
      }}
    />
  );
}
