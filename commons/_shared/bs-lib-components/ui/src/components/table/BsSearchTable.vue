<template>
<BsSelectSearch
    v-model="searchedCol"
    :options="colNames"
    label="Searched column"
></BsSelectSearch>
<QInput
    v-model="searchText"
></QInput>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QInput, QTableColumn } from 'quasar';
import BsSelectSearch from "./BsSelectSearch.vue"
export default defineComponent({
    name: "BsSearchTable",
    props: {
        columns: Array as PropType<QTableColumn[] | string[]>,
        rows: Array as PropType<Record<string, any>[]>,
        modelValue: Array as PropType<Record<string, any>[]>,
    },
    components: {
        QInput,
        BsSelectSearch
    },
    emits: ["update:model-value"],
    data() {
        return {
            searchedCol: undefined as string | undefined,
            searchText: null as string | null,
        };
    },
    computed: {
        colNames(): string[] | undefined{
            if (!this.columns || !this.columns.length) return;
            if (typeof this.columns[0] == "string") {
                return this.columns as string[];
            }
            return (this.columns as QTableColumn[]).map(col => col.name);
        },
    },
    methods: {
        filterRows(searchText?: string | null) {
            if (searchText === undefined) searchText = this.searchText;
            if ((typeof searchText !== "string") || (typeof this.searchedCol !== "string")) {
                return this.rows;
            }
            const searchTextFormatted = searchText.toLowerCase();
            return this.rows?.filter(row => {
                return `${row[this.searchedCol!]}`.toLowerCase().includes(searchTextFormatted);
            });
        },
        updateRows(searchText?: string | null) {
            const rows = this.filterRows(searchText);
            this.$emit("update:model-value", rows);
            return rows;
        }
    },
    watch: {
        searchText() {
            console.log({searchText: this.searchText});
            this.updateRows();
        },
        rows() {
            this.updateRows();
        },
        columns() {
            this.updateRows();
        },
    }
});
</script>