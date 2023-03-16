<template>
<BsLayoutDefault>
    <BsTab name="First Tab" icon="movie" docTitle="First Tab" docIcon="/imgs/doc-logo-example.svg">
        <BsHeader>
            <div class="dku-medium-title-sb q-px-md">Header First tab</div>
        </BsHeader>
        <BsDrawer>
            <div class="dku-medium-title-sb q-px-md">Left Panel First tab</div>
        </BsDrawer>
        <BsDocumentation>
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
        </BsDocumentation>
        <BsContent>
            <router-view />
        </BsContent>
    </BsTab>
    <BsTab icon="help" name="Second Tab" docTitle="Second Tab" docIcon="/imgs/doc-logo-example.svg">
        <BsHeader>
            <div class="dku-medium-title-sb q-px-md">Header Second tab</div>
        </BsHeader>
        <BsDrawer>
            <div class="dku-medium-title-sb q-px-md">Left Panel Second tab</div>
        </BsDrawer>
        <BsDocumentation>
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
        </BsDocumentation>
        <BsContent>
            <router-view />
        </BsContent>
    </BsTab>
</BsLayoutDefault>
</template>

<script lang="ts">
import BsContent from "app/../src/components/layout/base-subcomponents/BsContent.vue";
import BsDocumentation from "app/../src/components/layout/base-subcomponents/BsDocumentation.vue";
import BsDrawer from "app/../src/components/layout/base-subcomponents/BsDrawer.vue";
import BsHeader from "app/../src/components/layout/base-subcomponents/BsHeader.vue";
import BsTabIcon from "app/../src/components/layout/base-subcomponents/BsTabIcon.vue";
import BsTab from "app/../src/components/layout/BsTab.vue";
import { QIcon } from "quasar";
export default {
    name: "LayoutWithTabs",
    components: {
    BsTab,
    BsDocumentation,
    BsContent,
    BsDrawer,
    BsHeader,
    BsTabIcon,
    QIcon,
},
};
</script>