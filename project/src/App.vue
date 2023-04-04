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
      <DSSTableTest></DSSTableTest>
    </BsContent>
    </BsTab>
  </BsLayoutDefault>
</template>

<script>
import docLogo from "./assets/images/doc-logo-example.svg";
import StaticTableTest from "./components/StaticTableTest.vue";
import DSSTableTest from "./components/DSSTableTest.vue";
export default {
  data() {
    return {
      docLogo,
    };
  },
  components: {
    StaticTableTest,
    DSSTableTest,
  },
};
</script>

<style lang="scss">

.bs-tab-title {
  transform: translateX(100px);
}
</style>