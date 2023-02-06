<template>
    <Teleport v-if="qLayoutMounted" to=".q-drawer">
        <div v-show="showComponent" class="bs-drawer-container">
            <BsTabTitle></BsTabTitle>
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import BsTabChild from '../BsTabChild.vue';
import BsTabTitle from '../BsTabTitle.vue';

export default defineComponent({
    name: "BsDrawer",
    extends: BsTabChild,
    components: {
        BsTabTitle,
    },
    data() {
        return {
            leftPanelExpanded: false,
        };
    },
    props: {
        expandBtn: {
            type: [Boolean, Object],
            default: false
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
    width: var(--bs-drawer-width);
}
</style>