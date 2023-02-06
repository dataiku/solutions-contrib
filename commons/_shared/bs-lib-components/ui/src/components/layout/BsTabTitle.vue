<template>
<div
    v-bind="$attrs"
    class="text-primary bs-tab-title dku-medium-title-sb q-pa-md"
>
    {{tabName}}
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "bsTabTitle",
    inject: ["$tabName"],
    computed: {
        tabName(): string {
            return (this as any as {
                $tabName: string;
            }).$tabName;
        },
    },
});
</script>

<style scoped lang="scss">
.bs-tab-title {
    max-width: var(--bs-drawer-width);
    word-break: break-word;
}
</style>