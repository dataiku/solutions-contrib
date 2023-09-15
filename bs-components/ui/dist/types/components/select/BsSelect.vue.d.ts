export default _sfc_main;
declare const _sfc_main: import("vue").DefineComponent<{
    bsLabel: {
        type: StringConstructor;
    };
    placeHolder: {
        type: StringConstructor;
    };
}, any, {
    width: number;
}, {
    popupStyle(): {
        width: number;
        maxWidth: number;
        wordBreak: string;
    };
    computedLabel(): string | undefined;
}, {
    popupShow(): void;
    popupHide(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    bsLabel: {
        type: StringConstructor;
    };
    placeHolder: {
        type: StringConstructor;
    };
}>>, {}>;
