<template>
    <BsInputDebounce
            width="150"
            label="Column Search"
            clearable
            borderless
            dense
            v-bind="$attrs"
    >
        <template #append>
            <q-icon :name="icon"></q-icon>
        </template>
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope || {}" />
        </template>
    </BsInputDebounce>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BsInputDebounce from "./BsInputDebounce.vue"

export default defineComponent({
    name: "BsSearchTableCol",
    components: { BsInputDebounce },
    props: {
        icon: String,
    }
});
</script>

<style lang="scss" scoped>
</style>