import { AnimationMixer, PCFSoftShadowMap } from 'three';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useGLTF, Environment, PerspectiveCamera, useProgress, PresentationControls } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import './styles/App.scss';
import model from './assets/models/model2.glb';
import envMap from './assets/img/environments/kloofendal_43d_clear_puresky_4k.hdr';
import pages from './assets/content/pages.json';

function Loader() {
  const { progress } = useProgress();
  return (
    <div className={`loader-container ${Math.round(progress) === 100 ? 'loaded' : ''}`}>
      <div className="loader">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${Math.round(progress)}%` }} />
          <div className="loading-text" style={{ marginTop: '20px' }}>Yes, it&rsquo;s big...{Math.round(progress)}%</div>
        </div>
      </div>
    </div>
  );
}

function Pages(props) {
  const location = useLocation();
  const { setCurrentPage } = props;
  useEffect(() => {
    const page = location.pathname.split('/')[1] || 'View1';
    setCurrentPage(page);
  }, [location]);
  return null;
}

function NavMenu({ pageList, currentPage }) {
  return (
    <ul className="nav">
      {pageList.map(page => (
        <li key={page.url}>
          <Link
            to={`/${page.url}`}
            className={currentPage === page.url ? 'active-link' : ''}
          >
            {page['link-copy']}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Model() {
  let mixer = null;
  const { scene, animations } = useGLTF(model);

  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[1]).play();

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return <primitive object={scene} />;
}

function Camera(props) {
  const { camPosition, camTarget, currentPage } = props;
  const cameraRef = useRef();

  useEffect(() => {
    if (cameraRef.current && camTarget && camPosition) {
      // console.log(`camPosition: ${camPosition}`, `camTarget: ${camTarget}`);
      cameraRef.current.position.set(camPosition[0], camPosition[1], camPosition[2]);
      cameraRef.current.lookAt(camTarget[0], camTarget[1], camTarget[2]);
    }
  }, [camPosition, camTarget, currentPage]);

  return (
    <PerspectiveCamera
      makeDefault
      far={1100}
      near={0.1}
      fov={20}
      ref={cameraRef}
    />
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('View1');
  const [currentCamPosition, setCurrentCamPosition] = useState([0, 1.7, 2]);
  const [currentCamTarget, setCurrentCamTarget] = useState([0, 1.55, 0]);
  const canvasRef = useRef();
  const { active } = useProgress();

  useEffect(() => {
    if (!active && currentPage) {
      const { camPosition, camTarget } = pages.find(page => page.url === currentPage);
      setCurrentCamPosition(camPosition);
      setCurrentCamTarget(camTarget);
    }
  }, [active, currentPage]);

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <div className="app">

          <Pages setCurrentPage={setCurrentPage} />

          <Canvas shadows={{ type: PCFSoftShadowMap }} dpr={1} ref={canvasRef}>
            <Camera
              camPosition={currentCamPosition}
              camTarget={currentCamTarget}
            />
            <EffectComposer>
              <directionalLight intensity={0.5} castShadow shadow-mapSize={1024 * 2} shadow-bias={0.000001} position={[0, 1.7, 0]} target-position={[0, 1.55, 0]} />
              <Vignette eskil={false} offset={0} darkness={0.9} />
              <Environment
                files={envMap}
                background
                exposure={1}
                blur={0}
                ground={{ height: 1, radius: 8 }}
              />
              <PresentationControls
                enabled
                global={false}
                cursor
                snap
                speed={3}
                zoom={1}
                polar={[0, Math.PI / 20]}
                azimuth={[-Infinity, Infinity]}
                config={{ mass: 1, tension: 170, friction: 26 }}
              ><Model />
              </PresentationControls>

            </EffectComposer>
          </Canvas>
          <NavMenu pageList={pages} currentPage={currentPage} />
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
