import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "../package.json";

let format = process.env.format;

let indexPath =
  format === "es"
    ? "../src/index.esm.js"
    : format === "cjs"
    ? "../src/index.common.js"
    : "../src/index.umd.js";

let rollupOutput = {
  globals: { vue: "Vue", quasar: "Quasar" },
};

if (format === "umd") {
  Object.assign(rollupOutput, {
    name: "QuasarBs",
  });
}

export default defineConfig({
  build: {
    target: "es2015",
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
      external: ["vue", "quasar"],
      output: rollupOutput,
    },
  },
  plugins: [vue()],
  define: {
    __UI_VERSION__: version,
  },
});
