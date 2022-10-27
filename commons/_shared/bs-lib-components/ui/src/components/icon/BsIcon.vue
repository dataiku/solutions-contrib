<template>
    <q-icon
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-icon>
</template>
<script>
    export default {
        name: "BsIcon",
    }
</script>