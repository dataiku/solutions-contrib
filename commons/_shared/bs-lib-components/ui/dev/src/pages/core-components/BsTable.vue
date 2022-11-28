<template>
    <doc-page-core title="BsTable" :description="description" :quasarUrl="quasarURL">
        <Warning :text="warning" class="q-mt-md"></Warning>
        <DocExemple file="BsTable/Basic" title="Basic"/>
    </doc-page-core>
</template>
<script>
    import DocExemple from '../../components/DocExemple.vue';
    import DocPageCore from '../../components/DocPageCore.vue';
    import Warning from '../../components/Warning.vue';

    export default {

        components: {
            DocExemple, 
            DocPageCore,
            Warning
        },
        setup() {
            const description = "QTable is a component that allows you to display data in a tabular manner"
            const quasarURL = "https://quasar.dev/vue-components/table"
            const warning = "This component was built without UX specifications, it will be modified as soon as the specs are available"
            return {
                description,
                quasarURL,
                warning
            }
        }
    }
</script>