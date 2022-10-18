import { GlobalComponentConstructor, QBtn, QBtnProps, QBtnSlots } from "quasar"
import { App } from "vue";


export const BsButton: QBtn;

declare module "@vue/runtime-core" {
    interface GlobalComponents {
        BsButton: GlobalComponentConstructor<QBtnProps,QBtnSlots>;
    }
}

declare module "./plugin" {
    interface BsComponents {
        BsButton?: QBtn,
    }
}

import { BsPluginOptions } from "./plugin"
export const QuasarBs: {
  install: (app: App, options: Partial<BsPluginOptions>) => any;
};
export default QuasarBs;
