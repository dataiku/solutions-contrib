import { GridRow, DSSDatasetData } from "../../backend_model";
import { BsColDef } from "./bsGridTypes";
export declare class GridTransformations {
    private static isGroupKey;
    static transformDatasetRowsToGridRows(datasetData: DSSDatasetData | string, datasetColumns: BsColDef[], isGroupRow: boolean, groupKeys?: string[]): GridRow[];
    static createBsGridCol(col: {
        name: string;
        dataType: string;
    }, groupKeys?: string[]): BsColDef;
}
