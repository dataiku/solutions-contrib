<template>
    <doc-page-core title="BsButton" :description="description" :quasarUrl="quasarURL">
        <DocExemple file="BsButton/Primary" title="Primary"/>
        <DocExemple file="BsButton/Secondary" title="Secondary"/>
        <DocExemple file="BsButton/Link" title="Link"/>
        <DocExemple file="BsButton/ContainedDanger" title="Contained Danger"/>
        <DocExemple file="BsButton/OutlineDanger" title="Outlined Danger"/>
        <DocExemple file="BsButton/FlatDanger" title="Flat Danger"/>
        <DocExemple file="BsButton/ContainedSuccess" title="Contained Success"/>
        <DocExemple file="BsButton/OutlineSuccess" title="Outlined Success"/>
        <DocExemple file="BsButton/FlatSuccess" title="Flat Success"/>
        <DocExemple file="BsButton/AtClick" title="@click"/>

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
            const description = "The BsButton is a component wrapping the Quasar Qbtn component. It gives out of the box styles for all variations of action buttons (Primary, secondary ...). BsButton emits a @click event, as soon as it is clicked or tapped."
            const quasarURL = "https://quasar.dev/vue-components/button"
            return {
                description,
                quasarURL
            }
        }
    }
</script>