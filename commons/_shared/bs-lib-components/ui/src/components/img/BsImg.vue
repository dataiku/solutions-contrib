<template>
  <QImg v-bind="$attrs">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QImg>
</template>
<script>
import { QImg } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsImg",
  components: {
    QImg,
  },
});
</script>
