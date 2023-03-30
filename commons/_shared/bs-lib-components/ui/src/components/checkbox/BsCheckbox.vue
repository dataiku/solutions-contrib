<template>
  <div class="bs-checkbox" :class="{ hint: isHintOnly, disabled: isDisabled }">
    <QCheckbox
      v-bind="$attrs"
      size="29.57px"
      :tabindex="0"
      :label="labelFromHint"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </QCheckbox>
    <div class="dku-tiny-text bs-checkbox__hint" v-if="hint && $attrs.label">
      {{ hint }}
    </div>
  </div>
</template>
<script>
import { QCheckbox } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsCheckbox",
  components: {
    QCheckbox,
  },
  props: {
    hint: {
      type: String,
    },
  },
  computed: {
    labelFromHint() {
      if (this.$attrs.label) {
        return this.$attrs.label;
      } else if (this.hint) {
        return this.hint;
      }
      return null;
    },
    isHintOnly() {
      return !this.$attrs.label && this.hint;
    },
    isDisabled() {
      return this.$attrs.disable != null ? true : false;
    },
  },
});
</script>
