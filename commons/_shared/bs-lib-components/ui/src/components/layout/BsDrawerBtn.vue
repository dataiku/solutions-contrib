<template>
<Teleport v-if="qLayoutMounted" to=".q-layout">
    <div
        v-show="showComponent"
        @click="toggleLeftPanel"
        :style="{ 'left' : leftDist}"
        class="toggle-left-button"
    >
        <img src="../../assets/images/BtnImg.svg">
    </div>
</Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsTabChild from './BsTabChild.vue';

export default defineComponent({
    name: "BsDrawerBtn",
    extends: BsTabChild,
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        toggleLeftPanel() {
            this.$emit("update:modelValue", !this.modelValue);
        },
    },
    inject: ["$tabMenuWidth", "$leftPanelWidth"],
    computed: {
        expandedWidth() {
            return this.tabMenuWidth + this.leftPanelWidth;
        },
        leftDist() {
            const dist = this.modelValue ? this.expandedWidth : this.tabMenuWidth;
            return `${dist}px`;
        },
        tabMenuWidth() {
            return (this as any as {$tabMenuWidth: number}).$tabMenuWidth;
        },
        leftPanelWidth() {
            return (this as any as {$leftPanelWidth: number}).$leftPanelWidth;
        },
    }
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