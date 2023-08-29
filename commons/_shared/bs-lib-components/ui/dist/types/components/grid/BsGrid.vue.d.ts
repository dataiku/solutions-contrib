import { ColDef, GridReadyEvent, IServerSideDatasource, GridOptions, GridApi, GetRowIdParams, IServerSideGroupSelectionState } from "ag-grid-community";
import { PropType } from "vue";
import { RowModelType, BsColDef } from "./bsGridTypes";
import type { Filters, GridRow } from "../../backend_model";
import { IServerSideGetRowsParams, IServerSideGetRowsRequest } from "ag-grid-enterprise";
declare const _sfc_main: import("vue").DefineComponent<{
    columns: {
        type: {
            (arrayLength: number): BsColDef[];
            (...items: BsColDef[]): BsColDef[];
            new (arrayLength: number): BsColDef[];
            new (...items: BsColDef[]): BsColDef[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: false;
    };
    rows: {
        type: PropType<GridRow[]>;
        required: false;
    };
    isLoading: {
        type: BooleanConstructor;
        default: boolean;
    };
    virtualScroll: {
        type: BooleanConstructor;
        default: boolean;
    };
    pageSize: {
        type: NumberConstructor;
        default: number;
    };
    cacheBlockSize: {
        type: NumberConstructor;
        default: number;
    };
    rowId: {
        type: StringConstructor;
        default: string;
    };
    dssTableName: {
        type: StringConstructor;
        default: null;
    };
    filters: {
        type: PropType<Filters>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: null;
    };
    rowSelection: {
        type: StringConstructor;
        default: null;
    };
    groupKeys: {
        type: {
            (arrayLength: number): string[];
            (...items: string[]): string[];
            new (arrayLength: number): string[];
            new (...items: string[]): string[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
    };
    groupName: {
        type: StringConstructor;
        default: null;
    };
    saveSelectionState: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    mdiTrashCanOutline: string;
    rowHeight: number;
    headerHeight: number;
    columnDefs: BsColDef[];
    filterGridText: string;
    datasetColumns: BsColDef[] | undefined;
    datasetRows: GridRow[] | undefined;
    params: GridOptions<any> | undefined;
    gridApi: GridApi<any> | undefined;
    autoGroupColumnDef: ColDef<any, any> | undefined;
    loading: boolean;
    rowModelType: RowModelType;
    rowData: GridRow[] | undefined;
    dataSource: IServerSideDatasource | undefined;
    selectionState: IServerSideGroupSelectionState;
    isComponentAlive: boolean;
    hasFilters: boolean;
}, {
    isDataClientSide(): boolean;
}, {
    onFilterChanged(): void;
    updateLoadingState(val: boolean): void;
    onGridReady(params: GridReadyEvent): void;
    autoSizeColumns(): void;
    fetchDatasetColumns(): Promise<void>;
    handleError(err: string): void;
    refreshData(): void;
    isDoingGrouping(request: IServerSideGetRowsRequest): boolean;
    currentPageIndex(request: IServerSideGetRowsRequest): number | undefined;
    createDataSource(): {
        getRows: (params: IServerSideGetRowsParams) => Promise<void>;
    };
    getRowId(params: GetRowIdParams): string;
    prepareGridColStyle(): void;
    clearFilters(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:rows" | "update:columns" | "update:loading" | "update:selection-state" | "error")[], "update:rows" | "update:columns" | "update:loading" | "update:selection-state" | "error", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    columns: {
        type: {
            (arrayLength: number): BsColDef[];
            (...items: BsColDef[]): BsColDef[];
            new (arrayLength: number): BsColDef[];
            new (...items: BsColDef[]): BsColDef[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        required: false;
    };
    rows: {
        type: PropType<GridRow[]>;
        required: false;
    };
    isLoading: {
        type: BooleanConstructor;
        default: boolean;
    };
    virtualScroll: {
        type: BooleanConstructor;
        default: boolean;
    };
    pageSize: {
        type: NumberConstructor;
        default: number;
    };
    cacheBlockSize: {
        type: NumberConstructor;
        default: number;
    };
    rowId: {
        type: StringConstructor;
        default: string;
    };
    dssTableName: {
        type: StringConstructor;
        default: null;
    };
    filters: {
        type: PropType<Filters>;
        default: () => {};
    };
    title: {
        type: StringConstructor;
        default: null;
    };
    rowSelection: {
        type: StringConstructor;
        default: null;
    };
    groupKeys: {
        type: {
            (arrayLength: number): string[];
            (...items: string[]): string[];
            new (arrayLength: number): string[];
            new (...items: string[]): string[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
    };
    groupName: {
        type: StringConstructor;
        default: null;
    };
    saveSelectionState: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:rows"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns"?: ((...args: any[]) => any) | undefined;
    "onUpdate:loading"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selection-state"?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
}, {
    filters: Filters;
    isLoading: boolean;
    dssTableName: string;
    title: string;
    virtualScroll: boolean;
    saveSelectionState: boolean;
    pageSize: number;
    cacheBlockSize: number;
    rowId: string;
    rowSelection: string;
    groupKeys: string[];
    groupName: string;
}>;
export default _sfc_main;
