<template>
  <QIcon v-bind="$attrs">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QIcon>
</template>
<script>
import { QIcon } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsIcon",
  components: {
    QIcon,
  },
});
</script>
