<template>
    <div 
        class="bs-table-col-header-container"
        :style="{'--bs-table-header-cursor-type': sortable ? 'pointer' : 'default'}"
        @click="sortColumn"
        >
        <div class="bs-table-col-header-title-container">
            <div class="bs-table-col-header-title">
                {{ col?.label || col?.name || "" }}
            </div>
            <div v-if="(col as any)?.dataType" class="bs-table-col-header-data-type">
                {{ (col as any)?.dataType }}
            </div>
        </div>
        <div
            ref="BsTableColHeaderActions"
            class="bs-table-col-header-actions q-py-xs q-px-sm rounded-borders"
            @click.stop="1"
        >
            <q-icon v-if="sortable"  @click="sortColumn" :name="mdiArrowUpThin" size="1rem" class="sort-icon">
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
                                    v-model="lastSearchedValue"
                                    @update:formatted-value="searchColumn"
                                    @update:no-debounce:formatted-value="noDebounceValue = $event"
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

// import isUndefined from 'lodash/isUndefined';
import { isUndefined } from 'lodash';
// import isNull from 'lodash/isNull';
import { isNull } from 'lodash';


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
    emits: ["search-col"],
    data() {
        return {
            mdiArrowUpThin,
            searchColIcon: mdiMagnify,
            searchPopupActive: false,
            lastSearchedValue: "" as string | null | number | undefined,
            noDebounceValue: "" as string | null | number | undefined,
        };
    },
    computed: {
        sortable(): boolean {
            return !!(this.col as any)?._sortable;
        },
        searching(): boolean {
            const searchVal = this.lastSearchedValue;
            return !(isNull(searchVal) || isUndefined(searchVal)) && !!(searchVal as string)?.length;
        },
    },
    props: {
        sort: Function as PropType<(col: any) => void>,
        col: Object as PropType<{label: string, name: string}>,
        searchedCols: Object as PropType<Record<string, string>>
    },
    watch: {
        searchPopupActive(newVal, lastVal) {
            if (newVal || !lastVal) return;
            this.searchColumn(this.noDebounceValue);
        },
        searchedCols(newVal: Record<string, string>) {
            console.log(this.searchedCols);
            if (this.col?.name && newVal.hasOwnProperty(this.col.name)) {
                this.lastSearchedValue = newVal[this.col.name];
            } else {
                this.lastSearchedValue = "";
            }
        }
    },
    methods: {
        sortColumn() {
            if (this.sortable && this.sort) this.sort(this.col);
        },
        searchColumn(searchVal: string | null | number | undefined) {
            this.lastSearchedValue = searchVal;
            this.$emit("search-col", this.col?.name, searchVal);
        },
    },
});
</script>

<style scoped lang="scss">

.bs-table-col-header-container {
    display: flex;
    align-items: center;

    .bs-table-col-header-title-container {
        display: flex;
        flex-direction: column;
        cursor: var(--bs-table-header-cursor-type);
        user-select: text;
        padding-right: 1rem;

        .bs-table-col-header-data-type {
            color: var(--q-positive);
            font-size: .65rem;
            margin-top: -5px;
        }
    }
}


</style>