<template>
    <div class="q-pa-sm">
        <BsRange v-model="standard" :min="0" :max="50" :style="{ 'max-width' : '200px'}"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                standard: {
                    min: 10,
                    max: 35,
                },
            }
        },
    }
</script>