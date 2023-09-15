<template>
    <div class="bs-warning q-pa-md">
        {{ text }}
    </div>
</template>
<script>
    export default {
        name: "Warning",
        props: {
            text: String
        }
    }
</script>
<style scoped>
.bs-warning {
    border-top: 1px solid #E9412B;
    border-bottom: 1px solid#E9412B;
    border-left: 6px solid #E9412B;
    border-right: 6px solid #E9412B;
    background-color: rgba(233, 65, 43, 0.1);
    border-radius: 4px;
}
</style>