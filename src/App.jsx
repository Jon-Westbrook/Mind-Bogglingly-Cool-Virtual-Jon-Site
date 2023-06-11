import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, BoxGeometry, VSMShadowMap, PCFSoftShadowMap, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Vector3, SRGBColorSpace, PlaneGeometry } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.scss';
import model from './assets/model6.glb';
import envMap from './assets/modern_buildings_2k.hdr';
import pages from './assets/pages.json';


function Model() {
  // console.log(props.scene);
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
      // console.log(obj.material);
      // console.log(state.scene.environment);
    }
    if (obj.name === 'Wolf3D_Glasses') {
      console.log(obj);
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
  return (
    <primitive object={scene} />
  );
}


const App = () => {
  const [currentPage, setCurrentPage] = useState(pages[0].name);

  const cameraRef = useRef();
  const controlsRef = useRef();
  const canvasRef = useRef();

  const { animatedPosition } = useSpring({
    animatedPosition: pages.find(p => p.name === currentPage).camPostion,
    config: config.slow,
    onChange: (e) => {
      cameraRef.current.position.set(e.value.animatedPosition[0], e.value.animatedPosition[1], e.value.animatedPosition[2]);
    },
  });
  const { animatedTarget } = useSpring({
    animatedTarget: pages.find(p => p.name === currentPage).camTarget,
    config: config.slow,
    onChange: (e) => {
      controlsRef.current.target.set(e.value.animatedTarget[0], e.value.animatedTarget[1], e.value.animatedTarget[2]);
    },
  });

  const navigate = ({ target }) => {
    const page = pages.find(({ name }) => name === target.innerText);
    setCurrentPage(target.innerText);
  };

  return (
    <Router>
      <div className="app">
        <Canvas
          shadows={{ type: PCFSoftShadowMap }}
          dpr={0.66}
          ref={canvasRef}
          // gl-outputColorSpace={SRGBColorSpace}
        >
          <animated.group>
            <PerspectiveCamera
              makeDefault
              far={1100}
              near={0.1}
              fov={20}
              ref={cameraRef}
            />
          </animated.group>
          <OrbitControls
            ref={controlsRef}
            // enablePan={false}
            minDistance={0.25}
            maxDistance={5}
          />
          <EffectComposer>
            {/* <ChromaticAberration offset={[0.0025, 0.001]} /> */}
            {/* <DepthOfField focusDistance={0.09} focalLength={0.3} bokehScale={4} height={1000} /> */}
            {/* <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} /> */}
            {/* <Noise opacity={1} intensity={200} /> */}
            {/* <Vignette eskil={false} offset={0} darkness={0.5} /> */}
            <directionalLight
              intensity={2}
              castShadow
              shadow-mapSize={1024 * 2}
              shadow-bias={0.000001}
              // shadow-normalBias={-0.00001}
              // shadow-radius={50}
              // shadow-blurSamples={205}
              position={[1, 2, 1]}
              target-position={[0, 20, 0]}

            />
            <Environment
              // ref={envRef}
              files={envMap}
              background
              // blur={0.08}
              exposure={1}
              // ref={env}
              // ground={{ height: 1, radius: 8 }}
            />
            <group>
              <Model />
              {/* <mesh
                geometry={new BoxGeometry(0.75, 0.5, 0.75)}
                material={new MeshStandardMaterial({ color: 'red' })}
                castShadow
                receiveShadow
              /> */}
              <mesh
                geometry={new PlaneGeometry(3, 3)}
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                castShadow
                receiveShadow
              >
                <shadowMaterial />
              </mesh>
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
          {/* <button onClick={changeLight}>ChangeLight</button> */}
        </ul>
        <h1 className="pageTitle">{currentPage}</h1>
      </div>
    </Router>
  );
};
export default App;
