<template>
  <QTooltip v-bind="$attrs">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QTooltip>
</template>
<script>
import { QTooltip } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsTooltip",
  components: {
    QTooltip,
  },
});
</script>
