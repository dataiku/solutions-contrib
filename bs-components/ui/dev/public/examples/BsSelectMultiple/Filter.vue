<template>
    <div class="q-pa-sm" :style="{ 'max-width' : '300px'}">
        <BsSelect 
            v-model="model" 
            :options="options" 
            clearable 
            multiple 
            use-chips 
            bsLabel="Company"
            clear-icon="clear" 
            @filter="filterFn"
            use-input
            input-debounce="0"
            
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
                options: ['Dataiku','Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
                allOptions: ['Dataiku','Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
            }
        },
        methods: {
            filterFn: function(val, update, abort) {
                update(() => {
                const needle = val.toLowerCase()
                this.options = this.allOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
                })
            }
        }
    }
</script>