import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "../package.json";
import dts from "vite-plugin-dts";

console.log(`version : ${version}`);
console.log(typeof version);

let format = process.env.format;

let indexPath =
  format === "es"
    ? "../src/index.esm.js"
    : format === "cjs"
    ? "../src/index.common.js"
    : "../src/index.umd.js";

let rollupOutput = {
  globals: {
    vue: "Vue",
    quasar: "Quasar",
    lodash: "_",
    axios: "axios",
  },
};

const plugins = [vue()];

if (format === "es") {
  plugins.push(
    dts({
      root: "../src",
      outputDir: "../dist/types",
    })
  );
}

if (format === "umd") {
  Object.assign(rollupOutput, {
    name: "QuasarBs",
  });
}

export default defineConfig({
  define: {
    __UI_VERSION__: JSON.stringify(version),
  },
  build: {
    target: "es6",
    emptyOutDir: false,
    outDir: "../dist",
    lib: {
      entry: resolve(indexPath),
      name: "quasar-ui-bs",
      fileName: (format) => `quasar-ui-bs.${format}.js`,
      formats: [format],
    },
    rollupOptions: {
      input: resolve(indexPath),
      external: ["vue", "quasar", "lodash", "axios", "@quasar/extras/mdi-v6"],
      output: rollupOutput,
    },
  },
  plugins: plugins,
});
