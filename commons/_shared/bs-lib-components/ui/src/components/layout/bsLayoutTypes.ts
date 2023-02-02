import { ComponentPublicInstance } from 'vue';

type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & { [P in N]: T[K] };
export type InternalInstanceType<T extends ComponentPublicInstance> = Rename<T, "$props", "props">;

export interface Tab {
    name: string;
    icon: string;
    tabId: string;
    drawer: boolean;
    header: boolean;
}

export interface ImageDimensions {
    width: number;
    height: number;
}

export interface DocsProps {
    docTitle: string;
    docIcon: string;
    docImageDimensions: ImageDimensions;
}