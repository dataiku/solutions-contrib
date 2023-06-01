<template>
    <q-tr :props="props">
        <q-th
            v-for="col in cols"
            :key="col.name"
            :props="props"
            >
                <BsTableColHeader
                    :sort="sort"
                    :col="col"
                    :sorted-col="sortedCol"
                    @search-col="activateSearchCol"
                ></BsTableColHeader>
        </q-th>
        <q-th auto-width :key="'clearAllCol'"></q-th>
    </q-tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTr, QTh } from 'quasar';
import BsTableColHeader from "./BsTableColHeader.vue";
import { QTableHeaderProps } from "./tableTypes";

export default defineComponent({
    name: "BSTableHeader",
    components: {
    QTr,
    QTh,
    BsTableColHeader,
},
    props: {
        props: {
            type: Object as PropType<QTableHeaderProps>,
            required: true,
        },
    },
    data() {
        return {
            sortedCol: '',
        }
    },
    emits: ["search-col"],
    methods: {
        activateSearchCol(colName: string){
            this.$emit('search-col', colName);
        },
        sort(col: any) {
            this.sortedCol = col.name;
            this.props.sort(col);
        }
    },
    computed: {
        cols(): any[]{
            return this.props.cols.filter((col:any) => col.name !=='clearAllCol');
        }
    }
});
</script>

<style scoped lang="scss">
::v-deep th {
    .bs-table-col-header-container .bs-table-col-header-actions {
        flex: 0 0 none;
        display: flex;
        gap: .2rem;

        box-shadow: rgba(99, 99, 99, 0.2) 0px 0px 0px 0px;

        > * {
            cursor: pointer;
            transition: rotate 0.3s, opacity 0.5s, scale 0.3s, color 0.3s;
        }
    }
}
</style>