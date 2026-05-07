/**
 * Error Boundary Component
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '900px', 
          margin: '0 auto',
          background: '#f8f9fa',
          minHeight: '100vh'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: '#e74c3c', margin: '0 0 20px 0' }}>
              ⚠️ Application Error
            </h1>
            
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
              OmniCut encountered an error and couldn't render. This is likely due to:
            </p>

            <ul style={{ color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
              <li>Missing or incorrectly built packages</li>
              <li>Import errors from @omnicut/* packages</li>
              <li>Type mismatches in the store</li>
            </ul>

            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffc107',
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Error Message:</h3>
              <pre style={{ 
                background: 'white', 
                padding: '15px', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '14px',
                color: '#d32f2f',
                margin: 0
              }}>
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>

            {this.state.error?.stack && (
              <details style={{ marginBottom: '20px' }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  padding: '10px', 
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  Stack Trace
                </summary>
                <pre style={{ 
                  background: '#f8f9fa', 
                  padding: '15px', 
                  borderRadius: '4px', 
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px'
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{ 
                  padding: '12px 24px', 
                  background: '#3498db', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                🔄 Reload Page
              </button>
              
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{ 
                  padding: '12px 24px', 
                  background: '#95a5a6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                🗑️ Clear Cache & Reload
              </button>
            </div>

            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: '#e3f2fd',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💡 Quick Fix:</h3>
              <p style={{ margin: '0', color: '#666' }}>
                Try running: <code style={{ 
                  background: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>pnpm build</code> in the project root to rebuild all packages.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
