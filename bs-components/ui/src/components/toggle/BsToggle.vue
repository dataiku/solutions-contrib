<template>
  <div
    :class="{
      'bs-toggle--is-disabled': disable,
    }"
    class="bs-toggle"
    :style="{ 'font-size': fontSize }"
  >
    <label class="bs-toggle__label" :class="[labelClass]" v-if="labelLeft">
      {{ labelLeft }}
    </label>
    <input
      type="checkbox"
      :checked="isTrue === true"
      :value="modelIsArray === true ? val : trueValue"
      class="bs-toggle__input"
    />
    <div
      :aria-checked="isTrue === true"
      :aria-disabled="disable"
      :aria-readonly="disable"
      :class="[
        'bs-toggle__content',
        isTrue === true ? 'bs-toggle__content__active' : '',
      ]"
      :style="{ 'background-color': isTrue === true ? color : '' }"
      role="checkbox"
      @click="onClick"
      @keydown="onKeydown"
      @keyup="onKeyup"
      :tabindex="tabIndex"
    ></div>
    <label class="bs-toggle__label" :class="[labelClass]" v-if="labelRight">
      {{ labelRight }}
    </label>
  </div>
</template>
<script>
import { useToggleProps, useToggleEmits, fontSize } from "./use-toggle";
import { stopAndPrevent } from "../../utils/events";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BsToggle",
  data() {
    return {};
  },
  props: {
    ...useToggleProps,
  },
  emits: useToggleEmits,
  computed: {
    modelIsArray() {
      return this.val !== void 0 && Array.isArray(this.modelValue);
    },
    index() {
      const val = this.val;
      return this.modelIsArray === true
        ? this.modelValue.findIndex((opt) => opt === val)
        : -1;
    },
    isTrue() {
      return this.modelIsArray === true
        ? this.index > -1
        : this.modelValue === this.trueValue;
    },
    isFalse() {
      return this.modelIsArray === true
        ? this.index === -1
        : this.modelValue === this.falseValue;
    },
    tabIndex() {
      return this.disable === true ? -1 : this.tabindex || 0;
    },
    fontSize() {
      return fontSize(this.size);
    },
  },
  methods: {
    getNextValue() {
      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          const val = this.modelValue.slice();
          val.splice(this.index, 1);
          return val;
        }

        return this.modelValue.concat([this.val]);
      }

      if (this.isTrue === true) {
        return this.falseValue;
      }
      if (this.isFalse === true) {
        return this.trueValue;
      }
    },
    onClick(e) {
      if (e !== void 0) {
        stopAndPrevent(e);
      }
      if (this.disable !== true) {
        console.log("next value");
        console.log(this.isTrue);
        console.log(this.getNextValue());
        this.$emit("update:modelValue", this.getNextValue(), e);
      }
    },
    onKeydown(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e);
      }
    },
    onKeyup(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.onClick(e);
      }
    },
  },
});
</script>
