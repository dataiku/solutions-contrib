<template>
    <QSlider
        v-bind="$attrs"
    >
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </QSlider>
</template>
<script>
    import { QSlider } from 'quasar';
    export default {
        name: "BsSlider",
        components: {
            QSlider
        }
    }
</script>