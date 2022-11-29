<template>
    <BsLayoutDefault :header="true" docTitle="Solution Name" docIcon="/imgs/doc-logo-example.svg">
      <template #header>
        <div class="dku-medium-title-sb q-pa-md">Header</div>
      </template>
      <template #leftpanel>
        <div class="dku-medium-title-sb q-pa-md">Left Panel</div>
      </template>
      <template #documentation>
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
        
      </template>
      <template #content>
        <router-view />
      </template>
    </BsLayoutDefault>
</template>