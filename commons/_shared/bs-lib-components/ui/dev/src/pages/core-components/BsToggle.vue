<template>
  <doc-page-core title="BsToggle" :description="description">
      <DocExample file="BsToggle/Sizes" title="Sizes"/>
      <DocExample file="BsToggle/LeftLabel" title="Left Label"/>
      <DocExample file="BsToggle/RightLabel" title="Right Label"/>
      <DocExample file="BsToggle/RightAndLeftLabel" title="Right & Left Label"/>
      <DocExample file="BsToggle/DynamicLabel" title="Dynamic Label"/>
      <DocExample file="BsToggle/ArrayModel" title="Array Model"/>
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
          const description = "The BsToggle component is another basic element for user input. You can use this for turning settings, features or true/false inputs on and off."
          
          return {
              description,
          }
      }
  }
</script>