<template>
    <div class="tabs-container">
        <q-tabs
            :model-value="modelValue"
            @update:model-value="(val) => $emit('update:model-value', val)"
            vertical
            active-color="primary"
            indicator-color="primary"
            active-bg-color="white"
        >
            <slot></slot>
        </q-tabs>
    </div>
</template>
<script lang="ts">
import { QTabs } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BsMenuTabs",
    components: {
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
:deep(.q-tabs--vertical) .q-tab {
    padding: 0 5px;
    scale: -1 1;
    .q-tab__content {
        scale: -1 1;
    }
    .q-icon {
        display: block;
        --tab-icon-size: 20px;
        width: var(--tab-icon-size);
        height: var(--tab-icon-size);
        font-size: var(--tab-icon-size);
    }
}

.tabs-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: #f5f5f5;
    z-index: 10000;
}
</style>