<template>
    <doc-page-core title="BsButton" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsButton/Primary" title="Primary"/>
        <DocExample file="BsButton/Secondary" title="Secondary"/>
        <DocExample file="BsButton/Link" title="Link"/>
        <DocExample file="BsButton/ContainedDanger" title="Contained Danger"/>
        <DocExample file="BsButton/OutlineDanger" title="Outlined Danger"/>
        <DocExample file="BsButton/FlatDanger" title="Flat Danger"/>
        <DocExample file="BsButton/ContainedSuccess" title="Contained Success"/>
        <DocExample file="BsButton/OutlineSuccess" title="Outlined Success"/>
        <DocExample file="BsButton/FlatSuccess" title="Flat Success"/>
        <DocExample file="BsButton/AtClick" title="@click"/>

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
            const description = "The BsButton is a component wrapping the Quasar Qbtn component. It gives out of the box styles for all variations of action buttons (Primary, secondary ...). BsButton emits a @click event, as soon as it is clicked or tapped."
            const quasarURL = "https://quasar.dev/vue-components/button"
            return {
                description,
                quasarURL
            }
        }
    }
</script>