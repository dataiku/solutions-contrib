import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { version } from "../package.json";

export default defineConfig({
  build: {
    target: "es2015",
    lib: {
      entry: resolve("../src/index.esm.js"),
      name: "quasar-ui-bs",
      fileName: (format) => `quasar-ui-bs.${format}.js`,
    },
    rollupOptions: {
      input: resolve("../src/index.esm.js"),
      external: ["vue", "quasar"],
      output: {
        globals: { vue: "Vue", quasar: "Quasar" },
      },
    },
  },
  plugins: [vue()],
  define: {
    __UI_VERSION__: version,
  },
});
