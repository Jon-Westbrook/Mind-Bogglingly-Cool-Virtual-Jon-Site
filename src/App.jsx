import { Suspense, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap } from 'three';
import Loader from './Loader';
import Model from './Model';
import './styles/App.scss';

function App() {
  const canvasRef = useRef();
  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}> 
          <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={1} ref={canvasRef}>
            <Model />
          </Canvas>
        </Suspense>     
      </Router>
    </>
  );
}



export default App;
