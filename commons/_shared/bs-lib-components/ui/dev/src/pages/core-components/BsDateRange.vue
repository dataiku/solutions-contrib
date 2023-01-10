<template>
    <doc-page-core title="BsDateRange" :description="description">
        <DocExample file="BsDateRange/Basic" title="Basic"></DocExample>
        <DocExample file="BsDateRange/Label" title="With Label"></DocExample>
        <DocExample file="BsDateRange/Mask" title="With Custom Date Mask"></DocExample>
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
            const description = "The BsDateRange is a component used to select a range between two dates. \
                    You can easily navigate the date picker by days, months or years to enable selecting two distant dates. \
                    Selecting the dates should be done on the date picker, the input is readonly."
            
            return {
                description,
            }
        }
    }
</script>