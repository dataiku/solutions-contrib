<template>
    <TableContainer>
        <BsTable title="Treats" :dss-table-name="dssTableName" :server-side-pagination="serverSidePagination"></BsTable>
    </TableContainer>
	<TableConfigurationControls
		@update:batch-offset="serverSidePagination.batchOffset = +$event"
		@update:batch-size="serverSidePagination.batchSize = +$event"
		@update:records-amount="serverSidePagination.recordsCount = +$event"
		@update:dss-table-name="dssTableName = $event"
		
		:dssTableName="dssTableName"
        :batchSize="batchSize"
        :batchOffset="batchOffset"
        :recordsCount="recordsCount"
	></TableConfigurationControls>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TableContainer from "./TableContainer.vue";
import TableConfigurationControls from "../TableConfigurationControls.vue";

export default defineComponent({
	components: {
		TableContainer,
		TableConfigurationControls,
	},
	data() {
		return {
			dssTableName: "movies_data_top_1000_copy",
			serverSidePagination: {
				batchOffset: 0,
				batchSize: 100,
				recordsCount: 1000,
			},
			batchOffset: 0,
			batchSize: 100,
			recordsCount: 1000,
		};
	},
	watch: {
        "serverSidePagination.batchOffset"(newVal: any) {
			this.batchOffset = newVal;
        },
        "serverSidePagination.batchSize"(newVal: any) {
			this.batchSize = newVal;
        },
        "serverSidePagination.recordsCount"(newVal: any) {
			this.recordsCount = newVal;
        },
    },
	methods: {
	}
});
</script>