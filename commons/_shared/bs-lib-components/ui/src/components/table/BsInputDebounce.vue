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
import { formatSearchVal } from './filterTable';
// import uniqueId from 'lodash/uniqueId';
import { uniqueId } from 'lodash';
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
        },
        formatInput: {
            type: Boolean,
            default: false
        },
        formatInputMethod: {
            type: Function as PropType<(inputValue: string | number | null) => typeof inputValue>,
            default: formatSearchVal
        }
    },
    components: { QInput },
    emits: ["update:model-value", "update:loading", "update:formatted-value", "update:no-debounce:formatted-value"],
    data() {
        return {
            inputDebouncing: false,
            value: null as string | number | null,
            id: uniqueId("bs-input-debounce-")
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
            this.updateFormattedValue(val);
        },
        updateFormattedValue(val: string | number | null) {
            if (this.formatInput) {
                this.$emit("update:formatted-value", this.formatInputMethod(val));
            }
        },
        updateValueDebounce(val: string | number | null) {
            this.updateValueNoDebounce(val);
            this.setLoading(true);
            timeoutExecuteOnce(
                () => {
                    this.updateSearchedValue(val);
                    this.setLoading(false);
                },
                +this.valueSearchDebounce,
                this.id
            );
        },
        updateValueNoDebounce(val: string | number | null) {
            this.value = val;
            this.$emit("update:no-debounce:formatted-value", this.formatInputMethod(val));
        },
        syncModelValue() {
            this.updateValueNoDebounce(this.modelValue);
            this.updateFormattedValue(this.modelValue);
        },
    },
    mounted() {
        this.syncModelValue();
    }
});
</script>