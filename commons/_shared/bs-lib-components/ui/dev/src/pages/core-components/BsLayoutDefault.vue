<template>
  <doc-page-core title="BsLayoutDefault" :description="description">
     <LayoutGalleryGrid class="q-mt-sm"/>
  </doc-page-core>
</template>
<script>
  import DocExample from '../../components/DocExample.vue';
  import DocPageCore from '../../components/DocPageCore.vue';
  import LayoutGalleryGrid from "../../components/LayoutGalleryGrid.vue";

  export default {

      components: {
          DocExample, 
          DocPageCore,
          LayoutGalleryGrid,
      },
      setup() {
          const description = "The BsLayoutDefault is the default layout for business solutions webapps. It is highly customizable, the layout provides 4 named slots: \
            header, leftPanel, content and documentation that can be populated with custom vue components. See the examples in the usage section for more details."
          
          return {
              description,
          }
      }
  }
</script>