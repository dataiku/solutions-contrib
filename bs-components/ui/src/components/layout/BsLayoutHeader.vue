<template>
    <QHeader bordered class="bg-white bs-header"></QHeader>
</template>   
<script lang="ts">
import { defineComponent } from 'vue';
import { QHeader } from "quasar";

export default defineComponent({
    name: "BsLayoutHeader",
    components: {
        QHeader
    },
});
</script>
<style scoped lang="scss">
.bs-header {
    color: black;
}

</style>