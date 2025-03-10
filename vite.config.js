import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/duckdb-ws': {
                target: 'http://localhost:4000',
                ws: true,
            }
        },
    }
});
