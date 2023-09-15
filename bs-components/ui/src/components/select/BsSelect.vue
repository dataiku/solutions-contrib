<template>
  <div>
    <label class="bs-select__label dss-caption-400 q-mb-xs" v-if="bsLabel">{{
      bsLabel
    }}</label>
    <QSelect
      ref="bsSelect"
      v-bind="$attrs"
      dropdown-icon="r_expand_more"
      class="bs-select"
      outlined
      dense
      popup-content-class="bs-select__popup dds-text-400"
      @popup-show="popupShow"
      @popup-hide="popupHide"
      :popup-content-style="popupStyle"
      :label="computedLabel"
      label-color="#CCCCCC"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </QSelect>
  </div>
</template>
<script>
import { QSelect } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsSelect",
  data() {
    return {
      width: 0,
    };
  },
  props: {
    bsLabel: {
      type: String,
    },
    placeHolder: {
      type: String,
    },
  },
  components: {
    QSelect,
  },
  methods: {
    popupShow() {
      this.width = this.$refs.bsSelect.$el.offsetWidth;
    },
    popupHide() {
      this.width = 0;
    },
  },
  computed: {
    popupStyle() {
      return {
        width: this.width,
        maxWidth: this.width,
        wordBreak: "break-all",
      };
    },
    computedLabel() {
      if (this.placeHolder && !this.$attrs.modelValue) {
        return this.placeHolder;
      }
      return undefined;
    },
  },
});
</script>
