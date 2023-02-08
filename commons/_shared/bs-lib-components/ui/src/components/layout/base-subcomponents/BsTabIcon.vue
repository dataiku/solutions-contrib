<template>
    <Teleport v-if="menuTabsMounted" :to="bsMenuTabCSSSelector">
        <q-icon v-if="iconName" v-bind="$attrs" :name="iconName"></q-icon>
        <slot></slot>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getBsMenuTabId } from '../bsLayoutHelper'
import { QIcon } from 'quasar';
export default defineComponent({
    name: "BsTabIcon",
    inject: ["$menuTabsMounted", "$tabId"],
    components: {
        QIcon,
    },
    props: {
        name: String,
    },
    computed: {
        iconName() {
            if (this.name === undefined) {
                return this.$slots.default ? undefined : "tab";
            }
            return this.name;
        },
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