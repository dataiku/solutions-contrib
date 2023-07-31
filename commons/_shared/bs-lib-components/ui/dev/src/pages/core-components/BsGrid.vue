<template>
    <doc-page-core title="Ag Grid" :description="description" :aggridURL="aggridURL" sectionTitle="Ag Grid reference"><br>
        <p>
            BsGrid is a js library that offers a wide range of features for data tables.
            It provides you with the ability to <b>search for the data</b> in your table globally or within a certain column.<br>
            You can use it to display DSS table's data from your project by providing a <b><code>dss-table-name</code></b> prop to the component.
            You can specify the chunking size of the data with the <b><code>pageSize</code></b>.<br>
            <p>
                The grid supports : <br>
                - Virtual Scroll: Set <b>virtualScroll</b> to false, if you want to have pagination. <br>
                - Multiple & single selection : Set <b>rowSelection</b> to single or multiple. Specify <b>rowId </b> if you have a unique values in one column. 
                If not set, the rowId will be set by default to <b>`dss-row-id`</b> handled by the BSGrid. <br>
                When you want to get the selected rows: set <b>saveSelectionState</b> to true. An event <b>`update:selection`</b> will be sent from BsGrid. <br>
                - Server Side Filters: Set <b>filters</b> prop as a dictionary that takes column names and array of values to filter or a range object {from: string, to: string, type: 'string' | 'number'} <br>
                - Row Grouping : Set <b>groupKeys</b> prop as an array of the column names you can to group by. <br>
                By default the new group column will be named Group. If you need to change that, you can set <b>groupName </b> prop.
            </p>
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