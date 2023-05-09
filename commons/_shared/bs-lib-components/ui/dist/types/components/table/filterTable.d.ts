import { QTableColumn } from "quasar";
export declare function formatSearchVal(searchVal: string | number | null): string;
export declare function searchTableFilter(rows: readonly Record<string, any>[], { columns, searchVal }: {
    columns: Record<string, string>;
    searchVal: string;
}, cols: readonly QTableColumn[], cellValue: (col: QTableColumn, row: Record<string, any>) => any): readonly Record<string, any>[];
