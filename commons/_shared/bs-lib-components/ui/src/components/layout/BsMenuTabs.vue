<template>
    <QDrawer 
        v-model="leftPanelFull"
        :mini-width="tabsWidth"
        side="left"
        behavior="desktop"
        mini
        bordered
    >
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
    </QDrawer>
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
            tabsWidth: 50, // DSS webapp icon's width
        };
    },
    methods: {
        emitUpdatedValue(val: any) {
            this.$emit('update:model-value', val);
        }
    },
});
</script>

