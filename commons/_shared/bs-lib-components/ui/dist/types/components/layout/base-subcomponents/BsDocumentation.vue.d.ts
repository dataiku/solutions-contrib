import { PropType } from 'vue';
import { ImageDimensions, DocsProps } from "../bsLayoutTypes";
declare const _sfc_main: import("vue").DefineComponent<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    docIcon: {
        type: StringConstructor;
    };
    docTitle: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
}, unknown, {
    open: boolean;
    docHidden: boolean;
    docHide: boolean;
    defaultDocsPropValues: {
        docIcon: string;
        docTitle: string;
        docImageDimensions: {
            width: number;
            height: number;
        };
    };
}, {
    closed(): boolean;
    mDocsProps(): DocsProps;
    docsProps(): Partial<DocsProps>;
    tabDocsProps(): Partial<Partial<DocsProps>>;
    layoutDocsProps(): Partial<Partial<DocsProps>>;
    docContentStyleVariables(): {
        '--doc-content-hide-transition-duration': string;
    };
}, {
    toggleDoc(active?: boolean): void;
    clearObjectFromUndefined<T extends Object>(obj: T): Partial<T>;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    docIcon: {
        type: StringConstructor;
    };
    docTitle: {
        type: StringConstructor;
    };
    docImageDimensions: {
        type: PropType<ImageDimensions>;
    };
}>>, {
    modelValue: boolean;
}>;
export default _sfc_main;
