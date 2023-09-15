import { PropType } from 'vue';
import { DocsProps, ImageDimensions, Tab } from './bsLayoutTypes';
declare const _sfc_main: import("vue").DefineComponent<{
    docTitle: {
        type: StringConstructor;
    };
    docIcon: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
    tabMenuWidth: {
        type: NumberConstructor;
        default: number;
    };
    leftPanelWidth: {
        type: NumberConstructor;
        default: number;
    };
}, unknown, {
    tabIndex: number;
    tabs: Tab[];
    mounted: boolean;
    headerMounted: boolean;
    drawerMounted: boolean;
    qPageMounted: boolean;
    menuTabsMounted: boolean;
    drawerOpen: boolean;
    tabSlotNames: string[];
    defaultLayoutTabName: string;
    defaultTabUsed: boolean;
}, {
    tabContentId(): string;
    activeTabSlots(): string[];
    selectedTab(): Tab | undefined;
    selectedTabDrawer(): boolean | undefined;
    layoutDocsProps(): Partial<DocsProps>;
    qLayoutMounted(): boolean;
    defaultDrawer(): boolean;
    defaultHeader(): boolean;
    layoutStyles(): {
        '--bs-drawer-width': string;
    };
}, {
    getTabIndex(selectedTabId: string): number;
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
    getSlotComponents(componentName: string, slotName?: string): import("vue").Component[];
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    docTitle: {
        type: StringConstructor;
    };
    docIcon: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
    tabMenuWidth: {
        type: NumberConstructor;
        default: number;
    };
    leftPanelWidth: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    tabMenuWidth: number;
    leftPanelWidth: number;
}>;
export default _sfc_main;
