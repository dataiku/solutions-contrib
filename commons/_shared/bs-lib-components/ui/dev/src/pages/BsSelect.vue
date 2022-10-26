<template>
    <div class="q-pa-md q-gutter-lg" style="max-width: 200px">
        <BsSelect v-model="model" :options="options" outlined bsLabel="Font Size" bsLabelId="test"></BsSelect>
        <BsSelect v-model="model" :options="options" borderless bsLabel="Font Size" bsLabelId="test_2"></BsSelect>
        <BsSelect v-model="model" :options="options" outlined bsLabel="Font Size" bsLabelId="test">
            <template v-slot:prepend>
                <q-icon name="event" color="#6F7D89"/>
            </template>
        </BsSelect>
        <BsSelect v-model="model" :options="options" borderless bsLabel="Font Size" bsLabelId="test_2">
            <template v-slot:prepend>
                <q-icon name="event" color="#6F7D89"/>
            </template>
        </BsSelect>
        <BsSelect v-model="model" :options="options" outlined clearable clear-icon="clear"></BsSelect>
        
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
