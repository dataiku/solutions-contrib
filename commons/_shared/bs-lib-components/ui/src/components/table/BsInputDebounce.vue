<template>
<QInput
    :model-value="value"
    @update:model-value="updateValueDebounce"
    :loading="inputDebouncing"
    v-bind="$attrs"
>
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
    </template>
</QInput>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QInput } from 'quasar';
import { timeoutExecuteOnce } from '../../utils/utils';

export default defineComponent({
    name: "BsInputDebounce",
    props: {
        modelValue: {
            type: [String, Number] as PropType<string | number | null>,
            default: null,
        },
        valueSearchDebounce: {
            type: [Number, String],
            default: 500
        }
    },
    components: { QInput },
    emits: ["update:model-value", "update:loading"],
    data() {
        return {
            inputDebouncing: false,
            value: null as string | number | null,
        };
    },
    watch: {
        modelValue() {
            this.syncModelValue();
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
        updateValueDebounce(val: string | number | null) {
            this.value = val;
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
        syncModelValue() {
            this.value = this.modelValue;
        }
    },
    mounted() {
        this.syncModelValue();
    }
});
</script>