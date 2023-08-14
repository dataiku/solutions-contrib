import { GridRow, DSSDatasetData, DSSColumnData } from "../../backend_model";
import {
    MAP_DSS_COL_TYPE_TO_CELL_TYPE,
    MAP_TYPE_TO_FILTER,
    MAP_CELL_TYPE_TO_TYPE,
    BsColDef,
    DSS_ROW_INDEX,
} from "./bsGridTypes";

export class GridTransformations {
    private static isGroupKey(name: string, groupKeys?: string[]): boolean {
        return (groupKeys || []).indexOf(name) >= 0;
    }

    static transformDatasetRowsToGridRows(
        datasetData: DSSDatasetData | string,
        datasetColumns: BsColDef[],
        isGroupRow: boolean,
        groupKeys?: string[]
    ): GridRow[] {
        let rows: GridRow[] = [];
        if (datasetData === "None" || typeof datasetData === "string")
            return rows;

        // Extracting data keys
        const firstColumnData = Object.values(datasetData)[0];
        const dataKeys = Object.keys(firstColumnData);

        for (let key of dataKeys) {
            let row: GridRow = {};
            datasetColumns.forEach((col: any) => {
                const isGroupHeaderCol = isGroupRow && GridTransformations.isGroupKey(col.field, groupKeys);
                if (isGroupHeaderCol || !isGroupRow) {
                    row[col.field!] = datasetData[col.field][key  as keyof DSSColumnData];

                } else {
                    row[col.field!] = null;
                }
                row[DSS_ROW_INDEX] = key;
            });
            rows.push(row);
        }
        return rows;
    }

    static createBsGridCol(
        col: { name: string; dataType: string },
        groupKeys?: string[]
    ): BsColDef {
        const cellDataType =
            MAP_DSS_COL_TYPE_TO_CELL_TYPE.get(col.dataType) ||
            MAP_DSS_COL_TYPE_TO_CELL_TYPE.get("default");
        const type = MAP_CELL_TYPE_TO_TYPE.get(cellDataType!) || [];
        const filter =
            MAP_TYPE_TO_FILTER.get(cellDataType!) ||
            MAP_TYPE_TO_FILTER.get("default");
        const isGroupKey = GridTransformations.isGroupKey(col.name, groupKeys);
        return {
            headerName: col.name,
            field: col.name,
            type,
            filter: filter,
            dataType: col.dataType,
            rowGroup: isGroupKey,
            hide: isGroupKey,
        };
    }
}
