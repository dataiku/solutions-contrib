<template>
    <doc-page-core title="BsTooltip" :description="description" :quasarUrl="quasarURL">
        <DocExemple file="BsTooltip/Tooltip" title="Position"/>
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
            const description = "The BsTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or quickly tapping on mobile platforms), the tooltip will appear."
            const quasarURL = "https://quasar.dev/vue-components/tooltip"
            return {
                description,
                quasarURL
            }
        }
    }
</script>