<template>
    <div class="bs-table-bottom-container">
        <div
            v-if="!isFullDataset"
            :class="['bs-table-warning', searching && 'bs-table-warning-active']"
        >
            <q-icon :name="mdiAlert"></q-icon>
            <div class="bs-table-warning-text">the search is applied only to the sampled records!</div>
        </div>
        <div v-if="recordsTotal && !virtualScroll || (!isFullDataset && recordsCount)" class="bs-table-records-total">records total: {{ recordsTotal }}</div>
        <BsTablePagination
            v-if="!virtualScroll"
            :scope="scope"
            :server-side-pagination="serverSidePagination"
            :start-of-the-page="startOfThePage"
        ></BsTablePagination>
        <BsTableVirtualScrollIndicator
            v-else
            :q-table-middle="qTableMiddle"
        ></BsTableVirtualScrollIndicator>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BsTablePagination from "./BsTablePagination.vue";
import BsTableVirtualScrollIndicator from "./BsTableVirtualScrollIndicator.vue";
import isUndefined from 'lodash/isUndefined';
import { ServerSidePagination } from './tableHelper';
import { mdiAlert } from '@quasar/extras/mdi-v6';
import { QIcon } from "quasar";
import { QTableBottomScope, QTablePagination } from './tableTypes';

export default defineComponent({
    name: "BsTableBottom",
    components: {
        BsTablePagination,
        BsTableVirtualScrollIndicator,
        QIcon,
    },
    props: {
        scope: {
            type: Object as PropType<QTableBottomScope>,
            required: true,
        },
        serverSidePagination: Object as PropType<ServerSidePagination>,
        searching: Boolean,
        virtualScroll: {
            type: Boolean,
            required: true,
        },
        fetchedRowsLength: Number,
        startOfThePage: {
            type: Function,
            required: true,
        },
        qTableMiddle: Object as PropType<HTMLElement>
    },
    data() {
        return {
            recordsCount: 0,
            mdiAlert,
        };
    },
    computed: {
        pagination(): QTablePagination {
            return this.scope.pagination;
        },
        isFullDataset(): boolean {
            return isUndefined(this.serverSidePagination);
        },
        recordsTotal(): number | undefined {
            if (this.recordsCount) return this.recordsCount;
            if (this.isFullDataset) return this.fetchedRowsLength;
        },
    },
    watch: {
        "serverSidePagination.recordsCount"() {
            this.syncServerSidePagination();
        },
    },
    methods: {
        syncServerSidePagination() {
            if (this.serverSidePagination?.recordsCount) this.recordsCount = this.serverSidePagination?.recordsCount;
        },
    },
    mounted() {
        this.syncServerSidePagination();
    }
});
</script>

<style scoped lang="scss">
.bs-table-bottom-container {
    display: flex;
    inset: 0;
    width: 100%;
    gap: 10px;

    justify-content: flex-end;
    align-items: center;

    .bs-table-warning {
        position: absolute;
        bottom: 13px;
        left: 20px;
        z-index: 1;

        display: flex;
        align-items: center;
        gap: 5px;
        
        color: white;
        background: var(--q-warning);
        border-radius: 5px;
        padding: 2px 4px;

        transition: max-width .5s, opacity .5s;
        
        opacity: 0;
        pointer-events: none;
        
        &.bs-table-warning-active {
            pointer-events: all;
            opacity: 1;
        }
        
        max-width: 20px;
        &:hover {
            max-width: 275px;
        }
        
        min-width: 0;
        .bs-table-warning-text {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .bs-table-records-total {
        display: flex;
        align-items: center;
    }

}

</style>