import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import dotenv from 'dotenv';

dotenv.config();


const clientPort = String(process.env['VITE_CLIENT_PORT']);

const basePath = process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]
? String(process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]) + "/"
: "";

export default defineConfig({
    server: {
        host: "127.0.0.1",
        port: Number(clientPort),
    },
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        quasar({
            sassVariables: "quasar-variables.sass",
        }),
    ],
    base: basePath,
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },    

});