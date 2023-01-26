<template>
    <BsHeader v-if="usingSlotHeader"><slot name="header"></slot></BsHeader>
    <BsDrawer v-if="usingSlotLeftPanel"><slot name="leftpanel"></slot></BsDrawer>
    <QPageContainer v-show="isTabSelected">
        <QPage>
            <div class="content">
                <template v-if="$slots.documentation">
                    <QBtn unelevated outline no-caps no-wrap class="btn-solution absolute" square @click="toggleDoc">
                        <div class="row items-center q-gutter-sm no-wrap">
                            <img src="../../assets/images/solutions-icon.svg" width="15" height="16">
                            <span class="btn-solution-text">Dataiku Solutions</span>
                        </div>
                    </QBtn>
                    <QCard class="doc-content flex row" v-if="openDoc">
                        <div class="flex row items-center q-gutter-sm q-mb-lg">
                            <img v-if="docIcon" :src="docIcon" :width="docImageDimensions.width" :height="docImageDimensions.height">
                            <span class="dku-large-title-sb">{{ docTitle }}</span>
                        </div>
                        <div class="doc-body">
                            <slot name="documentation"></slot>
                        </div>
                        <div class="doc-footer flex row items-center">
                            <span class="doc-footer__icon"><img src="../../assets/images/solutions-icon.svg" width="14" height="12.5"></span>
                            <span class="doc-footer__text dku-tiny-text-sb">Dataiku Solutions</span>
                        </div>
                    </QCard>
                </template>
                <slot name="content"></slot>
            </div>
        </QPage>
    </QPageContainer>
</template>

<script lang="ts">
import { QDrawer, QPageContainer, QPage, QCard, QBtn, QHeader } from "quasar"
import { defineComponent, PropType, computed } from "vue";

import BsDrawer from './BsDrawer.vue';
import BsHeader from './BsHeader.vue';

import CheckSlotComponentsExtension from './CheckSlotComponentsExtension.vue';

import { SluggerSingleton } from './Slugger';
const slugger = new SluggerSingleton("tabs");

import { Tab } from "./bsLayoutTypes";

export default defineComponent({
    name: "BsTab",
    extends: CheckSlotComponentsExtension,
    components: {
        BsDrawer,
        BsHeader,
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
        };
    },
    expose: ["name", "icon"],
    inject: ["$tabs", "$selectedTab"],
    provide() {
        return {
            $isTabSelected: computed(() => this.isTabSelected),
        }
    },
    props: {
        name: {
            type: String,
            default: "tab-name-not-set"
        },
        icon: {
            type: String,
            default: "help"
        },
        docTitle: {
            type: String,
            default: "Documantation"
        },
        docIcon: {
            type: String,
        },
        docImageDimensions: {
            type: Object as PropType<{
                width: number,
                height: number,
            }>,
            default: () => ({
                width: 36,
                height: 40,
            })
        }
    },
    computed: {
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
            const { tabId, drawer, header } = this;
            return {
                tabId, drawer, header, drawerExpanded: computed(() => this.drawerExpanded)
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
        usingSlotHeader() {
            return (!this.usingComponentHeader) && (!!this.$slots.header);
        },
        usingSlotLeftPanel() {
            return (!this.usingComponentLeftPanel) && (!!this.$slots.leftpanel);
        },
    },
    methods: {
        toggleDoc() {
            this.openDoc = !this.openDoc;
        },
        registerTab() {
            this.tabs.push(this.tab);
        },
    },
    mounted() {
        this.registerTab();
    }
});
</script>

<style lang="scss" scoped>
.btn-solution-text {
    color: #000000;
    font-family: 'SourceSansPro';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 12px;
}


.btn-solution {
    color: #C8C8C8;
    top: 16px;
    right: 16px;
    z-index: 99;
    border-radius: 4px;
}

.doc-content {
    position: absolute;
    min-width: 359px;
    max-width: 359px;
    min-height: 515px;
    height: 515px;
    overflow: scroll;
    top: 60px;
    right: 15px;
    border: 1px solid #CCCCCC;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    padding: 26px 23px 0px 22px;
    z-index: 99;
    border-radius: 0px;
}

.doc-footer {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    right: 0;
    margin-left: auto;
    height: 25px;
    z-index: 99;

    &__icon {
        padding-left: 8px;
        padding-right: 4.5px;
        padding-top: 2px;
        border-top: 1px solid #F2F2F2;
        border-left: 1px solid #F2F2F2;
        border-radius: 4px 0px 0px 0px;
    }

    &__text {
        padding: 5px 12px 5px 9px;
        border-top: 1px solid #F2F2F2;
        border-left:1px solid #F2F2F2;
        border-right:1px solid #F2F2F2;
    }
}

.content {
    position: relative;
    min-height: inherit !important;
}

@supports (backdrop-filter: none) {
    .doc-footer {
        background-color: white;
        backdrop-filter: blur(7px);
    }  
}

@supports not (backdrop-filter: none) {
    .doc-footer {
        background-color: white;
    }
}

</style>