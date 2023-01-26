<template>
    <Teleport v-if="drawerMounted" to=".q-drawer">
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
    extends: BsTabChild,
    name: "BsDrawer",
    components: {
        QDrawer,
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
        miniWidth: {
            type: Number,
            default: 50
        },
        panelWidth: {
            type: Number,
            default: 300
        }
    },
    inject: ["$drawerMounted"],
    computed: {
        drawerMounted() {
            return (this as any as {$drawerMounted: boolean}).$drawerMounted;
        },
    },
    methods: {
        toggleLeftPanel() {
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