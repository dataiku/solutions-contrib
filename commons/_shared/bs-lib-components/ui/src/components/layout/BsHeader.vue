<template>
    <Teleport v-if="headerMounted" to=".bs-header">
        <div v-show="showComponent">
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">

import { defineComponent } from 'vue';
import BsTabChild from './BsTabChild.vue';

export default defineComponent({
    extends: BsTabChild,
    name: "BsHeader",
    inject: ["$headerMounted"],
    computed: {
        headerMounted() {
            return (this as any as {$headerMounted: boolean}).$headerMounted;

        }
    },
});
</script>