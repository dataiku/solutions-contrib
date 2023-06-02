<template>
<div class="bs-table-server-side-pagination" v-if="lastBatchIndex !== 0">
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
        <div class="bs-table-server-side-pagination-offset">{{ sampleFrom }} - {{ sampleTo }}</div>
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
    <div class="bs-table-server-side-pagination-label">
        sampled rows
    </div>
</div>
</template>

<script lang="ts">
// import isUndefined from 'lodash/isUndefined';
import { isUndefined } from 'lodash';
import { defineComponent, PropType } from 'vue';

import { QBtn } from 'quasar';

import { ServerSidePagination } from './tableHelper';

export default defineComponent({
    name: "default",
    components: {
        QBtn,
    },
    emits: ["update:batch-offset"],
    data() {
        return {
            batchSize: 0,
            batchOffset: 0,
            recordsCount: 0,
        };
    },
    props: {
        serverSidePagination: Object as PropType<ServerSidePagination>,
    },
    computed: {
        sampleFrom(): number {
            const from = this.batchSize * this.batchOffset;
            return from;
        },
        sampleTo(): number {
            let to = this.sampleFrom + this.batchSize;
            if (this.recordsCount) to = Math.min(to, this.recordsCount);
            return to;
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
.bs-table-server-side-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    padding: 0px 12px;
    font-size: 10px;

    .bs-table-server-side-pagination-offset {
        display: inline-block;
        min-width: 75px;
        text-align: center;
    }
}
</style>