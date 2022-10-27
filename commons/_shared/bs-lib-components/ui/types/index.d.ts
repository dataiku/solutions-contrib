import { ComponentConstructor, GlobalComponentConstructor, 
    QSelectProps, QSelectSlots,
    QBtnProps, QBtnSlots,
    QTooltipProps, QTooltipSlots,
    QSliderProps, QSliderSlots, QRangeProps, 
    QRangeSlots, QSpinnerProps, QSpinnerSlots, QTableProps, QTableSlots, QImgProps, QImgSlots, QIconProps, QIconSlots } from "quasar"
import { App, ComponentPublicInstance, VNode } from "vue";


// BsLayoutDefault Typing
export interface BsLayoutDefaultSlots {
    default: () => VNode[];
    head: () => VNode[];
    content: () => VNode[];
    leftpanel: () => VNode[];
}
export interface BsLayoutDefaultProps {
    LeftPanelTitle?: String;
}
export interface BsLayoutDefault extends ComponentPublicInstance<BsLayoutDefaultProps> {}
export const BsLayoutDefault: ComponentConstructor<BsLayoutDefault>

// BsSelect Typing
export interface BsSelectProps extends QSelectProps {
    bsLabel?: String;
    bsLabelId?: String;
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
export interface BsSlider extends ComponentPublicInstance<QSliderProps> {}
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





// RunTime typing for usage as a plugin
declare module "@vue/runtime-core" {
    interface GlobalComponents {
        BsLayoutDefault: GlobalComponentConstructor<BsLayoutDefaultProps,BsLayoutDefaultSlots>;
        BsSelect: GlobalComponentConstructor<BsSelectProps,QSelectSlots>;
        BsButton: GlobalComponentConstructor<QBtnProps,QBtnSlots>;
        BsTooltip: GlobalComponentConstructor<QTooltipProps,QTooltipSlots>;
        BsSlider: GlobalComponentConstructor<QSliderProps,QSliderSlots>;
        BsRange: GlobalComponentConstructor<QRangeProps,QRangeSlots>;
        BsSpinner: GlobalComponentConstructor<QSpinnerProps,QSpinnerSlots>;
        BsTable: GlobalComponentConstructor<QTableProps,QTableSlots>;
        BsImg: GlobalComponentConstructor<QImgProps,QImgSlots>;
        BsIcon: GlobalComponentConstructor<QIconProps,QIconSlots>;
        BsToggle: GlobalComponentConstructor<BsToggleProps,BsToggleSlots>;

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
    }
}

import { BsPluginOptions } from "./plugin"
export const QuasarBs: {
  install: (app: App, options: Partial<BsPluginOptions>) => any;
};
export default QuasarBs;
