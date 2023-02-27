<template>
    <div class="bs-table-col-header-container">
        <span class="bs-table-col-header-title">
            {{ col?.label || "" }}
        </span>
        <div class="bs-table-col-header-actions q-py-xs q-px-sm rounded-borders">
            <q-icon  @click="sortColumn" :name="mdiArrowUpThin" size="1rem" class="sort-icon">
            </q-icon>
            <q-icon @click="searchColumn" :name="mdiMagnify" size="1rem"></q-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QIcon, QTh } from 'quasar';
import {
        mdiArrowUpThin,
        mdiMagnify,
    } from '@quasar/extras/mdi-v6';

export default defineComponent({
    name: "BSTableColHeader",
    components: {
        QIcon, QTh,
    },
    data() {
        return {
            mdiArrowUpThin,
            mdiMagnify,
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
        searchColumn() {

        }
    },
    beforeMount() {
        console.log(this.col);
        console.log(this.sort);
    }
});
</script>

<style scoped lang="scss">

.bs-table-col-header-container {

    display: flex;
    justify-content: space-between;
    gap: 1rem;
    .bs-table-col-header-actions {
        flex: 0 0 none;
        display: flex;
        gap: .2rem;
        transition: box-shadow 0.3s;

        box-shadow: rgba(99, 99, 99, 0.2) 0px 0px 0px 0px;
        
        > * {
            transition: rotate 0.3s, opacity 0.5s, scale 0.3s;
            opacity: 0;
            scale: 0;

            &:hover {
                opacity: .8;
                scale: 1.1;
            }
        }
    }
}


</style>