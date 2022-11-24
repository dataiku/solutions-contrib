<template>
    <div class="q-gutter-sm q-pa-sm row">
        <BsToggle v-model="value" size="xs" />
        <BsToggle v-model="value" size="sm" />
        <BsToggle v-model="value" size="md" />
        <BsToggle v-model="value" size="lg" />
        <BsToggle v-model="value" size="xl" />
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