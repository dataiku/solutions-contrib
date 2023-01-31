<template>
    <BsHeader v-if="usingSlotHeader"><slot name="header"></slot></BsHeader>
    <BsDrawer v-if="usingSlotLeftPanel"><slot name="leftpanel"></slot></BsDrawer>
    <BsDrawerBtn
        v-if="drawer"
        v-model="drawerExpanded"
    ></BsDrawerBtn>
    <BsDocumentation
        v-if="usingSlotDocumentation"
        v-model="openDoc"
    >
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
import { QDrawer, QPageContainer, QPage, QCard, QBtn, QHeader } from "quasar"
import { defineComponent, PropType, computed } from "vue";

import BsDrawer from './BsDrawer.vue';
import BsDrawerBtn from './BsDrawerBtn.vue';
import BsHeader from './BsHeader.vue';
import BsDocumentation from "./BsDocumentation.vue";
import BsContent from "./BsContent.vue";

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
        QDrawer,
        QPageContainer,
        QPage,
        QCard,
        QBtn,
        QHeader
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
    inject: ["$tabs", "$selectedTab"],
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
            return (this as any as {$selectedTab: Tab}).$selectedTab;
        },
        tabs() {
            return (this as any as {$tabs: Tab[]}).$tabs;
        },
        tab() {
            const { tabId, drawer, header, name, icon } = this;
            return {
                tabId, drawer, header, name, icon, drawerExpanded: computed(() => this.drawerExpanded) as any
            } as Tab;
        },
        header() {
            return this.usingComponentHeader || this.usingSlotHeader;
        },
        drawer() {
            return this.usingComponentLeftPanel || this.usingSlotLeftPanel;
        },
        usingComponentHeader() {
            return !!this.getSlotComponents(BsHeader.name).length;
        },
        usingComponentLeftPanel() {
            return !!this.getSlotComponents(BsDrawer.name).length;
        },
        usingComponentDocumantation() {
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
            return (!this.usingComponentDocumantation) && (!!this.$slots.documentation);
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
