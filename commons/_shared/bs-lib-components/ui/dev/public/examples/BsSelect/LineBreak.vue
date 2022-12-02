<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect v-model="model" :options="options" bsLabel="Long Text options"></BsSelect>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: null,
                options: [
                    "A Really Long Option Name That Will Not Display in the Container1",
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
