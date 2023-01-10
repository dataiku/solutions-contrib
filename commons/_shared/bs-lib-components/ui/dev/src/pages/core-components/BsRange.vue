<template>
    <doc-page-core title="BsRange" :description="description" :quasarUrl="quasarURL">
        <Warning :text="warning" class="q-mt-md"></Warning>
        <DocExample file="BsRange/Basic" title="Basic"/>
    </doc-page-core>
</template>
<script>
    import DocExample from '../../components/DocExample.vue';
    import DocPageCore from '../../components/DocPageCore.vue';
    import Warning from '../../components/Warning.vue';

    export default {

        components: {
            DocExample, 
            DocPageCore,
            Warning
        },
        setup() {
            const description = "The BsRange component is a great way to offer the user the selection of a sub-range of values between a minimum and maximum value, with optional steps to select those values. An example use case for the Range component would be to offer a price range selection."
            const quasarURL = "https://quasar.dev/vue-components/range"
            const warning = "We will include richer examples on how to use this component in the next release of the library. UX specifications will help identify how to display boundaries and the current value of the slider as well as provide an input to modify the state of the slider"
            return {
                description,
                quasarURL,
                warning
            }
        }
    }
</script>