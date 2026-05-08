/**
 * Touch Gestures Hook
 * Mobile optimization for swipe and gesture support
 */

import { useEffect, useRef, RefObject } from 'react';

export interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  threshold?: number;
}

export function useTouchGestures(
  elementRef: RefObject<HTMLElement>,
  options: TouchGestureOptions
) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number>(0);

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onDoubleTap,
    threshold = 50,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - track for swipe
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
      } else if (e.touches.length === 2 && onPinch) {
        // Two touches - track for pinch
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && onPinch && initialDistanceRef.current > 0) {
        // Pinch gesture
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = distance / initialDistanceRef.current;
        onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const dx = touchEnd.x - touchStartRef.current.x;
      const dy = touchEnd.y - touchStartRef.current.y;
      const dt = touchEnd.time - touchStartRef.current.time;

      // Check for double tap
      if (onDoubleTap && dt < 300) {
        const timeSinceLastTap = touchEnd.time - lastTapRef.current;
        if (timeSinceLastTap < 300) {
          onDoubleTap();
          lastTapRef.current = 0;
          touchStartRef.current = null;
          return;
        }
        lastTapRef.current = touchEnd.time;
      }

      // Check for swipe
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > threshold || absDy > threshold) {
        if (absDx > absDy) {
          // Horizontal swipe
          if (dx > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (dx < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (dy > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (dy < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
      initialDistanceRef.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    elementRef,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onDoubleTap,
    threshold,
  ]);
}
