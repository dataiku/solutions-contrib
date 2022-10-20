import { ComponentConstructor, GlobalComponentConstructor } from "quasar"
import { App, ComponentPublicInstance, VNode } from "vue";


export interface BSLayoutDefaultSlots {
    default: () => VNode[];
    head: () => VNode[];
    content: () => VNode[];
    leftpanel: () => VNode[];
}

export interface BSLayoutDefaultProps {
    LeftPanelTitle?: String;
}

export interface BSLayoutDefault extends ComponentPublicInstance<BSLayoutDefaultProps> {}

export const BSLayoutDefault: ComponentConstructor<BSLayoutDefault>


declare module "@vue/runtime-core" {
    interface GlobalComponents {
        BSLayoutDefault: GlobalComponentConstructor<BSLayoutDefaultProps,BSLayoutDefaultSlots>;
    }
}

declare module "./plugin" {
    interface BsComponents {
        BSLayoutDefault?: BSLayoutDefault,
    }
}

import { BsPluginOptions } from "./plugin"
export const QuasarBs: {
  install: (app: App, options: Partial<BsPluginOptions>) => any;
};
export default QuasarBs;
