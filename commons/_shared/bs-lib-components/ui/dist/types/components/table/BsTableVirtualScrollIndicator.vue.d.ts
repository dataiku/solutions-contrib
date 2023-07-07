import { PropType } from 'vue';
import { ServerSidePagination } from './tableHelper';
declare const _sfc_main: import("vue").DefineComponent<{
    fetchedRowsLength: NumberConstructor;
    serverSidePagination: PropType<ServerSidePagination>;
    scrollDetails: ObjectConstructor;
}, unknown, {
    progress: number;
    showProgressBar: boolean;
}, {}, {
    updateProgress(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    fetchedRowsLength: NumberConstructor;
    serverSidePagination: PropType<ServerSidePagination>;
    scrollDetails: ObjectConstructor;
}>>, {}>;
export default _sfc_main;
