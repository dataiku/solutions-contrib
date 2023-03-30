<template>
    <doc-page-core title="BsTable" :description="description" :quasarUrl="quasarURL"><br>
        <p>
            BsTable provides you with the ability to <b>search for the data</b> in your table globally or within a certain column.<br>
            You can use it to display DSS table's data from your project by providing a <b><code>dss-table-name</code></b> prop to the component.
            You can specify the chunking of the data with the <b><code>server-side-pagination</code></b>.<br>
            If using without <b><code>dss-table-name</code></b>
            use it in combination with <b><code>@update:server-side-pagination</code></b> event for custom your custom logic.
        </p>
        <code-prism lang="js" :code="serverSidePaginationPropType"></code-prism><br>
        <Warning :text="warning" class="q-mt-md"></Warning>
        <DocExample file="BsTable/Basic" title="Basic"/>
    </doc-page-core>
</template>
<script>
import DocExample from '../../components/DocExample.vue';
import DocPageCore from '../../components/DocPageCore.vue';
import Warning from '../../components/Warning.vue';
import CodePrism from 'src/components/CodePrism';

export default {

    components: {
        DocExample, 
        DocPageCore,
        Warning,
        CodePrism
    },
    setup() {
        const description = "QTable is a component that allows you to display data in a tabular manner";
        const quasarURL = "https://quasar.dev/vue-components/table";
        const warning = "This component was built without UX specifications, it will be modified as soon as the specs are available";
        const serverSidePaginationPropType = 
`type ServerSidePagination = {
    batchSize: number;
    batchOffset: number;

    recordsCount: number | undefined;
} | boolean;`
        return {
            description,
            quasarURL,
            warning,
            serverSidePaginationPropType,
        };
    },
};
</script>