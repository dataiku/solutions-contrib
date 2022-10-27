<template>
    <q-slider
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </q-slider>
</template>
<script>
    export default {
        name: "BsSlider"
    }
</script>