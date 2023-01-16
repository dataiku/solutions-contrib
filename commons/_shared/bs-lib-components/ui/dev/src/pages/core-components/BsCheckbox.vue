<template>
    <doc-page-core title="BsCheckbox" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsCheckbox/Basic" title="Basic"/>
        <DocExample file="BsCheckbox/Disable" title="Disabled"/>
        <DocExample file="BsCheckbox/Label" title="With Label"/>
        <DocExample file="BsCheckbox/Description" title="With hint or label"/>
        <DocExample file="BsCheckbox/Indeterminate" title="Indeterminate State"/>
    </doc-page-core>
</template>
<script>
    import DocExample from '../../components/DocExample.vue';
    import DocPageCore from '../../components/DocPageCore.vue';

    export default {

        components: {
            DocExample, 
            DocPageCore,
        },
        setup() {
            const description = "The BsCheckbox component is another basic element for user input. You can use this to supply a way for the user to toggle an option."
            const quasarURL = "https://quasar.dev/vue-components/checkbox"
            return {
                description,
                quasarURL,
            }
        }
    }
</script>