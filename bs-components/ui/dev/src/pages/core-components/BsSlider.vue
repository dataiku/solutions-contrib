<template>
    <doc-page-core title="BsSlider" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsSlider/Basic" title="Basic"/>
        <DocExample file="BsSlider/Step" title="Custom Step"/>
        <DocExample file="BsSlider/Width" title="Custom Width"/>
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
            const description = "The BsSlider is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider."
            const quasarURL = "https://quasar.dev/vue-components/slider"
            return {
                description,
                quasarURL,
            }
        }
    }
</script>