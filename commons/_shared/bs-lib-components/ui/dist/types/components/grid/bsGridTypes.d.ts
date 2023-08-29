import { ColDef } from "ag-grid-community";
export declare const MAP_DSS_COL_TYPE_TO_CELL_TYPE: Map<string, string>;
export declare const MAP_TYPE_TO_FILTER: Map<string, string>;
export declare const MAP_CELL_TYPE_TO_TYPE: Map<string, string>;
export declare enum RowModelType {
    clientSide = "clientSide",
    serverSide = "serverSide"
}
export interface BsColDef extends ColDef {
    dataType?: string;
}
export declare const DSS_ROW_INDEX = "dss-index";
