import { PropType, Component } from "vue";
import { Tab, ImageDimensions, DocsProps } from "./bsLayoutTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    name: {
        type: StringConstructor;
        default: string;
    };
    icon: {
        type: StringConstructor;
    };
    docTitle: {
        type: StringConstructor;
    };
    docIcon: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
}, unknown, {
    index: number;
    tabId: string;
    isActive: boolean;
    openDoc: boolean;
    qPageMounted: boolean;
}, {
    tabContentId(): string;
    tabName(): string;
    tabDocsProps(): Partial<DocsProps>;
    isTabSelected(): boolean;
    selectedTab(): Tab;
    defaultDrawer(): boolean;
    defaultHeader(): boolean;
    defaultTabUsed(): boolean;
    tabs(): Tab[];
    tab(): Tab;
    header(): boolean;
    drawer(): boolean;
    tabIcon(): string | undefined;
    usingSlotHeader(): boolean;
    usingSlotDrawer(): boolean;
    usingSlotDocumentation(): boolean;
    usingSlotContent(): boolean;
    usingSlotTabIcon(): boolean;
    appendTabTitleToHeader(): boolean;
    slotsKeys(): string[];
}, {
    registerTab(): void;
    unregisterTab(): void;
    onQPageMounted(): void;
    usingComponent(component: Component): boolean;
    usingSlot(component: Component, ...slots: string[]): boolean;
}, import("vue").DefineComponent<{}, {}, {}, {}, {
    providePrefixed(keys: string[], options?: {
        prefix?: string | undefined;
        getter?: Function | undefined;
    } | undefined): Record<string, any>;
    createComputedFromKey(key: string): import("vue").ComputedRef<any>;
    provideComputed(keys: string[], options?: {
        prefix?: string | undefined;
    } | undefined): Record<string, any>;
    provideStatic(keys: string[], options?: {
        prefix?: string | undefined;
    } | undefined): Record<string, any>;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}> | import("vue").DefineComponent<{}, {}, {}, {}, {
    getSlotComponents(componentName: string, slotName?: string): Component[];
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>, import("vue").ComponentOptionsMixin, "mounted:q-page"[], "mounted:q-page", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
        default: string;
    };
    icon: {
        type: StringConstructor;
    };
    docTitle: {
        type: StringConstructor;
    };
    docIcon: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
}>> & {
    "onMounted:q-page"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
}>;
export default _sfc_main;
