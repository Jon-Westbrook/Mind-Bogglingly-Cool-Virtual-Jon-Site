import React from 'react';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer } from 'three';
import { useFrame } from '@react-three/fiber';
import model from './assets/models/model2.glb';

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

export default Model; // Export Model as the default export
