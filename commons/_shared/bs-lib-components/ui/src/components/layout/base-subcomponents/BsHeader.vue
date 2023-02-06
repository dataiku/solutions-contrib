<template>
    <Teleport v-if="qLayoutMounted" to=".bs-header">
        <div
            @vnode-mounted="calculateHeaderTabTitleWidth"
            v-show="showComponent"
            :style="tabHeaderStyles"
            :class="[
                'bs-header-wrapper',
                wrapperTransitions && 'bs-header-wrapper--transition',
                showComponent && drawerOpen && headerTabTitleWidthExists && 'bs-header-wrapper--hide-tab-name',
            ]"
        >
            <BsTabTitle
                ref="headerTabTitle"
                v-show="appendTabTitleToHeader"
            >
            </BsTabTitle>
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">

import { defineComponent, Teleport, ComponentPublicInstance } from 'vue';
import BsTabChild from '../BsTabChild.vue';
import BsTabTitle from '../BsTabTitle.vue';

export default defineComponent({
    name: "BsHeader",
    extends: BsTabChild,
    inject: ["$defaultTabUsed", "$drawerOpen"],
    data() {
        return {
            headerTabTitleWidth: "0px",
            wrapperTransitions: false,
        };
    },
    computed: {
        appendTabTitleToHeader(): boolean {
            return !this.defaultTabUsed;
        },
        defaultTabUsed(): boolean {
            return (this as any as {
                $defaultTabUsed: boolean;
            }).$defaultTabUsed;
        },
        drawerOpen(): boolean {
            return (this as any as {
                $drawerOpen: boolean;
            }).$drawerOpen;
        },
        tabHeaderStyles(): Record<string, any> {
            return {
                "--header-tab-title-width": this.headerTabTitleWidth,
            };
        },
        headerTabTitleWidthExists(): boolean {
            return !this.widthNonExistant(this.headerTabTitleWidth);
        },
    },
    methods: {
        widthNonExistant(width: string) {
            return ["0px", "auto"].includes(width);
        },
        calculateHeaderTabTitleWidth() {
            const titleHeader: HTMLDivElement = (this.$refs?.headerTabTitle as ComponentPublicInstance).$el;
            if (!titleHeader) return;
            const { width } = getComputedStyle(titleHeader);
            if (this.widthNonExistant(width))
                return;
            this.headerTabTitleWidth = width;
            this.toggleTransitions();
        },
        toggleTransitions() {
            setTimeout(() => {
                this.wrapperTransitions = true;
            }, 0);
        },
    },
    watch: {
        showComponent() {
            if (!this.showComponent || this.headerTabTitleWidthExists)
                return;
            this.$nextTick(() => this.calculateHeaderTabTitleWidth());
        }
    },
    components: { BsTabTitle }
});
</script>

<style lang="scss" scoped>
.bs-header-wrapper {
    --bs-hide-header-tab-title-duration: .12s;

    position: relative;
    display: flex;
    left: 0;
    width: 100%;
    &.bs-header-wrapper--hide-tab-name {
        left: calc(-1 * var(--header-tab-title-width));
        width: calc(100% + var(--header-tab-title-width));
    }
}
.bs-header-wrapper--transition {
    transition: left var(--bs-hide-header-tab-title-duration) ease, width var(--bs-hide-header-tab-title-duration) ease;
}
</style>