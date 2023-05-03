import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
    if (command === 'build') {
        process.env = { ...process.env, ...loadEnv(command, process.cwd()) };
        return {
            plugins: [
                laravel({
                    input: 'resources/js/app.jsx',
                    refresh: true,
                }),
                react(),
            ],
            server: {
                https: true,
                hmr: {
                    host: process.env.APP_URL,
                }
            },
            chunkSizeWarningLimit: 1000000, // set chunk size limit to 1 MB
        }
    } else {
        // command === 'dev or something else'
        process.env = { ...process.env, ...loadEnv(command, process.cwd()) };
        return {
            plugins: [
                laravel({
                    input: 'resources/js/app.jsx',
                    refresh: true,
                }),
                react(),
            ],
            server: {
                https: false,
                hmr: {
                    host: process.env.APP_URL,
                },
            },
            define: {
                "global": {},
            },
        }
    }
})
