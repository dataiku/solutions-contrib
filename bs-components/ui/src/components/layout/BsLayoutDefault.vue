<template>
    <QLayout view="lHh LpR lFf" class="bg-white" :style="layoutStyles">
        <!-- 
            =========================
            -----LAYOUT-ELEMENTS-----
            =========================
            
            Slots from the <BSTab> component will move here
            -->
            <BsLayoutDrawer
            v-model="drawerOpen"
            @vnode-mounted="drawerMounted = true"
            :expandable="selectedTabDrawer"
            :collapsed-width="tabMenuWidth"
            :panel-width="leftPanelWidth"
            :mini="!defaultTabUsed"
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
            v-if="mounted && !defaultTabUsed"
            v-model="tabIndex"
            @vnode-mounted="menuTabsMounted = true"
            >
            <BsMenuTab 
            v-for="({name, icon, tabId}, index) in tabs"
            :name="name"
            :tab-id="tabId"
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
        <slot></slot>
    </BsTab>
    <slot v-else></slot>
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
import BsDrawer from './base-subcomponents/BsDrawer.vue'
import BsHeader from './base-subcomponents/BsHeader.vue';
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
                menuTabsMounted: false,
                drawerOpen: true,
                tabSlotNames: [
                'header',
                'head',
                'leftpanel',
                'drawer',
                'documentation',
                'content',
                ],
                defaultLayoutTabName: "Layout Default",
                defaultTabUsed: true,
            }  
        },
        provide() {
            let provideComputed = this.provideComputed([
            "tabs",
            "selectedTab",
            "qLayoutMounted",
            "menuTabsMounted",
            "layoutDocsProps",
            "defaultTabUsed",
            "drawerOpen",
            ]);
            if (this.defaultTabUsed) {
                const provideVirtualTab = this.provideComputed([
                'tabContentId',
                'qPageMounted',
                'defaultDrawer',
                'defaultHeader',
                ]);
                provideComputed = {...provideComputed, ...provideVirtualTab};
            }
            const provide = provideComputed;
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
            selectedTabDrawer() {
                return this.selectedTab?.drawer;
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
            },
            defaultHeader() {
                return !!this.getSlotComponents(BsHeader.name).length;
            },
            layoutStyles() {
                return {
                    '--bs-drawer-width': `${this.leftPanelWidth}px`,
                };
            },
        },
        watch: {
            "tabs.length"(newVal: number) {
                this.defaultTabUsed = (newVal === 0) || ((newVal === 1) && (this.tabs[0].name === this.defaultLayoutTabName));
            },
        },
        mounted() {
            this.mounted = true;
        }
    });
</script>