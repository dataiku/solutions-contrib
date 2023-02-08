<template>
    <BsLayoutDefault docTitle="Solution Name" :docIcon="docLogo">
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
        <!-- your content -->
      </BsContent>
    </BsLayoutDefault>
</template>

<script>
  import docLogo from "./assets/images/doc-logo-example.svg"
  export default {
    data() {
      return {
        docLogo,
      }
    }
  }
</script>