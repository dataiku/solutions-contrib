<template>
<BsSelectSearch
    :model-value="searchedCol"
    @update:model-value="updateSearchedCol"
    :options="colNames"
    label="Searched column"
    clearable
    :input-debounce="colSearchDebounce"
></BsSelectSearch>
<QInput
    :model-value="_searchedValue"
    @update:model-value="updateSearchedValueDebounce"
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
        searchedCol: {
            type: [String, Number] as PropType<string | number | null>,
            default: null,
        },
        searchedValue: {
            type: [String, Number] as PropType<string | number | null>,
            default: null,
        },
        valueSearchDebounce: {
            type: [Number, String],
            default: 500
        },
        colSearchDebounce: {
            type: [Number, String],
            default: 0
        }
    },
    components: {
        QInput,
        BsSelectSearch
    },
    emits: ["update:searched-col", "update:searched-value", "update:loading"],
    data() {
        return {
            inputDebouncing: false,
            _searchedValue: null as string | number | null,
        };
    },
    computed: {
        colNames(): string[] | undefined {
            if (!this.columns || !this.columns.length) return;
            if (typeof this.columns[0] == "string") {
                return this.columns as string[];
            }
            return (this.columns as QTableColumn[]).map(col => col.name);
        },
    },
    watch: {
        searchedValue() {
            this.syncSearchedValue();
        }
    },
    methods: {
        setLoading(loading: boolean) {
            this.inputDebouncing = loading;
            this.$emit('update:loading', loading);
        },
        updateSearchedValue(val: string | number | null) {
            this.$emit("update:searched-value", val);
        },
        updateSearchedValueDebounce(val: string | number | null) {
            this._searchedValue = val;
            this.setLoading(true);
            timeoutExecuteOnce(
                () => {
                    this.updateSearchedValue(val);
                    this.setLoading(false);
                },
                +this.valueSearchDebounce,
                "bs-search-table-search-text"
            );
        },
        updateSearchedCol(col: string | number | null) {
            this.updateSearchedValue(null);
            this.$emit("update:searched-col", col);
        },
        syncSearchedValue() {
            this._searchedValue = this.searchedValue;
        }
    },
    mounted() {
        this.syncSearchedValue();
    }
});
</script>