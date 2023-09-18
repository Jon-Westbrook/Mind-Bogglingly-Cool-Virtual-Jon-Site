import { useGLTF } from '@react-three/drei';
import { AnimationMixer } from 'three';
import { useFrame } from '@react-three/fiber';
import { DRACOLoader } from 'draco3dgltf';
import model from './assets/models/model4.glb';

function Model() {
  let mixer = null;
  const { scene, animations } = useGLTF(model, DRACOLoader);
  mixer = new AnimationMixer(scene);
  mixer.clipAction(animations[2]).play();
  useFrame((state, delta) => {
    mixer.update(delta);
  });
  return <primitive object={scene} />;
}

export default Model;
