export namespace useSizeDefaults {
    const xs: number;
    const sm: number;
    const md: number;
    const lg: number;
    const xl: number;
}
export function fontSize(size: any, sizes?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}): any;
export namespace useToggleProps {
    namespace size {
        export const type: StringConstructor;
        const _default: string;
        export { _default as default };
    }
    namespace modelValue {
        export const required: boolean;
        const _default_1: null;
        export { _default_1 as default };
    }
    const val: {};
    namespace trueValue {
        const _default_2: boolean;
        export { _default_2 as default };
    }
    namespace falseValue {
        const _default_3: boolean;
        export { _default_3 as default };
    }
    const labelLeft: StringConstructor;
    const labelRight: StringConstructor;
    namespace labelClass {
        const type_1: StringConstructor;
        export { type_1 as type };
        const _default_4: string;
        export { _default_4 as default };
    }
    namespace color {
        const type_2: StringConstructor;
        export { type_2 as type };
        const _default_5: string;
        export { _default_5 as default };
    }
    const disable: BooleanConstructor;
    const tabindex: (StringConstructor | NumberConstructor)[];
}
export const useToggleEmits: string[];
