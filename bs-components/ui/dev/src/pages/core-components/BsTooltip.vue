<template>
    <doc-page-core title="BsTooltip" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsTooltip/Tooltip" title="Position"/>
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
            const description = "The BsTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or quickly tapping on mobile platforms), the tooltip will appear."
            const quasarURL = "https://quasar.dev/vue-components/tooltip"
            return {
                description,
                quasarURL
            }
        }
    }
</script>