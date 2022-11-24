<template>
    <q-page padding>
        <div class="q-gutter-sm" style="max-width: 300px">
            <BsRange v-model="standard" :min="0" :max="50" />
        </div>
    </q-page>
</template>
<script>
    import { BsRange } from 'ui';

    export default {
        data() {
            return {
                standard: {
                    min: 10,
                    max: 35,
                },
            }
        },
        components: {
            BsRange,
        }
    }
</script>