<template>
    <q-btn :label="label" color="secondary"></q-btn>
</template>
<script>
import { QBtn } from 'quasar'
export default {
    name: 'BsButton',
    props: {
        label: {
            type: String,
            required: true,
        }
    },
    components: {
        QBtn
    }
};
</script>
