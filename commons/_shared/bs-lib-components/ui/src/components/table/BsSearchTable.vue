<template>
<BsSelectSearch
    v-model="searchedCol"
    @update:model-value="searchText = ''"
    :options="colNames"
    label="Searched column"
    :input-debounce="searchDebounce"
></BsSelectSearch>
<QInput
    v-model="searchText"
    clearable
    :loading="inputDebouncing"
></QInput>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QInput, QTableColumn } from 'quasar';
import BsSelectSearch from "./BsSelectSearch.vue"
import { timeoutExecuteOnce } from '../../utils/utils';

export default defineComponent({
    name: "BsSearchTable",
    props: {
        columns: Array as PropType<QTableColumn[] | string[]>,
        rows: Array as PropType<Record<string, any>[]>,
        modelValue: Array as PropType<Record<string, any>[]>,
        inputDebounce: {
            type: [Number, String],
            default: 500
        },
        searchDebounce: {
            type: [Number, String],
            default: 0
        }
    },
    components: {
        QInput,
        BsSelectSearch
    },
    emits: ["update:model-value", "update:loading"],
    data() {
        return {
            searchedCol: undefined as string | undefined,
            searchText: null as string | null,
            inputDebouncing: false,
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
        },
        setLoading(loading: boolean) {
            this.inputDebouncing = loading;
            this.$emit('update:loading', loading);
        }
    },
    watch: {
        searchText() {
            this.setLoading(true);
            timeoutExecuteOnce(
                () => {
                    this.updateRows();
                    this.setLoading(false);
                },
                +this.inputDebounce,
                "bs-search-table-search-text"
            );
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