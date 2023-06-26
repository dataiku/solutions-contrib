import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import image from "@rollup/plugin-image"

import dotenv from "dotenv"
import path from "path";
import fs from "fs";


function getDotenvVar(varName, relativeDotenvPath) {
    if (!relativeDotenvPath) relativeDotenvPath = "..";
    try {
        const valPath = path.resolve(__dirname, relativeDotenvPath, ".env");
        const valUnparsed = fs.readFileSync(valPath);
        const valParsed = dotenv.parse(valUnparsed);
        if (valParsed.hasOwnProperty(varName)) {
            return valParsed[varName];
        } else {
            console.error(`${varName} environment variable does not exist (in the {root}/.env)`);
        }
    } catch (error) {
        console.error(`Create a .env file in the root directory of the project containing ${varName} variable`);
        console.error(error);
    }
    return undefined;
}

let basePath = process.env.DKU_CODE_STUDIO_BROWSER_PATH_5173
? process.env.DKU_CODE_STUDIO_BROWSER_PATH_5173 + "/"
: "";

let {server: serverConfig} = defineConfig({
    server: {
        port: 5173,
        host: "127.0.0.1",
        fs: {
            strict: false,
            allow: [".."],
        },
        // origin: "http://127.0.0.1:5173",
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    }
});

if (!basePath) {
    serverConfig.origin = "http://127.0.0.1:5173";
}

let defaultConfig = defineConfig({
    plugins: [
        {
            ...image(),
            enforce: "pre",
        },
        vue({
            template: { transformAssetUrls },
        }),
        quasar({
            sassVariables: "quasar-variables.sass",
        }),
    ],
    build: {
        manifest: true,
        rollupOptions: {
            input: "./main.js",
        },
    },
    server: serverConfig,
    resolve: {
        alias: {
            '@' : resolve("..","./")
        },
        dedupe: [
            'vue'
        ]
    },
    define: {
        'process.env': {
            FLASK_RUN_PORT: JSON.stringify(+(getDotenvVar("FLASK_RUN_PORT") || 5000)),
        }
    }
})

if (basePath !== "") {
    const { experimental, base } = defineConfig({
        experimental: {
            renderBuiltUrl(filename, { hostType }) {
                if (hostType === "css") {
                    return "/" + filename;
                } else {
                    return { relative: true };
                }
            },
        },
        base: basePath,
    });
    
    defaultConfig.experimental = experimental;
    defaultConfig.base = base;
}

export default defaultConfig;
