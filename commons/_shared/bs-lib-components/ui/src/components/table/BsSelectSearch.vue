<template>
<q-select
    input-debounce="0"
    outlined
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    :options="optionsFiltered"
    @filter="search"
    use-input
    behavior="menu"
>
    <template v-slot:no-option>
    <q-item>
        <q-item-section class="text-grey">
            No results
        </q-item-section>
    </q-item>
    </template>
</q-select>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QSelect } from "quasar";

export default defineComponent({
    name: "BsSelectSearch",
    components: {
        QSelect
    },
    data() {
        return {
            optionsFiltered: [] as string[],
        };
    },
    emits: ["update:model-value"],
    props: {
        modelValue: {
            validator:() => true,
        },
        options: {
            type: Array as PropType<string[]>
        },
    },
    methods: {
        search(
            inputValue: string,
            doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
            abortFn: () => void,
        ) {
            doneFn(() => {
                if (!this.options) return;
                const searchEl = inputValue.toLowerCase();
                this.optionsFiltered = this.options.filter(option => option.toLowerCase().includes(searchEl));
            })
        },
    },
});
</script>

<style scoped lang="scss">

</style>