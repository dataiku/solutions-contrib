<template>
  <QRange v-bind="$attrs">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QRange>
</template>
<script>
import { QRange } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsRange",
  components: {
    QRange,
  },
});
</script>
