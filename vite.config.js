import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5179,
    strictPort: true,
    proxy: {'/pvp-socket':{target:'ws://127.0.0.1:5181',ws:true,rewrite:()=>'/pvp'}},
    watch: {
      // Production sources and backups can be locked during asset generation.
      // Runtime assets in public and application source in src remain watched.
      ignored: [
        '**/.orchestration/**', '**/art-source/**', '**/backup/**', '**/backups/**',
        '**/dist/**', '**/dist-apk/**', '**/dist-electron/**', '**/dist-pacote/**',
        '**/android/**', '**/.gradle/**',
        '**/*.apk', '**/*.aab', '**/*.exe', '**/*.blockmap',
      ]
    }
  }
})
