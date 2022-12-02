<template>
    <div class="flex row q-pa-md">
        <div class="col-4">
            <BsCheckbox v-model="model" :label="label"></BsCheckbox>
        </div>
       <div class="col-4">
            <BsCheckbox v-model="model" :label="label" :hint="hint"></BsCheckbox>
       </div>
       <div class="col-4">
            <BsCheckbox v-model="model" :hint="hint"></BsCheckbox>
       </div>
       <div class="col-4">
            <BsCheckbox v-model="model" :label="label" disable></BsCheckbox>
       </div>
       <div class="col-4">
            <BsCheckbox v-model="model"  :label="label" :hint="hint" disable></BsCheckbox>
       </div>
       <div class="col-4">
            <BsCheckbox v-model="model" :hint="hint" disable></BsCheckbox>
       </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: false,
                label: "Text",
                hint: "Text description for the label"
            }
        }
    }
</script>