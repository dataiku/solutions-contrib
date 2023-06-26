import { PropType } from 'vue';
import { QTableHeaderProps } from "./tableTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
}, unknown, {
    sortedCol: string;
    sortedDesc: boolean;
}, {
    cols(): any[];
}, {
    activateSearchCol(colName: string): void;
    sort(col: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "search-col"[], "search-col", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    props: {
        type: PropType<QTableHeaderProps>;
        required: true;
    };
}>> & {
    "onSearch-col"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
