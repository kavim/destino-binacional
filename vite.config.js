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
            chunkSizeWarningLimit: 500,
            build: {
                rollupOptions: {
                    output: {
                        manualChunks(id) {
                            if (id.includes('lottie-react') || id.includes('/lotties/')) {
                                return 'lottie';
                            }
                            if (id.includes('@tiptap') || id.includes('prosemirror')) {
                                return 'tiptap';
                            }
                            if (id.includes('react-easy-crop')) {
                                return 'cropper';
                            }

                            return undefined;
                        },
                    },
                },
            },
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
