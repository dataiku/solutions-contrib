<template>
    <div>
        <label class="bs-select__label dss-caption-400 q-mb-xs" :for="bsLabelId" v-if="bsLabel">{{ bsLabel }}</label>
        <q-select
            v-bind="$attrs"
            dropdown-icon="r_expand_more"
            class="bs-select"
            popup-content-class="bs-select__popup dds-text-400"
        >
            <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope || {}" />
            </template>
        </q-select>
    </div>
</template>
<script>

    export default {
    name: "BsSelect",
    props: {
        bsLabel: {
            type: String,
        },
        bsLabelId: {
            type: String,
        },
    },
    
}
</script>