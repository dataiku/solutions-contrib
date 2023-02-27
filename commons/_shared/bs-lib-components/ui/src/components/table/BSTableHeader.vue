<template>
    <q-tr :props="props">
        <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            >
                <BsTableColHeader :sort="props.sort" :col="col"></BsTableColHeader>
        </q-th>
    </q-tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTr } from 'quasar';
import BsTableColHeader from "./BsTableColHeader.vue";
import { QTableHeaderProps } from "./tableTypes";

export default defineComponent({
    name: "BSTableHeader",
    components: {
        QTr, BsTableColHeader
    },
    props: {
        props: {
            type: Object as PropType<QTableHeaderProps>,
            required: true,
        },
    },
});
</script>

<style scoped lang="scss">
::v-deep th {
    &:hover .bs-table-col-header-actions {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        > * {
            opacity: 0.5;
            scale: 1;
        }
    }
    
    &.sorted .sort-icon {
        opacity: 1 !important;
        scale: 1 !important;
    }

    &.sort-desc .sort-icon {
        rotate: 180deg;
    }
}
</style>