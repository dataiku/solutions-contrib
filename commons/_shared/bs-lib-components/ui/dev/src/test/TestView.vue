<template>
    <div class="test-container">
        <BsTable
            dss-table-name="movies_data_top_1000"
            :batchSize="100"
            
        >
        </BsTable>
        <!-- <BsTextHighlight text="howtolive" :queries="['howt', 'wtolive']"></BsTextHighlight> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsTable from "../../../src/components/table/BsTable.vue";
import BsTextHighlight from "../../../src/components/table/BsTextHighlight.vue";
export default defineComponent({
    name: "default",
    components: {
        BsTable,
        BsTextHighlight,
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
.test-container {
    position: fixed;
    inset: 20vh 20vw;
}
</style>