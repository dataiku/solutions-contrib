<template>
{{ col?.label || "" }}
<q-icon  @click="sortColumn" :name="mdiArrowUpThin" size="1rem" class="sort-icon">
</q-icon>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QIcon, QTh } from 'quasar';
import {
        mdiArrowUpThin,
    } from '@quasar/extras/mdi-v6';

export default defineComponent({
    name: "BSTableColHeader",
    components: {
        QIcon, QTh,
    },
    data() {
        return {
            mdiArrowUpThin,
        };
    },
    props: {
        sort: Function as PropType<(col: any) => void>,
        col: Object as PropType<{label: string}>,
    },
    methods: {
        sortColumn() {
            if (!this.sort) return;
            this.sort(this.col);
        },
    },
    beforeMount() {
        console.log(this.col);
        console.log(this.sort);
    }
});
</script>

<style scoped lang="scss">

.sort-icon {
    transition: rotate 0.3s, opacity 0.5s, scale 0.3s;
    opacity: 0;
    scale: 0;
}


</style>