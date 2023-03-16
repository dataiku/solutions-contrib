<template>
    <q-tab 
        :name="tabIndex"
        :icon="icon"
        :ripple="false"
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
        <span v-if="tabId" :id="getBsMenuTabId(tabId)">
        </span> 
    </q-tab>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getBsMenuTabId } from './bsLayoutHelper'
export default defineComponent({
    name: "BsMenuTab",
    props: {
        name: {
            type: String,
        },
        icon: {
            type: String,
        },
        tabIndex: {
            type: Number,
        },
        tabId: {
            type: String,
        }
    },
    methods: {
        getBsMenuTabId(tabId?: string) {
            tabId = tabId || `${this.tabIndex}` || "";
            return getBsMenuTabId(tabId);
        },
    }
});
</script>
<style lang="scss" scoped>
.tab-name-tooltip {
    font-size: .8rem;
}
</style>