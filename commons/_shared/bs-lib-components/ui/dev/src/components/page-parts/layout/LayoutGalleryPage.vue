<template>
    <q-page padding class="flex flex-center">
        <CodeSourceDisplay :file="file"></CodeSourceDisplay>
    </q-page>
</template>
<script>
    import { useRoute } from 'vue-router';
    import {computed} from "vue";
    import CodeSourceDisplay from '../../CodeSourceDisplay.vue';
    export default {
        name: 'LayoutGalleryPage',
        components: {
            CodeSourceDisplay
        },
        setup() {
            const $route = useRoute()
            const file = computed(() => {
                const pathParts = $route.path.split("/");
                return pathParts[pathParts.length - 1];
            })

            return {
                file,
            }
        }
    }
</script>