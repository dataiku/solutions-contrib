<template>
  <div class="q-pa-sm" style="height: 700px">
    <div style="display: inline-flex; flex-direction: row">
      <BsToggle
        v-model="filtersOn"
        labelLeft="Filters On"
        color="blue"
      ></BsToggle>
    </div>
    <BsGrid
      title="Demand Forecast Data"
      row-key="field"
      dss-table-name="webapp_data"
      :filters="filtersOn ? filters : {}"
      :rowSelection="selection"
      groupKey="date"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      filtersOn: false,
      filters: {
        granularity: ["store_california_2"],
        product_id: ["FOODS_3_107", "FOODS_3_086", "FOODS_3_080"],
      },
      selection: "multiple",
    };
  },
};
</script>
<style>
.bs-toggle--is-disabled .bs-toggle__content {
  background-color: rgba(0, 0, 255, 0.4) !important;
}
</style>
