<template>
    <div class="bs-table-col-header-container">
        <span class="bs-table-col-header-title">
            {{ col?.label || col?.name || "" }}
        </span>
        <div
            ref="BsTableColHeaderActions"
            class="bs-table-col-header-actions q-py-xs q-px-sm rounded-borders"
        >
            <q-icon  @click="sortColumn" :name="mdiArrowUpThin" size="1rem" class="sort-icon">
            </q-icon>
            <q-icon
                :class="[
                    searchPopupActive && 'bs-table-col-header-action-interacting',
                    searching && 'bs-table-col-header-action-active',
                ]"
                :name="searchColIcon"
                size="1rem"
            >
                <q-menu
                    anchor="top middle"
                    self="bottom middle"
                    
                    transition-show="scale"
                    transition-hide="scale"

                    :offset="[0, 10]"

                    v-model="searchPopupActive"
                >
                    <q-list>
                        <q-item>
                            <q-item-section>
                                <BsSearchTableCol
                                    :icon="searchColIcon"
                                    :model-value="lastSearchedValue"
                                    @update:model-value="searchColumn"
                                    autofocus
                                ></BsSearchTableCol>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { isNull, isUndefined } from "lodash";

import { QIcon, QTh, QMenu, QItem, QItemSection, QList } from 'quasar';
import {
        mdiArrowUpThin,
        mdiMagnify,
    } from '@quasar/extras/mdi-v6';
import BsSearchTableCol from './BsSearchTableCol.vue';

export default defineComponent({
    name: "BSTableColHeader",
    components: {
        QIcon, QTh, QMenu, QItem, QItemSection, QList
    ,
    BsSearchTableCol,
},
    emits: ["search-col", "update:model-value"],
    data() {
        return {
            mdiArrowUpThin,
            searchColIcon: mdiMagnify,
            searchPopupActive: false,
            searching: false,
            lastSearchedValue: "" as string | null | number | undefined,
        };
    },
    props: {
        sort: Function as PropType<(col: any) => void>,
        col: Object as PropType<{label: string, name: string}>,
    },
    methods: {
        sortColumn() {
            if (!this.sort) return;
            this.sort(this.col);
        },
        searchColumn(searchVal: string | null | number | undefined) {
            this.lastSearchedValue = searchVal;
            this.searching = !(isNull(searchVal) || isUndefined(searchVal)) && !!(searchVal as string)?.length;
            this.$emit("search-col", this.col?.name, searchVal);
        },
    },
});
</script>

<style scoped lang="scss">

.bs-table-col-header-container {
    display: flex;
    gap: 1rem;
    align-items: center;
}


</style>