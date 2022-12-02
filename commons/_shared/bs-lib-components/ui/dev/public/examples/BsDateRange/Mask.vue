<template>
    <div class="q-pa-lg" :style="{ 'max-width' : '250px'}">
        <BsDateRange v-model="model" mask="DD-MM-YYYY" bsLabel="Date"></BsDateRange>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: { from: '10-05-2020', to: '17-05-2020' }
            };
        },
    }
</script>