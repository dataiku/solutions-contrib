<template>
    <div :class="['bs-table-virtual-scroll', showProgressBar && 'bs-table-virtual-scroll--active']">
        <div class="bs-table-virtual-scroll-progress-bar">
            <q-linear-progress :value="progress" rounded size="5px"/>
        </div>
    </div>
</template>

<script lang="ts">
import { timeoutExecuteOnce } from '../../utils/utils';
import { QLinearProgress } from 'quasar';
import { defineComponent, PropType } from 'vue';
import { ServerSidePagination } from './tableHelper';
export default defineComponent({
    name: "BsTableVirtualScrollIndicator",
    components: {
        QLinearProgress
    },
    props: {
        fetchedRowsLength: Number,
        serverSidePagination: Object as PropType<ServerSidePagination>,
        scrollDetails: Object
    },
    data() {
        return {
            progress: 0,
            showProgressBar: false,
        }
    },
    computed: {},
    methods: {
        updateProgress(){
            timeoutExecuteOnce(() => {
                this.showProgressBar = this.scrollDetails? this.scrollDetails.scrollHeight > 0 : false;
                this.progress = this.showProgressBar  && this.scrollDetails ? this.scrollDetails.scrollTop/this.scrollDetails.scrollHeight : 1;
            }, 250, "bs-table-scroll-update-indicator");
        }
    },
    mounted() {
        this.updateProgress();
    },
    watch: {
        "serverSidePagination.batchOffset"() {
            this.updateProgress();
        },
        "serverSidePagination.batchSize"() {
            this.updateProgress();
        },
        "serverSidePagination.recordsCount"() {
            this.updateProgress();
        },
        scrollDetails(newVal: any){
            this.updateProgress();
        }
    }
});
</script>

<style scoped lang="scss">
.bs-table-virtual-scroll-progress-bar {
    width: 100px;
    .q-linear-progress{
        color: #444444;
    }
}

.bs-table-virtual-scroll {
    opacity: 0;
    transition: opacity .3s;

    &.bs-table-virtual-scroll--active {
        opacity: 1;
    }
}
</style>