<template>
<QDrawer
    :mini="collapsed"
    :mini-width="collapsedWidth"
    :width="expandedWidth"
    side="left"
    behavior="desktop"
    :model-value="true"
    bordered
>
</QDrawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QDrawer } from "quasar";

export default defineComponent({
    name: "BsLayoutDrawer",
    components: {
        QDrawer,
    },
    props: {
        collapsedWidth: {
            type: Number,
            default: 50
        },
        panelWidth: {
            type: Number,
            default: 300,
        },
        expand: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        collapsed() {
            return !this.expand;
        },
        expandedWidth() {
            return this.collapsedWidth + this.panelWidth;
        },
    },
});
</script>