<template>
    <doc-page-core title="BsCheckbox" :description="description" :quasarUrl="quasarURL">
        <DocExemple file="BsCheckbox/Basic" title="Basic"/>
        <DocExemple file="BsCheckbox/Disable" title="Disabled"/>
        <DocExemple file="BsCheckbox/Label" title="With Label"/>
        <DocExemple file="BsCheckbox/Description" title="With hint or label"/>
        <DocExemple file="BsCheckbox/Indeterminate" title="Indeterminate State"/>
    </doc-page-core>
</template>
<script>
    import DocExemple from '../../components/DocExemple.vue';
    import DocPageCore from '../../components/DocPageCore.vue';

    export default {

        components: {
            DocExemple, 
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