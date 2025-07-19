import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Different base paths for different deployment platforms
    base: process.env.CF_PAGES
        ? '/'  // Cloudflare Pages uses root path
        : process.env.NODE_ENV === 'production'
            ? '/peerconnect/'  // GitHub Pages uses repo name
            : '/',  // Local development
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        // Ensure all public files are copied
        copyPublicDir: true,
    },
    publicDir: 'public',
}) 