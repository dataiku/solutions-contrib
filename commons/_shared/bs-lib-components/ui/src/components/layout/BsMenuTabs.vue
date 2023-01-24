<template>
    <div class="tabs-container">
        <q-tabs
            :model-value="modelValue"
            @update:model-value="(val) => $emit('update:model-value', val)"
            vertical
            class="text-teal"
        >
            <slot></slot>
        </q-tabs>
    </div>
</template>
<script lang="ts">
import { QDrawer, QTabs } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BsMenuTabs",
    components: {
        QDrawer,
        QTabs,
    },
    props: {
        modelValue: [Number, String],
    },
    data() {
        return {
            leftPanelFull: true,
        };
    },
    methods: {
        emitUpdatedValue(val: any) {
            this.$emit('update:model-value', val);
        }
    },
});
</script>

<style scoped lang="scss">
::v-deep .q-tabs--vertical .q-tab {
    padding: 0 5px;
}
</style>