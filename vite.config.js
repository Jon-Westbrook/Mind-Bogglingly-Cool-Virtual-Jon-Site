import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
	server: {
		port: 8080,
		host: true,
		open: '/',
	},
	build: {
		cssCodeSplit: false,
		chunkSizeWarningLimit: 650,
		rollupOptions: {
			external: [
				'react',
				'react-dom',
				'react-router-dom',
				'@react-three/fiber',
				'@react-three/drei',
				'three'],
			output: {
				format: 'es',
				manualChunks(id) {
					if (id.includes('node_modules/react/')) {
						return 'react';
					}
					if (id.includes('node_modules/react-dom/')) {
						return 'react-dom';
					}
					if (id.includes('node_modules/react-router-dom/')) {
						return 'react-router-dom';
					}
					if (id.includes('node_modules/@react-three/')) {
						return 'react-three';
					}
					if (id.includes('node_modules/three/')) {
						return 'three';
					}
					return 'vendor'; // misc prefix if not matching any condition
				}
			}
		}
	}
});
