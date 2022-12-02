<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect 
        v-model="model" 
        :options="options"  
        clearable 
        multiple 
        use-chips 
        clear-icon="clear"
        bsLabel="Company"
        >
            <template v-slot:selected-item="scope">
                <q-chip
                    removable
                    square
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    class="q-mr-xs bs-chip__select"
                    icon-remove="clear"
                    text-color="white"
                >
            
                    {{ scope.opt }}
                </q-chip>
            </template>
        </BsSelect>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: [],
                options: ['Dataiku','Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
            }
        }
    }
</script>