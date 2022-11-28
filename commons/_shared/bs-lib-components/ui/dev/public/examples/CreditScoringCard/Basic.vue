<template>
    <div class="q-pa-sm">
        <CreditScoringCard 
        rating="good" 
        linearPercent="70%" 
        title="Age" 
        subtitle="40-50" 
        score="50" 
        :options="options"

        ></CreditScoringCard>
    </div>
</template>
<script>
    import CreditScoringCard from '../../source-code/CreditScoringCard.vue';
    export default {
        components: {
            CreditScoringCard,
        },
        data() {
            return {
                options: [
                    {label : "0-20, Missing", value : "5"},
                    {label : "20-30", value : "10"},
                    {label : "30-40", value : "15", highlight: true},
                    {label : "40-50", value : "20"},
                    {label : "50+  ", value : "25"}
                ]
            }
        }
    }
</script>