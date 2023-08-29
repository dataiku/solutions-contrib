<template>
    <q-page padding class="column">
        <section class="column q-mb-xl">
            <span class="text-primary dku-huge-title-sb q-mb-sm">{{ title }}</span>
            <span class="dku-small-title">
                {{$slots.description ? "" : description}}
                <slot name="description"></slot>
            </span>
        </section>
        
        <section class="column q-mb-xl" v-if="quasarUrl">
            <span class="text-primary dku-huge-title-sb q-mb-sm">{{ sectionTitle }}</span>
            <span class="dku-small-title quasar-ref-card q-pa-md">The {{ title }} is a components that wraps the quasar {{ title.replace("Bs","Q")}} component.
                <slot name="quasar-ref" v-if="$slots.hasOwnProperty('quasar-ref')" :quasar-url="quasarUrl"></slot>
                <span v-else>
                    It can inherit all the props, slots and events available for the corresponding quasar component. Please refer to this <a :href="quasarUrl" target="_blank">page</a>
                    for more details
                </span>
            </span>
        </section>

        <section class="column q-mb-xl" v-else>
            <span class="text-primary dku-huge-title-sb q-mb-sm">{{ sectionTitle }}</span>
            <span class="dku-small-title bs-native-card q-pa-md">
                The {{ title }} is a native business solutions component. It does not wrap a specific quasar component, the examples below give more details
                on how to use it
            </span>
        </section>

        <section>
            <span class="text-primary dku-huge-title-sb q-mb-sm">Usage</span>
            <slot></slot>
        </section>
    </q-page>
</template>
<script>
    

    export default {
        name: "DocPageCore",

        props: {
            title: String,
            description: String,
            quasarUrl: String,
            sectionTitle: {
                type: String,
                default: 'Quasar reference'
            }
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