<template>
<BsLayoutDefault docTitle="Solution Name" docIcon="/imgs/doc-logo-example.svg">
	<BsHeader>
		<div class="dku-medium-title-sb q-pa-md">Header</div>
	</BsHeader>
	<BsDrawer>
		<div class="dku-medium-title-sb q-pa-md">Left Panel</div>
	</BsDrawer>
	<BsDocumentation>
		<p class="dku-small-title">Description 1</p>
		<p class="dku-text">Use filters to discover your process through the data.
			Remove noisy activities through the bottom filters.
			Processes displayed in the main screen can be saved as reference and
			compared through conformance checks and individual traces.</p>
		<p class="dku-small-title">Description 2</p>
		<p class="dku-text">Use filters to discover your process through the data.
			Remove noisy activities through the bottom filters.
			Processes displayed in the main screen can be saved as reference and
			compared through conformance checks and individual traces.</p>
		<p class="dku-small-title">Description 3</p>
		<p class="dku-text">Use filters to discover your process through the data.
			Remove noisy activities through the bottom filters.
			Processes displayed in the main screen can be saved as reference and
			compared through conformance checks and individual traces.</p>
		<p class="dku-small-title">Description 4</p>
		<p class="dku-text">Use filters to discover your process through the data.
			Remove noisy activities through the bottom filters.
			Processes displayed in the main screen can be saved as reference and
			compared through conformance checks and individual traces.</p>
	</BsDocumentation>
	<BsContent>
		<router-view />
	</BsContent>
</BsLayoutDefault>
</template>

<script>
import { defineComponent } from "vue";

import BsContent from "app/../src/components/layout/base-subcomponents/BsContent.vue";
import BsDocumentation from "app/../src/components/layout/base-subcomponents/BsDocumentation.vue";
import BsDrawer from "app/../src/components/layout/base-subcomponents/BsDrawer.vue";
import BsHeader from "app/../src/components/layout/base-subcomponents/BsHeader.vue";
import BsLayoutDefault from "app/../src/components/layout/BsLayoutDefault.vue"

export default defineComponent({
	name: "EmptyLayout",
	components: {
		BsHeader,
		BsDrawer,
		BsDocumentation,
		BsContent,
		BsLayoutDefault
	}
});
</script>