import React, { useEffect, useRef, useState } from 'react';
import { Link, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, PCFSoftShadowMap, MeshPhysicalMaterial } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.scss';
import model from './assets/model.glb';
import envMap from './assets/modern_buildings_2k.hdr';
import pages from './assets/pages.json';

function Pages(props) {
  const location = useLocation();
  const { setCurrentPage } = props;
  useEffect(() => {
    const page = location.pathname.split('/')[2] || 'Home';
    setCurrentPage(page);
  }, [location]);

  return <div />;
}

function Model(props) {
  const { setCurrentPage } = props;
  const state = useThree();
  let mixer = null;
  const { scene, animations } = useGLTF(model);
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.material.envMap = state.scene.environment;
      obj.material.emissiveIntensity = 3;
      obj.material.needsUpdate = true;
    }
    if (obj.name === 'Wolf3D_Glasses') {
      const newMat = new MeshPhysicalMaterial();
      newMat.map = obj.material.map;
      newMat.envMap = state.scene.environment;
      newMat.reflectivity = 0.75;
      newMat.transmission = 0.9;
      newMat.metalness = 0.25;
      newMat.roughness = 0.1;
      newMat.thickness = 0.01;
      obj.material = newMat;
    }
    // obj.frustumCulled = false;
  });
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[0]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    console.log('model loaded', scene);
    setCurrentPage('Home');
  }, [scene]);

  return <primitive object={scene} />;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('');

  const cameraRef = useRef();
  const controlsRef = useRef();
  const canvasRef = useRef();

  const { animatedPosition } = useSpring(
    {
      animatedPosition: pages.find((p) => p.name === currentPage).camPostion,
      config: config.slow,
      onChange: (e) => {
        if (cameraRef.current) cameraRef.current.position.set(e.value.animatedPosition[0], e.value.animatedPosition[1], e.value.animatedPosition[2]);
      },
    },
    [currentPage]
  );
  const { animatedTarget } = useSpring(
    {
      animatedTarget: pages.find((p) => p.name === currentPage).camTarget,
      config: config.slow,
      onChange: (e) => {
        if (controlsRef.current) {
          controlsRef.current.target.set(e.value.animatedTarget[0], e.value.animatedTarget[1], e.value.animatedTarget[2]);
        }
      },
    },
    [currentPage]
  );

  return (
    <Router>
      <Pages setCurrentPage={setCurrentPage} />
      <div className='app'>
        <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={0.5} ref={canvasRef}>
          <animated.group>
            <PerspectiveCamera makeDefault far={1100} near={0.1} fov={20} ref={cameraRef} />
          </animated.group>
          <OrbitControls
            ref={controlsRef}
            // enablePan={false}
            minDistance={0.25}
            maxDistance={5}
          />
          <EffectComposer>
            <ChromaticAberration offset={[0.0004, 0.0004]} />
            <DepthOfField focusDistance={0.25} focalLength={2.5} bokehScale={16} height={1024} />
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} />
            {/* <Noise opacity={1} intensity={200} /> */}
            <Vignette eskil={false} offset={0} darkness={0.5} />
            <directionalLight intensity={3} castShadow shadow-mapSize={1024 * 2} shadow-bias={0.000001} position={[1, 2, 1]} target-position={[0, 20, 0]} />
            <Environment
              files={envMap}
              background
              // blur={0.01}
              exposure={1}
              // ground={{ height: 1, radius: 8 }}
            />
            <group>
              <Model setCurrentPage={setCurrentPage} />
            </group>
          </EffectComposer>
        </Canvas>
        <ul className='nav'>
          {pages.map((page) => (
            <li key={page.name}>
              {/* <button type="button" onClick={navigate}>{page.name}</button> */}
              <Link to={`/${page.name}`}>{page.name}</Link>
            </li>
          ))}
          {/* <button onClick={changeLight}>ChangeLight</button> */}
        </ul>
        <h1 className='pageTitle'>{currentPage}</h1>
      </div>
    </Router>
  );
};
export default App;
