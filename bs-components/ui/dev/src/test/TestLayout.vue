<template>
    <BsLayoutDefault>
        <BsTab
            icon="movie"
            name="first tab"
            docTitle="First Tab"
        >
            <BsHeader>
                <div>Header first tab</div>
            </BsHeader>
            <BsContent>
                <h1>CheckList</h1>
                <h1>Status:</h1>
            </BsContent>
        </BsTab>
        <!-- <BsTab
            icon="movie"
            name="second tab"
            docTitle="First Tab"
        >
            <BsHeader>
                <div>Header SECOND tab</div>
            </BsHeader>
            <BsContent>
                <h1>AGGAG</h1>
                <h1>GAGA:</h1>
            </BsContent>
        </BsTab> -->
    </BsLayoutDefault>
</template>

<script lang="ts">
import BsLayoutDefault from 'app/../src/components/layout/BsLayoutDefault.vue';
import BsTab from 'app/../src/components/layout/BsTab.vue';
import BsHeader from 'app/../src/components/layout/base-subcomponents/BsHeader.vue';
import BsContent from 'app/../src/components/layout/base-subcomponents/BsContent.vue';

import { defineComponent } from 'vue';

export default defineComponent({
    name: "default",
    components: {
    BsLayoutDefault,
    BsTab,
    BsHeader,
    BsContent,
},
    data() {
        return {};
    },
    props: {

    },
    methods: {

    },
});
</script>

<style scoped lang="scss">

</style>