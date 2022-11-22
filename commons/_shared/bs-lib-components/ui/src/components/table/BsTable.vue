<template>
    <QTable
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QTable>
</template>
<script>
    import { QTable } from 'quasar';
    export default {
        name: "BsTable",
        components: {
            QTable  
        }
    }
</script>