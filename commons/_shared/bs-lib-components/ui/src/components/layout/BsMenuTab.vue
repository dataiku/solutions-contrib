<template>
  <QTab :name="tabIndex" :icon="icon" :ripple="false">
    <QTooltip
      :offset="[9, 10]"
      anchor="center right"
      self="center left"
      transition-show="jump-right"
      transition-hide="jump-left"
    >
      <span class="tab-name-tooltip">
        {{ name }}
      </span>
    </QTooltip>
    <span v-if="tabId" :id="getBsMenuTabId(tabId)"> </span>
  </QTab>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getBsMenuTabId } from "./bsLayoutHelper";
import { QTab, QTooltip } from "quasar";
export default defineComponent({
  name: "BsMenuTab",
  components: {
    QTab,
    QTooltip,
  },
  props: {
    name: {
      type: String,
    },
    icon: {
      type: String,
    },
    tabIndex: {
      type: Number,
    },
    tabId: {
      type: String,
    },
  },
  methods: {
    getBsMenuTabId(tabId?: string) {
      tabId = tabId || `${this.tabIndex}` || "";
      return getBsMenuTabId(tabId);
    },
  },
});
</script>
<style lang="scss" scoped>
.tab-name-tooltip {
  font-size: 0.8rem;
}
</style>
