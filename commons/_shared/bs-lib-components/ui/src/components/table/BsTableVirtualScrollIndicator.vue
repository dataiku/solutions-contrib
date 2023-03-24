<template>
    <div class="bs-table-virtual-scroll" v-if="elementsCount">
        <div class="bs-table-virtual-scroll-progress-bar">
            <q-linear-progress :value="progress" rounded size="5px"/>
        </div>
        <div class="bs-table-virtual-scroll-label">
            {{ scrollDetails.to + 1 }} / {{ elementsCount }}
        </div>
    </div>
</template>

<script lang="ts">
import { QLinearProgress } from 'quasar';
import { defineComponent, PropType } from 'vue';

type scrollDetails = {
    from: number;
    to: number;
    index: number;
    direction: "increase" | "decrease";
}

export default defineComponent({
    name: "BsTableVirtualScrollIndicator",
    components: {
        QLinearProgress
    },
    props: {
        scrollDetails: {
            type: Object as PropType<scrollDetails>,
            required: true,
        },
        elementsCount: Number,
    },
    computed: {
        progress(): number {
            return this.elementsCount ? (this.scrollDetails.to + 1) / (this.elementsCount) : 0;
        }
    }
});
</script>

<style scoped lang="scss">
.bs-table-virtual-scroll-progress-bar {
    width: 150px;
}
</style>