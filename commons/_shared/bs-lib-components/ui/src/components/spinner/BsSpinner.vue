<template>
    <q-spinner
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-spinner>
</template>
<script>
    export default {
        name: "BsSpinner",
    }
</script>