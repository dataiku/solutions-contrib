<template>
    <Teleport v-if="qLayoutMounted" to=".bs-header">
        <div v-show="showComponent">
            <slot></slot>
        </div>
    </Teleport>
</template>
<script lang="ts">

import { defineComponent } from 'vue';
import BsTabChild from './BsTabChild.vue';

export default defineComponent({
    name: "BsHeader",
    extends: BsTabChild,
});
</script>