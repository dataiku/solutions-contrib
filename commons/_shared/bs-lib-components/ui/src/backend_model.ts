export interface DSSColumnSchema {
    name: string;
    type: string;
}

export interface DSSColumnData extends Record<`${number}`, any> {}

export interface DSSDatasetSchema {
    columns: DSSColumnSchema[];
    userModified: boolean;
}

export interface DSSDatasetData extends Record<string, DSSColumnData> {}