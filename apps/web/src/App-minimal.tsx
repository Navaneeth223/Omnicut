/**
 * Minimal App Component for Testing
 */

import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>OmniCut - Minimal Test</h1>
      <p>If you see this, React is working!</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h2>Status:</h2>
        <ul>
          <li>✅ React rendering</li>
          <li>✅ State management</li>
          <li>✅ Event handlers</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
