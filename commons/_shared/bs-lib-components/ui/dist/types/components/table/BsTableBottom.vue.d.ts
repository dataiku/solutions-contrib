import { PropType } from 'vue';
import { ServerSidePagination } from './tableHelper';
import { QTableBottomScope, QTablePagination } from './tableTypes';
declare const _sfc_main: import("vue").DefineComponent<{
    scope: {
        type: PropType<QTableBottomScope>;
        required: true;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    searching: BooleanConstructor;
    virtualScroll: {
        type: BooleanConstructor;
        required: true;
    };
    fetchedRowsLength: NumberConstructor;
    startOfThePage: {
        type: FunctionConstructor;
        required: true;
    };
    qTableMiddle: PropType<HTMLElement>;
}, unknown, {
    recordsCount: number;
    mdiAlert: string;
}, {
    pagination(): QTablePagination;
    isFullDataset(): boolean;
    recordsTotal(): number | undefined;
}, {
    syncServerSidePagination(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    scope: {
        type: PropType<QTableBottomScope>;
        required: true;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    searching: BooleanConstructor;
    virtualScroll: {
        type: BooleanConstructor;
        required: true;
    };
    fetchedRowsLength: NumberConstructor;
    startOfThePage: {
        type: FunctionConstructor;
        required: true;
    };
    qTableMiddle: PropType<HTMLElement>;
}>>, {
    searching: boolean;
}>;
export default _sfc_main;
