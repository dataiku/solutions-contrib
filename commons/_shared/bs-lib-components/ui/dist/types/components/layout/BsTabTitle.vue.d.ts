declare const _sfc_main: import("vue").DefineComponent<{
    calculateWidth: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    tabTitleWidth: string;
}, {
    tabName(): string;
    defaultDrawer(): boolean;
    defaultTabUsed(): boolean;
    tabTitleWidthSet(): boolean;
}, {
    calculateTabTitleWidth(): void;
    widthNotSet(width: string): boolean;
    calculateWidthIfNeeded(): void;
}, import("vue").ComponentOptionsMixin, import("vue").DefineComponent<{}, {}, {}, {
    showComponent(): boolean;
    qLayoutMounted(): boolean;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>, "calculated"[], "calculated", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    calculateWidth: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onCalculated?: ((...args: any[]) => any) | undefined;
}, {
    calculateWidth: boolean;
}>;
export default _sfc_main;
