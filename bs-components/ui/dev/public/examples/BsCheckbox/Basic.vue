<template>
    <div class="q-pa-md">
        <BsCheckbox v-model="model"></BsCheckbox>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: false,
            }
        }
    }
</script>