import { PropType } from 'vue';
import { QTableHeaderProps } from "./tableTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
    selection: StringConstructor;
    allSelected: BooleanConstructor;
}, unknown, {
    sortedCol: string;
    sortedDesc: boolean;
    isChecked: boolean;
}, {
    cols(): any[];
}, {
    activateSearchCol(colName: string): void;
    sort(col: any): void;
    toggleCheckbox(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("search-col" | "select-all")[], "search-col" | "select-all", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
    selection: StringConstructor;
    allSelected: BooleanConstructor;
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
    "onSelect-all"?: ((...args: any[]) => any) | undefined;
}, {
    allSelected: boolean;
}>;
export default _sfc_main;
