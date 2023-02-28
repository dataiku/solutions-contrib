<template>
    <q-tr :props="props">
        <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            >
                <BsTableColHeader
                    :sort="props.sort"
                    :col="col"
                    @search-col="$emit('search-col', $event)"
                ></BsTableColHeader>
        </q-th>
    </q-tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QTr } from 'quasar';
import BsTableColHeader from "./BsTableColHeader.vue";
import { QTableHeaderProps } from "./tableTypes";

export default defineComponent({
    name: "BSTableHeader",
    components: {
        QTr, BsTableColHeader
    },
    props: {
        props: {
            type: Object as PropType<QTableHeaderProps>,
            required: true,
        },
    },
    emits: ["search-col"],
});
</script>

<style scoped lang="scss">
::v-deep th {
    .bs-table-col-header-container .bs-table-col-header-actions {
        flex: 0 0 none;
        display: flex;
        gap: .2rem;
        transition: box-shadow 0.3s;

        box-shadow: rgba(99, 99, 99, 0.2) 0px 0px 0px 0px;

        > * {
            transition: rotate 0.3s, opacity 0.5s, scale 0.3s, color 0.3s;
            opacity: 0;
            scale: 0;

            &:hover {
                opacity: .8;
                scale: 1.1;
            }
        }
    }
    &:hover .bs-table-col-header-actions {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        > * {
            opacity: 0.5;
            scale: 1;
        }
    }
    
    &.sorted .sort-icon, .bs-table-col-header-action-interacting, .bs-table-col-header-action-active {
        opacity: 1 !important;
        scale: 1 !important;
    }

    &.sorted .sort-icon, .bs-table-col-header-action-active {
        color: var(--q-primary);
    }
    
    &.sort-desc .sort-icon {
        rotate: 180deg;
    }
}
</style>