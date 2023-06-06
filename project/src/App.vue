<template>
  <BsLayoutDefault>
    <BsTab
      icon="movie"
      name="First Tab"
      docTitle="First Tab"
      :docIcon="docLogo"
    >
      <BsHeader>
        <div class="dku-medium-title-sb q-px-md">Header first tab</div>
      </BsHeader>
      <BsDrawer>
        <div class="dku-medium-title-sb q-px-md">Left Panel first tab</div>
      </BsDrawer>
      <BsDocumentation>
        <p class="dku-small-title">Documentation First tab</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 2</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 3</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 4</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
      </BsDocumentation>
      <BsContent>
        <HelloWorld />
      </BsContent>
    </BsTab>
    <BsTab
      icon="help"
      name="Second Tab"
      docTitle="Second Tab"
      :docIcon="docLogo"
    >
      <BsHeader>
        <div class="dku-medium-title-sb q-px-md">Header Second tab</div>
      </BsHeader>
      <BsDrawer>
        <div class="dku-medium-title-sb q-px-md">Left Panel Second tab</div>
      </BsDrawer>
      <BsDocumentation>
        <p class="dku-small-title">Documentation Second tab</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 2</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 3</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
        <p class="dku-small-title">Description 4</p>
        <p class="dku-text">
          Use filters to discover your process through the data. Remove noisy
          activities through the bottom filters. Processes displayed in the main
          screen can be saved as reference and compared through conformance
          checks and individual traces.
        </p>
      </BsDocumentation>
      <BsContent>
        <HelloWorld />
      </BsContent>
    </BsTab>
  </BsLayoutDefault>
</template>

<script>
import docLogo from "./assets/images/doc-logo-example.svg";
import HelloWorld from "./components/HelloWorld.vue";
export default {
  data() {
    return {
      docLogo,
      ismounted: false,
    };
  },
  components: {
    HelloWorld,
  },
  mounted: function () {
    this.ismounted = true;
  },
};
</script>
