<template>
    <div class="q-pa-md q-gutter-lg" style="max-width: 400px">
        <p>Default</p>
        <BsSelect v-model="model" :options="options" outlined clearable multiple use-chips clear-icon="clear">
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
        <p>With filters</p>
        <BsSelect 
            v-model="model" 
            :options="options" 
            outlined 
            clearable 
            multiple 
            use-chips 
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
        <p>With filters & Hint</p>
        <BsSelect 
            v-model="model" 
            :options="options" 
            outlined 
            clearable 
            multiple 
            use-chips 
            clear-icon="clear" 
            @filter="filterFn"
            use-input
            input-debounce="0"
            hint="Help message if needed"
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
        <p>With filters & Hint & Label</p>
        <BsSelect 
            v-model="model" 
            :options="options" 
            outlined 
            clearable 
            multiple 
            use-chips 
            clear-icon="clear" 
            @filter="filterFn"
            use-input
            input-debounce="0"
            hint="Help message if needed"
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
import { BsSelect } from 'ui';
import { ref } from 'vue';

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default {
    setup() {
        const options = ref(stringOptions);
        return {
            model: ref([]),
            options,
            filterFn (val, update, abort) {
                update(() => {
                const needle = val.toLowerCase()
                options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
                })
            }
        };
    },
    components: { BsSelect }
}
</script>
