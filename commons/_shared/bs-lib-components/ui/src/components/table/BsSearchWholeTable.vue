<template>
<div class="bs-search-table-container">
    <BsInputDebounce
            width="190"
            label="Search items"
            filled
            dense
            format-input
            v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
        <template #append>
            <q-icon :name="searchColIcon" size="1rem">
            </q-icon>
        </template>
    </BsInputDebounce>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mdiMagnify } from '@quasar/extras/mdi-v6';

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
            searchColIcon: mdiMagnify,
        };
    }
});
</script>

<style lang="scss" scoped>
.bs-search-table-container {
    --bs-search-table-container-item-gap: 10px;
    display: flex;
    gap: var(--bs-search-table-container-item-gap);
    width: 240px;
    border: 1px solid #CCCCCC;
    border-radius: 2px;
    padding: 0px 8px;
    height: 26px;

    :deep(.q-field--filled){
        .q-field__control, .q-field__control:before{
            background-color: #FFFFFF;
            padding: 0px;
        }
    }
    :deep(.q-field--dense){
        .q-field__control{
            height: 100%;
            max-height: 100%;
        }
        .q-field__control:before{
            border: none;
            transition: none;
        }
        .q-field__label{
            top: 4px;
            font-size: 13px;
        }
        .q-field__native{
            padding-bottom: 4px;
        }
    }  
    :deep(.q-field__control-container){
        order: 2;
        margin-left: 10px;
    }
    :deep(.q-field__append){
        max-height: 100%;
    }
    :deep(.q-field__marginal){
        font-size: 0.8rem;
    }
}
.bs-search-table-container > * {
    flex: 0 0 100%;
}
</style>