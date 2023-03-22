<template>
    <div class="bs-table-bottom-container">
        <div
            v-if="!isFullDataset"
            :class="['bs-table-warning', searching && 'bs-table-warning-active']"
        >
            <q-icon :name="mdiAlert"></q-icon>
            <div class="bs-table-warning-text">the search is applied only to the sampled records!</div>
        </div>
        <div class="bs-table-records-total" v-if="recordsTotal">{{ recordsTotal }}</div>
        <div class="bs-table-sampled-records" v-if="!isFullDataset">
            <span>{{ sampledRecords }}</span>
            <div class="bs-table-server-side-pagination-controls">
                <q-btn
                    icon="chevron_left"
                    color="grey-8"
                    round
                    dense
                    flat
                    :disable="isFirstBatch"
                    @click="prevBatch"
                />
                <q-btn
                    icon="chevron_right"
                    color="grey-8"
                    round
                    dense
                    flat
                    :disable="isLastBatch"
                    @click="nextBatch"
                />
            </div>
        </div>
        <div class="bs-table-records-info">
            <span>{{ recordsShown }}</span>
        </div>
        <div class="bs-table-pagination-controls">
            <q-btn
                v-if="scope.pagesNumber > 2"
                icon="first_page"
                color="grey-8"
                round
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.firstPage"
            />
            
            <q-btn
                icon="chevron_left"
                color="grey-8"
                round
                dense
                flat
                :disable="scope.isFirstPage"
                @click="scope.prevPage"
            />
            
            <q-btn
                icon="chevron_right"
                color="grey-8"
                round
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.nextPage"
            />
            
            <q-btn
                v-if="scope.pagesNumber > 2"
                icon="last_page"
                color="grey-8"
                round
                dense
                flat
                :disable="scope.isLastPage"
                @click="scope.lastPage"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { isUndefined } from 'lodash';
import { defineComponent, PropType } from 'vue';
import { ServerSidePagination } from './tableHelper';
import { mdiAlert } from '@quasar/extras/mdi-v6';
import { QIcon } from "quasar";

type QPagination = {
    /**
       * Column name (from column definition)
       */
    sortBy: string;
    /**
       * Is sorting in descending order?
       */
    descending: boolean;
    /**
       * Page number (1-based)
       */
    page: number;
    /**
       * How many rows per page? 0 means Infinite
       */
    rowsPerPage: number;
};

type QTableBottomScope = {
    pagination: QPagination;
    pagesNumber: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    firstPage: () => void;
    prevPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
    inFullscreen: boolean;
    toggleFullscreen: () => void;
}


export default defineComponent({
    name: "BsTableBottom",
    components: {
        QIcon
    },
    emits: ["update:batch-offset"],
    props: {
        scope: {
            type: Object as PropType<QTableBottomScope>,
            required: true,
        },
        serverSidePagination: Object as PropType<ServerSidePagination>,
        searching: Boolean,
    },
    data() {
        return {
            batchSize: 0,
            batchOffset: 0,
            recordsCount: 0,
            mdiAlert,
        };
    },
    computed: {
        pagination(): QPagination {
            return this.scope.pagination;
        },
        recordsShown(): string {
            const rowsPerPage = this.pagination.rowsPerPage;
            let to = (this.pagination.page * rowsPerPage) + this.batchSize * this.batchOffset;
            const from = to - rowsPerPage;
            if (this.recordsCount) to = Math.min(to, this.recordsCount);
            
            return `records ${from} - ${to}`;
        },
        isFullDataset(): boolean {
            return isUndefined(this.serverSidePagination);
        },
        recordsTotal(): string | undefined {
            if (this.recordsCount || this.isFullDataset) {
                const total = this.recordsCount || (this.scope.pagesNumber * this.pagination.rowsPerPage);
                return `records total: ${total}`;
            }
        },
        sampledRecords(): string | undefined {
            if (!this.isFullDataset) {
                const from = this.batchSize * this.batchOffset;
                let to = from + this.batchSize;
                if (this.recordsCount) to = Math.min(to, this.recordsCount);
                return `sampled records: ${from} - ${to}`;
            }
        },
        isFirstBatch(): boolean {
            return this.batchOffset === 0;
        },
        isLastBatch(): boolean {
            return !(isUndefined(this.lastBatchIndex) || (this.batchOffset !== this.lastBatchIndex));
        },
        lastBatchIndex(): number | undefined {
            if (this.recordsCount && this.batchSize) {
                return Math.floor((this.recordsCount - 1)/ this.batchSize);
            }
        }
    },
    watch: {
        "serverSidePagination.batchOffset"() {
            this.syncServerSidePagination();
        },
        "serverSidePagination.batchSize"() {
            this.syncServerSidePagination();
        },
        "serverSidePagination.recordsCount"() {
            this.syncServerSidePagination();
        },
    },
    methods: {
        prevBatch() {
            this.changeCurrentBatchOffsetBy(-1);
        },
        nextBatch() {
            this.changeCurrentBatchOffsetBy(1);
        },
        changeCurrentBatchOffsetBy(changeBy: number) {
            this.pagination.page = 1;
            this.$emit("update:batch-offset", this.batchOffset + changeBy);
        },
        syncServerSidePagination() {
            if (!isUndefined(this.serverSidePagination?.batchOffset)) this.batchOffset = this.serverSidePagination!.batchOffset;
            if (this.serverSidePagination?.batchSize) this.batchSize = this.serverSidePagination?.batchSize;
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
    .bs-table-sampled-records {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .bs-table-records-total {
        display: flex;
        align-items: center;
    }

    .bs-table-records-info {
        display: flex;
        gap: 10px;
    }
    
    .bs-table-pagination-controls {
        display: flex;
        gap: 10px;
    }
}

</style>