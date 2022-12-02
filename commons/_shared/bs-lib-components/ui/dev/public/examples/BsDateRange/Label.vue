<template>
    <div class="q-pa-lg" :style="{ 'max-width' : '250px'}">
        <BsDateRange v-model="model" bsLabel="Date"></BsDateRange>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: { from: '2020/07/08', to: '2020/07/17' }
            };
        },
    }
</script>