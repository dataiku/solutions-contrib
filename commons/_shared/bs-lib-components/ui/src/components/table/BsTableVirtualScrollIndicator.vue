<template>
    <div class="bs-table-virtual-scroll">
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
        }
    },
    computed: {},
    methods: {
        addScrollEventListener() {
            if (!this.qTableMiddle) return;
            this.qTableMiddle.addEventListener("scroll", (e) => {
                timeoutExecuteOnce(() => {
                    if (!this.qTableMiddle) return;
                    const scrollTop = this.qTableMiddle.scrollTop;
                    const scrollHeight = this.qTableMiddle.scrollHeight - this.qTableMiddle.clientHeight;
                    this.progress = scrollTop / scrollHeight;
                }, 250, "bs-table-scroll-update-indicator");
            });
        },
    },
    mounted() {
        this.addScrollEventListener();
    },
});
</script>

<style scoped lang="scss">
.bs-table-virtual-scroll-progress-bar {
    width: 200px;
}

.bs-table-virtual-scroll {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}
</style>