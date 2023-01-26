<template>
<QLayout view="lHh LpR lFf" class="bg-white">
    <!-- 
        =========================
        -----LAYOUT-ELEMENTS-----
        =========================
        
        Slots from the <BSTab> component will move here
    -->
    <BsLayoutDrawer
        @vnode-mounted="drawerMounted = true"
        :expandable="selectedTab?.drawer"
        :expand="selectedTab?.drawerExpanded"
    ></BsLayoutDrawer>
    <BsLayoutHeader
        @vnode-mounted="headerMounted = true"
    ></BsLayoutHeader>
    <!-- 
        ===================
        -----MENU-TABS-----
        ===================
        
        Sidebar menu with tabs selection
    -->
    <BsMenuTabs
        v-if="isTabsMultiple"
        v-model="tabIndex"
    >
        <BsMenuTab 
            v-for="({name, icon}, index) in tabsProps"
            :name="name"
            :icon="icon"
            :tab-index="index"
        ></BsMenuTab>
    </BsMenuTabs>
    <!-- 
        ===================
        ----DEFAULT-TAB----
        ===================

        If a user decides not to use a tab, the content will move here
    -->
    <BsTab 
        v-bind="tabProps"
        v-if="noTabsUsed"
    >
        <template v-if="$slots.header" #header><slot name="header"></slot></template>
        <template v-if="$slots.leftpanel" #leftpanel><slot name="leftpanel"></slot></template>
        <template v-if="$slots.documentation" #documentation><slot name="documentation"></slot></template>
        <template v-if="$slots.content" #content><slot name="content"></slot></template>
    </BsTab>
    <slot></slot>
</QLayout>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { QLayout, QBtn } from 'quasar';

import { InternalInstanceType, Tab } from './bsLayoutTypes'
type BsTabInternalInstance = InternalInstanceType<InstanceType<typeof BsTab>>;

import BsMenuTabs from './BsMenuTabs.vue';
import BsMenuTab from './BsMenuTab.vue';
import BsLayoutDrawer from './BsLayoutDrawer.vue';
import BsLayoutHeader from './BsLayoutHeader.vue';
import BsTab from './BsTab.vue';

import CheckSlotComponentsExtension from './CheckSlotComponentsExtension.vue';


    
export default defineComponent({
    name:"BsLayoutDefault",
    extends: CheckSlotComponentsExtension,
    components: {
        BsTab,
        BsMenuTab,
        BsMenuTabs,
        BsLayoutDrawer,
        BsLayoutHeader,
        QLayout,
        QBtn,
    },
    data() {
        return {
            tabIndex: 0,
            tabs: [] as Tab[],

            headerMounted: false,
            drawerMounted: false,
        }  
    },
    provide() {
        return {
            $tabs: this.tabs,
            $selectedTab: computed(() => this.selectedTab),
            $headerMounted: computed(() => this.headerMounted),
            $drawerMounted: computed(() => this.drawerMounted),
        }; 
    },
    methods: {
        getTabIndex(selectedTabId: string) {
            return this.tabs.findIndex(({tabId}) => selectedTabId === tabId);
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
            const tabComponentName = BsTab.name;
            return this.getSlotComponents(tabComponentName) as any;
        },
        tabsProps() {
            return this.tabComponents.map(({ props }) => {
                const {name, icon} = {...props};
                return {name, icon};
            });
        },
        isTabsMultiple(): boolean {
            return this.tabComponents.length > 1;
        },
        noTabsUsed(): boolean {
            return !this.tabComponents.length;
        },
        tabProps(): Record<string, any> {
            const {docTitle, docIcon, docImageDimensions} = this;
            return {docTitle, docIcon, docImageDimensions};
        },
    },
    props: {
        docTitle: {
            type: String,
        },
        docIcon: {
            type: String,
        },
        docImageDimensions: {
            type: Object,
            default: () => ({
                width: 36,
                height: 40,
            })
        }
    },
});
</script>