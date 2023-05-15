<template>
<div class="bs-search-table-container">
    <BsInputDebounce
            width="190"
            label="Table Search"
            clearable
            dense
            filled
            format-input
            v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
        <template #append>
            <q-icon :name="mdiTableSearch">
            </q-icon>
        </template>
    </BsInputDebounce>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mdiTableSearch } from '@quasar/extras/mdi-v6';

import { QIcon } from 'quasar';

import BsInputDebounce from "./BsInputDebounce.vue"

export default defineComponent({
    name: "BsSearchTable",
    components: {
        QIcon,
        BsInputDebounce,
    },
    data() {
        return {
            mdiTableSearch,
        };
    }
});
</script>

<style lang="scss" scoped>
.bs-search-table-container {
    --bs-search-table-container-item-gap: 10px;
    display: flex;
    gap: var(--bs-search-table-container-item-gap);
    width: 327px;

}
.bs-search-table-container > * {
    flex: 0 0 100%;
}
</style>