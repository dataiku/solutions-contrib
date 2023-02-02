<template>
    <BsHeader v-if="usingSlotHeader">
        <slot name="header"></slot>
    </BsHeader>
    <BsDrawer v-if="usingSlotLeftPanel">
        <slot name="leftpanel"></slot>
    </BsDrawer>
    <BsDrawerBtn v-if="drawer" v-model="drawerExpanded"></BsDrawerBtn>
    <BsDocumentation v-if="usingSlotDocumentation" v-model="openDoc">
        <slot name="documentation"></slot>
    </BsDocumentation>
    <QPageContainer v-show="isTabSelected">
        <QPage @vnode-mounted="onQPageMounted">
            <div class="content" :id="tabContentId">
                <BsContent v-if="usingSlotContent">
                    <slot name="content"></slot>
                </BsContent>
                <slot></slot>
            </div>
        </QPage>
    </QPageContainer>
</template>

<script lang="ts">
import { QPageContainer, QPage } from "quasar"
import { defineComponent, PropType } from "vue";

import BsHeader from './base-components/BsHeader.vue';
import BsDocumentation from "./base-components/BsDocumentation.vue";
import BsContent from "./base-components/BsContent.vue";
import BsDrawer from './base-components/BsDrawer.vue';
import BsDrawerBtn from './BsDrawerBtn.vue';

import CheckSlotComponentsMixin from './CheckSlotComponentsMixin.vue';
import ProvideMixin from './ProvideMixin.vue';

import { SluggerSingleton } from './Slugger';
const slugger = new SluggerSingleton("tabs");

import { Tab, ImageDimensions, DocsProps } from "./bsLayoutTypes";

export default defineComponent({
    name: "BsTab",
    mixins: [CheckSlotComponentsMixin, ProvideMixin],
    components: {
        BsDrawer,
        BsDrawerBtn,
        BsHeader,
        BsDocumentation,
        BsContent,
        QPageContainer,
        QPage,
    },
    data() {
        return {
            index: 0,
            tabId: slugger.slug(this.name),
            isActive: false,
            openDoc: false,
            drawerExpanded: false,
            qPageMounted: false,
        };
    },
    inject: ["$tabs", "$selectedTab", "$defaultDrawer"],
    provide() {
        return this.provideComputed([
            'isTabSelected',
            // documention
            'tabDocsProps',
            'tabContentId',
            'qPageMounted',
        ]);
    },
    props: {
        name: {
            type: String,
            default: "tab-name-not-set"
        },
        icon: {
            type: String,
            default: "tab"
        },
        docTitle: {
            type: String,
        },
        docIcon: {
            type: String,
        },
        docImageDimensions: {
            type: Object as PropType<ImageDimensions>
        },
    },
    computed: {
        tabContentId() {
            return this.getTabContentId(this.tabId);
        },
        tabDocsProps(): Partial<DocsProps> {
            return {
                docImageDimensions: this.docImageDimensions,
                docTitle: this.docTitle,
                docIcon: this.docIcon,
            }
        },
        isTabSelected() {
            return this.selectedTab?.tabId === this.tabId;
        },
        selectedTab() {
            return (this as any as { $selectedTab: Tab }).$selectedTab;
        },
        defaultDrawer() {
            return (this as any as { $defaultDrawer: Tab }).$defaultDrawer;
        },
        tabs() {
            return (this as any as { $tabs: Tab[] }).$tabs;
        },
        tab() {
            const { tabId, drawer, header, name, icon } = this;
            return {
                tabId, drawer, header, name, icon, drawerExpanded: this.createComputedFromKey("drawerExpanded") as any
            } as Tab;
        },
        header() {
            return this.usingComponentHeader || this.usingSlotHeader;
        },
        drawer() {
            return this.usingComponentLeftPanel || this.usingSlotLeftPanel || this.defaultDrawer;
        },
        usingComponentHeader() {
            return !!this.getSlotComponents(BsHeader.name).length;
        },
        usingComponentLeftPanel() {
            return !!this.getSlotComponents(BsDrawer.name).length;
        },
        usingComponentDocumentation() {
            return !!this.getSlotComponents(BsDocumentation.name).length;
        },
        usingComponentContent() {
            return !!this.getSlotComponents(BsContent.name).length;
        },
        usingSlotHeader() {
            return (!this.usingComponentHeader) && (!!this.$slots.header);
        },
        usingSlotLeftPanel() {
            return (!this.usingComponentLeftPanel) && (!!this.$slots.leftpanel);
        },
        usingSlotDocumentation() {
            return (!this.usingComponentDocumentation) && (!!this.$slots.documentation);
        },
        usingSlotContent() {
            return (!this.usingComponentContent) && (!!this.$slots.content);
        },
    },
    methods: {
        registerTab() {
            this.tabs.push(this.tab);
        },
        getTabContentId(tabId: string) {
            return `tab-content-id-${tabId}`;
        },
        onQPageMounted() {
            this.qPageMounted = true;
            this.$emit('mounted:q-page');
        }
    },
    emits: ['mounted:q-page'],
    mounted() {
        this.registerTab();
    }
});
</script>

<style lang="scss" scoped>
.content {
    position: relative;
    min-height: inherit !important;
}
</style>
