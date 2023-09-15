<template>
  <div class="flex row bs-slider no-wrap">
    <QSlider
      v-bind="$attrs"
      :style="{ width: sliderWidth + 'px' }"
      thumb-size="15px"
      track-size="3.5px"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </QSlider>
    <input
      class="bs-slider__input dku-text"
      type="number"
      :value="inputData.value"
      @input="updateSliderFromInput"
      :min="inputData.min"
      :max="inputData.max"
      :step="inputData.step"
    />
  </div>
</template>
<script>
import { QSlider } from "quasar";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsSlider",
  components: {
    QSlider,
  },
  props: {
    sliderWidth: {
      type: Number,
      default: 192,
    },
  },
  computed: {
    inputData() {
      return {
        value: this.$attrs.modelValue,
        min: this.$attrs.min,
        max: this.$attrs.max,
        step: this.$attrs.step,
      };
    },
  },
  methods: {
    // TODO : Round to step in needed
    updateSliderFromInput(e) {
      let newValue = Number(e.target.value);
      if (newValue < this.$attrs.min) {
        newValue = this.$attrs.min;
      }
      if (newValue > this.$attrs.max) {
        newValue = this.$attrs.max;
      }
      this.$emit("update:model-value", newValue);
    },
  },
});
</script>
