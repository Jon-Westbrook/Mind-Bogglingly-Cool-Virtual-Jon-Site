import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './App.scss';
import model from './assets/model1.gltf';


function Model() {
  let mixer = null;
  const { scene, animations } = useGLTF(model);
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[0]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });
  return <primitive object={scene} position={[0, 0, 0]} />;
}


const App = () => {
  console.log('here');
  return (
    <Router>
      <div className="app">
        <Canvas
          shadows={{ type: 'PCFShadowMap' }}
        >
          <pointLight intensity={5} position={[2, 10, 20]} />
          <group position={[0, 0, 0]}>
            <gridHelper />
            <Model />
          </group>
          <OrbitControls />
        </Canvas>
      </div>
    </Router>
  );
};
export default App;
