<template>
    <div class="q-pa-md q-gutter-lg" style="max-width: 200px">
        <BsSelect v-model="model" :options="options" outlined bsLabel="Select" bsLabelId="test"></BsSelect>
        <BsSelect v-model="model" :options="options" borderless bsLabel="Select" bsLabelId="test"></BsSelect>
    </div>
</template>
<script>
import { BsSelect } from 'ui';
import { ref } from 'vue'

export default {
    setup() {
        return {
            model: ref(null),
            options: [
                "Extra small",
                "Small",
                "Medium",
                "Large",
                "Extra large",
                "Custom"
            ]
        };
    },
    components: { BsSelect }
}
</script>
