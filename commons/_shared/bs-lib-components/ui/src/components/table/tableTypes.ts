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