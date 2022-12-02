<template>
    <doc-page-core title="BsDateRange" :description="description">
        <DocExemple file="BsDateRange/Basic" title="Basic"></DocExemple>
        <DocExemple file="BsDateRange/Label" title="With Label"></DocExemple>
        <DocExemple file="BsDateRange/Mask" title="With Custom Date Mask"></DocExemple>
    </doc-page-core>
</template>
<script>
    import DocExemple from '../../components/DocExemple.vue';
    import DocPageCore from '../../components/DocPageCore.vue';

    export default {

        components: {
            DocExemple, 
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