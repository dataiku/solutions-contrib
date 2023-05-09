import { PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<{
    sort: PropType<(col: any) => void>;
    col: PropType<{
        label: string;
        name: string;
    }>;
    searchedCols: PropType<Record<string, string>>;
}, unknown, {
    mdiArrowUpThin: string;
    searchColIcon: string;
    searchPopupActive: boolean;
    lastSearchedValue: string | number | null | undefined;
    noDebounceValue: string | number | null | undefined;
}, {
    sortable(): boolean;
    searching(): boolean;
}, {
    sortColumn(): void;
    searchColumn(searchVal: string | null | number | undefined): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "search-col"[], "search-col", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    sort: PropType<(col: any) => void>;
    col: PropType<{
        label: string;
        name: string;
    }>;
    searchedCols: PropType<Record<string, string>>;
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
