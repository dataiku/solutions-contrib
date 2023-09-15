<template>
  <div>
    <label
      class="bs-date-range__label dss-caption-400 q-mb-xs"
      v-if="bsLabel"
      >{{ bsLabel }}</label
    >
    <QInput dense outlined readonly v-model="inputValue">
      <template v-slot:append>
        <QIcon name="event" class="cursor-pointer">
          <QPopupProxy cover transition-show="scale" transition-hide="scale">
            <QDate range v-bind="$attrs">
              <div class="row items-center justify-end">
                <QBtn v-close-popup label="Close" color="primary" flat />
              </div>
            </QDate>
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
  </div>
</template>
<script>
import { QInput, QDate, QPopupProxy, QIcon, QBtn } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsDateRange",
  components: {
    QInput,
    QDate,
    QPopupProxy,
    QIcon,
    QBtn,
  },
  props: {
    bsLabel: {
      type: String,
    },
  },
  computed: {
    inputValue() {
      if (this.$attrs.modelValue) {
        if (this.$attrs.modelValue.from && this.$attrs.modelValue.to) {
          return (
            this.$attrs.modelValue.from + " - " + this.$attrs.modelValue.to
          );
        }
        return "";
      }
      return "";
    },
  },
});
</script>
