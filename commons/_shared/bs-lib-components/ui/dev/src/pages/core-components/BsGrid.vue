<template>
    <doc-page-core title="BsGrid" :description="description" :aggridURL="aggridURL"><br>
        <p>
            BsGrid is a js library that offers a wide range of features for data tables.
            It provides you with the ability to <b>search for the data</b> in your table globally or within a certain column.<br>
            You can use it to display DSS table's data from your project by providing a <b><code>dss-table-name</code></b> prop to the component.
            You can specify the chunking size of the data with the <b><code>pageSize</code></b>.<br>
        </p>
        <DocExample file="BsGrid/Basic" title="Basic" class="bs-grid-example"/>
        <DocExample file="BsGrid/DssDataset" title="Using DSS Dataset"/>
    </doc-page-core>
</template>
<script lang="ts">
import DocExample from '../../components/DocExample.vue';
import DocPageCore from '../../components/DocPageCore.vue';
import Warning from '../../components/Warning.vue';
import { defineComponent } from 'vue';
import CodePrism from 'src/components/CodePrism';
export default defineComponent( {
    components: {
        DocExample, 
        DocPageCore,
        Warning,
        CodePrism,
    },
    setup() {
        const description = "ag-Grid is a feature-rich JavaScript grid library for building advanced data tables.";
        const aggridURL = "https://www.ag-grid.com/";

        return {
            description,
            aggridURL,
        };
    },
});
</script>

<style lang="scss" scoped>
.bs-grid-example {
    :deep(.doc-example__content) {
        width: 0;
    }
}
</style>