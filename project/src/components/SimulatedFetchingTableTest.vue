<template>
	<TableContainer>
		<BsTable
            title="Treats"
            row-key="name"
            :rows="displayedRows"
            :columns="columns"
            :loading="loading"
            :server-side-pagination="serverSidePagination"
            @update:server-side-pagination="onRequest"
        />
	</TableContainer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TableContainer from "./TableContainer.vue";

import { rows, columns } from "./tableStaticData";

interface ServerSidePagination {
    batchSize: number;
    batchOffset: number;

    recordsCount: number | undefined;
}

export default defineComponent({
	components: {
		TableContainer,
	},
	data() {
		return {
			displayedRows: [] as Record<string, any>[],
			columns,
            serverSidePagination: {
                batchOffset: 0,
                batchSize: 2,
                recordsCount: 10
            } as ServerSidePagination,
            loading: false,
		};
	},
    methods: {
        onRequest(serverSidePagination: ServerSidePagination) {
            this.loading = true;
            this.serverSidePagination = {...this.serverSidePagination, ...serverSidePagination};
            setTimeout(() => {
                const start = this.serverSidePagination.batchOffset * this.serverSidePagination.batchSize
                const end = start + this.serverSidePagination.batchSize;
                this.displayedRows = rows.slice(start, end);
                this.loading = false;
            }, 1000);
        }
    },
    mounted() {
        this.onRequest(this.serverSidePagination);
    }
});
</script>