import React, { useRef, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimationMixer, MathUtils, Vector3 } from 'three';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, CameraShake } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette, ChromaticAberration, Depth } from '@react-three/postprocessing';
import './App.scss';
import model from './assets/model4.glb';
import envMap from './assets/modern_buildings_2k.hdr';
import pages from './assets/pages.json';

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

// let lerpedCameraPosition = new Vector3();


const App = () => {
  const controlsRef = useRef();
  const [currentPage, setCurrentPage] = useState(pages[0].name);
  const [cameraPosition, setCameraPosition] = useState([0, 1, 3]);
  const [lerpedCameraPosition, setLerpedCameraPosition] = useState(cameraPosition);
  const [cameraTarget, setCameraTarget] = useState([0, 1, 0]);
  // const [lerpedCameraTarget, setLerpedCameraTarget] = useState(cameraTarget);
  // const [cameraRotate, setCameraRotate] = useState(true);
  // const [camMoving, setCamMoving] = useState(false);
  const pos = new Vector3();
  const tgt = new Vector3();

  function CamController() {
    useFrame((state, delta) => {
      // if (camMoving) {
      const posX = MathUtils.damp(cameraPosition[0], state.camera.position.x, 400, delta);
      const pozY = MathUtils.damp(cameraPosition[1], state.camera.position.y, 400, delta);
      const posZ = MathUtils.damp(cameraPosition[2], state.camera.position.z, 400, delta);
      const tarX = MathUtils.damp(cameraTarget[0], tgt.x, 400, delta);
      const tarY = MathUtils.damp(cameraTarget[1], tgt.y, 400, delta);
      const tarZ = MathUtils.damp(cameraTarget[2], tgt.z, 400, delta);
      // setLerpedCameraPosition([posX, pozY, posZ]);
      // setLerpedCameraTarget([tarX, tarY, tarZ]);
      pos.set(posX, pozY, posZ);
      tgt.set(tarX, tarY, tarZ);
      state.camera.position.copy(pos);
      state.camera.lookAt(tgt);
      // }
    });
  }


  const navigate = ({ target }) => {
    const page = pages.find(({ name }) => name === target.innerText);
    const { camPostion, camTarget, camRotate } = page;
    setCurrentPage(target.innerText);
    setCameraPosition(camPostion);
    setCameraTarget(camTarget);
  };

  // const CamController = camController();

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
            // position={lerpedCameraPosition}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            // enableRotate={cameraRotate}
            // maxPolarAngle={Math.PI / 2 + 0.1}
            // minPolarAngle={Math.PI / 2 - 0.1}
            minDistance={0.25}
            maxDistance={5}
            // target={lerpedCameraTarget}
          />
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
            <group position={[0, 0, 0]} scale={0.5}>
              <Model scale={2} />
              <CamController />

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
