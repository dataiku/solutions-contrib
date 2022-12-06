<template>
    <doc-page-core title="BsSelect" :description="description" :quasarUrl="quasarURL">
        <DocExemple file="BsSelect/Basic" title="Basic"/>
        <DocExemple file="BsSelect/PlaceHolder" title="Place Holder" />
        <DocExemple file="BsSelect/Icon" title="With Icon"/>
        <DocExemple file="BsSelect/LineBreak" title="Line Break"/>
        <DocExemple file="BsSelect/NoLabel" title="Without Label"/>
        <DocExemple file="BsSelect/MenuOptions" title="Custom Menu Options"/>
        <DocExemple file="BsSelect/EventOnChange" title="Call a custom function on update"/>
        <DocExemple file="BsSelect/NoFilter" title="Deactivate Filtering"/>

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