import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const basePath = process.env["DKU_CODE_STUDIO_BROWSER_PATH_{{ cookiecutter.__code_studio_href_env }}"]
? process.env["DKU_CODE_STUDIO_BROWSER_PATH_{{ cookiecutter.__code_studio_href_env }}"] + "/"
: "";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: Number("{{ cookiecutter.port }}"),
    proxy: {
      "/api": {
        target: "http://127.0.0.1:{{ cookiecutter.api_port }}",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      }
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: basePath
})
