<template>
    <Teleport v-if="qLayoutMounted" to=".q-drawer">
        <div v-show="showComponent" class="bs-drawer-container" :style="drawerStyles">
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import BsTabChild from './BsTabChild.vue';

export default defineComponent({
    name: "BsDrawer",
    extends: BsTabChild,
    data() {
        return {
            leftPanelExpanded: false,
        };
    },
    inject: ["$leftPanelWidth"],
    props: {
        expandBtn: {
            type: [Boolean, Object],
            default: false
        },
    },
    computed: {
        drawerStyles() {
            return {
                '--bs-panel-width': `${this.leftPanelWidth}px`,
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
    width: var(--bs-panel-width);
}
</style>