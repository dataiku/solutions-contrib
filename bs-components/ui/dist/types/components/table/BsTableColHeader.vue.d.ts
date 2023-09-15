import { PropType } from "vue";
declare const _sfc_main: import("vue").DefineComponent<{
    sort: PropType<(col: any) => void>;
    col: PropType<{
        label: string;
        name: string;
    }>;
    sortedCol: StringConstructor;
}, unknown, {
    mdiArrowUpThin: string;
    mdiSortAscending: string;
    mdiSortDescending: string;
    mdiChevronDown: string;
    searchColIcon: string;
    noDebounceValue: string | number | null | undefined;
    sortAsc: boolean;
    sorted: boolean;
}, {
    sortable(): boolean;
    sortColIcon(): any;
    sortText(): string;
}, {
    sortColumn(): void;
    searchColumn(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "search-col"[], "search-col", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    sort: PropType<(col: any) => void>;
    col: PropType<{
        label: string;
        name: string;
    }>;
    sortedCol: StringConstructor;
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
