<template>
<BsTabPageChildWrapper>
    <slot></slot>
</BsTabPageChildWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsTabPageChildWrapper from '../BsTabPageChildWrapper.vue'

export default defineComponent({
    name: "BsContent",
    components: {
        BsTabPageChildWrapper
    },
});
</script>