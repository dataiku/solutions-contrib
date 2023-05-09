<script lang="ts">
import { defineComponent, Component } from "vue";

export default defineComponent({
  name: "CheckSlotComponentsMixin",
  methods: {
    /**
     * Returns an array of the components under a certain slot.
     *
     * It filters the `$slot[slotName]()` by the `componentName`.
     *
     * @param {string} componentName - The name field of the component
     * @param {string} [slotName=\"default\"] - The name of the slot under which to look for the component
     * */
    getSlotComponents(componentName: string, slotName = "default") {
      const getSlotElements = (slotName: string) => {
        return this.$slots.hasOwnProperty(slotName)
          ? this.$slots[slotName]!()
          : [];
      };
      const components = getSlotElements(slotName);
      return components.filter((child) => {
        const childType = child.type as any as { name?: string };
        return childType?.name && childType.name === componentName;
      }) as Component[];
    },
  },
});
</script>
