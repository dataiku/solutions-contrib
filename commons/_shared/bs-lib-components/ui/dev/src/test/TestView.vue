<template>
    <BsTable
        dss-table-name="movies_data_top_1000"
    >
    </BsTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsTable from "../../../src/components/table/BsTable.vue";
export default defineComponent({
    name: "default",
    components: {
        BsTable
    },
    data() {
        return {};
    },
    props: {

    },
    methods: {

    },
});
</script>

<style scoped lang="scss">

</style>