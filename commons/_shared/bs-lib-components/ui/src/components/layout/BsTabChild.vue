<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    inject: ['$isTabSelected', '$qLayoutMounted'],
    computed: {
        showComponent() {
            const selected = (this as any as {$isTabSelected: boolean})?.$isTabSelected;
            const noTab = selected === undefined;
            return noTab || selected;
        },
        qLayoutMounted() {
            return (this as any as {$qLayoutMounted: boolean}).$qLayoutMounted;
        },
    },
});
</script>