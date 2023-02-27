declare const _sfc_main: import("vue").DefineComponent<{
    collapsedWidth: {
        type: NumberConstructor;
        default: number;
    };
    panelWidth: {
        type: NumberConstructor;
        default: number;
    };
    mini: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandable: {
        type: BooleanConstructor;
        default: boolean;
    };
    modelValue: BooleanConstructor;
}, unknown, {
    expand: boolean;
}, {
    collapsed(): boolean;
    displayExpanded(): boolean;
    expandedWidth(): number;
    miniDrawerProps(): Record<string, any>;
    defaultDrawerProps(): Record<string, any>;
    drawerProps(): Record<string, any>;
}, {
    toggleDrawer(expand: boolean): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    collapsedWidth: {
        type: NumberConstructor;
        default: number;
    };
    panelWidth: {
        type: NumberConstructor;
        default: number;
    };
    mini: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandable: {
        type: BooleanConstructor;
        default: boolean;
    };
    modelValue: BooleanConstructor;
}>>, {
    modelValue: boolean;
    collapsedWidth: number;
    panelWidth: number;
    mini: boolean;
    expandable: boolean;
}>;
export default _sfc_main;
