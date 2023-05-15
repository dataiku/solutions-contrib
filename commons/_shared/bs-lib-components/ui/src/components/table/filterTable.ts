import { QTableColumn } from "quasar";

type filterFunc = (
    rows: readonly Record<string, any>[],
    {columns, searchVal}: { columns: Record<string, string>, searchVal: string | number | null },
    cols: readonly QTableColumn[],
    cellValue: (col: QTableColumn, row: Record<string, any>
) => any) => readonly Record<string, any>[];

function colIncludesValue(col: QTableColumn, row: Record<string, any>, lowerTerms: string, cellValue: (col: QTableColumn, row: Record<string, any>) => any) {
    {
        const val = cellValue(col, row) + ''
        const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase()
        return haystack.includes(lowerTerms)
    }
}

export function formatSearchVal(searchVal: string | number | null): string {
    return searchVal ? `${searchVal}`.toLowerCase() : '';
}


export function searchTableFilter(
    rows: readonly Record<string, any>[],
    {columns, searchVal}: { columns: Record<string, string>, searchVal: string },
    cols: readonly QTableColumn[],
    cellValue: (col: QTableColumn, row: Record<string, any>
) => any) {
    let filteredRows = rows;

    const colsToFilterNames = Object.keys(columns);
    if (colsToFilterNames.length) {
        const colsToFilter = cols.filter(col => colsToFilterNames.includes(col.name));
        filteredRows = filteredRows.filter(row => colsToFilter.every(col => {
            const colSearchVal = columns[col.name];
            return colIncludesValue(col, row, colSearchVal, cellValue);
        }))
    }

    if (searchVal) {
        filteredRows = filteredRows.filter((row) => cols.some(col => colIncludesValue(col, row, searchVal, cellValue)))
    }

    return filteredRows;
}