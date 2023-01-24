<template>
    <div
        v-if="expandable"
        :style="{ 'left' : leftDist}"
        @click="toggleLeftPanel"
        class="toggle-left-button"
    >
        <img src="../../assets/images/BtnImg.svg">
    </div>
    <QDrawer
        :mini="leftPanelHidden"
        :mini-width="miniWidth"
        :width="expandedWidth"
        side="left"
        behavior="desktop"
        :model-value="true"
        bordered
    >
        <slot></slot>
    </QDrawer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { QDrawer } from "quasar";
export default defineComponent({
    name: "BsDrawer",
    components: {
        QDrawer
    },
    data() {
        return {
            leftPanelDisplayed: false,
        };
    },
    props: {
        expandable: {
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
    computed: {
        expandedWidth() {
            return this.miniWidth + this.panelWidth;
        },
        leftDist() {
            const dist = this.leftPanelDisplayed ? this.expandedWidth : this.miniWidth;
            return `${dist}px`;
        },
        leftPanelHidden() {
            return !this.leftPanelDisplayed;
        },
    },
    methods: {
        toggleLeftPanel() {
            this.leftPanelDisplayed = !this.leftPanelDisplayed;
        },
    },
});
</script>

<style scoped lang="scss">
.toggle-left-button {
    cursor: pointer;
    margin: 0;
    top: 50%;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    position: fixed;
    z-index: 99;
}
</style>