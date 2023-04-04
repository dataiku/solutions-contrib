<template>
    <TableContainer>
        <BsTable title="Treats" :dss-table-name="dssTableName"></BsTable>
    </TableContainer>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TableContainer from "./TableContainer.vue";

export default defineComponent({
	components: {
		TableContainer,
	},
	data() {
		return {
			dssTableName: "movies_data_top_1000_copy",
		};
	},
});
</script>