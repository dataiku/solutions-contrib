import { ComponentConstructor, GlobalComponentConstructor, 
    QSelectProps, QSelectSlots,
    QBtnProps, QBtnSlots,
    QTooltipProps, QTooltipSlots,
    QSliderProps, QSliderSlots, QRangeProps, 
    QRangeSlots, QSpinnerProps, QSpinnerSlots, QTableProps, 
    QTableSlots, QImgProps, QImgSlots, QIconProps, QIconSlots,
    QCheckboxProps, QCheckboxSlots, QDateProps
    } from "quasar"
import { App, ComponentPublicInstance, VNode } from "vue";


// BsLayoutDefault Typing
export interface BsLayoutDefaultSlots {
    default: () => VNode[];
    head: () => VNode[];
    content: () => VNode[];
    leftpanel: () => VNode[];
    documentation: () => VNode[];
}
export interface BsLayoutDefaultProps {
    leftpanel?: Boolean;
    header?: Boolean;
    docTitle?: String;
    docIcon?: String;
    doc?: Boolean;
    docImageDimensions?: { width: Number; height: Number};

}
export interface BsLayoutDefault extends ComponentPublicInstance<BsLayoutDefaultProps> {}
export const BsLayoutDefault: ComponentConstructor<BsLayoutDefault>

// BsSelect Typing
export interface BsSelectProps extends QSelectProps {
    bsLabel?: String;
    placeHolder?: String;
    filter?: Boolean;

}
export interface BsSelect extends ComponentPublicInstance<BsSelectProps> {}
export const BsSelect: ComponentConstructor<BsSelect>

// BsButton Typing
export interface BsButton extends ComponentPublicInstance<QBtnProps> {}
export const BsButton: ComponentConstructor<BsButton>

// Bs Tooltip
export interface BsTooltip extends ComponentPublicInstance<QTooltipProps> {}
export const BsTooltip : ComponentConstructor<BsTooltip>

// BsSlider
export interface BsSliderProps extends QSliderProps {
    sliderWidth?: Number;
}
export interface BsSlider extends ComponentPublicInstance<BsSliderProps> {}
export const BsSlider : ComponentConstructor<BsSlider>

// BsRange
export interface BsRange extends ComponentPublicInstance<QRangeProps> {}
export const BsRange : ComponentConstructor<BsRange>

// Bs Spinner
export interface BsSpinner extends ComponentPublicInstance<QSpinnerProps> {}
export const BsSpinner : ComponentConstructor<BsSpinner>

// Bs Table
export interface BsTable extends ComponentPublicInstance<QTableProps> {}
export const BsTable : ComponentConstructor<BsTable>

// Bs Image 
export interface BsImg extends ComponentPublicInstance<QImgProps> {}
export const BsImg : ComponentConstructor<BsImg>

// Bs Icon
export interface BsIcon extends ComponentPublicInstance<QIconProps> {}
export const BsIcon : ComponentConstructor<BsIcon>

// Bs Toggle
export interface BsToggleProps {
    size?: String;
    modelValue?: any;
    val?: any;
    trueValue?: Boolean | Number | String;
    falseValue?: Boolean | Number | String;
    labelLeft: String;
    labelRight?: String;
    labelClass?: String;
    color?: String;
    disable?: Boolean;
    tabIndex?: String | Number;
}
export interface BsToggleSlots {
    default: () => VNode[];
}
export interface BsToggle extends ComponentPublicInstance<BsToggleProps> {}
export const BsToggle: ComponentConstructor<BsToggle>

// Bs Checkbox
export interface BsCheckboxProps extends QCheckboxProps {
    hint?: String;
}
export interface BsCheckbox extends ComponentPublicInstance<BsCheckboxProps> {}
export const BsCheckbox: ComponentConstructor<BsCheckbox>

// Bs Date Range
export interface BsDateRangeProps extends QDateProps {
    bsLabel?: String;
}
export interface BsDateRange extends ComponentPublicInstance<BsDateRangeProps> {}
export const BsDateRange: ComponentConstructor<BsDateRange>
export interface BsDateRangeSlots {
    default: () => VNode[];
}



// RunTime typing for usage as a plugin
declare module "@vue/runtime-core" {
    interface GlobalComponents {
        BsLayoutDefault: GlobalComponentConstructor<BsLayoutDefaultProps,BsLayoutDefaultSlots>;
        BsSelect: GlobalComponentConstructor<BsSelectProps,QSelectSlots>;
        BsButton: GlobalComponentConstructor<QBtnProps,QBtnSlots>;
        BsTooltip: GlobalComponentConstructor<QTooltipProps,QTooltipSlots>;
        BsSlider: GlobalComponentConstructor<BsSliderProps,QSliderSlots>;
        BsRange: GlobalComponentConstructor<QRangeProps,QRangeSlots>;
        BsSpinner: GlobalComponentConstructor<QSpinnerProps,QSpinnerSlots>;
        BsTable: GlobalComponentConstructor<QTableProps,QTableSlots>;
        BsImg: GlobalComponentConstructor<QImgProps,QImgSlots>;
        BsIcon: GlobalComponentConstructor<QIconProps,QIconSlots>;
        BsToggle: GlobalComponentConstructor<BsToggleProps,BsToggleSlots>;
        BsCheckbox: GlobalComponentConstructor<BsCheckboxProps,QCheckboxSlots>;
        BsDateRange: GlobalComponentConstructor<BsDateRangeProps,BsDateRangeSlots>;

    }
}

declare module "./plugin" {
    interface BsComponents {
        BsLayoutDefault?: BsLayoutDefault;
        BsSelect?: BsSelect;
        BsButton?: BsButton;
        BsTooltip?: BsTooltip;
        BsSlider? : BsSlider;
        BsRange?: BsRange;
        BsSpinner?: BsSpinner;
        BsTable?: BsTable;
        BsImg?: BsImg;
        BsIcon?: BsIcon;
        BsToggle?: BsToggle;
        BsCheckbox?: BsCheckbox;
        BsDateRange?: BsDateRange;
    }
}

import { BsPluginOptions } from "./plugin"
export const QuasarBs: {
  install: (app: App, options: Partial<BsPluginOptions>) => any;
};
export default QuasarBs;
