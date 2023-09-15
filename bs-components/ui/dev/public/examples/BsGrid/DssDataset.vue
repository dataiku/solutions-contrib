<template>
  <div class="q-pa-sm" style="height: 700px">
    <div style="display: inline-flex; flex-direction: row">
      <BsToggle
        v-model="filtersOn"
        label-left="Filters On"
        color="blue"
      />
    </div>
    <BsGrid
      title="Demand Forecast Data"
      dss-table-name="webapp_data"
      :filters="filtersOn ? filters : {}"
      :row-selection="selection"
      :group-keys="groupKeys"
      group-name="Group"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      filtersOn: false,
      filters: {
        granularity: ["store_california_1","store_california_2"],
        product_id: ["FOODS_3_107", "FOODS_3_086"],
      },
      selection: "multiple",
      groupKeys: ['date','granularity','main_category']
    };
  },
};
</script>
