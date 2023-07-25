import { PropType } from 'vue';
import { QTableHeaderProps } from "./tableTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
    selection: StringConstructor;
    allSelected: {
        type: PropType<boolean | null>;
        default: boolean;
    };
    loading: BooleanConstructor;
}, unknown, {
    sortedCol: string;
    sortedDesc: boolean;
    isChecked: boolean | null;
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
    allSelected: {
        type: PropType<boolean | null>;
        default: boolean;
    };
    loading: BooleanConstructor;
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
    "onSelect-all"?: ((...args: any[]) => any) | undefined;
}, {
    loading: boolean;
    allSelected: boolean | null;
}>;
export default _sfc_main;
