<template>
<BsLayoutDefault>
    <BsTab icon="movie" name="a-first-tab" docTitle="First Tab" docIcon="/imgs/doc-logo-example.svg">
        <template #header>
            <div class="dku-medium-title-sb q-pa-md">Header First tab</div>
        </template>
        <template #leftpanel>
            <div class="dku-medium-title-sb q-pa-md">Left Panel First tab</div>
        </template>
        <template #documentation>
            <p class="dku-small-title">Documentation First tab</p>
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
        </template>
        <template #content>
            <router-view />
        </template>
    </BsTab>
    <BsTab icon="help" name="a-second-tab" docTitle="Second Tab" docIcon="/imgs/doc-logo-example.svg">
        <template #header>
            <div class="dku-medium-title-sb q-pa-md">Header Second tab</div>
        </template>
        <template #leftpanel>
            <div class="dku-medium-title-sb q-pa-md">Left Panel Second tab</div>
        </template>
        <template #documentation>
            <p class="dku-small-title">Documentation Second tab</p>
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
        </template>
        <template #content>
            <router-view />
        </template>
    </BsTab>
</BsLayoutDefault>
</template>

<script lang="ts">
import BsTab from "../../../../src/components/layout/BsTab.vue"

export default {
    name: "LayoutWithTabs",
    components: {
        BsTab,
    },
};
</script>