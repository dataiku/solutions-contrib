import { QTableColumn } from "quasar";
import BsTextHighlight from "./BsTextHighlight.vue"

export type QTableHeaderProps = {
    cols: any;
    colsMap: any;
    sort: (col: any) => void;
    selected: boolean;
    expand: boolean;
    color: string;
    dark: boolean;
    dense: boolean;
    __trClass: string;
    header: boolean;
}

export type QTablePagination = {
    /**
       * Column name (from column definition)
       */
    sortBy: string;
    /**
       * Is sorting in descending order?
       */
    descending: boolean;
    /**
       * Page number (1-based)
       */
    page: number;
    /**
       * How many rows per page? 0 means Infinite
       */
    rowsPerPage: number;
};

export type QTableBottomScope = {
    pagination: QTablePagination;
    pagesNumber: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    firstPage: () => void;
    prevPage: () => void;
    nextPage: () => void;
    lastPage: () => void;
    inFullscreen: boolean;
    toggleFullscreen: () => void;
}

export interface QTableBodyCellProps {
   col: QTableColumn;
   value: any;
   key: any;
   row: any;
   rowIndex: number;
   pageIndex: number;
   cols: QTableColumn[];
   colsMap: any;
   sort: (col: QTableColumn) => void;
   selected: boolean;
   expand: boolean;
   color: string;
   dark: boolean;
   dense: boolean;
}

export interface BsTableBodyCellProps extends QTableBodyCellProps {
   cellValueComponent: typeof BsTextHighlight,
   cellValueComponentProps: {
      queries: [string | undefined, string | undefined],
      text: string,
   }
}
