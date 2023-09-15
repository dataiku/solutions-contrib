<template>
  <div
    v-if="!defaultTabUsed"
    v-bind="$attrs"
    class="text-primary bs-tab-title dku-medium-title-sb q-px-md"
  >
    {{ tabName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BsTabChild from "./BsTabChild.vue";

export default defineComponent({
  name: "BsTabTitle",
  extends: BsTabChild,
  inject: ["$tabName", "$defaultTabUsed"],
  emits: ["calculated"],
  props: {
    calculateWidth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabTitleWidth: "0px",
    };
  },
  computed: {
    tabName(): string {
      return (
        this as any as {
          $tabName: string;
        }
      ).$tabName;
    },
    defaultDrawer(): boolean {
      return (this as any as { $defaultDrawer: boolean }).$defaultDrawer;
    },
    defaultTabUsed(): boolean {
      return (this as any as { $defaultTabUsed: boolean }).$defaultTabUsed;
    },
    tabTitleWidthSet(): boolean {
      return !this.widthNotSet(this.tabTitleWidth);
    },
  },
  methods: {
    calculateTabTitleWidth() {
      const { width } = this.$el
        ? getComputedStyle(this.$el)
        : { width: "0px" };
      if (this.widthNotSet(width)) return;
      this.tabTitleWidth = width;
      this.$emit("calculated", width);
    },
    widthNotSet(width: string) {
      return ["0px", "auto"].includes(width);
    },
    calculateWidthIfNeeded() {
      if (!this.calculateWidth || !this.showComponent || this.tabTitleWidthSet)
        return;
      this.$nextTick(() => this.calculateTabTitleWidth());
    },
  },
  watch: {
    showComponent() {
      this.calculateWidthIfNeeded();
    },
    calculateWidth() {
      this.calculateWidthIfNeeded();
    },
  },
});
</script>

<style scoped lang="scss">
.bs-tab-title {
  padding-top: 12.5px;
  padding-bottom: 12.5px;
  max-width: var(--bs-drawer-width);
  word-break: break-word;
}
</style>
