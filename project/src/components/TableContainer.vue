<template>
<div class="bs-table-container">
    <slot></slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "TableContainer"
});
</script>

<style lang="scss" scoped>
.bs-table-container {
  height: calc(100vh - 49px);
  box-sizing: border-box;
  padding: 20px;
  position: relative;
}
</style>