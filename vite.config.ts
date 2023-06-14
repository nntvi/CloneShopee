// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), pluginRewriteAll(), visualizer()],
  test: {
    environment: 'jsdom'
    // setupFiles: path.resolve(__dirname, './vitest.setup.js')
  },
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
