import { PropType } from 'vue';
import { ServerSidePagination } from './tableHelper';
declare const _sfc_main: import("vue").DefineComponent<{
    serverSidePagination: PropType<ServerSidePagination>;
}, unknown, {
    batchSize: number;
    batchOffset: number;
    recordsCount: number;
}, {
    sampleFrom(): number;
    sampleTo(): number;
    isFirstBatch(): boolean;
    isLastBatch(): boolean;
    lastBatchIndex(): number | undefined;
}, {
    prevBatch(): void;
    nextBatch(): void;
    changeCurrentBatchOffsetBy(changeBy: number): void;
    syncServerSidePagination(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:batch-offset"[], "update:batch-offset", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    serverSidePagination: PropType<ServerSidePagination>;
}>> & {
    "onUpdate:batch-offset"?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _sfc_main;
