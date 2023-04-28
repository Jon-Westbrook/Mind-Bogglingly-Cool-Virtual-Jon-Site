import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
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
        <PerspectiveCamera
          makeDefault
          far={2000}
          near={1}
          position={[0, 1, 10]}
        />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={(Math.PI * 0.5) - 0.2}
          minPolarAngle={(Math.PI * 0.5) - 0.5}
        />
        <pointLight intensity={1} position={[2, 10, 20]} />
        <Environment files={envMap} exposure={0.5} ground={{ height: 3, radius: 8 }} />

        <group position={[0, 0, 0]} scale={2}>
          <Model />
        </group>
      </Canvas>
    </div>
  </Router>
);
export default App;
