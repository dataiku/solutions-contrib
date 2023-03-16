<template>
<Teleport v-if="qPageMounted" :to="contentCSSSelector">
    <slot></slot>
</Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getBsContentId } from "./bsLayoutHelper"

export default defineComponent({
    name: "BsTabPageChildWrapper",
    inject: ['$qPageMounted', '$tabId'],
    computed: {
        contentCSSSelector(): string {
            return `#${this.tabContentId}`;
        },
        tabContentId(): string {
            return getBsContentId(this.tabId);
        },
        tabId(): string {
            return (this as any as {$tabId: string})?.$tabId;
        },
        qPageMounted(): boolean {
            return (this as any as { $qPageMounted: boolean })?.$qPageMounted;
        },
    },
});
</script>