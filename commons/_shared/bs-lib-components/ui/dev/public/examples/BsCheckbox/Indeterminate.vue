<template>
    <div class="q-pa-md">
        <BsCheckbox v-model="model" toggle-indeterminate></BsCheckbox>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: null,
            }
        }
    }
</script>