import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import './App.scss';
import model from './assets/model2.glb';
import envMap from './assets/blue_photo_studio_2k.hdr';

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

const App = () => (
  <Router>
    <div className="app">
      <Canvas
        shadows={{ type: 'PCFShadowMap' }}
      >
        <OrbitControls />
        <pointLight intensity={1} position={[2, 10, 20]} />
        <Environment files={envMap} exposure={0.5} ground={{ height: 3, radius: 6 }} />

        <group position={[0, -1, 0]} scale={2}>
          <Model />
        </group>
      </Canvas>
    </div>
  </Router>
);
export default App;
