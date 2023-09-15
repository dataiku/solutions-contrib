<template>
    <DocPageCustom :description="description" :title="title" :references="references">
        <div class="text-primary dku-huge-title-sb q-mb-sm">Source code</div>
        <CodeSourceDisplay file="CreditScoringCard"></CodeSourceDisplay>
        <div class="text-primary dku-huge-title-sb q-mb-sm">Usage</div>
        <DocExample file="CreditScoringCard/Basic" title="Basic"></DocExample>
        <DocExample file="CreditScoringCard/Grid" title="Grid"></DocExample>
    </DocPageCustom>


</template>
<script>
    import DocPageCustom from "../../components/DocPageCustom.vue";
    import CodeSourceDisplay from "../../components/CodeSourceDisplay.vue";
    import DocExample from "../../components/DocExample.vue";

    export default {
        components: {
            DocPageCustom,
            CodeSourceDisplay,
            DocExample
        },
        setup() {
            const description = "The CreditScoringCard is an example of a custom component created for the project Credit Scoring to highlight credit scores per feature \
                    and give a visual representation of the score classification (bad - fair - good)"
            const title = "CreditScoringCard"
            const references = ["Credit scoring"]

            return {
                description,
                title,
                references
            }
        }

    }
</script>
