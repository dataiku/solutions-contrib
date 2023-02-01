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
        :expand="expandCurrentTab"
        :collapsed-width="tabMenuWidth"
        :panel-width="leftPanelWidth"
        :mini="isTabsMultiple"
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
        v-if="mounted && isTabsMultiple"
        v-model="tabIndex"
    >
        <BsMenuTab 
            v-for="({name, icon}, index) in tabs"
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
        v-if="mounted && defaultTabUsed"
        @mounted:q-page="qPageMounted = true"
        :name="defaultLayoutTabName"
    >
        <template v-for="name in activeTabSlots" v-slot:[name]>
            <slot :name="name"></slot>
        </template>
    </BsTab>
    <slot></slot>
</QLayout>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { QLayout } from 'quasar';

import { DocsProps, ImageDimensions, Tab } from './bsLayoutTypes'

import BsMenuTabs from './BsMenuTabs.vue';
import BsMenuTab from './BsMenuTab.vue';
import BsLayoutDrawer from './BsLayoutDrawer.vue';
import BsLayoutHeader from './BsLayoutHeader.vue';
import BsTab from './BsTab.vue';
import BsDrawer from './BsDrawer.vue'
import CheckSlotComponentsMixin from './CheckSlotComponentsMixin.vue';
import ProvideMixin from './ProvideMixin.vue';

import { Slugger } from './Slugger';
const slugger = new Slugger();

export default defineComponent({
    name:"BsLayoutDefault",
    mixins: [ProvideMixin, CheckSlotComponentsMixin],
    components: {
        BsTab,
        BsMenuTab,
        BsMenuTabs,
        BsLayoutDrawer,
        BsLayoutHeader,
        QLayout,
    },
    props: {
        docTitle: {
            type: String,
        },
        docIcon: {
            type: String,
        },
        docImageDimensions: {
            type: Object as PropType<ImageDimensions>,
        },
        tabMenuWidth: {
            type: Number,
            default: 50,
        },
        leftPanelWidth: {
            type: Number,
            default: 300,
        },
    },
    data() {
        return {
            tabIndex: 0,
            tabs: [] as Tab[],
            mounted: false,
            headerMounted: false,
            drawerMounted: false,
            qPageMounted: false,
            tabSlotNames: [
                'header',
                'leftpanel',
                'documentation',
                'content',
            ],
            defaultLayoutTabName: "Layout Default"
        }  
    },
    provide() {
        const provideStatic = this.provideStatic([
            "tabs",
            // menu props
            "leftPanelWidth",
        ]);
        let provideComputed = this.provideComputed([
            "selectedTab",
            "qLayoutMounted",
            "layoutDocsProps",
        ]);
        if (this.defaultTabUsed) {
            const provideVirtualTab = this.provideComputed([
                'tabContentId',
                'qPageMounted',
                'defaultDrawer',
            ]);
            provideComputed = {...provideComputed, ...provideVirtualTab};
        }
        const provide = {...provideComputed, ...provideStatic};
        return provide;
    },
    methods: {
        getTabIndex(selectedTabId: string) {
            return this.tabs.findIndex(({tabId}) => selectedTabId === tabId);
        },
    },
    computed: {
        tabContentId() {
            const sluggedDefaultTabName = slugger.slug(this.defaultLayoutTabName);
            return `tab-content-id-${sluggedDefaultTabName}`;
        },
        activeTabSlots() {
            return Object.keys(this.$slots).filter(slot => this.tabSlotNames.includes(slot));
        },
        selectedTab(): Tab | undefined {
            return this.tabs[this.tabIndex] as any;
        },
        expandCurrentTab() {
            return this.selectedTab?.drawer && this.selectedTab?.drawerExpanded;
        },
        isTabsMultiple(): boolean {
            return this.tabs.length > 1;
        },
        defaultTabUsed(): boolean {
            return this.tabs.length < 2;
        },
        layoutDocsProps(): Partial<DocsProps> {
            const {docTitle, docIcon, docImageDimensions} = this;
            return {docTitle, docIcon, docImageDimensions};
        },
        qLayoutMounted() {
            return this.drawerMounted && this.headerMounted;
        },
        defaultDrawer() {
            return !!this.getSlotComponents(BsDrawer.name).length;
        }
    },
    mounted() {
        this.mounted = true;
    }
});
</script>