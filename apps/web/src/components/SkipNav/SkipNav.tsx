/**
 * Skip Navigation Component
 * Accessibility feature for keyboard navigation
 */

import './SkipNav.css';

export function SkipNav() {
  return (
    <div className="skip-nav">
      <a href="#main-content" className="skip-nav__link">
        Skip to main content
      </a>
      <a href="#timeline" className="skip-nav__link">
        Skip to timeline
      </a>
      <a href="#media-pool" className="skip-nav__link">
        Skip to media pool
      </a>
    </div>
  );
}
