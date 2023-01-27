<template>
<Teleport v-if="qLayoutMounted" to=".q-drawer">
    <div
        v-show="showComponent"
        @click="toggleLeftPanel"
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
});
</script>

<style scoped lang="scss">
.toggle-left-button {
    cursor: pointer;
    position: absolute;
    margin: 0;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    -ms-transform: translateY(-50%);
    z-index: 99;
}
</style>