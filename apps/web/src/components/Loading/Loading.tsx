/**
 * Loading Components
 * Spinners and skeleton screens
 */

import './Loading.css';

export function Spinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <div className={`spinner spinner--${size}`}>
      <div className="spinner__circle" />
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay__content">
        <Spinner size="large" />
        {message && <p className="loading-overlay__message">{message}</p>}
      </div>
    </div>
  );
}

export function SkeletonText({ width = '100%' }: { width?: string }) {
  return <div className="skeleton skeleton--text" style={{ width }} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__content">
        <SkeletonText width="80%" />
        <SkeletonText width="60%" />
      </div>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="loading-dots">
      <span className="loading-dots__dot" />
      <span className="loading-dots__dot" />
      <span className="loading-dots__dot" />
    </div>
  );
}

// Unified Loading component for Suspense fallback
export interface LoadingProps {
  variant?: 'spinner' | 'overlay' | 'dots' | 'skeleton';
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Loading({ variant = 'spinner', message, size = 'medium' }: LoadingProps) {
  switch (variant) {
    case 'overlay':
      return <LoadingOverlay message={message} />;
    case 'dots':
      return <LoadingDots />;
    case 'skeleton':
      return <SkeletonCard />;
    case 'spinner':
    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
          <Spinner size={size} />
          {message && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{message}</p>}
        </div>
      );
  }
}

