<template>
<div
    v-show="showComponent"
    @click="toggleLeftPanel"
    :class="[hide && 'hide', hidden && 'hidden','toggle-left-button']"
    :style="{ 
        '--hide-transition-duration': `.${hideTransitionDuration}s`
    }"
>
    <img src="../../assets/images/BtnImg.svg">
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsTabChild from './BsTabChild.vue';

import { transitionHideToHiddenClasses } from './bsLayoutHelper';

export default defineComponent({
    name: "BsDrawerBtn",
    extends: BsTabChild,
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        show: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            hide: false,
            hidden: false,
            hideTransitionDuration: 200
        };
    },
    watch: {
        show() {
            this.toggleShown(this.show);
        },
    },
    methods: {
        toggleLeftPanel() {
            this.$emit("update:modelValue", !this.modelValue);
        },
        toggleShown(show: boolean) {
            const hide = !show;

            const toggleHide = () => this.hide = hide;
            const toggleHidden = () => this.hidden = hide;

            transitionHideToHiddenClasses(
                toggleHide,
                toggleHidden,
                hide,
                this.hideTransitionDuration
            )
        },
    },
});
</script>

<style scoped lang="scss">
.toggle-left-button {
    cursor: pointer;
    position: absolute;
    visibility: visible;
    margin: 0;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    -ms-transform: translateY(-50%);
    z-index: 99;
    transition: transform var(--hide-transition-duration);

    &.hide {
        transform: translate(0, -50%);
    }
    &.hidden {
        display: none;
    }
}
</style>