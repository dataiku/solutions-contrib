<template>
    <doc-page-core title="BsSelectMultiple" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsSelectMultiple/Basic" title="Basic"/>
        <DocExample file="BsSelectMultiple/Filter" title="With Filter"/>
        <DocExample file="BsSelectMultiple/Hint" title="With Hint"/>
        <DocExample file="BsSelectMultiple/NoLabel" title="No Label"/>
    
    </doc-page-core>
</template>
<script>
    import DocExample from '../../components/DocExample.vue';
    import DocPageCore from '../../components/DocPageCore.vue';

    export default {

        components: {
            DocExample, 
            DocPageCore
        },
        setup() {
            const description = "The BsSelect component has two types of selection: single or multiple. This component opens up a menu for the selection list and action. A filter can also be used for longer lists."
            const quasarURL = "https://quasar.dev/vue-components/select"
            return {
                description,
                quasarURL
            }
        }
    }
</script>