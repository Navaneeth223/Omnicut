/**
 * ResizeHandle Component
 * Draggable handle for resizing panels
 */

import { useEffect, useRef } from 'react';
import './ResizeHandle.css';

export interface ResizeHandleProps {
  panelId: string;
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  minSize?: number;
  maxSize?: number;
  side?: 'left' | 'right' | 'top' | 'bottom'; // Which side of the panel the handle is on
}

export function ResizeHandle({
  panelId,
  direction,
  onResize,
  minSize = 200,
  maxSize = 600,
  side = 'right',
}: ResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      
      const startX = e.clientX;
      const startY = e.clientY;
      
      document.body.classList.add('resizing');
      handle.classList.add('dragging');

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        
        const delta = direction === 'horizontal' 
          ? e.clientX - startX 
          : e.clientY - startY;
        
        onResize(delta);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.body.classList.remove('resizing');
        handle.classList.remove('dragging');
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
    };
  }, [direction, onResize]);

  return (
    <div
      ref={handleRef}
      className={`resize-handle resize-handle--${direction} resize-handle--${side}`}
      data-panel-id={panelId}
      role="separator"
      aria-label={`Resize ${panelId} panel`}
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
    />
  );
}
