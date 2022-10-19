<template>
    <BsLayoutDefault LeftPanelTitle="Subtitle">
      <template #leftpanel>
      </template>
      <template #header>
          <div class="fit row wrap justify-between items-center content-start">
            <div class="dku-text">
              Number of records
            </div>
            <q-btn label="Save"></q-btn>
          </div>
      </template>
      <template #content>
          <div class="fit row wrap justify-between items-center content-start">
            <div class="dku-text">
              Number of records
            </div>
            <q-btn label="Save"></q-btn>
          </div>
      </template>
      
    </BsLayoutDefault>
</template>
  
<script>
import { BsLayoutDefault } from "ui"
export default {
  components: {
      BsLayoutDefault
  }
}
</script>
  