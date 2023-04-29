import React, { useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
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
  {
    name: 'Home',
    camPostion: [0, 1, 3],
    camTarget: [0, 1, 0],
    camRotate: true,
  }, {
    name: 'About',
    camPostion: [-0.2, 1.6, 0.1],
    camTarget: [0, 1.7, 0.1],
    camRotate: false,
  }, {
    name: 'Experience',
    camPostion: [0.3, 0.75, -0.2],
    camTarget: [0.3, 0.75, 0.5],
    camRotate: false,
  }, {
    name: 'Work',
    camPostion: [0, 1.2, 1],
    camTarget: [0.1, 1, 0.5],
    camRotate: false,
  }, {
    name: 'Contact',
    camPostion: [0, 1, 0],
    camTarget: [0.5, 2, 0.5],
    camRotate: false,
  }, {
    name: 'Butt Shot!',
    camPostion: [0, 1, -1],
    camTarget: [0.1, 1, 0],
    camRotate: false,
  }, {
    name: 'Left Cheek 🍑',
    camPostion: [0.3, 0.7, -0.3],
    camTarget: [-0.1, 1, 0],
    camRotate: false,
  },
];


const App = () => {
  const [currentPage, setCurrentPage] = useState(pages[0].name);
  const [cameraPosition, setCameraPosition] = useState([0, 1, 3]);
  const [cameraTarget, setCameraTarget] = useState([0, 1, 0]);
  const [cameraRotate, setCameraRotate] = useState(true);

  const navigate = ({ target }) => {
    const page = pages.find(({ name }) => name === target.innerText);
    const { camPostion, camTarget, camRotate } = page;

    setCurrentPage(target.innerText);
    setCameraPosition(camPostion);
    setCameraTarget(camTarget);
    setCameraRotate(camRotate);
  };

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
            position={cameraPosition}
            frustumCulled
          />
          <OrbitControls
            enablePan={false}
            enableRotate={cameraRotate}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 2 - 0.1}
            minDistance={0.25}
            maxDistance={5}
            target={cameraTarget}
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
        <ul className="nav">
          {
          pages.map(page => (
            <li key={page.name}>
              <button type="button" onClick={navigate}>{page.name}</button>
            </li>
          ))
          }
        </ul>
        <h1 className="pageTitle">{currentPage}</h1>
      </div>
    </Router>
  );
};
export default App;
