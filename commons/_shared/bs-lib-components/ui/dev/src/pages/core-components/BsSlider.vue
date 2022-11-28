<template>
    <doc-page-core title="BsSlider" :description="description" :quasarUrl="quasarURL">
        <Warning :text="warning" class="q-mt-md"></Warning>
        <DocExemple file="BsSlider/Basic" title="Basic"/>
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
            const description = "The BsSlider is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider."
            const quasarURL = "https://quasar.dev/vue-components/slider"
            const warning = "We will include richer examples on how to use this component in the next release of the library. UX specifications will help identify how to display boundaries and the current value of the slider as well as provide an input to modify the state of the slider"
            return {
                description,
                quasarURL,
                warning
            }
        }
    }
</script>