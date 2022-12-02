<template>
    <div class="q-pa-md">
        <BsCheckbox v-model="model" label="Text"></BsCheckbox>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: true,
            }
        }
    }
</script>