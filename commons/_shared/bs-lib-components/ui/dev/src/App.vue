<template>
  <router-view />
</template>

<script lang="ts">
import { ServerApi } from 'ui';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted() {

    function getEnvVar(key: string) {
        try {
            return process.env[key];
        }
        catch (error){
            console.warn(`${key} is not defined as the environment variable`);
            console.warn(error);
        }
    }

    if (getEnvVar("NODE_ENV") === "development") {
        const localBackendPort = getEnvVar("FLASK_RUN_PORT") || "5000";
        const backendUrl = `http://127.0.0.1:${localBackendPort}`;
        
        ServerApi.init(backendUrl);
    }
  }
})
</script>
