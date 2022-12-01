<template>
  <doc-page-core title="BsToggle" :description="description">
      <DocExemple file="BsToggle/Sizes" title="Sizes"/>
      <DocExemple file="BsToggle/LeftLabel" title="Left Label"/>
      <DocExemple file="BsToggle/RightLabel" title="Right Label"/>
      <DocExemple file="BsToggle/RightAndLeftLabel" title="Right & Left Label"/>
      <DocExemple file="BsToggle/DynamicLabel" title="Dynamic Label"/>
      <DocExemple file="BsToggle/ArrayModel" title="Array Model"/>
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
          const description = "The BsToggle component is another basic element for user input. You can use this for turning settings, features or true/false inputs on and off."
          
          return {
              description,
          }
      }
  }
</script>