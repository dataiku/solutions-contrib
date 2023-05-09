declare const _sfc_main: import("vue").DefineComponent<{
    modelValue: {
        type: BooleanConstructor;
        required: true;
    };
    show: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    hide: boolean;
    hidden: boolean;
    hideTransitionDuration: number;
}, {}, {
    toggleLeftPanel(): void;
    toggleShown(show: boolean): void;
}, import("vue").ComponentOptionsMixin, import("vue").DefineComponent<{}, {}, {}, {
    showComponent(): boolean;
    qLayoutMounted(): boolean;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}>, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: BooleanConstructor;
        required: true;
    };
    show: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    show: boolean;
}>;
export default _sfc_main;
