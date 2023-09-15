<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect v-model="model" :options="options" bsLabel="Font Size"></BsSelect>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: null,
                options: [
                    "Extra small",
                    "Small",
                    "Medium",
                    "Large",
                    "Extra large",
                    "Custom"
                ]
            }
        }
    }
</script>