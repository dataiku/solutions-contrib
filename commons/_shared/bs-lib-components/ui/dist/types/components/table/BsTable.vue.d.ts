import { PropType, Slot } from 'vue';
import { QTableColumn } from 'quasar';
import { ServerSidePagination } from './tableHelper';
declare const _sfc_main: import("vue").DefineComponent<{
    dssTableName: StringConstructor;
    title: StringConstructor;
    serverSidePagination: PropType<boolean | Partial<ServerSidePagination>>;
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    rows: PropType<Record<string, any>[]>;
    columns: PropType<QTableColumn<any, string, string | ((row: any) => any)>[]>;
    virtualScroll: {
        type: BooleanConstructor;
        default: boolean;
    };
    stickyHeader: {
        type: BooleanConstructor;
        default: boolean;
    };
    globalSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    serverSidePaginationControls: {
        type: BooleanConstructor;
        default: boolean;
    };
    style: (StringConstructor | ObjectConstructor)[];
    class: PropType<string | string[]>;
}, unknown, {
    searching: boolean;
    fetching: boolean;
    searchedCols: Record<string, string>;
    searchedValue: string | null;
    searchedValueFormatted: string;
    _serverSidePagination: ServerSidePagination;
    _rows: Record<string, any>[] | undefined;
    _columns: QTableColumn<any, string, string | ((row: any) => any)>[] | undefined;
    lastBatchIndex: number;
    scrollDetails: {
        from: number;
    };
    passedRowsLength: number;
    tableEl: HTMLElement | undefined;
    qTableMiddle: HTMLElement | undefined;
    mdiCloseCircleMultiple: string;
}, {
    isDSSTable(): boolean;
    isLoading(): boolean;
    anyColumnSearched(): boolean;
    isServerSidePaginationObject(): boolean;
    passedRows(): Record<string, any>[] | undefined;
    passedColumns(): QTableColumn[] | undefined;
    formattedColumns(): any[] | undefined;
    filter(): {
        columns: Record<string, string>;
        searchVal: string | number | null;
    };
    colSlots(): [string, string][];
    classParsed(): string[];
    tableClasses(): (string | boolean | undefined)[];
    filteredSlots(): {
        [k: string]: Slot | undefined;
    };
}, {
    updateDSSRows(rows: Record<string, any>[] | undefined): void;
    updateDSSColumns(columns: QTableColumn[]): void;
    searchTableFilter(args_0: readonly Record<string, any>[], args_1: {
        columns: Record<string, string>;
        searchVal: string;
    }, args_2: readonly QTableColumn<any, string, string | ((row: any) => any)>[], args_3: (col: QTableColumn<any, string, string | ((row: any) => any)>, row: Record<string, any>) => any): readonly Record<string, any>[];
    updateSearchedCols(colName: string, searchedVal: string): void;
    getColBodySlot(colName: string): string;
    getColSearchedValue(colName: string): any;
    setBatchOffset(batchOffset: number, emit?: boolean): void;
    setBatchSize(batchSize: number, emit?: boolean): void;
    setRecordsCount(recordsCount: number, emit?: boolean): void;
    setServerSidePagination(pagination: Partial<ServerSidePagination>, emit?: boolean): void;
    syncServerSidePagination(): void;
    createServerSidePagination(): void;
    clearAllSearch(): void;
    onVirtualScroll(details: any): void;
    startOfTheTable(): void;
    startOfThePage(): void;
    firstPage(): any;
    scrollTo(index: string | number, edge?: "center" | "start" | "end" | "start-force" | "center-force" | "end-force" | undefined): any;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:rows" | "update:columns" | "update:server-side-pagination" | "virtual-scroll")[], "update:rows" | "update:columns" | "update:server-side-pagination" | "virtual-scroll", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dssTableName: StringConstructor;
    title: StringConstructor;
    serverSidePagination: PropType<boolean | Partial<ServerSidePagination>>;
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    rows: PropType<Record<string, any>[]>;
    columns: PropType<QTableColumn<any, string, string | ((row: any) => any)>[]>;
    virtualScroll: {
        type: BooleanConstructor;
        default: boolean;
    };
    stickyHeader: {
        type: BooleanConstructor;
        default: boolean;
    };
    globalSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    serverSidePaginationControls: {
        type: BooleanConstructor;
        default: boolean;
    };
    style: (StringConstructor | ObjectConstructor)[];
    class: PropType<string | string[]>;
}>> & {
    "onUpdate:rows"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns"?: ((...args: any[]) => any) | undefined;
    "onUpdate:server-side-pagination"?: ((...args: any[]) => any) | undefined;
    "onVirtual-scroll"?: ((...args: any[]) => any) | undefined;
}, {
    loading: boolean;
    virtualScroll: boolean;
    stickyHeader: boolean;
    globalSearch: boolean;
    serverSidePaginationControls: boolean;
}>;
export default _sfc_main;
