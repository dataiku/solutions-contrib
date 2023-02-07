<template>
    <BsHeader v-if="usingSlotHeader || !(header || defaultTabUsed)">
        <slot name="header"></slot>
    </BsHeader>
    <BsDrawer v-if="usingSlotDrawer">
        <slot v-if="!$slots.drawer" name="leftpanel"></slot>
        <slot name="drawer"></slot>
    </BsDrawer>
    <BsDocumentation v-if="usingSlotDocumentation" v-model="openDoc">
        <slot name="documentation"></slot>
    </BsDocumentation>
    <BsTabIcon v-if="usingSlotDocumentation">
        <slot name="documentation"></slot>
    </BsTabIcon>
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
import { defineComponent, PropType, Component } from "vue";

import BsHeader from './base-subcomponents/BsHeader.vue';
import BsDocumentation from "./base-subcomponents/BsDocumentation.vue";
import BsContent from "./base-subcomponents/BsContent.vue";
import BsDrawer from './base-subcomponents/BsDrawer.vue';
import BsTabIcon from "./base-subcomponents/BsTabIcon.vue";

import CheckSlotComponentsMixin from './CheckSlotComponentsMixin.vue';
import ProvideMixin from './ProvideMixin.vue';

import { SluggerSingleton } from './Slugger';
const slugger = new SluggerSingleton("tabs");

import { Tab, ImageDimensions, DocsProps } from "./bsLayoutTypes";
import { getBsContentId } from "./bsLayoutHelper"
export default defineComponent({
    name: "BsTab",
    mixins: [CheckSlotComponentsMixin, ProvideMixin],
    components: {
    BsDrawer,
    BsHeader,
    BsDocumentation,
    BsContent,
    QPageContainer,
    QPage,
    BsTabIcon
},
    data() {
        return {
            index: 0,
            tabId: slugger.slug(this.name),
            isActive: false,
            openDoc: false,
            qPageMounted: false,
        };
    },
    inject: ["$tabs", "$selectedTab", "$defaultTabUsed", "$defaultDrawer"],
    provide() {
        return this.provideComputed([
            'isTabSelected',
            'tabName',
            // documention
            'tabDocsProps',
            'tabId',
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
            return getBsContentId(this.tabId);
        },
        tabName() {
            return this.name;
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
            return (this as any as { $defaultDrawer: boolean }).$defaultDrawer;
        },
        defaultHeader() {
            return (this as any as { $defaultHeader: boolean }).$defaultHeader;
        },
        defaultTabUsed() {
            return (this as any as { $defaultTabUsed: boolean }).$defaultTabUsed;
        },
        tabs() {
            return (this as any as { $tabs: Tab[] }).$tabs;
        },
        tab() {
            const { tabId, drawer, header, name, icon } = this;
            return {tabId, drawer, header, name, icon} as Tab;
        },
        header() {
            return this.usingComponent(BsHeader) || this.usingSlotHeader || this.defaultHeader;
        },
        drawer() {
            return this.usingComponent(BsDrawer) || this.usingSlotDrawer || this.defaultDrawer;
        },
        usingSlotHeader() {
            return !this.usingComponent(BsHeader) && (!!this.$slots.header);
        },
        usingSlotDrawer() {
            return !this.usingComponent(BsDrawer) && !!(this.$slots.leftpanel || this.$slots.drawer);
        },
        usingSlotDocumentation() {
            return !this.usingComponent(BsDocumentation) && !!this.$slots.documentation;
        },
        usingSlotContent() {
            return !this.usingComponent(BsContent) && !!this.$slots.content;
        },
        appendTabTitleToHeader() {
            return !this.defaultTabUsed;
        },
    },
    methods: {
        registerTab() {
            this.tabs.push(this.tab);
        },
        onQPageMounted() {
            this.qPageMounted = true;
            this.$emit('mounted:q-page');
        },
        usingComponent(component: Component) {
            return !!this.getSlotComponents(component.name || "").length;
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
