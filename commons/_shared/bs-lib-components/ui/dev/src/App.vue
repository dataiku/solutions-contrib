<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ServerApi } from "../../dist/quasar-ui-bs.es";
import DevServerApi from "../../src/server_api";

export default defineComponent({
  name: "App",
  mounted() {
    function getNodeEnv() {
      try {
        return process.env.NODE_ENV;
      } catch (error) {
        return "production";
      }
    }

    function getEnvVar(key: string) {
      try {
        return process.env[key];
      } catch (error) {
        console.warn(`${key} is not defined as the environment variable`);
        console.warn(error);
      }
    }


    if (getNodeEnv() === "development") {
      const localBackendPort = getEnvVar("FLASK_RUN_PORT") || "5000";
      const backendUrl = `http://127.0.0.1:${localBackendPort}`;
      ServerApi.init(backendUrl);
      DevServerApi.init(backendUrl);
    }
  },
});
</script>
