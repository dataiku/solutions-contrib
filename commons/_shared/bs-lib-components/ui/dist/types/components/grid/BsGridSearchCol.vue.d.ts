declare const _sfc_main: import("vue").DefineComponent<{
    params: {
        required: true;
        type: ObjectConstructor;
    };
}, unknown, {
    currentValue: string | number | null;
    mdiTrashCanOutline: string;
}, {}, {
    onInputBoxChanged(newVal: string | number | null): void;
    onParentModelChanged(parentModel: any): void;
    clearField(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    params: {
        required: true;
        type: ObjectConstructor;
    };
}>>, {}>;
export default _sfc_main;
