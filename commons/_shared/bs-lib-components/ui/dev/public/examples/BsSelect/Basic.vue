<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect v-model="model" :options="options" outlined bsLabel="Font Size" bsLabelId="test"></BsSelect>
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