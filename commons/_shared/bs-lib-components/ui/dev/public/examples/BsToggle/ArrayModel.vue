<template>
    <div class="q-gutter-sm q-pa-sm row">
        <BsToggle v-model="valueArray" val="default" />
        <BsToggle v-model="valueArray" val="red" color="red"/>
        <BsToggle v-model="valueArray" val="green" color="green"/>
        <BsToggle v-model="valueArray" val="black" color="black"/>
        <BsToggle v-model="valueArray" val="blue" color="blue"/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                valueArray: []
            }
        }
    }
</script>