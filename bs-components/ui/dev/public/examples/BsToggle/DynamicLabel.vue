<template>
    <div class="q-gutter-sm q-pa-sm row">
        <BsToggle v-model="valueDynamic" trueValue="On" falseValue="Off" :labelLeft="valueDynamic"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                valueDynamic: "Off",
            }
        }
    }
</script>