<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    inject: ['$isTabSelected'],
    computed: {
        showComponent() {
            const selected = (this as any as {$isTabSelected: boolean})?.$isTabSelected;
            const noTab = selected === undefined;
            return noTab || selected;
        },
    },
});
</script>