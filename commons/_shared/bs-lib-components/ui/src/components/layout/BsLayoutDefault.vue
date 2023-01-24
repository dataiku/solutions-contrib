<template>
    <QLayout view="lHh LpR lFf" class="bg-white">
        <BsMenuTabs
            v-if="isTabsMultiple"
            v-model="tabIndex"
        >
            <BsMenuTab 
                v-for="({name, icon}, index) in tabsData"
                :key="index"
                :name="name"
                :tab-index="index"
                :icon="icon"
            ></BsMenuTab>
            <QBtn @click="tabIndex = 1"></QBtn>
        </BsMenuTabs>
        <slot></slot>
    </QLayout>
</template>

<script lang="ts">
import { defineComponent, Component, computed } from 'vue';

import { QLayout, QBtn } from 'quasar';
import BsMenuTabs from './BsMenuTabs.vue';
import BsMenuTab from './BsMenuTab.vue';
import BsTab from './BsTab.vue';


type RenameByT<T, U> = {
    [K in keyof U as K extends keyof T
        ? T[K] extends string
            ? T[K]
            : never
    : K]: K extends keyof U ? U[K] : never;
};
type InternalInstanceType<T> = RenameByT<{$props: "props"}, T>
type BsTabInternalInstance = InternalInstanceType<InstanceType<typeof BsTab>>;
    
export default defineComponent({
    name:"BsLayoutDefault",
    data() {
        return {
            openDoc: false,
            tabIndex: 0,
            tabs: [] as string[],
        }  
    },
    components: {
        BsTab,
        BsMenuTab,
        BsMenuTabs,
        QLayout,
        QBtn,
    },
    provide() {
        return {
            $tabs: this.tabs,
            $selectedTab: computed(() => this.selectedTab)
        };
    },
    methods: {
        getTabIndex(selectedTab: string) {
            return this.tabs.indexOf(selectedTab);
        }
    },
    computed: {
        selectedTab() {
            return this.tabs[this.tabIndex];
        },
        defaultSlot() {
            const slotFactory = this.$slots.default;
            return slotFactory ? slotFactory() : [];
        },
        tabComponents(): BsTabInternalInstance[] {
            return this.defaultSlot.filter((child) => {
                const slotType = child.type as Component;
                return slotType?.name && (slotType.name === BsTab.name);
            }) as any;
        },
        tabsData() {
            return this.tabComponents.map(({ props }) => {
                const {name, icon} = {...props};
                return {name, icon};
            });
        },
        isTabsMultiple(): boolean {
            return this.tabComponents.length > 1;
        }
    },
    mounted() {
    },
    watch: {
        selectedTab(newVal: string) {
            console.log(newVal);
        }
    },
    props: {
        header: {
            type: Boolean,
            default: true
        },
        leftpanel: {
            type: Boolean,
            default: true
        },
        docTitle: {
            type: String,
        },
        docIcon: {
            type: String,
        },
        doc: {
            type: Boolean,
            default: true
        },
        docImageDimensions: {
            type: Object,
            default: () => ({
                width: 36,
                height: 40,
            })
        }
    }
});
</script>