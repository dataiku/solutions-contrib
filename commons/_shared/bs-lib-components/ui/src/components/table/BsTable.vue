<template>
    <component
        :is="tableComponent"
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </component>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';
import { QTable } from 'quasar';
import BsDSSTable from "./BsDSSTable.vue"

export default defineComponent({
    name: "BsTable",
    components: {
        QTable,
        BsDSSTable,
    },
    computed: {
        tableComponent(): Component {
            return this.isDSSTable ? BsDSSTable : QTable
        },
        isDSSTable(): boolean {
            const attrsKeys = Object.keys(this.$attrs);
            return attrsKeys.includes('dssTableName') || attrsKeys.includes('dss-table-name');
        }
    },
});
</script>