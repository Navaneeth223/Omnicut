/**
 * Performance Monitoring Utilities
 * Track and optimize app performance
 */

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  private initObservers() {
    // Observe paint timing
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              console.log('[Performance] FCP:', entry.startTime.toFixed(2), 'ms');
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          console.log('[Performance] LCP:', lastEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
            console.log('[Performance] FID:', this.metrics.fid.toFixed(2), 'ms');
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
              this.metrics.cls = clsValue;
              console.log('[Performance] CLS:', clsValue.toFixed(4));
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('[Performance] Observer not supported:', error);
      }
    }

    // Time to First Byte
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        this.metrics.ttfb = timing.responseStart - timing.requestStart;
        console.log('[Performance] TTFB:', this.metrics.ttfb.toFixed(2), 'ms');
      });
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  logMetrics() {
    console.group('[Performance] Metrics Summary');
    console.table(this.metrics);
    console.groupEnd();
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request idle callback wrapper
export function requestIdleTask(callback: () => void, options?: IdleRequestOptions) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1) as any;
  }
}

// Cancel idle callback wrapper
export function cancelIdleTask(id: number) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Measure component render time
export function measureRender(componentName: string, callback: () => void) {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16.67) {
    // Longer than one frame (60fps)
    console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms (> 16.67ms)`);
  }
}

// Check if device is low-end
export function isLowEndDevice(): boolean {
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for connection type
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  return cores <= 2 || memory <= 2 || effectiveType === 'slow-2g' || effectiveType === '2g';
}

// Get performance grade
export function getPerformanceGrade(metrics: Partial<PerformanceMetrics>): 'A' | 'B' | 'C' | 'D' | 'F' {
  let score = 100;
  
  // FCP scoring (< 1.8s = good)
  if (metrics.fcp) {
    if (metrics.fcp > 3000) score -= 20;
    else if (metrics.fcp > 1800) score -= 10;
  }
  
  // LCP scoring (< 2.5s = good)
  if (metrics.lcp) {
    if (metrics.lcp > 4000) score -= 20;
    else if (metrics.lcp > 2500) score -= 10;
  }
  
  // FID scoring (< 100ms = good)
  if (metrics.fid) {
    if (metrics.fid > 300) score -= 20;
    else if (metrics.fid > 100) score -= 10;
  }
  
  // CLS scoring (< 0.1 = good)
  if (metrics.cls) {
    if (metrics.cls > 0.25) score -= 20;
    else if (metrics.cls > 0.1) score -= 10;
  }
  
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();

// Log metrics on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.logMetrics();
  });
}
