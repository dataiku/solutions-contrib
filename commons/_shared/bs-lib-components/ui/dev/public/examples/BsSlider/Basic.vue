<template>
    <div class="q-pa-sm">
        <BsSlider v-model="standard" :min="0" :max="50" :style="{ 'max-width' : '200px'}"/>
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