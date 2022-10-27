<template>
    <q-tooltip
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-tooltip>
</template>
<script>
    export default {
        name: "BsTooltip",
    }
</script>