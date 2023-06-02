import { PropType } from 'vue';
import { formatSearchVal } from './filterTable';
declare const _sfc_main: import("vue").DefineComponent<{
    modelValue: {
        type: PropType<string | number | null>;
        default: null;
    };
    valueSearchDebounce: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    formatInput: {
        type: BooleanConstructor;
        default: boolean;
    };
    formatInputMethod: {
        type: PropType<(inputValue: string | number | null) => string | number | null>;
        default: typeof formatSearchVal;
    };
}, unknown, {
    inputDebouncing: boolean;
    value: string | number | null;
    id: string;
}, {}, {
    setLoading(loading: boolean): void;
    updateSearchedValue(val: string | number | null): void;
    updateFormattedValue(val: string | number | null): void;
    updateValueDebounce(val: string | number | null): void;
    updateValueNoDebounce(val: string | number | null): void;
    syncModelValue(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:loading" | "update:model-value" | "update:formatted-value" | "update:no-debounce:formatted-value")[], "update:loading" | "update:model-value" | "update:formatted-value" | "update:no-debounce:formatted-value", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: PropType<string | number | null>;
        default: null;
    };
    valueSearchDebounce: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    formatInput: {
        type: BooleanConstructor;
        default: boolean;
    };
    formatInputMethod: {
        type: PropType<(inputValue: string | number | null) => string | number | null>;
        default: typeof formatSearchVal;
    };
}>> & {
    "onUpdate:loading"?: ((...args: any[]) => any) | undefined;
    "onUpdate:model-value"?: ((...args: any[]) => any) | undefined;
    "onUpdate:formatted-value"?: ((...args: any[]) => any) | undefined;
    "onUpdate:no-debounce:formatted-value"?: ((...args: any[]) => any) | undefined;
}, {
    modelValue: string | number | null;
    valueSearchDebounce: string | number;
    formatInput: boolean;
    formatInputMethod: (inputValue: string | number | null) => string | number | null;
}>;
export default _sfc_main;
