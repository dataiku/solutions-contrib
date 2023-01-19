<template>
    <q-tab 
        :name="name"
        :icon="icon"
    >
        <q-tooltip 
            :offset="[9, 10]"
            anchor="center right"
            self="center left"
            transition-show="jump-right"
            transition-hide="jump-left"
        >
            <span class="tab-name-tooltip">
                {{ name }}
            </span>
        </q-tooltip>
    </q-tab>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "BsMenuTab",
    props: {
        name: {
            type: String,
            default: "tab-name-not-set"
        },
        icon: {
            type: String,
            default: "help"
        },
    }
});
</script>