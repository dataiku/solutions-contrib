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

export default defineComponent({
    name: "BsTableVirtualScrollIndicator",
    components: {
        QLinearProgress
    },
    props: {
        qTableMiddle: Object as PropType<HTMLElement>
    },
    data() {
        return {
            progress: 0,
            showProgressBar: false,
        }
    },
    computed: {},
    methods: {
        addScrollEventListener() {
            if (!this.qTableMiddle) return;
            this.qTableMiddle.addEventListener("scroll", (e) => {
                this.onScroll();
            });
        },
        onScroll() {
            timeoutExecuteOnce(() => {
                if (!this.qTableMiddle) return;
                const scrollTop = this.qTableMiddle.scrollTop;
                const scrollHeight = this.qTableMiddle.scrollHeight - this.qTableMiddle.clientHeight;
                this.showProgressBar = scrollHeight > 0;
                this.progress = this.showProgressBar ? scrollTop / scrollHeight : 1;
            }, 250, "bs-table-scroll-update-indicator");
        },
    },
    mounted() {
        this.addScrollEventListener();
        this.onScroll();
    },
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