<template>
    <div class="bs-grid-header-container">
        <div class="bs-grid-col-header-title-container">
            <div class="bs-grid-col-header-title">{{ params.displayName }}</div>
            <q-icon v-if="filterActive" :name="mdiFilterOutline" size="1rem"></q-icon>
            <div class="bs-grid-col-header-title-icon" v-if="params.enableMenu" ref="menuButton">
                <q-icon :name="mdiChevronDown" size="1rem">
                    <q-menu
                        anchor="bottom middle"
                        self="top middle"
                        transition-show="scale"
                        transition-hide="scale"
                        :offset="[0, 10]"
                    >
                        <q-list
                            ref="BsGridColHeaderActions"
                            class="bs-grid-col-header-actions q-py-xs q-px-sm rounded-borders"
                        >
                            <q-item v-if="params.enableSorting">
                                <q-item-section>
                                    <div
                                        class="bs-grid-col-header-action-section cursor-pointer"
                                        @click="onSortRequested"
                                    >
                                        <q-icon
                                            :name="sortColIcon"
                                            size="0.8rem"
                                            class="sort-icon"
                                            :class="{
                                                sorted: noSort === 'inactive',
                                            }"
                                        >
                                        </q-icon>
                                        <div>Sort {{ sortText }}</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                            <q-item v-close-popup>
                                <q-item-section>
                                    <div
                                        class="bs-grid-col-header-action-section cursor-pointer"
                                        @click="searchColumn"
                                    >
                                        <q-icon :name="mdiMagnify" size="0.8rem">
                                        </q-icon>
                                        <div>Filter</div>
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-icon>
            </div>
        </div>
        <div
                v-if="params.column.colDef.dataType"
                class="bs-grid-col-header-data-type"
            >
                {{ params.column.colDef.dataType }}
            </div>
    </div>
</template>

<script>
import { QIcon, QItem, QMenu, QList, QItemSection, ClosePopup } from "quasar";
import {
    mdiMagnify,
    mdiChevronDown,
    mdiSortAscending,
    mdiSortDescending,
    mdiFilterOutline
} from "@quasar/extras/mdi-v6";
export default {
    data() {
        return {
            QIcon,
            QItem, QMenu, QList,
            QItemSection, ClosePopup,
            mdiSortAscending,
            mdiSortDescending,
            mdiChevronDown,
            mdiMagnify,
            mdiFilterOutline,
            ascSort: null,
            descSort: null,
            noSort: "active",
            filterActive: false,
        };
    },
    mounted() {
        this.params.column.addEventListener("sortChanged", this.onSortChanged);
        this.params.column.addEventListener("filterChanged", this.onFilterChanged);
        this.onSortChanged();
    },
    beforeUnmount() {
        this.params.column.removeEventListener("sortChanged", this.onSortChanged);
        this.params.column.removeEventListener("filterChanged", this.onFilterChanged);
    },
    computed: {
        sortColIcon() {
            if (this.descSort === "active") {
                return mdiSortAscending;
            }
            return mdiSortDescending;
        },
        sortText() {
            if (this.descSort === "active") {
                return "descending";
            }
            return "ascending";
        },
    },
    methods: {
        searchColumn() {
            this.params.showColumnMenu(this.$refs.menuButton);
        },
        onSortChanged() {
            this.ascSort = this.descSort = this.noSort = "inactive";
            if (this.params.column.isSortAscending()) {
                this.ascSort = "active";
            } else if (this.params.column.isSortDescending()) {
                this.descSort = "active";
            } else {
                this.noSort = "active";
            }
        },
        onSortRequested(event) {
            let order =
                this.noSort === "active"
                    ? "asc"
                    : this.ascSort === "active"
                    ? "desc"
                    : "";
            this.params.setSort(order, event.shiftKey);
        },
        onFilterChanged() {
            this.filterActive = this.params.column.filterActive;
        },
    },
};
</script>

<style lang="scss" scoped>
.bs-grid-header-container {
    display: flex;
    flex-direction: column;
    cursor: var(--bs-grid-header-cursor-type);
    user-select: text;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 100%;
}

.bs-grid-col-header-title-container {
    display: flex;
    font-weight: 600;
    line-height: 15px;
    display: flex;
    flex-direction: row;
    gap: 10px;
}
.bs-grid-col-header-data-type {
    color: var(--q-dark);
    font-size: 0.65rem;
    margin-top: -5px;
    font-family: Monaco;
    font-weight: 400;
    line-height: 15px;
}

.bs-grid-col-header-actions {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    :deep(.q-item) {
        min-height: auto;
        padding: 0px;
    }
    .bs-grid-col-header-action-section {
        display: flex;
        flex-direction: row;
        gap: 4px;
        font-size: 10px;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }
    .sorted {
        color: var(--q-primary);
    }
}

</style>
