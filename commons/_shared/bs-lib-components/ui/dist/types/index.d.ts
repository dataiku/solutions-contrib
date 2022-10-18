import { QBtn } from "quasar"

export as namespace bs;

export const BsButton: QBtn;

declare module "@vue/runtime-core" {
    interface GlobalComponents {
        BsButton: QBtn;
    }
}