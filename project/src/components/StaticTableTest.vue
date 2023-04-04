<template>
	<TableContainer>
		<BsTable title="Treats" :rows="rows" :columns="columns" row-key="name" />
	</TableContainer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TableContainer from "./TableContainer.vue";

import { rows, columns } from "./tableStaticData";

export default defineComponent({
	components: {
		TableContainer,
	},
	data() {
		return {
			rows,
			columns,
		};
	},
});
</script>