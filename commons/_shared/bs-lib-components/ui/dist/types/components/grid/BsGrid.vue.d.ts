import { ColDef, GridReadyEvent, IServerSideDatasource, GridOptions, GridApi, GetRowIdParams, IServerSideGroupSelectionState } from "ag-grid-community";
import { PropType } from "vue";
import { RowModelType, BsColDef } from "./bsGridTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    columns: {
        type: {
            (arrayLength: number): any[];
            (...items: any[]): any[];
            new (arrayLength: number): any[];
            new (...items: any[]): any[];
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
        type: PropType<Record<string, any>>;
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
    dssTableName: StringConstructor;
    title: StringConstructor;
    filters: PropType<Record<string, any[]>>;
    rowSelection: StringConstructor;
    groupKey: StringConstructor;
    saveSelectionState: BooleanConstructor;
}, unknown, {
    rowHeight: number;
    headerHeight: number;
    columnDefs: BsColDef[];
    filterGridText: string;
    datasetColumns: BsColDef[] | undefined;
    datasetRows: any[] | undefined;
    params: GridOptions<any> | undefined;
    gridApi: GridApi<any> | undefined;
    autoGroupColumnDef: ColDef<any, any> | undefined;
    loading: boolean;
    rowModelType: RowModelType;
    rowData: Record<string, any>[] | undefined;
    dataSource: IServerSideDatasource | undefined;
    selectionState: IServerSideGroupSelectionState;
}, {
    isDataClientSide(): boolean;
}, {
    onGridReady(params: GridReadyEvent): void;
    autoSizeColumns(): void;
    createBsGridCol(col: any): BsColDef;
    fetchDatasetColumns(): void;
    transformDatasetRowsToGridRows(datasetData: any | string, isGroupRow: boolean): Record<string, any>[];
    handleError(err: string): void;
    refreshData(): void;
    isDoingGrouping(request: any): boolean;
    currentPageIndex(request: any): number | undefined;
    createDataSource(): {
        getRows: (params: any) => void;
    };
    getRowId(params: GetRowIdParams): string;
    prepareGridColStyle(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:rows" | "update:columns" | "update:loading" | "update:selection-state" | "error")[], "update:rows" | "update:columns" | "update:loading" | "update:selection-state" | "error", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    columns: {
        type: {
            (arrayLength: number): any[];
            (...items: any[]): any[];
            new (arrayLength: number): any[];
            new (...items: any[]): any[];
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
        type: PropType<Record<string, any>>;
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
    dssTableName: StringConstructor;
    title: StringConstructor;
    filters: PropType<Record<string, any[]>>;
    rowSelection: StringConstructor;
    groupKey: StringConstructor;
    saveSelectionState: BooleanConstructor;
}>> & {
    "onUpdate:rows"?: ((...args: any[]) => any) | undefined;
    "onUpdate:columns"?: ((...args: any[]) => any) | undefined;
    "onUpdate:loading"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selection-state"?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
}, {
    isLoading: boolean;
    virtualScroll: boolean;
    saveSelectionState: boolean;
    pageSize: number;
    cacheBlockSize: number;
    rowId: string;
}>;
export default _sfc_main;
