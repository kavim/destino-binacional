import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
    if (command === 'build') {
        process.env = { ...process.env, ...loadEnv(command, process.cwd()) };
        return {
            plugins: [
                laravel({
                    input: 'resources/js/app.tsx',
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
                    input: 'resources/js/app.tsx',
                    refresh: true,
                }),
                react(),
            ],
            server: {
                https: false,
                hmr: {
                    host: process.env.APP_URL,
                },
                // Se abrires o dev server do Vite diretamente, /storage continua a servir-se do Laravel.
                proxy: {
                    '^/storage': {
                        target: process.env.VITE_LARAVEL_ORIGIN || 'http://127.0.0.1:8000',
                        changeOrigin: true,
                    },
                },
            },
            define: {
                "global": {},
            },
        }
    }
})
