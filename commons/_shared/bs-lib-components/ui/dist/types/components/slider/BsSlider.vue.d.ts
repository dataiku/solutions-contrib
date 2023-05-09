export default _sfc_main;
declare const _sfc_main: import("vue").DefineComponent<{
    sliderWidth: {
        type: NumberConstructor;
        default: number;
    };
}, any, any, {
    inputData(): {
        value: any;
        min: any;
        max: any;
        step: any;
    };
}, {
    updateSliderFromInput(e: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    sliderWidth: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    sliderWidth: number;
}>;
