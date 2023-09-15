<template>
    <div class="q-gutter-sm q-pa-sm row">
        <BsToggle v-model="value" labelRight="On" labelLeft="Off"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                value: false,
            }
        }
    }
</script>