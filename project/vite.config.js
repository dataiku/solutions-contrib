import { defineConfig, searchForWorkspaceRoot } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"


export default defineConfig({
  plugins: [vue()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./main.js",
      
    }
  },
  server: {
    port: 5173,
    fs: {
      strict: false,
      allow: [
        "..",
      ]
    },
    origin: "http://127.0.0.1:5173"
  },
  resolve: {
    alias: {
      '@' : resolve("..","./")
    }
  }
})
