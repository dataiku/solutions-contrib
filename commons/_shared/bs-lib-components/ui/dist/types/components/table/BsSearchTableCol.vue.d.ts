import { PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<{
    icon: StringConstructor;
    clear: BooleanConstructor;
    colName: StringConstructor;
    searchedCols: PropType<Record<string, string>>;
}, unknown, {
    value: string | null;
    mdiTrashCanOutline: string;
}, {}, {
    clearField(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "clear-search"[], "clear-search", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    icon: StringConstructor;
    clear: BooleanConstructor;
    colName: StringConstructor;
    searchedCols: PropType<Record<string, string>>;
}>> & {
    "onClear-search"?: ((...args: any[]) => any) | undefined;
}, {
    clear: boolean;
}>;
export default _sfc_main;
