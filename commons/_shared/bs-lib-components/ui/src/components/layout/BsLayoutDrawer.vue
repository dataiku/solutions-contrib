<template>
<div
    v-show="expandable"
    :style="{ 'left' : leftDist}"
    @click="toggleLeftPanel"
    class="toggle-left-button"
>
    <img src="../../assets/images/BtnImg.svg">
</div>
<QDrawer
    :mini="collapsed"
    :mini-width="collapsedWidth"
    :width="expandedWidth"
    side="left"
    behavior="desktop"
    :model-value="true"
    bordered
>
</QDrawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QDrawer } from "quasar";

export default defineComponent({
    name: "BsLayoutDrawer",
    components: {
        QDrawer,
    },
    props: {
        collapsedWidth: {
            type: Number,
            default: 50
        },
        panelWidth: {
            type: Number,
            default: 300
        },
        expand: {
            type: Boolean,
            default: false,
        },
        expandable: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        expanded() {
            return this.expandable && this.expand;
        },
        collapsed() {
            return !this.expanded;
        },
        expandedWidth() {
            return this.collapsedWidth + this.panelWidth;
        },
        leftDist() {
            const dist = this.expanded ? this.expandedWidth : this.collapsedWidth;
            return `${dist}px`;
        },
    },
    expose: ["toggleLeftPanel"],
    methods: {
        toggleLeftPanel() {
            this.$emit("toggle");
        },
    },
});
</script>

<style scoped lang="scss">
.toggle-left-button {
    cursor: pointer;
    position: fixed;
    margin: 0;
    top: 50%;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    position: fixed;
    z-index: 99;
}
</style>