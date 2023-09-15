<template>
    <div
        class="bs-table-col-header-container"
    >
        <div class="bs-table-col-header-title-container" ref="BsTableColHeaderTitleContainer">
            <div class="bs-table-col-header-title">
                <div class="bs-table-col-header-title-label">
                    {{ col?.label || col?.name || "" }}
                </div>
                <div class="bs-table-col-header-title-icon">
                    <q-icon :name="mdiChevronDown" size="1rem">
                        <q-menu
                            anchor="bottom middle"
                            self="top middle"
                            transition-show="scale"
                            transition-hide="scale"
                            :offset="[0, 10]"
                        >
                            <q-list
                                ref="BsTableColHeaderActions"
                                class="bs-table-col-header-actions q-py-xs q-px-sm rounded-borders"
                            >
                                <q-item v-if="sortable">
                                    <q-item-section>
                                        <div
                                            class="bs-table-col-header-action-section cursor-pointer"
                                            @click="sortColumn"
                                        >
                                            <q-icon
                                                :name="sortColIcon"
                                                size="0.8rem"
                                                class="sort-icon"
                                                :class="{'sorted': sorted}"
                                            >
                                            </q-icon>
                                            <div>
                                                Sort {{ sortText }}
                                            </div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                                <q-item v-close-popup>
                                    <q-item-section>
                                        <div
                                            class="bs-table-col-header-action-section cursor-pointer"
                                            @click="searchColumn"
                                        >
                                            <q-icon
                                                :name="searchColIcon"
                                                size="0.8rem"
                                            >
                                            </q-icon>
                                            <div>Search</div>
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-icon>
                </div>
            </div>
            <div
                v-if="(col as any)?.dataType"
                class="bs-table-col-header-data-type"
            >
                {{ (col as any)?.dataType }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { QIcon, QTh, QMenu, QItem, QItemSection, QList, ClosePopup } from "quasar";
import {
    mdiArrowUpThin,
    mdiMagnify,
    mdiChevronDown,
    mdiSortAscending,
    mdiSortDescending,
} from "@quasar/extras/mdi-v6";

export default defineComponent({
    name: "BSTableColHeader",
    components: {
        QIcon,
        QTh,
        QMenu,
        QItem,
        QItemSection,
        QList
    },
    directives:{
        ClosePopup
    },
    emits: ["search-col"],
    data() {
        return {
            mdiArrowUpThin,
            mdiSortAscending,
            mdiSortDescending,
            mdiChevronDown,
            searchColIcon: mdiMagnify,
            noDebounceValue: "" as string | null | number | undefined,
            sortAsc: false,
            sorted: false,
        };
    },
    computed: {
        sortable(): boolean {
            return !!(this.col as any)?._sortable;
        },
        sortColIcon(): any {
            return !this.sortAsc ? mdiSortDescending : mdiSortAscending;
        },
        sortText(): string{
            return !this.sortAsc ? 'ascending' : 'descending' ;
        }
    },
    props: {
        sort: Function as PropType<(col: any) => void>,
        col: Object as PropType<{ label: string; name: string }>,
        sortedCol: String,
    },
    methods: {
        sortColumn() {
            if (this.sortable && this.sort) this.sort(this.col);
            this.sortAsc = this.sorted ? !this.sortAsc : true;
        },
        searchColumn() {
            this.$emit("search-col", this.col?.name);
        },
    },
    watch: {
        sortedCol(newVal: string){
            if(newVal === this.col?.name){
                this.sortAsc = this.sorted ? !this.sortAsc : true;
                this.sorted = true;
            }else{
                this.sorted = false;
                this.sortAsc = false;
            }
        }
    }
});
</script>

<style scoped lang="scss">
.bs-table-col-header-container {
    height: 36px;
    display: inline-block;
    --bs-table-header-cursor-type: pointer;
    .bs-table-col-header-title-container {
        display: flex;
        flex-direction: column;
        cursor: var(--bs-table-header-cursor-type);
        user-select: text;
        justify-content: space-evenly;
        align-items: flex-start;
        height: 100%;
        .bs-table-col-header-title {
            font-weight: 600;
            line-height: 15px;
            display: flex;
            flex-direction: row;
            gap: 10px;
        }
        .bs-table-col-header-data-type {
            color: var(--q-dark);
            font-size: 0.65rem;
            margin-top: -5px;
            font-family: Monaco;
            font-weight: 400;
            line-height: 15px;
        }
    }
}

.bs-table-col-header-actions {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    :deep(.q-item) {
        min-height: auto;
        padding: 0px;
    }
    .bs-table-col-header-action-section {
        display: flex;
        flex-direction: row;
        gap: 4px;
        font-size: 10px;
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
    }
    .sorted {
        color: var(--q-primary);
    }
}
</style>
