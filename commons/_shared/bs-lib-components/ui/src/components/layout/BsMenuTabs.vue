<template>
    <div class="tabs-container">
        <q-tabs
            :model-value="modelValue"
            @update:model-value="(val) => $emit('update:model-value', val)"
            vertical
            class="text-primary"
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
::v-deep .q-tabs--vertical .q-tab {
    padding: 0 5px;
    scale: -1 1;
    transition: background-color .345s;
    
    &.q-tab--active {
        background-color: #3B99FC19
    }
    .q-icon {
        --tab-icon-size: 20px;
        
        scale: -1 1;
        width: var(--tab-icon-size);
        height: var(--tab-icon-size);
        font-size: var(--tab-icon-size);
}
}

</style>