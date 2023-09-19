/*
How to Generate:
In ./src/assets/models/
Run Command: npx gltfjsx@6.2.13 [Model Name].glb
Copy the return statement contents here.  
*/

import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { AnimationMixer } from 'three';
import glb from './assets/models/model4.glb';

export default function Model(props) {
	let mixer = null;
	const { scene, nodes, materials, animations } = useGLTF(glb);
	mixer = new AnimationMixer(scene);
	mixer.clipAction(animations[1]).play();
	useFrame((state, delta) => {
		mixer.update(delta);
	});
	const group = useRef();
	return (
		<group ref={group} {...props} dispose={null}>
			<group name="Scene">
				<group name="Armature001">
					<primitive object={scene} />
					<skinnedMesh name="avaturn_body" geometry={nodes.avaturn_body.geometry} material={materials.avaturn_body_material} skeleton={nodes.avaturn_body.skeleton} />
					<skinnedMesh name="avaturn_glasses" geometry={nodes.avaturn_glasses.geometry} material={materials.avaturn_glasses_0_material} skeleton={nodes.avaturn_glasses.skeleton} />
					<skinnedMesh name="avaturn_glasses_glass" geometry={nodes.avaturn_glasses_glass.geometry} material={materials.avaturn_glasses_1_material} skeleton={nodes.avaturn_glasses_glass.skeleton} />
					<skinnedMesh name="avaturn_hair" geometry={nodes.avaturn_hair.geometry} material={materials.avaturn_hair_0_material} skeleton={nodes.avaturn_hair.skeleton} />
					<skinnedMesh name="avaturn_look" geometry={nodes.avaturn_look.geometry} material={materials.avaturn_look_0_material} skeleton={nodes.avaturn_look.skeleton} />
					<skinnedMesh name="avaturn_shoes" geometry={nodes.avaturn_shoes.geometry} material={materials.avaturn_shoes_0_material} skeleton={nodes.avaturn_shoes.skeleton} />
				</group>
			</group>
		</group>
	);
}

useGLTF.preload(glb);
