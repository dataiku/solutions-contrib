<script>
    
</script>
<template>
    <BsLayoutDefault :header="true">
      <template #leftpanel>
        test
      </template>
      <template #header>
          <div class="fit row wrap justify-between items-center content-start">
            <div class="dku-text">
              Number of records
            </div>
            <BsButton class="bs-btn dku-text" unelevated>Fullscreen</BsButton>
          </div>
      </template>
      <template #content>
          <div class="fit row wrap justify-between items-center content-start">
            <div class="dku-text">
              Number of records
            </div>
            <BsButton class="bs-btn dku-text" unelevated>Fullscreen</BsButton>
          </div>
      </template>

    </BsLayoutDefault>
</template>