/**
 * Safe App Component with Error Boundary
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#e74c3c' }}>⚠️ Application Error</h1>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h2>Error Details:</h2>
            <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
              {this.state.error?.message}
            </pre>
            <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
              {this.state.error?.stack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function SafeApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🎬 OmniCut</h1>
      <p>Loading application...</p>
      <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
        <p>✅ React is working</p>
        <p>✅ Component rendering</p>
        <p>⏳ Loading stores...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SafeApp />
    </ErrorBoundary>
  );
}

export default App;
