<template>
    <doc-page-core title="BsSelect" :description="description" :quasarUrl="quasarURL">
        <DocExample file="BsSelect/Basic" title="Basic"/>
        <DocExample file="BsSelect/PlaceHolder" title="Place Holder" />
        <DocExample file="BsSelect/Icon" title="With Icon"/>
        <DocExample file="BsSelect/LineBreak" title="Line Break"/>
        <DocExample file="BsSelect/NoLabel" title="Without Label"/>
        <DocExample file="BsSelect/MenuOptions" title="Custom Menu Options"/>
        <DocExample file="BsSelect/EventOnChange" title="Call a custom function on update"/>
        <!-- <DocExample file="BsSelect/NoFilter" title="Deactivate Filtering"/> -->

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
            const description = "The BsSelect component has two types of selection: single or multiple. This component opens up a menu for the selection list and action. A filter can also be used for longer lists."
            const quasarURL = "https://quasar.dev/vue-components/select"
            return {
                description,
                quasarURL
            }
        }
    }
</script>