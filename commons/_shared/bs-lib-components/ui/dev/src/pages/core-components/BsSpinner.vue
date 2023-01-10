<template>
  <doc-page-core title="BsSpinner" :description="description" :quasarUrl="quasarURL">
      <Warning :text="warning" class="q-mt-md"></Warning>
      <DocExample file="BsSpinner/Thickness" title="Thickness"/>
  </doc-page-core>
</template>
<script>
  import DocExample from '../../components/DocExample.vue';
  import DocPageCore from '../../components/DocPageCore.vue';
  import Warning from '../../components/Warning.vue';

  export default {

      components: {
          DocExample, 
          DocPageCore,
          Warning
      },
      setup() {
          const description = "A Spinner is used to show the user a timely process is currently taking place. It is an important UX feature, which gives the user the feeling the system is continuing to work for longer term activities, like grabbing data from the server or some heavy calculations."
          const quasarURL = "https://quasar.dev/vue-components/spinners"
          const warning = "This component was built without UX specifications, it will be modified as soon as the specs are available"
          return {
              description,
              quasarURL,
              warning
          }
      }
  }
</script>