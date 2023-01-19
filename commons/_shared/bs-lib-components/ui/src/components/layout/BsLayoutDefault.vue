<template>
    <!-- 
        <BsLayout>
            <QBsTab>
                template icon (optional)

                template settings
                template content
            </QBsTab>
        </BsLayout>
    -->
    <QLayout view="lHh LpR lFf" class="bg-white">
        <BsMenuTabs
            v-if="isTabsMultiple"
            v-model="selectedTab"
        >
            <BsMenuTab 
                v-for="{name, icon} in tabsData"
                :key="name"
                :name="name"
                :icon="icon"
            ></BsMenuTab>
        </BsMenuTabs>
        <slot></slot>
    </QLayout>
</template>

<script lang="ts">
import { QLayout, QHeader, QDrawer, QPageContainer, QBtn, QCard, QPage } from 'quasar';
import { defineComponent, VNode, Component } from 'vue';
const btnImg = require("../../assets/images/BtnImg.svg");
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
            btnImg : btnImg,
            openDoc: false,
            tabsProvider: {
                selectedIndex: 0,
                tabs: [] as VNode[],
                count: 0,
            },
            selectedTab: "a-first-tab",
        }  
    },
    components: {
        BsTab,
        BsMenuTab,
        BsMenuTabs,
        QLayout, 
        QHeader, 
        QDrawer, 
        QPageContainer,
        QBtn,
        QCard,
        QPage,
    },
    created() {
        if (!this.$slots.default) return;
        this.tabsProvider.tabs = this.$slots.default().filter((child) => child.type === "BsTab");
    },
    methods: {
        toggleDoc() {
            this.openDoc = !this.openDoc;
        },
    },
    computed: {
        defaultSlot() {
            const slotFactory = this.$slots.default;
            return slotFactory ? slotFactory() : [];
        },
        tabs(): BsTabInternalInstance[] {
            return this.defaultSlot.filter((child) => {
                const slotType = child.type as Component;
                return slotType?.name && (slotType.name === BsTab.name);
            }) as any;
        },
        tabsData() {
            return this.tabs.map(({ props }, index) => {
                const {name, icon} = {name: `tab-${index}`, icon: "camera", ...props};
                return {name, icon};
            });
        },
        isTabsMultiple(): boolean {
            return this.tabs.length > 1;
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