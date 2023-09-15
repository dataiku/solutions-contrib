<template>
    <div class="q-gutter-sm q-pa-sm">
        <BsButton class="bs-btn dku-text" unelevated @click="onClick">Click Me</BsButton>
    </div>
</template>
<script>
    import { Notify } from 'quasar';
    export default {
        methods: {
            onClick: function() {
                Notify.create({
                    message: "Button Clicked"
                })
            }
        }
    }
</script>