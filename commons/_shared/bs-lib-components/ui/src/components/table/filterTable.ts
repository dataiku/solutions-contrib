import { QTableColumn } from "quasar";

function colIncludesValue(col: QTableColumn, row: Record<string, any>, lowerTerms: string, cellValue: (col: QTableColumn, row: Record<string, any>) => any) {
    {
        const val = cellValue(col, row) + ''
        const haystack = (val === 'undefined' || val === 'null') ? '' : val.toLowerCase()
        return haystack.includes(lowerTerms)
    }
}

export function filterTable(rows: readonly Record<string, any>[], {column, searchVal}: { column: string | null, searchVal: string | number | null }, cols: readonly QTableColumn[], cellValue: (col: QTableColumn, row: Record<string, any>) => any) {
    if (!searchVal) return rows;
    const lowerTerms = searchVal ? `${searchVal}`.toLowerCase() : '';
    if (column) {
        const col = cols.find(col => col.name === column);
        if (col) return rows.filter(row => colIncludesValue(col, row, lowerTerms, cellValue));
    }
    return rows.filter((row) => cols.some(col => colIncludesValue(col, row, lowerTerms, cellValue)))
}