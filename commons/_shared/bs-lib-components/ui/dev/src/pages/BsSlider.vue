<template>
    <q-page padding>
        <div class="q-gutter-sm" style="max-width: 300px">
            <BsSlider v-model="standard" :min="0" :max="50" />
        </div>
    </q-page>
</template>
<script>
    import { BsSlider } from 'ui';

    export default {
        data() {
            return {
                standard: 2,
            }
        },
        components: {
            BsSlider,
        }
    }
</script>