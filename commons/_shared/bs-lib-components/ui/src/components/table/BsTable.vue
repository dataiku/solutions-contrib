<template>
    <q-table
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-table>
</template>
<script>
    export default {
        name: "BsTable",
    }
</script>