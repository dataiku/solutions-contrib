<template>
    <div>
        <label class="bs-select__label dss-caption-400" :for="bsLabelId">{{ bsLabel }}</label>
        <q-select
            v-bind="$attrs"
            v-on="$listeners"
            dropdown-icon="r_expand_more"
            class="bs-select"
        >

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
        }
    },
    
}
</script>