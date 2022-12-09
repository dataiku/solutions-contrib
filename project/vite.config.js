import { defineConfig, searchForWorkspaceRoot } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import image from "@rollup/plugin-image"


export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'quasar-variables.sass',
    })
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./main.js",
      
    }
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
    fs: {
      strict: false,
      allow: [
        "..",
      ]
    },
    origin: "http://127.0.0.1:5173",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@' : resolve("..","./")
    }
  }
})
