import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: "./main.js"
    }
  },
  server: {
    fs: {
      allow: [".."]
    },
    origin: "http://127.0.0.1:5000"
  }
})
