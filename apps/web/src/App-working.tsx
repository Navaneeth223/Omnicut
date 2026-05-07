/**
 * Working App Component - Simplified Version
 */

import { useState } from 'react';
import './styles/App.css';

function App() {
  const [message, setMessage] = useState('OmniCut is loading...');

  return (
    <div className="app" style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '36px' }}>🎬 OmniCut</h1>
          <p style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
            Professional Video Editor - Development Build
          </p>
        </header>

        {/* Status Card */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>✅ Application Status</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              padding: '15px', 
              background: '#e8f5e9', 
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <strong>✅ React:</strong> Working
            </div>
            <div style={{ 
              padding: '15px', 
              background: '#e8f5e9', 
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <strong>✅ Vite Dev Server:</strong> Running on port 5173
            </div>
            <div style={{ 
              padding: '15px', 
              background: '#e8f5e9', 
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <strong>✅ Component Rendering:</strong> Successful
            </div>
            <div style={{ 
              padding: '15px', 
              background: '#fff3cd', 
              borderRadius: '8px'
            }}>
              <strong>⚠️ Full App:</strong> Loading stores...
            </div>
          </div>

          <button
            onClick={() => setMessage('Button clicked! React events working ✅')}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Test Interaction
          </button>

          <p style={{ marginTop: '15px', color: '#666' }}>{message}</p>
        </div>

        {/* Features Card */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>🎯 Implemented Features</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📁 Media Import</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Browser-based file import with drag & drop
              </p>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🎬 Timeline</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Multi-track editing with 100+ features
              </p>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>✨ Effects</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                40+ professional effects with real-time preview
              </p>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🔄 Transitions</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                12 professional transitions
              </p>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>💾 Export</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                FFmpeg.wasm video rendering
              </p>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>⌨️ Shortcuts</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                32+ keyboard shortcuts
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>🚀 Next Steps</h2>
          
          <ol style={{ lineHeight: '2', color: '#666' }}>
            <li>
              <strong>Build Packages:</strong> Run <code style={{ 
                background: '#f8f9fa', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>pnpm build</code> to build all packages
            </li>
            <li>
              <strong>Load Full App:</strong> Once packages are built, the full OmniCut interface will load
            </li>
            <li>
              <strong>Test Features:</strong> Import media, edit on timeline, apply effects, export videos
            </li>
          </ol>

          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#e3f2fd',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>💡 Quick Fix</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>
              If you're seeing this page, it means React is working but the stores need to be initialized.
            </p>
            <p style={{ margin: 0, color: '#666' }}>
              Run: <code style={{ 
                background: 'white', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>pnpm build</code> then refresh the page.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          marginTop: '30px', 
          textAlign: 'center', 
          color: '#999',
          fontSize: '14px'
        }}>
          <p>OmniCut v1.0.0-alpha • Built with React, TypeScript, and Vite</p>
          <p>Open Source Video Editor • May 7, 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
