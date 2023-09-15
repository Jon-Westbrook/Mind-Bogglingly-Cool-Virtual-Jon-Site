import React, { useEffect, useRef, useState } from 'react';
import { Link, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer, PCFSoftShadowMap } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.scss';
import model from './assets/models/model2.glb';
import envMap from './assets/img/environments/hamburg_canal_2k.hdr';
import pages from './assets/content/pages.json';

function Pages(props) {
  const location = useLocation();
  const { setCurrentPage } = props;
  useEffect(() => {
    const page = location.pathname.split('/')[1] || 'View1';
    setCurrentPage(page);
  }, [location]);
  return null;
}

function Model() {
  let mixer = null;
  const { scene, animations } = useGLTF(model);

  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[1]).play();

  useFrame((state, delta) => {
    // mixer.update(delta);
    // console.log(cameraRef.current);
  });

  return <primitive object={scene} />;
}

function Camera() {
  const cameraRef = useRef();
  // const cameraTarget = {
  //   x: 0,
  //   y: 1.65,
  //   z: 0
  // };

  useFrame(() => {
    // cameraTarget.x -= 0.001;
    // cameraTarget.y -= 0.0005;
    // cameraRef.current.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
  });


  return (
    <PerspectiveCamera
      makeDefault
      far={1100}
      near={0.1}
      fov={20}
      ref={cameraRef}
      position={[0, 1.65, 1.55]}
    />
  );
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('View1');
  const controlsRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);


  return (
    <Router>
      <Pages setCurrentPage={setCurrentPage} />

      <div className="app">
        <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={0.5} ref={canvasRef}>

          <Camera />

          <EffectComposer>
            <ChromaticAberration offset={[0.0004, 0.0004]} />
            <DepthOfField focusDistance={0.1} focalLength={3} bokehScale={16} height={1024} />
            <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} />
            <Vignette eskil={false} offset={0} darkness={0.5} />
            <directionalLight intensity={3} castShadow shadow-mapSize={1024 * 2} shadow-bias={0.000001} position={[1, 2, 1]} target-position={[0, 20, 0]} />

            <Environment
              files={envMap}
              background
              exposure={1}
              blur={0.1}
              ground={{ height: 1, radius: 8 }}
            />

            <group>
              <Model />
            </group>
          </EffectComposer>
        </Canvas>

        <ul className="nav">
          {pages.map(page => (
            <li key={page.name}>
              <Link to={`/${page.name}`}>{page.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Router>
  );
};

export default App;
