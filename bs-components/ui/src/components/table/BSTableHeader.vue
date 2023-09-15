<template>
    <q-tr :props="props">
        <q-th auto-width key="selectAll" v-if="selection === 'multiple'">
            <q-checkbox v-model="isChecked" @update:model-value="toggleCheckbox" :disable="loading"></q-checkbox>
        </q-th>
        <q-th auto-width key="select" v-if="selection === 'single'">
        </q-th>
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
import { QTr, QTh, QCheckbox } from 'quasar';
import BsTableColHeader from "./BsTableColHeader.vue";
import { QTableHeaderProps } from "./tableTypes";

export default defineComponent({
    name: "BSTableHeader",
    components: {
    QTr,
    QTh,
    BsTableColHeader,
    QCheckbox
},
    props: {
        props: {
            type: Object as PropType<QTableHeaderProps>,
            required: true,
        },
        selection: String,
        allSelected: {
            type: Boolean as PropType<boolean | null>,
            default: false,
        },
        loading: Boolean
    },
    data() {
        return {
            sortedCol: '',
            sortedDesc: false,
            isChecked: false as boolean | null
        }
    },
    emits: ["search-col", "select-all"],
    methods: {
        activateSearchCol(colName: string){
            this.$emit('search-col', colName);
        },
        sort(col: any) {
            const prevCol = this.sortedCol;
            this.sortedCol = (prevCol !== col.name) ? col.name : (this.sortedDesc ? '' : col.name);
            this.sortedDesc = (prevCol !== col.name) ? false : !this.sortedDesc;
            this.props.sort(col);
        },
        toggleCheckbox() {
            this.$emit('select-all', this.isChecked);
        }
    },
    computed: {
        cols(): any[]{
            return this.props.cols.filter((col:any) => col.name !=='clearAllCol');
        }
    },
    watch: {
        allSelected(newVal: boolean | null){
            this.isChecked = newVal;
        },
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