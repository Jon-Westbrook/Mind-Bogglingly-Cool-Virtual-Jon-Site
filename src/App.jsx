import React, { useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer, BoxGeometry, MeshNormalMaterial } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import './App.scss';
import model from './assets/model3.glb';
import envMap from './assets/modern_buildings_2k.hdr';

function Model(props) {
  const { scale } = props;
  let mixer = null;
  const { scene, animations } = useGLTF(model);
  scene.traverse((obj) => { obj.frustumCulled = false; });
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[1]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });
  return <primitive object={scene} position={[0, 0, 0]} scale={scale} />;
}

const pages = [
  'About',
  'Experience',
  'Work',
  'Contact',
];

const App = () => {
  const camTarget = useRef();

  return (
    <Router>
      <div className="app">
        <Canvas
          shadows={{ type: 'PCFShadowMap' }}
        >
          <PerspectiveCamera
            makeDefault
            far={1100}
            near={0.1}
            position={[0, 1, 2.5]}
            frustumCulled
          />
          <OrbitControls
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 2 - 0.1}
            minDistance={0.25}
            maxDistance={2.5}
            target-y={1}
          />
          <EffectComposer>
            {/* <DepthOfField focusDistance={5} focalLength={10} bokehScale={3} height={400} /> */}
            {/* <BokehEffect /> */}
            <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} />
            {/* <Noise opacity={0.02} /> */}
            <Vignette eskil={false} offset={0} darkness={0.5} />
            <pointLight intensity={1} position={[2, 10, 20]} />
            <Environment
              files={envMap}
              exposure={5}
              ground={{ height: 1, radius: 8 }}
            />
            <group position={[0, 0, 0]} scale={0.5}>
              <Model scale={2} />
            </group>
          </EffectComposer>
        </Canvas>
      </div>
    </Router>
  );
};
export default App;
