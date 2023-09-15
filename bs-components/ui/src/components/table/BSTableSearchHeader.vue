<template>
     <q-tr
        :props="props" 
        v-if="!noSearches">
        <q-th auto-width v-if="selectionOn"></q-th>
        <q-th 
            v-for="col in cols" 
            :key="col.name"
            :style="{'text-align': col.align ? col.align : 'left'}">
            <div class="bs-table-search-header">
                <BsSearchTableCol
                    v-if="searchedCols?.hasOwnProperty(col.name)"
                    :icon="searchColIcon"
                    :searchedCols="searchedCols"
                    :col-name="col.name"
                    @update:formatted-value="searchColumn(col.name, $event)"
                    @update:no-debounce:formatted-value="noDebounceValue = $event"
                    @clear-search="searchColumn(col.name, null)"
                ></BsSearchTableCol>
            </div>
        </q-th>
        <q-th v-if="!noSearches"
            :key="'clearAllCol'">
            <span @click="clearAll" 
            class="bs-table-header-clear-all-btn">
                Clear all
            </span>
        </q-th>
    </q-tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTr, QTh } from 'quasar';
import { QTableHeaderProps } from "./tableTypes";
import BsSearchTableCol from './BsSearchTableCol.vue';
import { mdiMagnify } from '@quasar/extras/mdi-v6';
import { isEmpty } from 'lodash';

export default defineComponent({
    name: "BSTableSearchHeader",
    components: {
    QTr,
    QTh,
    BsSearchTableCol
},
    props: {
        props: {
            type: Object as PropType<QTableHeaderProps>,
            required: true,
        },
        searchedCols: Object as PropType<Record<string, string>>,
        searchedCol: String || undefined,
        selectionOn: Boolean
    },
    emits: ['search-col', 'clear-all'],
    data() {
        return {
            noDebounceValue: "" as string | null | number | undefined,
            searchColIcon: mdiMagnify,
        }
    },
    watch: {
        searchedCol(newCol?: string){
            if(newCol) this.activateSearchCol(newCol);
        },
    },
    methods: {
        activateSearchCol(colName: string){
            if(!this.searchedCols?.hasOwnProperty(colName)){
                this.$emit("search-col", colName, '');
            }
        },
        searchColumn(colName: string, searchVal: string | null) {
            this.$emit("search-col", colName, searchVal);
        },
        clearAll(){
            this.$emit('clear-all');
        }
    },
    computed: {
        noSearches(): boolean{
            return isEmpty(this.searchedCols);
        },
        cols(): any[]{
            return this.props.cols.filter((col:any) => col.name !=='clearAllCol');
        },
    }
});
</script>

<style scoped lang="scss">
.bs-table-search-header {
    display: inline-block;
}
.bs-table-header-clear-all-btn {
    font-size: 12px;
    text-decoration-line: underline;
    cursor: pointer;
}
</style>