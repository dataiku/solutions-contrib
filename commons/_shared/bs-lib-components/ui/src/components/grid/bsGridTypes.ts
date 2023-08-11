import {
    ColDef,
} from "ag-grid-community";
export const MAP_DSS_COL_TYPE_TO_CELL_TYPE = new Map([
    ["string", "text"],
    ["int", "number"],
    ["bigint", "number"],
    ["smallint", "number"],
    ["tinyint", "number"],
    ["float", "number"],
    ["double", "number"],
    ["boolean", "boolean"],
    ["date", "datestring"],
    ["object", "object"],
    ["map", "object"],
    ["array", "object"],
    ["default", "text"],
]);
export const MAP_TYPE_TO_FILTER = new Map([
    ["text", "agTextColumnFilter"],
    ["number", "agNumberColumnFilter"],
    ["date", "agDateColumnFilter"],
    ["default", "agTextColumnFilter"],
]);
export const MAP_CELL_TYPE_TO_TYPE = new Map([
    ["number", "numericColumn"],
    ["right", "rightAligned"],
    ["left", "leftAligned"],
]);
export enum RowModelType {
    clientSide = 'clientSide',
    serverSide = 'serverSide'
}
export interface BsColDef extends ColDef {
    dataType?: string;
}

export const DSS_ROW_INDEX = "dss-index";