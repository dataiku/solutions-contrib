import { PropType } from 'vue';
import { QTableHeaderProps } from "./tableTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
    searchedCols: PropType<Record<string, string>>;
    searchedCol: StringConstructor;
    selectionOn: BooleanConstructor;
}, unknown, {
    noDebounceValue: string | number | null | undefined;
    searchColIcon: string;
}, {
    noSearches(): boolean;
    cols(): any[];
}, {
    activateSearchCol(colName: string): void;
    searchColumn(colName: string, searchVal: string | null): void;
    clearAll(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("search-col" | "clear-all")[], "search-col" | "clear-all", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
    searchedCols: PropType<Record<string, string>>;
    searchedCol: StringConstructor;
    selectionOn: BooleanConstructor;
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
    "onClear-all"?: ((...args: any[]) => any) | undefined;
}, {
    selectionOn: boolean;
}>;
export default _sfc_main;
