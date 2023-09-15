<template>
  <QSpinner v-bind="$attrs">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QSpinner>
</template>
<script>
import { QSpinner } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsSpinner",
  components: {
    QSpinner,
  },
});
</script>
