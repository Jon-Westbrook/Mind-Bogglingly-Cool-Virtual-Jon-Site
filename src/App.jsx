import { Suspense, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap } from 'three';
import Loader from './Loader';
import Model from './Model';
import './styles/App.scss';

function App() {
  const canvasRef = useRef();
  const [loaderUnmounted, setLoaderUnmounted] = useState(false);

  useEffect(() => {    
    if (loaderUnmounted) {
      canvasRef.current.classList = 'fade-in';
      console.log(canvasRef.current.classList);
    }
  }, [loaderUnmounted]);

  return (
    <>
      <Router>
        <Suspense fallback={<Loader onUnmount={() => setLoaderUnmounted(true)} />}> 
          <div className="app">
            <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={1} ref={canvasRef}>
              <Model />
            </Canvas>
          </div>
        </Suspense>     
      </Router>
    </>
  );
}

export default App;
