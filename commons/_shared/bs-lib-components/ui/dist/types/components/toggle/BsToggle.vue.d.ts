export default _sfc_main;
declare const _sfc_main: import("vue").DefineComponent<{
    size: {
        type: StringConstructor;
        default: string;
    };
    modelValue: {
        required: boolean;
        default: null;
    };
    val: {};
    trueValue: {
        default: boolean;
    };
    falseValue: {
        default: boolean;
    };
    labelLeft: StringConstructor;
    labelRight: StringConstructor;
    labelClass: {
        type: StringConstructor;
        default: string;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    disable: BooleanConstructor;
    tabindex: (StringConstructor | NumberConstructor)[];
}, any, {}, {
    modelIsArray(): boolean;
    index(): any;
    isTrue(): boolean;
    isFalse(): boolean;
    tabIndex(): string | number;
    fontSize(): any;
}, {
    getNextValue(): any;
    onClick(e: any): void;
    onKeydown(e: any): void;
    onKeyup(e: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, string[], string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    size: {
        type: StringConstructor;
        default: string;
    };
    modelValue: {
        required: boolean;
        default: null;
    };
    val: {};
    trueValue: {
        default: boolean;
    };
    falseValue: {
        default: boolean;
    };
    labelLeft: StringConstructor;
    labelRight: StringConstructor;
    labelClass: {
        type: StringConstructor;
        default: string;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    disable: BooleanConstructor;
    tabindex: (StringConstructor | NumberConstructor)[];
}>> & {
    [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
}, {
    modelValue: null;
    size: string;
    trueValue: boolean;
    falseValue: boolean;
    labelClass: string;
    color: string;
    disable: boolean;
}>;
