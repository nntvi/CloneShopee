import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), pluginRewriteAll(), visualizer()],
  server: {
    port: 3030
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
