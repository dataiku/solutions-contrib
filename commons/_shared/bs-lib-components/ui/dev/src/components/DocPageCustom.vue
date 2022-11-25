<template>
    <q-page padding class="column">
        <section class="column q-mb-xl">
            <span class="text-primary dku-huge-title-sb q-mb-sm">{{ title }}</span>
            <span class="dku-small-title">{{ description }}</span>
        </section>
        
        
        <section class="column q-mb-xl">
            <span class="text-primary dku-huge-title-sb q-mb-sm">Projects using {{ title }}</span>
            <span class="dku-small-title bs-native-card q-pa-md">
                {{ title }} is an illustration of how to use quasar and business solutions core components to create more complex components.
                <br/>
                <br/>
                {{ title }} is currently used in the following projects: 
                <br/>
                <ul>
                    <li v-for="project in references">
                        {{ project }}
                    </li>
                </ul>
            </span>
        </section>
        <section>
            <slot></slot>
        </section>
    </q-page>
</template>
<script>
    

    export default {
        name: "DocPageCustom",

        props: {
            title: String,
            description: String,
            references: Array,
        }
    }
</script>
<style>
.quasar-ref-card {
    border-top: 1px solid #E99D2B;
    border-bottom: 1px solid#E99D2B;
    border-left: 6px solid #E99D2B;
    border-right: 6px solid #E99D2B;
    background-color: rgba(233, 157, 43, 0.1);
    border-radius: 4px;
}

.bs-native-card {
    border-top: 1px solid #61B658;
    border-bottom: 1px solid #61B658;
    border-left: 6px solid #61B658;
    border-right: 6px solid #61B658;
    border-radius: 4px;
    background-color: rgba(97, 182, 88, 0.1);

}
</style>