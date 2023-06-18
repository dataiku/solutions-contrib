
import { computed, ref, Ref } from 'vue';
import { QTableColumn } from 'quasar';
import ServerApi from "../../server_api";
import { PandasDataframe, FetchDatasetChunk, FetchChunk, FetchDatasetSchema, FetchDatasetGenericData,DSSColumnSchema, DSSDatasetGenericData, DSSDatasetSchema } from "../../backend_model"
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

function createBsTableColFromSchema(schema: DSSColumnSchema) {
    return createBsTableCol({ name: schema.name, dataType: schema.type });
}

function transformDataframeToQTableRow(dataframe: PandasDataframe | "None"): Record<string, any>[] | undefined {
    if (dataframe === "None") return;
    const entries = Object.entries(dataframe)
    if (!entries?.length) return;

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


export class DataframeFetcher {
    protected _fetchChunk: FetchChunk;
    protected fetchingChunk = ref(false);

    public fetching = computed(() => this.fetchingChunk.value);
    // public datasetName: Ref<string | undefined> = ref(undefined);

    constructor(options: {fetchChunk: FetchChunk}) {
        this._fetchChunk = options.fetchChunk;
    }

    public fetchChunk(
        ...args: Parameters<FetchChunk>
    ): Promise<{
        rows: Record<string, any>[] | undefined;
        columns?: BsTableCol[] | undefined;
    }> {
        const promise = this._fetchChunk(...args).then((res) => {
            const rows = transformDataframeToQTableRow(res);
            const columns = createQColsFromDataframe(res);
            return { rows, columns };
        });
        return PromiseWithPendingFlag(promise, this.fetchingChunk)
    }

    public fetchChunkRaw(
        ...args: Parameters<FetchChunk>
    ) {
        return PromiseWithPendingFlag(this._fetchChunk(...args), this.fetchingChunk)
    }
}

export class DatasetFetcher extends DataframeFetcher{
    
    private datasetName!: string;

    public setDataset(datasetName: string) {
        this.datasetName = datasetName;
    }

    private _fetchSchema?: () => ReturnType<FetchDatasetSchema> | ReturnType<FetchDatasetGenericData>;
    private fetchingSchema = ref(false);

    public override fetching = computed(() => this.fetchingChunk.value && this.fetchingSchema.value); 

    constructor(options: {datasetName: string, fetchChunk?: FetchDatasetChunk, fetchSchema?: FetchDatasetSchema | FetchDatasetGenericData, withoutSchema?: boolean}) {
        if (!options.fetchChunk) options.fetchChunk = (...args) => ServerApi.getDatasetChunk(...args);
        if (!options.fetchSchema) options.fetchSchema = (...args) => ServerApi.getDatasetGenericData(...args);
        super({fetchChunk: options.fetchChunk as unknown as FetchChunk});
        this.setDataset(options.datasetName);
        this._fetchChunk = (...args) => options.fetchChunk!(this.datasetName, ...args);
        if (!options.withoutSchema) {
            this._fetchSchema = () => options.fetchSchema!(this.datasetName);
        }
    }

    override fetchChunk(
        ...args: Parameters<FetchChunk>
    ) {
        if (!this._fetchSchema) {
            return super.fetchChunk(...args);
        }
        const promise = this._fetchChunk(...args).then((res) => {
            if (res) {
                const rows = transformDataframeToQTableRow(res);
                // const columns = createQColsFromDataframe(res);
                return { rows };
            } else {
                return { rows: undefined };
            }
        });
        return PromiseWithPendingFlag(promise, this.fetchingChunk)
    }

    public fetchSchema() {
        if (!this._fetchSchema) {
            console.error("withoutSchema option was supplied, you can't call DatasetFetcher.fetchSchema method");
            return [];
        }
        const promise = this._fetchSchema().then(res => {
            const isDatasetGenericData = res.hasOwnProperty("schema");
            let schemaCols = isDatasetGenericData ?
                (res as DSSDatasetGenericData).schema.columns :
                (res as DSSDatasetSchema).columns;
            let columnsCount = isDatasetGenericData ? (res as DSSDatasetGenericData).columnsCount : undefined;
            
            return {
                columns: schemaCols.map(createBsTableColFromSchema),
                columnsCount
            };
        })
        return PromiseWithPendingFlag(promise, this.fetchingChunk)
    }

    public fetchSchemaRaw() {
        if (!this._fetchSchema) {
            console.error("withoutSchema option was supplied, you can't call DatasetFetcher.fetchSchema method");
            return [];
        }
        const promise: Promise<DSSDatasetSchema | DSSDatasetGenericData> = this._fetchSchema();
        return PromiseWithPendingFlag(promise, this.fetchingChunk);
    }
}
