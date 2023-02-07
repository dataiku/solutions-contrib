<template>
    <Teleport v-if="menuTabsMounted" :to="bsMenuTabCSSSelector"></Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getBsMenuTabId } from '../bsLayoutHelper'

export default defineComponent({
    name: "default",
    inject: ["$menuTabsMounted", "$tabId"],
    components: {

    },
    data() {
        return {};
    },
    props: {

    },
    computed: {
        menuTabsMounted() {
            return (this as any as { $menuTabsMounted: boolean }).$menuTabsMounted;
        },
        tabId(): string {
            return (this as any as { $tabId: string })?.$tabId;
        },
        bsMenuTabId(): string {
            return getBsMenuTabId(this.tabId);
        },
        bsMenuTabCSSSelector(): string {
            return `#${this.bsMenuTabId}`;
        }
    },
});
</script>

<style scoped lang="scss">

</style>