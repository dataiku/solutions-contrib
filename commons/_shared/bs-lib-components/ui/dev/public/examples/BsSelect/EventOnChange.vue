<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect 
            :model-value="model" 
            @update:model-value="value => onUpdate(value)" 
            :options="options" 
            bsLabel="Font Size" 
        ></BsSelect>
    </div>
</template>
<script>
    import { Notify } from 'quasar';
    export default {
        data() {
            return {
                model: null,
                options: [
                    "Extra small",
                    "Small",
                    "Medium",
                    "Large",
                    "Extra large",
                    "Custom"
                ],
            }
        },
        methods: {
            onUpdate(value) {
                this.model = value;
                // Call a custom function (it can be a backend call for example)
                Notify.create({
                    message: `New Model: ${value}`
                })
            }
        }
    }
</script>