<template>
    <Teleport v-if="qLayoutMounted" to=".q-drawer">
        <div v-show="showComponent" class="bs-drawer-container">
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { QDrawer } from "quasar";

import BsTabChild from './BsTabChild.vue';

export default defineComponent({
    name: "BsDrawer",
    extends: BsTabChild,
    components: {
        QDrawer,
    },
    data() {
        return {
            leftPanelExpanded: false,
        };
    },
    inject: ['leftPanelWidth'],
    props: {
        expandBtn: {
            type: [Boolean, Object],
            default: false
        },
        collapsedWidth: {
            type: Number,
            default: 50
        },
        panelWidth: {
            type: Number,
            default: 300
        },
    },
    computed: {
        drawerStyles() {
            return {
                '--bs-panel-width': this.panelWidth
            };
        },
        leftPanelWidth() {
            return (this as any as {$leftPanelWidth: number}).$leftPanelWidth;
        },
    },
    methods: {
        toggleLeftPanel() {
            this.$emit("model")
            this.leftPanelExpanded = !this.leftPanelExpanded;
        },
    },
});
</script>

<style scoped lang="scss">
.bs-drawer-container {
    position: absolute;
    inset: 0;
    left: unset;
    width: 300px;
}
</style>