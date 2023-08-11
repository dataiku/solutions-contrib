import { PropType } from 'vue';
import { QTableColumn } from 'quasar';
import { ServerSidePagination } from './tableHelper';
import { BsTableBodyCellProps, QTableBodyCellProps } from './tableTypes';
import { RangeFilter } from '../../backend_model';
declare const _sfc_main: import("vue").DefineComponent<{
    dssTableName: StringConstructor;
    title: StringConstructor;
    serverSidePagination: PropType<boolean | Partial<ServerSidePagination>>;
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    rows: PropType<Record<string, any>[]>;
    columns: PropType<QTableColumn[]>;
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
    filters: PropType<Record<string, RangeFilter | string[]>>;
    selection: {
        type: PropType<"single" | "multiple" | "none">;
        default: undefined;
    };
    rowKey: StringConstructor;
}, unknown, {
    searching: boolean;
    fetching: boolean;
    searchedCols: Record<string, string>;
    searchedCol: string | undefined;
    searchedValue: string | null;
    searchedValueFormatted: string;
    _serverSidePagination: ServerSidePagination;
    _rows: Record<string, any>[] | undefined;
    _columns: QTableColumn[] | undefined;
    lastBatchIndex: number;
    scrollDetails: {
        from: number;
    };
    passedRowsLength: number;
    tableEl: HTMLElement | undefined;
    mdiCloseCircleMultiple: string;
    selectedRowsByBatch: Record<number, Record<string, any>[]>;
    selected: Record<string, any>[];
    allSelected: Record<number, boolean | null>;
    prevBatchIndex: number;
}, {
    isDSSTable(): boolean;
    isLoading(): boolean;
    anyColumnSearched(): boolean;
    isServerSidePaginationObject(): boolean;
    passedRows(): Record<string, any>[] | undefined;
    passedColumns(): QTableColumn[] | undefined;
    colSlotsUsed(): QTableColumn[] | undefined;
    formattedColumns(): any[] | undefined;
    filter(): {
        columns: Record<string, string>;
        searchVal: string | number | null;
    };
    classParsed(): string[];
    tableClasses(): (string | boolean | undefined)[];
    filteredSlots(): {
        [k: string]: import("vue").Slot | undefined;
    };
    selectionOn(): boolean;
    allSelectedBatch(): boolean | null;
    currentBatchIndex(): number;
}, {
    updateDSSRows(rows: Record<string, any>[] | undefined): void;
    updateDSSColumns(columns: QTableColumn[]): void;
    searchTableFilter(args_0: readonly Record<string, any>[], args_1: {
        columns: Record<string, string>;
        searchVal: string;
    }, args_2: readonly QTableColumn[], args_3: (col: QTableColumn, row: Record<string, any>) => any): readonly Record<string, any>[];
    updateSearchedCols(colName: string, searchedVal: string | null): void;
    searchCol(colName: string): void;
    colBodySlotUsed(col: QTableColumn): boolean;
    getColBodySlot(col: QTableColumn): string;
    getColSearchedValue(colName: string): string | undefined;
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
    getBodyCellProps(props: QTableBodyCellProps): BsTableBodyCellProps;
    selectAllHandler(checked: boolean): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:rows" | "update:columns" | "update:loading" | "update:server-side-pagination" | "virtual-scroll" | "update:selection")[], "update:rows" | "update:columns" | "update:loading" | "update:server-side-pagination" | "virtual-scroll" | "update:selection", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    dssTableName: StringConstructor;
    title: StringConstructor;
    serverSidePagination: PropType<boolean | Partial<ServerSidePagination>>;
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    rows: PropType<Record<string, any>[]>;
    columns: PropType<QTableColumn[]>;
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
    filters: PropType<Record<string, RangeFilter | string[]>>;
    selection: {
        type: PropType<"single" | "multiple" | "none">;
        default: undefined;
    };
    rowKey: StringConstructor;
}>> & {
    "onUpdate:rows"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns"?: ((...args: any[]) => any) | undefined;
    "onUpdate:loading"?: ((...args: any[]) => any) | undefined;
    "onUpdate:server-side-pagination"?: ((...args: any[]) => any) | undefined;
    "onVirtual-scroll"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selection"?: ((...args: any[]) => any) | undefined;
}, {
    loading: boolean;
    virtualScroll: boolean;
    stickyHeader: boolean;
    globalSearch: boolean;
    serverSidePaginationControls: boolean;
    selection: "single" | "multiple" | "none";
}>;
export default _sfc_main;
