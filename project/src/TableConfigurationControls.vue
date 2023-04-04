<template>
    <h4>Table Configuration</h4>
    <div class="q-pa-md">
        <q-select
        label="DSS table selected"
        filled
        :model-value="dssTableName"
        @update:model-value="$emit('update:dss-table-name', $event)"
        use-input
        hide-dropdown-icon
        use-chips
        input-debounce="0"
        @new-value="createValue"
        style="width: 250px"
        />
    </div>
    <h5>Server side pagination</h5>
    <div class="q-pa-md" style="max-width: 300px">
        <q-input
            filled
            :model-value="batchOffset"
            @update:model-value="$emit('update:batch-offset', $event)"

            label="batchOffset"
        />
    </div>
    <div class="q-pa-md" style="max-width: 300px">
        <q-input
            filled
            :model-value="batchSize"
            @update:model-value="$emit('update:batch-size', $event)"
            label="batchSize"
        />
    </div>
    <div class="q-pa-md" style="max-width: 300px">
        <q-input
            filled
            :model-value="recordsCount"
            @update:model-value= "$emit('update:records-amount', $event)"
            label="recordsCount"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: [
        "update:dss-table-name",
        "update:batch-offset",
        "update:batch-size",
        'update:records-amount',
    ],
    methods: {
        createValue (val: string, done: Function) {
            done(val);
        }
    },
    props: {
        dssTableName: String,
        batchSize: Number,
        batchOffset: Number,
        recordsCount: Number,
    }
});
</script>
