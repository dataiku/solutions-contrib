<script lang="ts">
import { defineComponent, Component } from 'vue';

export default defineComponent({
    methods: {
        getSlotComponents(name: string, slotName = "default") {
            const getComponents = (slotName: string) => {
                return this.$slots.hasOwnProperty(slotName) ? this.$slots[slotName]!() : [];
            }
            const components = getComponents(slotName);
            return components.filter((child) => {
                const childType = child.type as Component;
                return childType?.name && (childType.name === name);
            });
        },
    },
});
</script>