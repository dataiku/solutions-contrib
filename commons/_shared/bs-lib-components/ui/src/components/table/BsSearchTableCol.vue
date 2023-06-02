<template>
    <div class="bs-search-table-col-search-box">
        <BsInputDebounce
                class="bs-search-table-col-input"
                width="102"
                label="Search"
                clearable
                clear-icon="close"
                borderless
                dense
                format-input
                autofocus
                v-model="value"
                v-bind="$attrs"
        >
            <template #prepend>
                <q-icon :name="icon" size="1rem"></q-icon>
            </template>
            <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope || {}" />
            </template>
        </BsInputDebounce>
        <div>
            <q-icon :name="mdiTrashCanOutline" @click="clearField" 
                size="1rem" class="cursor-pointer" />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import BsInputDebounce from "./BsInputDebounce.vue"
import { mdiTrashCanOutline } from '@quasar/extras/mdi-v6';
import { QIcon } from "quasar";

export default defineComponent({
    name: "BsSearchTableCol",
    components: { BsInputDebounce, QIcon },
    props: {
        icon: String,
        clear: Boolean,
        colName: String,
        searchedCols: Object as PropType<Record<string, string>>
            
    },
    data(){
        return {
            value: null as string | null,
            mdiTrashCanOutline,
        }
    },
    emits: ['clear-search'],
    watch: {
        clear() {
            this.value = null;
        },
        searchedCols(newVal: Record<string, string>){
            if (this.colName && newVal.hasOwnProperty(this.colName)) {
                this.value = newVal[this.colName]!;
            } else {
                this.value = '';
            }
        },
    },
    methods: {
        clearField(){
            this.$emit('clear-search', this.colName);
        }
    }
});
</script>

<style lang="scss" scoped>
.bs-search-table-col-search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
}
.bs-search-table-col-input {
    border: 1px solid #CCCCCC;
    border-radius: 2px;
    padding: 0px 8px;
    height: 26px;
    width: 102px;
    :deep(.q-field--dense){
        height: 100%;
        max-height: 100%;
    }
    :deep(.q-field__label){
        top:3px;
        font-size: 11px;
    }
    :deep(.q-field__control-container),
    :deep(.q-placeholder){
        padding-top: 4px;
    }
    :deep(.q-field__marginal), :deep(.q-field__native){
        font-size: 0.8rem;
    }
    :deep(.q-field__control), 
    :deep(.q-field__prepend),
    :deep(.q-field__marginal){
        height: 100%;
        max-height: 100%;
    }
    :deep(.q-field__append .q-icon){
        top: 1px;
    }
}

</style>