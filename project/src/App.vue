<template>
  <BsLayoutDefault>
    <BsTab
      name="static table"
    >
    <BsTabIcon>
      1
    </BsTabIcon>
    <BsContent>
      <StaticTableTest></StaticTableTest>
    </BsContent>
    </BsTab>
    <BsTab
      name="DSS table"
    >
    <BsTabIcon>
      2
    </BsTabIcon>
    <BsContent>
      <DSSTableTest
        :dssTableName="dssTableName"
        :batchSize="batchSize"
        :batchOffset="batchOffset"
        :recordsAmount="recordsAmount"
      ></DSSTableTest>
    </BsContent>
    </BsTab>
    <BsTab
      name="Simulated fetching table"
    >
    <BsTabIcon>
      3
    </BsTabIcon>
    <BsContent>
      <SimulatedFetchingTableTest></SimulatedFetchingTableTest>
    </BsContent>
    </BsTab>
  </BsLayoutDefault>
</template>

<script>
import docLogo from "./assets/images/doc-logo-example.svg";
import StaticTableTest from "./components/StaticTableTest.vue";
import DSSTableTest from "./components/DSSTableTest.vue";
import SimulatedFetchingTableTest from "./components/SimulatedFetchingTableTest.vue";
import TableConfigurationControls from "./TableConfigurationControls.vue";
export default {
  data() {
    return {
      docLogo,
    };
  },
  components: {
    StaticTableTest,
    DSSTableTest,
    SimulatedFetchingTableTest,
    TableConfigurationControls
},
};
</script>

<style lang="scss">

.bs-tab-title {
  transform: translateX(100%);
}
</style>