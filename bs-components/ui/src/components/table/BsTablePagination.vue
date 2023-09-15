<template>
<div class="bs-table-pagination">
    <div class="bs-table-pagination-controls">
        <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="executeAndGoToTop(scope.firstPage)"
        />
        
        <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="executeAndGoToTop(scope.prevPage)"
        />
        <div class="bs-table-records-info">
            {{ recordsShown }}
        </div>
        <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="executeAndGoToTop(scope.nextPage)"
        />
        
        <q-btn
            v-if="scope.pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="executeAndGoToTop(scope.lastPage)"
        />
    </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QBtn } from "quasar";

import { QTablePagination, QTableBottomScope } from './tableTypes';
import { ServerSidePagination } from './tableHelper';
// import isUndefined from 'lodash/isUndefined';
import { isUndefined } from 'lodash';

export default defineComponent({
    name: "BsTablePagination",
    components: {
        QBtn
    },
    props: {
        scope: {
            type: Object as PropType<QTableBottomScope>,
            required: true,
        },
        serverSidePagination: Object as PropType<ServerSidePagination>,
        startOfThePage: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            batchSize: 0,
            batchOffset: 0,
            recordsCount: 0,
        };
    },
    computed: {
        pagination(): QTablePagination {
            return this.scope.pagination;
        },
        recordsShown(): string {
            const rowsPerPage = this.pagination.rowsPerPage;
            let to = (this.pagination.page * rowsPerPage) + this.batchSize * this.batchOffset;
            const from = to - rowsPerPage;
            if (this.recordsCount) to = Math.min(to, this.recordsCount);
            
            return `${from} - ${to}`;
        },
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
        syncServerSidePagination() {
            if (!isUndefined(this.serverSidePagination?.batchOffset)) this.batchOffset = this.serverSidePagination!.batchOffset;
            if (this.serverSidePagination?.batchSize) this.batchSize = this.serverSidePagination?.batchSize;
            if (this.serverSidePagination?.recordsCount) this.recordsCount = this.serverSidePagination?.recordsCount;
        },
        executeAndGoToTop(f: Function) {
            f();
            if (this.startOfThePage) this.startOfThePage();
        },
    },
});
</script>

<style scoped lang="scss">

.bs-table-pagination,
.bs-table-pagination-controls,
.bs-table-records-info {
    display: inline-block;
    text-align: center;
    min-width: 75px;
}

.bs-table-pagination-controls {
    align-items: center;
}
</style>