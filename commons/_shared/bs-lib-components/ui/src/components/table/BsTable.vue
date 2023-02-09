<template>
    <QTable
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTable } from 'quasar';

export default defineComponent({
    name: "BsTable",
    props: {
        tableName: String,
        batchSize: {
            type: Number,
            default: 1000,
        },
        batchOffset: {
            type: Number,
            default: 0,
        },
    },
    components: {
        QTable  
    },
    computed: {
        
    }
});
</script>