<template>
    <q-btn
        v-bind="$attrs"
        unelevated
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-btn>
</template>
<script>
    export default {
        name: "BsButton",
    }
</script>