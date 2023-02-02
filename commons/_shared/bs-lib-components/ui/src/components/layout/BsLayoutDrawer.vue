<template>
<QDrawer
    v-bind="drawerProps"
    :mini-width="collapsedWidth"
    :width="expandedWidth"
    side="left"
    behavior="desktop"
    bordered
>
    <BsDrawerBtn
        v-model="expand"
        :show="expandable"
    ></BsDrawerBtn>
</QDrawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QDrawer } from "quasar";

import BsDrawerBtn from './BsDrawerBtn.vue';

export default defineComponent({
    name: "BsLayoutDrawer",
    components: {
        QDrawer,
        BsDrawerBtn,
    },
    props: {
        collapsedWidth: {
            type: Number,
            default: 50
        },
        panelWidth: {
            type: Number,
            default: 300,
        },
        mini: {
            type: Boolean,
            default: false,
        },
        expandable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            expand: true,
        };
    },
    computed: {
        collapsed() {
            return !this.displayExpanded;
        },
        displayExpanded() {
            return this.expand && this.expandable;
        },
        expandedWidth() {
            return (+this.mini * this.collapsedWidth) + this.panelWidth;
        },
        miniDrawerProps() {
            return {
                mini: this.collapsed,
                modelValue: true
            } as Record<string, any>;
        },
        defaultDrawerProps() {
            return {
                modelValue: this.displayExpanded,
            } as Record<string, any>;
        },
        drawerProps() {
            return this.mini ? this.miniDrawerProps : this.defaultDrawerProps;
        }
    },
});
</script>

<style scoped lang="scss">
::v-deep .q-drawer {
    box-sizing: content-box;
    z-index: 3000;

    &.q-drawer--left.q-drawer--bordered {
        border-right: .5px solid #ccc;
    }
}
</style>