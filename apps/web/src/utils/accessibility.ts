/**
 * Accessibility Utilities
 * WCAG 2.1 Level AA compliance helpers
 */

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if user prefers high contrast
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Check if user prefers dark mode
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Trap focus within an element (for modals/dialogs)
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  firstFocusable?.focus();
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

// Get contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast ratio meets WCAG AA standards
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Check if contrast ratio meets WCAG AAA standards
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Generate accessible label from text
export function generateAriaLabel(text: string, context?: string): string {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  return context ? `${cleanText}, ${context}` : cleanText;
}

// Check if element is visible to screen readers
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    parseFloat(style.opacity) > 0
  );
}

// Get accessible name for an element
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  // Check associated label
  if (element instanceof HTMLInputElement) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }
  
  // Check title
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Check alt (for images)
  if (element instanceof HTMLImageElement) {
    return element.alt;
  }
  
  // Fallback to text content
  return element.textContent || '';
}

// Validate keyboard navigation
export function validateKeyboardNavigation(container: HTMLElement): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for interactive elements without keyboard access
  const interactiveElements = container.querySelectorAll<HTMLElement>(
    'div[onclick], span[onclick], [role="button"], [role="link"]'
  );
  
  interactiveElements.forEach((element) => {
    const tabindex = element.getAttribute('tabindex');
    if (tabindex === null || parseInt(tabindex) < 0) {
      issues.push(`Element ${element.tagName} with role="${element.getAttribute('role')}" is not keyboard accessible`);
    }
  });
  
  // Check for missing ARIA labels on interactive elements
  const buttons = container.querySelectorAll<HTMLElement>('button, [role="button"]');
  buttons.forEach((button) => {
    const accessibleName = getAccessibleName(button);
    if (!accessibleName) {
      issues.push(`Button without accessible name: ${button.outerHTML.substring(0, 50)}...`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

// Add screen reader only class to CSS
export function addScreenReaderOnlyStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    .sr-only-focusable:focus {
      position: static;
      width: auto;
      height: auto;
      padding: inherit;
      margin: inherit;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
  `;
  document.head.appendChild(style);
}

// Initialize accessibility features
export function initAccessibility() {
  // Add screen reader only styles
  addScreenReaderOnlyStyles();
  
  // Log accessibility preferences
  console.group('[Accessibility] User Preferences');
  console.log('Reduced Motion:', prefersReducedMotion());
  console.log('High Contrast:', prefersHighContrast());
  console.log('Dark Mode:', prefersDarkMode());
  console.groupEnd();
  
  // Add focus visible polyfill for older browsers
  if (!('focus-visible' in document.documentElement.style)) {
    document.body.classList.add('js-focus-visible');
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}
