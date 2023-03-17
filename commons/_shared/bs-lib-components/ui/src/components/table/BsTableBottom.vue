<template>
    <div class="bs-table-bottom-container">
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

    },
    emits: ["update:batch-offset"],
    props: {
        scope: {
            type: Object as PropType<QTableBottomScope>,
            required: true,
        },
        batchSize: Number,
        batchOffset: Number,
        lastBatchIndex: Number,
        columnsCount: Number
    },
    data() {
        return {};
    },
    computed: {
        pagination(): QPagination {
            return this.scope.pagination;
        },
        recordsShown(): string {
            const batchSize = this.batchSize || 0;
            const batchOffset = this.batchOffset || 0;
            const rowsPerPage = this.pagination.rowsPerPage;
            const to = (this.pagination.page * rowsPerPage) + batchSize * batchOffset;
            const from = to - rowsPerPage;

            
            return `records ${from} - ${to}`;
        },
        isFullDataset(): boolean {
            return isUndefined(this.batchSize) || isUndefined(this.batchOffset);
        },
        recordsTotal(): string | undefined {
            if (this.columnsCount || this.isFullDataset) {
                const total = this.columnsCount || (this.scope.pagesNumber * this.pagination.rowsPerPage);
                return `records total: ${total}`
            }
        },
        sampledRecords(): string | undefined {
            if (!this.isFullDataset) {
                const batchSize = this.batchSize || 0;
                const batchOffset = this.batchOffset || 0;
                const from = batchSize * batchOffset;
                const to = from + batchSize;
                return `sampled records: ${from} - ${to}`;
            }
        },
        isFirstBatch(): boolean {
            return this.batchOffset === 0;
        },
        isLastBatch(): boolean {
            return !(isUndefined(this.lastBatchIndex) || (this.batchOffset !== this.lastBatchIndex));
        }
    },
    methods: {
        prevBatch() {
            this.changeCurrentBatchOffsetBy(-1);
        },
        nextBatch() {
            this.changeCurrentBatchOffsetBy(1);
        },
        changeCurrentBatchOffsetBy(changeBy: number) {
            const batchOffset = this.batchOffset || 0;
            this.pagination.page = 1;
            this.$emit("update:batch-offset", batchOffset + changeBy);
        },
    },
});
</script>

<style scoped lang="scss">
.bs-table-bottom-container {
    display: flex;
    inset: 0;
    width: 100%;

    justify-content: flex-end;
    align-items: center;

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