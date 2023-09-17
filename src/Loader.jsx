import React from 'react';
import { useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <div className={`loader-container ${Math.round(progress) === 100 ? 'loaded' : ''}`}>
      <div className="loader">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${Math.round(progress)}%` }} />
          <div className="loading-text" style={{ marginTop: '20px' }}>Yes, it&rsquo;s big...{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
