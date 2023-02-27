<template>
    <div class="bs-search-table-container">
        <QInput
            width="190"
            :model-value="_searchedValue"
            label="Table Search"
            @update:model-value="updateSearchedValueDebounce"
            clearable
            dense
            filled
            :loading="inputDebouncing"
        >
            <template #append>
                <q-icon :name="mdiTableSearch">
                </q-icon>
        </template>
    </QInput>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QInput, QTableColumn } from 'quasar';
import BsSelectSearch from "./BsSelectSearch.vue"
import { timeoutExecuteOnce } from '../../utils/utils';
import { mdiTableSearch } from '@quasar/extras/mdi-v6';

export default defineComponent({
    name: "BsSearchTable",
    props: {
        columns: Array as PropType<QTableColumn[] | string[]>,
        searchedCol: {
            type: [String, Number] as PropType<string | number | null>,
            default: null,
        },
        modelValue: {
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
    emits: ["update:model-value", "update:loading"],
    data() {
        return {
            inputDebouncing: false,
            _searchedValue: null as string | number | null,
            mdiTableSearch,
        };
    },
    watch: {
        modelValue() {
            this.syncSearchedValue();
        }
    },
    methods: {
        setLoading(loading: boolean) {
            this.inputDebouncing = loading;
            this.$emit('update:loading', loading);
        },
        updateSearchedValue(val: string | number | null) {
            this.$emit("update:model-value", val);
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
        syncSearchedValue() {
            this._searchedValue = this.modelValue;
        }
    },
    mounted() {
        this.syncSearchedValue();
    }
});
</script>

<style lang="scss" scoped>
.bs-search-table-container {
    --bs-search-table-container-item-gap: 10px;
    display: flex;
    gap: var(--bs-search-table-container-item-gap);
    width: 327px;

}
.bs-search-table-container > * {
    flex: 0 0 100%;
}
</style>