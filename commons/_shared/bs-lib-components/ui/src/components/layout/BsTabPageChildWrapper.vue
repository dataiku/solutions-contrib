<template>
<Teleport v-if="qPageMounted" :to="contentCSSSelector">
    <slot></slot>
</Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BsTabPageChildWrapper",
    inject: ['$qPageMounted', '$tabContentId'],
    computed: {
        contentCSSSelector(): string {
            return `#${this.tabContentId}`;
        },
        tabContentId() {
            return (this as any as {$tabContentId: string})?.$tabContentId;
        },
        qPageMounted() {
            return (this as any as {$qPageMounted: string})?.$qPageMounted;
        },
    },
});
</script>