<template>
    <doc-page-core title="BsSelectMultiple" :description="description" :quasarUrl="quasarURL">
        <DocExemple file="BsSelectMultiple/Basic" title="Basic"/>
        <DocExemple file="BsSelectMultiple/Dense" title="Dense"/>
        <DocExemple file="BsSelectMultiple/Filter" title="With Filter"/>
        <DocExemple file="BsSelectMultiple/Hint" title="With Hint"/>
        <DocExemple file="BsSelectMultiple/NoLabel" title="No Label"/>
    
    </doc-page-core>
</template>
<script>
    import DocExemple from '../../components/DocExemple.vue';
    import DocPageCore from '../../components/DocPageCore.vue';

    export default {

        components: {
            DocExemple, 
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