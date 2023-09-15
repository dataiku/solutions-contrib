<template>
    <div class="q-pa-sm column q-gutter-md">
        <BsSlider v-model="standard" :min="0" :max="50"/>
        <BsSlider v-model="standard" :min="0" :max="50" :sliderWidth="200"/>
        <BsSlider v-model="standard" :min="0" :max="50" :sliderWidth="300"/>
        <BsSlider v-model="standard" :min="0" :max="50" :sliderWidth="500"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                standard: 2,
            }
        },
    }
</script>