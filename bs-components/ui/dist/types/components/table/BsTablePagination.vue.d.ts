import { PropType } from 'vue';
import { QTablePagination, QTableBottomScope } from './tableTypes';
import { ServerSidePagination } from './tableHelper';
declare const _sfc_main: import("vue").DefineComponent<{
    scope: {
        type: PropType<QTableBottomScope>;
        required: true;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    startOfThePage: {
        type: FunctionConstructor;
        required: true;
    };
}, unknown, {
    batchSize: number;
    batchOffset: number;
    recordsCount: number;
}, {
    pagination(): QTablePagination;
    recordsShown(): string;
}, {
    syncServerSidePagination(): void;
    executeAndGoToTop(f: Function): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    scope: {
        type: PropType<QTableBottomScope>;
        required: true;
    };
    serverSidePagination: PropType<ServerSidePagination>;
    startOfThePage: {
        type: FunctionConstructor;
        required: true;
    };
}>>, {}>;
export default _sfc_main;
