<template>
    <doc-page-core title="BsTable" :description="description" :quasarUrl="quasarURL"><br>
        <p>
            BsTable provides you with the ability to <b>search for the data</b> in your table globally or within a certain column.<br>
            You can use it to display DSS table's data from your project by providing a <b><code>dss-table-name</code></b> prop to the component.
            You can specify the chunking of the data with the <b><code>server-side-pagination</code></b>.<br>
            If using without <b><code>dss-table-name</code></b>
            use it in combination with <b><code>@update:server-side-pagination</code></b> event for custom your custom logic. <br>
            You can <b><code>filter DSS Table data</code> </b> displayed on server side before it is displayed in the table by specifying filters object. 
            Filers Object keys are the columns names and its values are the filter values you want to apply<br>
            If you want to use <b><code>selection</code> </b>on the table with DSS Table, use <b><code>index as row-key</code> </b> so it is guaranteed to be unique if you don't have a unique ID.<br>
        </p>
        <code-prism lang="js" :code="serverSidePaginationPropType"></code-prism><br>
        To use <b>body-cell, body-cell-[column]</b> slots with searched text highlighting feature use <b>cellValueComponent, cellValueComponentProps</b> scoped slot's props.<br>
        Other scoped slot's props are described on <b>QTable</b> documentation page. 
        <code-prism lang="html" :code="bodyCellSlotUseExample"></code-prism><br>
        
        <DocExample file="BsTable/Basic" title="Basic" class="bs-table-example"/>
        <template #quasar-ref="{quasarUrl}">
            It can inherit all the props and events available for the corresponding quasar component. Currently only <b>top, body-cell, body-cell-[column]</b> and custom <b>title</b> slots are implemented and tested. Please refer to this
            <a :href="quasarUrl" target="_blank">page</a>
            for more details.
        </template>
    </doc-page-core>
</template>
<script lang="ts">
import DocExample from '../../components/DocExample.vue';
import DocPageCore from '../../components/DocPageCore.vue';
import Warning from '../../components/Warning.vue';
import CodePrism from 'src/components/CodePrism';
import { defineComponent } from 'vue';
export default defineComponent( {
    components: {
        DocExample, 
        DocPageCore,
        Warning,
        CodePrism
    },
    setup() {
        const description = "QTable is a component that allows you to display data in a tabular manner";
        const quasarURL = "https://quasar.dev/vue-components/table";
        const serverSidePaginationPropType = 
`type ServerSidePagination = {
    batchSize: number;
    batchOffset: number;

    recordsCount: number | undefined;
} | boolean;`;

        const bodyCellSlotUseExample = `
<BsTable>
    <template #body-cell=props> <!-- or #body-cell-[colName]=props -->
        <q-td :props="props">
            <component :is="props.cellValueComponent" v-bind="props.cellValueComponentProps"></component>
        </q-td>
    </template>
</BsTable>`;

        return {
            description,
            quasarURL,
            serverSidePaginationPropType,
            bodyCellSlotUseExample,
        };
    },
});
</script>

<style lang="scss" scoped>
.bs-table-example {
    :deep(.doc-example__content) {
        width: 0;
    }
}
</style>