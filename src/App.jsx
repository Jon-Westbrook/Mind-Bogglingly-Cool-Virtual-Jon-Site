import React, { useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer, MathUtils, Vector3 } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.scss';
import model from './assets/model4.glb';
import envMap from './assets/modern_buildings_2k.hdr';
import pages from './assets/pages.json';

function Model(props) {
  let mixer = null;
  const { scene, animations } = useGLTF(model);
  scene.traverse((obj) => { obj.frustumCulled = false; });
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[1]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });
  return (
    <primitive object={scene} />
  );
}

const App = () => {
  const [currentPage, setCurrentPage] = useState(pages[0].name);

  const cam = useRef();
  const { animatedPosition } = useSpring({
    animatedPosition: pages.find(p => p.name === currentPage).camPostion,
    config: config.default,
  });

  const { animatedTarget } = useSpring({
    animatedTarget: pages.find(p => p.name === currentPage).camTarget,
    config: config.default,
    onChange: (e) => {
      const pos = new Vector3(e.value.animatedTarget[0], e.value.animatedTarget[1], e.value.animatedTarget[2]);
      cam.current.lookAt(pos);
    },
  });

  const navigate = ({ target }) => {
    const page = pages.find(({ name }) => name === target.innerText);
    setCurrentPage(target.innerText);
  };

  return (
    <Router>
      <div className="app">
        <Canvas shadows={{ type: 'PCFShadowMap' }}>
          <animated.group position={animatedPosition}>
            <PerspectiveCamera
              makeDefault
              far={1100}
              near={0.1}
              ref={cam}
            />
          </animated.group>

          {/* <OrbitControls
              // ref={controlsRef}
              enablePan={false}
            // enableRotate={cameraRotate}
            // maxPolarAngle={Math.PI / 2 + 0.1}
            // minPolarAngle={Math.PI / 2 - 0.1}
              minDistance={0.25}
              maxDistance={5}
            /> */}
          <EffectComposer>
            <ChromaticAberration
              offset={[0.005, 0.001]}
            />
            <DepthOfField focusDistance={0.1} focalLength={1} bokehScale={20} height={400} />
            {/* <BokehEffect /> */}
            <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} />
            {/* <Noise opacity={0.2} intensity={20} /> */}
            <Vignette eskil={false} offset={0} darkness={0.5} />
            <pointLight intensity={2} position={[2, 10, 20]} />
            <Environment
              files={envMap}
              exposure={5}
              ground={{ height: 1, radius: 8 }}
            />
            <group>
              <Model />
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
