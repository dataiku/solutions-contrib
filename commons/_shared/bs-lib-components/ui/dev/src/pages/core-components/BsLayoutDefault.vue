<template>
  <doc-page-core title="BsLayoutDefault" :description="description">
      
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
          const description = "The BsLayoutDefault "
          
          return {
              description,
          }
      }
  }
</script>