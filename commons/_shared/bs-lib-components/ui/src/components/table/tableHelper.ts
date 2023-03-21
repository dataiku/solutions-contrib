export interface ServerSidePagination {
    batchSize: number;
    batchOffset: number;

    recordsCount: number | undefined;
}