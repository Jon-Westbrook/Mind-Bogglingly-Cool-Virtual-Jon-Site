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
	base: "./"
});
