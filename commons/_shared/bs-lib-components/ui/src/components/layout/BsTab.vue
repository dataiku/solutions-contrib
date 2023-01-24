<template>
    <QHeader v-show="isTabSelected" bordered class="bg-white bs-header" v-if="$slots.header">
        <slot name="header"></slot>
    </QHeader>
    <template v-show="isTabSelected" v-if="$slots.leftpanel">
        <div class="toggle-left-button" :style="{ 'left' : leftDist + 'px'}">
            <div @click="toggleLeftPanel">
                <img src="../../assets/images/BtnImg.svg">
            </div>
        </div>
        <QDrawer v-model="showLeftPanel" side="left" bordered behavior="desktop">
            <slot name="leftpanel"></slot>
        </QDrawer>
    </template>
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
                            <img :src="docIcon" :width="docImageDimensions.width" :height="docImageDimensions.height"   v-if="docIcon">
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
import { defineComponent, PropType, ComputedRef } from "vue";
import BsDrawer from './BsDrawer.vue';
const btnImg = require("../../assets/images/BtnImg.svg");

import { SluggerSingleton } from './Slugger';
const slugger = new SluggerSingleton("tabs");

export default defineComponent({
    name: "BsTab",
    components: {
        BsDrawer,
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
            isActive: false,
            showLeftPanel: true,
            openDoc: false,
            btnImg: btnImg,
            tabId: slugger.slug(this.name),
        };
    },
    expose: ["name", "icon"],
    inject: ["$tabs", "$selectedTab"],
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
        leftDist() {
            return this.showLeftPanel ? 300 : 0;
        },
        isTabSelected() {
            return this.selectedTab === this.tabId;
        },
        selectedTab() {
            return (this as any as {$selectedTab: ComputedRef<string>}).$selectedTab.value;
        },
        tabs() {
            return (this as any as {$tabs: string[]}).$tabs;
        }
    },
    watch: {
        isTabSelected(newVal: boolean) {
            console.log(`${this.tabId}: ${newVal}`);
        }
    },
    methods: {
        toggleLeftPanel() {
            this.showLeftPanel = !this.showLeftPanel;
        },
        toggleDoc() {
            this.openDoc = !this.openDoc;
        },
        registerTab() {
            this.tabs.push(this.tabId);
        }
    },
    mounted() {
        this.registerTab();
    }
});
</script>