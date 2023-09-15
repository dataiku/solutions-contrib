<template>
  <div class="q-pa-sm" style="height: 700px">
    <BsGrid
      title="Treats"
      :rows="rows"
      :columns="columns"
      :row-selection="selection"
    />
  </div>
</template>
<script>
const columns = [
  {
    headerName: "Dessert (100g serving)",
    field: "name",
    sortable: true,
    valueGetter: (params) => params.data.name,
    valueFormatter: (params) => `${params.value}`,
    cellDataType: "text",
    filter: true,
    filterParams: {
      filterOptions: ["equals", "contains"], // Customize the filter options
    },
  },
  {
    headerName: "Calories",
    field: "calories",
    align: "center",
    sortable: true,
    cellDataType: "text",
    filter: true,
    filterParams: {
      filterOptions: ["equals", "contains"], // Customize the filter options
    },
  },
  {
    headerName: "Fat (g)",
    field: "fat",
    sortable: true,
    cellDataType: "number",
    type: "numericColumn",
    filter: true,
    filterParams: {
      filterOptions: ["equals", "lessThan", "greaterThan"], // Customize the filter options
    },
  },
  {
    headerName: "Carbs (g)",
    field: "carbs",
    cellDataType: "number",
    type: "numericColumn",
    filter: true,
    filterParams: {
      filterOptions: ["equals", "lessThan", "greaterThan"], // Customize the filter options
    },
  },
  {
    headerName: "Protein (g)",
    field: "protein",
    cellDataType: "number",
    type: "numericColumn",
    filter: true,
    filterParams: {
      filterOptions: ["equals", "lessThan", "greaterThan"],
    },
  },
  {
    headerName: "Sodium (mg)",
    field: "sodium",
    cellDataType: "text",
  },
  {
    headerName: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: "asc",
    cellDataType: "text",
  },
  {
    headerName: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: "asc",
    cellDataType: "text",
  },
];

const rows = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
];

export default {
  data() {
    return {
      rows: rows,
      columns: columns,
      selection: "single",
    };
  },
};
</script>
