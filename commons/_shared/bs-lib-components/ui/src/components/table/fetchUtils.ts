
import { computed, ref, Ref } from 'vue';
import { QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { PandasDataframe, FetchDatasetChunk, FetchDatasetSchema, FetchDatasetGenericData,DSSColumnSchema, DSSDatasetGenericData, DSSDatasetSchema, FetchDataframeChunk, QTableData } from "../../backend_model"
// import isEqual from 'lodash/isEqual';

interface BsTableCol extends QTableColumn {
    dataType?: string,
}

// const props = defineProps({
//     dssTableName: {
//         type: String,
//     },
//     serverSidePagination: Object as PropType<ServerSidePagination>,
// });

// const emit = defineEmits(["", "update:rows", "update:columns", "update:columns-count"]);



function PromiseWithPendingFlag<T>(promise: Promise<T>, flag: ((inProgress: boolean) => any) | Ref<boolean>) {
    const flagSet = typeof flag === "function" ? flag : (inProgress: boolean) => flag.value = inProgress;

    flagSet(true);
    return promise.finally(() => flagSet(false));
}



function createBsTableCol(options: Partial<BsTableCol>): BsTableCol {
    const name = options?.name || "default";
    return {
        name,
        label: name,
        field: name,
        sortable: true,
        align: "left",
        dataType: "string",
        ...options
    }
}

function createBsTableColFromName(name: string) {
    return createBsTableCol({ name })
}

function createBsTableColFromSchemaCol(schema: DSSColumnSchema) {
    return createBsTableCol({ name: schema.name, dataType: schema.type });
}

function extractBsTableColFromSchemaOrGenericData(res: DSSDatasetGenericData | DSSDatasetSchema) {
    const isDatasetGenericData = res.hasOwnProperty("schema");
    const schemaCols = isDatasetGenericData ?
        (res as DSSDatasetGenericData).schema.columns :
        (res as DSSDatasetSchema).columns;
    const columnsCount = isDatasetGenericData ? (res as DSSDatasetGenericData).columnsCount : undefined;
    
    return {
        columns: schemaCols.map(createBsTableColFromSchemaCol),
        columnsCount
    };
}

function transformDataframeToQTableRow(dataframe: PandasDataframe | "None"): Record<string, any>[] {
    if (dataframe === "None") return [];
    const entries = Object.entries(dataframe)
    if (!entries?.length) return [];

    const rowsAmount = Object.entries(entries[0][1]).length;
    const rows: any[] = Array(rowsAmount).fill(undefined).map(() => ({}));
    entries.forEach(([colName, colData]) => {
        const colValues = Object.values(colData);
        colValues.forEach((val: any, val_index: number) => {
            const row = rows[val_index];
            row[colName] = val;
        });
    });
    return rows;
}

function extractColsFromDataframe(dataframe: PandasDataframe) {
    return Object.keys(dataframe);
}

function createQColsFromDataframe(dataframe: PandasDataframe | "None") {
    if (dataframe === "None") return;
    const cols = extractColsFromDataframe(dataframe);
    return cols.map(createBsTableColFromName);
}



type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface DataframeData extends PartialBy<QTableData, "columns"> {};

type DataFormatter = ((dataframe: PandasDataframe) => DataframeData) | ((...args: any[]) => DataframeData);

function extractQTableDataFromDataframe(dataframe: PandasDataframe): DataframeData {
    const rows = transformDataframeToQTableRow(dataframe);
    const columns = createQColsFromDataframe(dataframe);
    return { rows, columns };
}

export class DataFetcher {
    protected _fetchData: (...args: any) => Promise<any>;
    protected dataFormatter?: (...args: any) => any;
    protected fetchingData = ref(false);

    public fetching = computed(() => this.fetchingData.value);

    constructor(options: {fetchData: (...args: any) => Promise<any>, dataFormatter?: DataFormatter }) {
        this._fetchData = options.fetchData;
        if (options.dataFormatter) {
            this.dataFormatter = options.dataFormatter;
        }
    }

    public fetchDataFormatted(
        ...args: Parameters<FetchDataframeChunk>
    ): Promise<{
        rows: Record<string, any>[] | undefined;
        columns?: BsTableCol[] | undefined;
    } | unknown> {
        let promise = this.fetchDataRaw(...args)
        if (this.dataFormatter) promise = promise.then(this.dataFormatter as any);
        return promise;
    }

    public fetchDataRaw(
        ...args: Parameters<FetchDataframeChunk>
    ) {
        return PromiseWithPendingFlag(this._fetchData(...args), this.fetchingData);
    }
}
type DataBatchFetcherType = "DATAFRAME" | "CUSTOM";
export class DataBatchFetcher extends DataFetcher {
    protected override _fetchData: (batchSize?: number, batchOffset?: number) => Promise<PandasDataframe>;
    protected override dataFormatter?: DataFormatter;
    constructor(options: {
        fetchData: DataBatchFetcher["_fetchData"],
        dataFormatter?: DataFormatter,
        type?: DataBatchFetcherType
    }) {
        if (options.type === "DATAFRAME" && !options.dataFormatter) {
            options.dataFormatter = extractQTableDataFromDataframe;
        }
        super(options)
        this._fetchData = options.fetchData;
        this.dataFormatter = options.dataFormatter;
    }
}

export class DatasetFetcher extends DataBatchFetcher {
    
    private datasetName!: string;

    public setDataset(datasetName: string) {
        this.datasetName = datasetName;
    }

    private _fetchSchema?: () => ReturnType<FetchDatasetSchema> | ReturnType<FetchDatasetGenericData>;
    private fetchingSchema = ref(false);
    private schemaFormatter;
    public override fetching = computed(() => this.fetchingData.value && this.fetchingSchema.value); 

    constructor(options: {
            datasetName: string,
            fetchData?: FetchDatasetChunk,
            fetchSchema?: FetchDatasetSchema | FetchDatasetGenericData,
            dataFormatter?: DataFormatter,
            schemaFormatter?: (value: DSSDatasetGenericData | DSSDatasetSchema) => {
                columns: BsTableCol[],
                columnsCount?: number | undefined,
            },
            withoutSchema?: boolean
        }) {
        if (!options.fetchData) options.fetchData = ServerApi.getDatasetChunk.bind(ServerApi);
        if (!options.fetchSchema) options.fetchSchema = ServerApi.getDatasetGenericData.bind(ServerApi);
        if (!(options.dataFormatter || options.withoutSchema)) {
            options.dataFormatter = (dataframe: PandasDataframe): DataframeData => ({rows: transformDataframeToQTableRow(dataframe)});
        }
        super(options as any);
        this.setDataset(options.datasetName);
        this._fetchData = ((...args: Parameters<FetchDataframeChunk>) => options.fetchData!(this.datasetName, ...args));

        if (!options.schemaFormatter) options.schemaFormatter = extractBsTableColFromSchemaOrGenericData;

        this.schemaFormatter = options.schemaFormatter;
        if (!options.withoutSchema) {
            this._fetchSchema = () => options.fetchSchema!(this.datasetName);
        }
    }
    public fetchSchemaFormatted() {
        const promise = this.fetchSchemaRaw();
        if (this.schemaFormatter) promise.then(this.schemaFormatter);
        return promise;
    }

    public fetchSchemaRaw() {
        if (!this._fetchSchema) {
            return Promise.reject("withoutSchema option was supplied, you can't call DatasetFetcher.fetchSchema method");
        }
        const promise: Promise<DSSDatasetSchema | DSSDatasetGenericData> = this._fetchSchema();
        return PromiseWithPendingFlag(promise, this.fetchingData);
    }
}
