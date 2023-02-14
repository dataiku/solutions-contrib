export interface DSSColumn {
    name: string;
    type: string;
}

export interface DSSDatasetSchema {
    columns: DSSColumn[];
    userModified: boolean;
}

export interface DSSDatasetData extends Record<string, Record<`${number}`, any>> {}