<template>
    <div class="q-pa-md">
    <div class="q-gutter-md row">
      <BsSpinner
        color="primary"
        size="3em"
      />

      <BsSpinner
        color="primary"
        size="3em"
        :thickness="2"
      />

      <BsSpinner
        color="primary"
        size="3em"
        :thickness="10"
      />
    </div>
  </div>

</template>
<script>
    import { BsSpinner } from 'ui';

    export default {
        components: {
            BsSpinner,
        }
    }
</script>