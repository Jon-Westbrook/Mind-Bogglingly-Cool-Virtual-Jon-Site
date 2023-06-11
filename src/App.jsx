import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, BoxGeometry, MeshStandardMaterial, Object3D, Vector3, SRGBColorSpace } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { useSpring, animated, config } from '@react-spring/three';
import './App.scss';
import model from './assets/model6.glb';
import envMap from './assets/modern_buildings_2k.hdr';
import pages from './assets/pages.json';

let _lightTarget;

// const vec = [0, 1, 0];
const obj = new Object3D({ position: new Vector3(10, 0, 0) });

// setInterval(() => {
//   obj.position.x += 0.1;
// }, 100);

function Model(props) {
  let mixer = null;
  const { scene, animations } = useGLTF(model);
  scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      // console.log(env, obj.material);
    }
    // obj.frustumCulled = false;
  });
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[0]).play();
  useFrame((state, delta) => {
    // mixer.update(delta);
  });
  return (
    <primitive object={scene} />
  );
}

const App = () => {
  const [currentPage, setCurrentPage] = useState(pages[0].name);

  const cameraRef = useRef();
  const controlsRef = useRef();
  const lt = useRef();
  const dl = useRef();
  const [vec, setVec] = useState([0, 3, 0]);

  // console.log(dl);
  // const env = useRef();
  // const pointLight = useRef();

  const { animatedPosition } = useSpring({
    animatedPosition: pages.find(p => p.name === currentPage).camPostion,
    config: config.default,
    onChange: (e) => {
      cameraRef.current.position.set(e.value.animatedPosition[0], e.value.animatedPosition[1], e.value.animatedPosition[2]);
    },
  });
  const { animatedTarget } = useSpring({
    animatedTarget: pages.find(p => p.name === currentPage).camTarget,
    config: config.default,
    onChange: (e) => {
      controlsRef.current.target.set(e.value.animatedTarget[0], e.value.animatedTarget[1], e.value.animatedTarget[2]);
    },
  });

  const navigate = ({ target }) => {
    const page = pages.find(({ name }) => name === target.innerText);
    setCurrentPage(target.innerText);
  };

  const changeLight = () => {
    setVec([(Math.random() * 4) - 2, (Math.random() * 4) - 2, (Math.random() * 4) - 2]);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigate({ target: { innerText: 'Home' } });
  //   }, 1000);
  // }, []);

  return (
    <Router>
      <div className="app">
        <Canvas
          shadows={{ type: 'PCFSoftShadowMap' }}
          dpr={0.75}
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
            <DepthOfField focusDistance={0.1} focalLength={1} bokehScale={20} height={400} />
            <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} height={300} />
            {/* <Noise opacity={1} intensity={200} /> */}
            <Vignette eskil={false} offset={0} darkness={0.5} />
            <directionalLight
              intensity={4}
              // distance={2}
              castShadow
              shadow-mapSize={1024 * 8}
              shadow-bias={-0.00001}
              // shadow-radius={0.9}
              position={[1, 2, 1]}
              target-position={vec}
              // target={obj}
              // target={lt.current}
              // ref={dl}
            />
            {/* <pointLight
              intensity={1}
              castShadow
              distance={100}
              postion={[2, 1, 1]}
              // target={obj}
            /> */}
            {/* <pointLightHelper pointLight={pointLight.current} /> */}
            <Environment
              files={envMap}
              background
              // blur={0.08}
              exposure={1}
              // ref={env}
              // ground={{ height: 1, radius: 8 }}
            />
            <group>
              <Model />
              <mesh
                geometry={new BoxGeometry(0.75, 0.5, 0.75)}
                material={new MeshStandardMaterial({ color: 'red' })}
                castShadow
                receiveShadow
              />
              <mesh
                geometry={new BoxGeometry(2, 0.05, 2)}
                material={new MeshStandardMaterial({ color: 'gray' })}
                position={[0, -0.25, 0]}
                castShadow
                receiveShadow
              />
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
          <button onClick={changeLight}>ChangeLight</button>
        </ul>
        <h1 className="pageTitle">{currentPage}</h1>
      </div>
    </Router>
  );
};
export default App;
