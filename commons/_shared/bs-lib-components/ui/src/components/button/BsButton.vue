<template>
  <QBtn v-bind="$attrs" unelevated>
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </QBtn>
</template>
<script>
import { QBtn } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsButton",
  components: {
    QBtn,
  },
});
</script>
