export default _sfc_main;
declare namespace _sfc_main {
    function data(): {
        QIcon: import("quasar").ComponentConstructor<QIcon>;
        QItem: import("quasar").ComponentConstructor<QItem>;
        QMenu: import("quasar").ComponentConstructor<QMenu>;
        QList: import("quasar").ComponentConstructor<QList>;
        QItemSection: import("quasar").ComponentConstructor<QItemSection>;
        ClosePopup: ClosePopup;
        mdiSortAscending: string;
        mdiSortDescending: string;
        mdiChevronDown: string;
        mdiMagnify: string;
        mdiFilterOutline: string;
        ascSort: null;
        descSort: null;
        noSort: string;
        filterActive: boolean;
    };
    function mounted(): void;
    function beforeUnmount(): void;
    namespace computed {
        function sortColIcon(): string;
        function sortText(): "descending" | "ascending";
    }
    namespace methods {
        function searchColumn(): void;
        function onSortChanged(): void;
        function onSortRequested(event: any): void;
        function onFilterChanged(): void;
    }
}
import { QIcon } from "quasar";
import { QItem } from "quasar";
import { QMenu } from "quasar";
import { QList } from "quasar";
import { QItemSection } from "quasar";
import { ClosePopup } from "quasar";
