var He = Object.defineProperty, We = Object.defineProperties;
var Ye = Object.getOwnPropertyDescriptors;
var ce = Object.getOwnPropertySymbols;
var qe = Object.prototype.hasOwnProperty, Ze = Object.prototype.propertyIsEnumerable;
var he = (e, t, s) => t in e ? He(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, B = (e, t) => {
  for (var s in t || (t = {}))
    qe.call(t, s) && he(e, s, t[s]);
  if (ce)
    for (var s of ce(t))
      Ze.call(t, s) && he(e, s, t[s]);
  return e;
}, E = (e, t) => We(e, Ye(t));
var pe = (e, t, s) => new Promise((o, n) => {
  var i = (u) => {
    try {
      l(s.next(u));
    } catch (c) {
      n(c);
    }
  }, a = (u) => {
    try {
      l(s.throw(u));
    } catch (c) {
      n(c);
    }
  }, l = (u) => u.done ? o(u.value) : Promise.resolve(u.value).then(i, a);
  l((s = s.apply(e, t)).next());
});
import Re from "axios";
import { defineComponent as f, computed as Te, openBlock as r, createBlock as p, Teleport as K, renderSlot as D, createCommentVNode as g, resolveComponent as d, withCtx as h, createVNode as m, normalizeStyle as z, normalizeClass as O, createElementVNode as b, createElementBlock as I, createTextVNode as De, toDisplayString as N, pushScopeId as U, popScopeId as H, mergeProps as j, withDirectives as L, vShow as R, Fragment as F, renderList as w, createSlots as P, normalizeProps as M, guardReactiveProps as v, resolveDirective as ye } from "vue";
import { QCard as Fe, QBtn as W, QIcon as Q, QDrawer as Ge, QHeader as Xe, QTab as Je, QTooltip as Ie, QTabs as xe, QPageContainer as Ke, QPage as et, QLayout as tt, QSelect as st, QSlider as ot, QRange as nt, QSpinner as at, QInput as $e, QTh as ne, QMenu as it, QItem as rt, QItemSection as lt, QList as dt, ClosePopup as ut, QTr as ae, QCheckbox as _e, QLinearProgress as ct, QTable as ht, QTd as pt, QImg as mt, QDate as gt, QPopupProxy as bt } from "quasar";
import { isEqual as ft, uniqueId as St, isUndefined as V, isNull as Tt, escape as Dt, isEmpty as Me } from "lodash";
import { mdiMagnify as ie, mdiArrowUpThin as yt, mdiSortAscending as me, mdiSortDescending as ge, mdiChevronDown as It, mdiAlert as $t, mdiTrashCanOutline as _t, mdiCloseCircleMultiple as Mt } from "@quasar/extras/mdi-v6";
function vt(e) {
  return e !== null && typeof e == "object" && Array.isArray(e) !== !0;
}
function Ct(e, t) {
  t.components !== void 0 && Object.values(t.components).forEach((s) => {
    vt(s) === !0 && s.name !== void 0 && e.component(s.name, s);
  });
}
function ee(e) {
  return new Promise((t, s) => {
    e.then((o) => t(o == null ? void 0 : o.data)).catch((o) => s(o));
  });
}
class Y {
  static initClient(t) {
    this._restApiEndpoint = t, this.client = Re.create({ baseURL: this._restApiEndpoint }), this.client.interceptors.response.use(
      (s) => s,
      (s) => {
        console.error(s), this.errors.push(s.response);
      }
    );
  }
  static requestWrapper(t) {
    const s = t.bind(this);
    return (...o) => new Promise((n, i) => {
      this.client || i("client not set, init servetApi with the backendUrl"), s(...o).then(n).catch(i);
    });
  }
  static init(t) {
    this.initialized || (this.initClient(t), this.doDelete = this.requestWrapper(this.doDelete), this.doPost = this.requestWrapper(this.doPost), this.doGet = this.requestWrapper(this.doGet), this.doPut = this.requestWrapper(this.doPut), this.initialized = !0);
  }
  static doPost(t, s) {
    return ee(this.client.post(t, s));
  }
  static doPut(t, s) {
    return ee(this.client.put(t, s));
  }
  static doGet(t) {
    return ee(this.client.get(t));
  }
  static doDelete(t) {
    return pe(this, null, function* () {
      return new Promise((s, o) => {
        this.client.delete(t).then((n) => s(!!n)).catch((n) => o(n));
      });
    });
  }
  static getDatasetChunk(t, s = 1e4, o = 0) {
    return this.doPost("bs_api/dataset/get", {
      dataset_name: t,
      chunksize: s,
      chunk_index: o
    });
  }
  static getDatasetSchema(t) {
    return this.doPost("bs_api/dataset/get_schema", {
      dataset_name: t
    });
  }
  static getFilteredDataset(t, s, o, n) {
    return this.doPost("bs_api/dataset/get_filtered_dataset", {
      dataset_name: t,
      chunksize: s,
      chunk_index: o,
      filters: n || {}
    });
  }
  static getDatasetGenericData(t) {
    return this.doPost("bs_api/dataset/get_generic_data", {
      dataset_name: t
    });
  }
}
Y.errors = [];
Y.initialized = !1;
const re = f({
  name: "ProvideMixin",
  methods: {
    providePrefixed(e, t) {
      const { prefix: s, getter: o } = B({
        prefix: "$",
        getter: (n) => this[n]
      }, t);
      return e.reduce((n, i) => {
        const a = s + i;
        return n[a] = o(i), n;
      }, {});
    },
    createComputedFromKey(e) {
      return Te(() => this[e]);
    },
    provideComputed(e, t) {
      const s = E(B({}, t), {
        getter: (o) => this.createComputedFromKey(o)
      });
      return this.providePrefixed(e, s);
    },
    provideStatic(e, t) {
      const s = E(B({}, t), {
        getter: (o) => this[o]
      });
      return this.providePrefixed(e, s);
    }
  }
}), le = f({
  name: "CheckSlotComponentsMixin",
  methods: {
    /**
     * Returns an array of the components under a certain slot.
     *
     * It filters the `$slot[slotName]()` by the `componentName`.
     *
     * @param {string} componentName - The name field of the component
     * @param {string} [slotName=\"default\"] - The name of the slot under which to look for the component
     * */
    getSlotComponents(e, t = "default") {
      return ((n) => this.$slots.hasOwnProperty(n) ? this.$slots[n]() : [])(t).filter((n) => {
        const i = n.type;
        return (i == null ? void 0 : i.name) && i.name === e;
      });
    }
  }
});
function wt(...e) {
  e.forEach(([t, s]) => {
    setTimeout(() => {
      t();
    }, s);
  });
}
function ve(e, t, s, o, n = 50) {
  wt(
    [e, n * +!s],
    [t, o * +s]
  );
}
const Ce = (e) => `bs-menu-tab-${e}`, we = (e) => `tab-content-id-${e}`, Nt = f({
  name: "BsTabPageChildWrapper",
  inject: ["$qPageMounted", "$tabId"],
  computed: {
    contentCSSSelector() {
      return `#${this.tabContentId}`;
    },
    tabContentId() {
      return we(this.tabId);
    },
    tabId() {
      return this == null ? void 0 : this.$tabId;
    },
    qPageMounted() {
      return this == null ? void 0 : this.$qPageMounted;
    }
  }
}), S = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [o, n] of t)
    s[o] = n;
  return s;
};
function Bt(e, t, s, o, n, i) {
  return e.qPageMounted ? (r(), p(K, {
    key: 0,
    to: e.contentCSSSelector
  }, [
    D(e.$slots, "default")
  ], 8, ["to"])) : g("", !0);
}
const de = /* @__PURE__ */ S(Nt, [["render", Bt]]), Pt = f({
  name: "BsContent",
  components: {
    BsTabPageChildWrapper: de
  }
});
function jt(e, t, s, o, n, i) {
  const a = d("BsTabPageChildWrapper");
  return r(), p(a, null, {
    default: h(() => [
      D(e.$slots, "default")
    ]),
    _: 3
  });
}
const te = /* @__PURE__ */ S(Pt, [["render", jt]]), Ot = f({
  name: "BsDocumentation",
  components: {
    QCard: Fe,
    QBtn: W,
    BsTabPageChildWrapper: de
  },
  data() {
    return {
      open: !1,
      docHidden: !0,
      docHide: !0,
      defaultDocsPropValues: {
        docIcon: "help",
        docTitle: "Documentation",
        docImageDimensions: {
          width: 36,
          height: 40
        }
      }
    };
  },
  props: {
    modelValue: {
      type: Boolean,
      default: !1
    },
    docIcon: {
      type: String
    },
    docTitle: {
      type: String
    },
    docImageDimensions: {
      type: Object
    }
  },
  inject: [
    // docs props
    "$tabDocsProps",
    "$layoutDocsProps"
  ],
  computed: {
    closed() {
      return !this.open;
    },
    mDocsProps() {
      return B(B(B(B({}, this.defaultDocsPropValues), this.layoutDocsProps), this.tabDocsProps), this.docsProps);
    },
    docsProps() {
      return this.clearObjectFromUndefined({
        docImageDimensions: this.docImageDimensions,
        docTitle: this.docTitle,
        docIcon: this.docIcon
      });
    },
    tabDocsProps() {
      const e = (this == null ? void 0 : this.$tabDocsProps) || {};
      return this.clearObjectFromUndefined(e);
    },
    layoutDocsProps() {
      const e = (this == null ? void 0 : this.$layoutDocsProps) || {};
      return this.clearObjectFromUndefined(e);
    },
    docContentStyleVariables() {
      return {
        "--doc-content-hide-transition-duration": ".345s"
      };
    }
  },
  methods: {
    toggleDoc(e) {
      e === void 0 && (e = !this.open), this.open = e, this.$emit("update:model-value", e);
    },
    clearObjectFromUndefined(e) {
      return Object.entries(e).reduce((s, [o, n]) => (n !== void 0 && (s[o] = n), s), {});
    }
  },
  watch: {
    modelValue() {
      this.open = this.modelValue;
    },
    open() {
      ve(
        () => this.docHide = this.closed,
        () => this.docHidden = this.closed,
        this.closed,
        500
      );
    }
  },
  mounted() {
    this.open = this.modelValue;
  }
}), Ne = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNjQ2IDAuNzAzNjEzQzAuNzM2ODU3IDAuNzAzNjEzIDAgMS40MTMxOCAwIDIuMjg4NjVWNy43ODUyNEMwIDguNjYwNzEgMC43MzY4NTcgOS4zNzAyOCAxLjY0NiA5LjM3MDI4SDQuMDkwNjVDNC4wMzExMSA5LjA1ODAyIDQgOC43MzYxNyA0IDguNDA3MzJIMy43NVYxLjY2NjU4SDEwLjM1NEMxMC43MTA5IDEuNjY2NTggMTEgMS45NDUwMSAxMSAyLjI4ODY1VjMuMzEwMzFDMTEuMzQ4NiAzLjQwNTI0IDExLjY4MzIgMy41MzI0NCAxMiAzLjY4ODM1VjIuMjg4NjVDMTIgMS40MTMxOCAxMS4yNjMxIDAuNzAzNjEzIDEwLjM1NCAwLjcwMzYxM0gxLjY0NlpNMi43NSAxLjY2NjU4VjguNDA3MzJIMS42NDZDMS4yODkxNCA4LjQwNzMyIDEgOC4xMjg4OCAxIDcuNzg1MjRWMi4yODg2NUMxIDEuOTQ1MDEgMS4yODkxNCAxLjY2NjU4IDEuNjQ2IDEuNjY2NThIMi43NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNDk5OSA3LjUxODVDOC45ODk5IDcuNTE4NSA4LjU3Njg5IDcuOTE2MjEgOC41NzY4OSA4LjQwNzMyQzguNTc2ODkgOC44OTg0MyA4Ljk4OTkgOS4yOTYxMyA5LjQ5OTkgOS4yOTYxM0MxMC4wMDk5IDkuMjk2MTMgMTAuNDIyOSA4Ljg5ODQzIDEwLjQyMjkgOC40MDczMkMxMC40MjI5IDcuOTE2MjEgMTAuMDA5OSA3LjUxODUgOS40OTk5IDcuNTE4NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNSAxMi43NDA2QzExLjk4NSAxMi43NDA2IDE0IDEwLjgwMDMgMTQgOC40MDczMkMxNCA2LjAxNDM1IDExLjk4NSA0LjA3Mzk4IDkuNSA0LjA3Mzk4QzcuMDE1IDQuMDczOTggNSA2LjAxNDM1IDUgOC40MDczMkM1IDEwLjgwMDMgNy4wMTUgMTIuNzQwNiA5LjUgMTIuNzQwNlpNOS41MDI5IDUuNTE4NDNDOS43Mjg5IDUuNTIxMzIgOS45NTM5IDUuNTQ2MzUgMTAuMTczOSA1LjU5MzU0QzEwLjI2OTkgNS42MTM3NiAxMC4zNDE5IDUuNjkxNzYgMTAuMzUyOSA1Ljc4NjEzTDEwLjQwNDkgNi4yMzg3MkMxMC40Mjg5IDYuNDQ2NzIgMTAuNjEwOSA2LjYwMzY5IDEwLjgyNzkgNi42MDM2OUMxMC44ODU5IDYuNjAzNjkgMTAuOTQzOSA2LjU5MjEzIDEwLjk5NzkgNi41NjkwMkwxMS40Mjg5IDYuMzg3MDJDMTEuNTE4OSA2LjM0OTQ3IDExLjYyMjkgNi4zNjk2OSAxMS42ODk5IDYuNDM5MDJDMTIuMDAwOSA2Ljc1OTY5IDEyLjIzMjkgNy4xNDM5MSAxMi4zNjc5IDcuNTYyOEMxMi4zOTY5IDcuNjUzMzIgMTIuMzYzOSA3Ljc1MTU0IDEyLjI4NDkgNy44MDczOUwxMS45MDI5IDguMDc4OTVDMTEuNzkzOSA4LjE1NTk4IDExLjcyOTkgOC4yNzgyOCAxMS43Mjk5IDguNDA4MjhDMTEuNzI5OSA4LjUzODI4IDExLjc5MzkgOC42NjA1OCAxMS45MDM5IDguNzM4NThMMTIuMjg1OSA5LjAxMDEzQzEyLjM2NDkgOS4wNjU5OCAxMi4zOTg5IDkuMTY0MjEgMTIuMzY5OSA5LjI1NDcyQzEyLjIzNDkgOS42NzM2MSAxMi4wMDI5IDEwLjA1NzggMTEuNjkxOSAxMC4zNzg1QzExLjYyNDkgMTAuNDQ2OSAxMS41MTk5IDEwLjQ2ODEgMTEuNDMwOSAxMC40MzA1TDEwLjk5NzkgMTAuMjQ3NUMxMC44NzM5IDEwLjE5NTUgMTAuNzMxOSAxMC4yMDMyIDEwLjYxNDkgMTAuMjY3OEMxMC40OTc5IDEwLjMzMzIgMTAuNDE5OSAxMC40NDc4IDEwLjQwNDkgMTAuNTc2OUwxMC4zNTI5IDExLjAyOTVDMTAuMzQxOSAxMS4xMjI5IDEwLjI3MTkgMTEuMTk5OSAxMC4xNzY5IDExLjIyMTFDOS43MzA5IDExLjMyMzIgOS4yNjY5IDExLjMyMzIgOC44MjA5IDExLjIyMTFDOC43MjU5IDExLjE5ODkgOC42NTU5IDExLjEyMjkgOC42NDQ5IDExLjAyOTVMOC41OTI5IDEwLjU3NzhDOC41Nzc5IDEwLjQ0ODggOC40OTk5IDEwLjMzNDIgOC4zODI5IDEwLjI2OTdDOC4yNjU5IDEwLjIwNTIgOC4xMjM5IDEwLjE5NzUgOC4wMDA5IDEwLjI0OTVMNy41Njc4OSAxMC40MzI0QzcuNDc3OSAxMC40NyA3LjM3MzkgMTAuNDQ5OCA3LjMwNjkgMTAuMzgwNEM2Ljk5NTkgMTAuMDU5OCA2Ljc2MzkgOS42NzU1NCA2LjYyODg5IDkuMjU1NjlDNi41OTk5IDkuMTY1MTcgNi42MzM5IDkuMDY2OTUgNi43MTI5IDkuMDExMDlMNy4wOTU4OSA4LjczOTU0QzcuMjA0OSA4LjY2MjUgNy4yNjg5IDguNTQwMjEgNy4yNjg5IDguNDEwMjFDNy4yNjg5IDguMjgwMjEgNy4yMDQ5IDguMTU3OTEgNy4wOTU4OSA4LjA3OTkxTDYuNzEzODkgNy44MDkzMkM2LjYzNDkgNy43NTM0NiA2LjYwMDkgNy42NTUyNCA2LjYyOTkgNy41NjQ3MkM2Ljc2NDkgNy4xNDU4MyA2Ljk5Njg5IDYuNzYxNjEgNy4zMDc4OSA2LjQ0MDk1QzcuMzc0OSA2LjM3MjU4IDcuNDc5OSA2LjM1MTM5IDcuNTY4OSA2LjM4ODk1TDcuOTk5OSA2LjU3MDk1QzguMTIzOSA2LjYyMjk1IDguMjY1ODkgNi42MTUyNCA4LjM4Mzg5IDYuNTQ5NzZDOC41MDA5IDYuNDg0MjggOC41Nzg5IDYuMzY5NjkgOC41OTM4OSA2LjIzOTY5TDguNjQ1OSA1Ljc4ODA2QzguNjU2OSA1LjY5MzY5IDguNzI4OSA1LjYxNjY1IDguODI0OSA1LjU5NTQ2QzkuMDQ1OSA1LjU0ODI4IDkuMjcwOSA1LjUyMzI0IDkuNTAxOSA1LjUyMDM1TDkuNTAyOSA1LjUxODQzWiIgZmlsbD0iIzAxQjJBQSIvPgo8L3N2Zz4K";
const Be = (e) => (U("data-v-47db9d18"), e = e(), H(), e), At = /* @__PURE__ */ Be(() => /* @__PURE__ */ b("div", { class: "row items-center q-gutter-sm no-wrap" }, [
  /* @__PURE__ */ b("img", {
    src: Ne,
    width: "15",
    height: "16"
  }),
  /* @__PURE__ */ b("span", { class: "btn-solution-text" }, "Dataiku Solutions")
], -1)), kt = { class: "flex row items-center q-gutter-sm q-mb-lg" }, zt = ["src", "width", "height"], Lt = { class: "dku-large-title-sb" }, Vt = { class: "doc-body" }, Qt = /* @__PURE__ */ Be(() => /* @__PURE__ */ b("div", { class: "doc-footer flex row items-center" }, [
  /* @__PURE__ */ b("span", { class: "doc-footer__icon" }, [
    /* @__PURE__ */ b("img", {
      src: Ne,
      width: "14",
      height: "12.5"
    })
  ]),
  /* @__PURE__ */ b("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
], -1));
function Et(e, t, s, o, n, i) {
  const a = d("QBtn"), l = d("QCard"), u = d("BsTabPageChildWrapper");
  return r(), p(u, null, {
    default: h(() => [
      m(a, {
        unelevated: "",
        outline: "",
        "no-caps": "",
        "no-wrap": "",
        class: "btn-solution absolute",
        square: "",
        onClick: t[0] || (t[0] = (c) => e.toggleDoc())
      }, {
        default: h(() => [
          At
        ]),
        _: 1
      }),
      m(l, {
        style: z(e.docContentStyleVariables),
        class: O([
          "doc-content",
          "flex",
          "row",
          e.docHide && "doc-hide",
          e.docHidden && "doc-hidden"
        ])
      }, {
        default: h(() => [
          b("div", kt, [
            e.mDocsProps.docIcon ? (r(), I("img", {
              key: 0,
              src: e.mDocsProps.docIcon,
              width: e.mDocsProps.docImageDimensions.width,
              height: e.mDocsProps.docImageDimensions.height
            }, null, 8, zt)) : g("", !0),
            b("span", Lt, [
              e.$slots.title ? D(e.$slots, "title", { key: 0 }, void 0, !0) : g("", !0),
              De(" " + N(e.$slots.title ? "" : e.mDocsProps.docTitle), 1)
            ])
          ]),
          b("div", Vt, [
            D(e.$slots, "default", {}, void 0, !0)
          ]),
          Qt
        ]),
        _: 3
      }, 8, ["style", "class"])
    ]),
    _: 3
  });
}
const se = /* @__PURE__ */ S(Ot, [["render", Et], ["__scopeId", "data-v-47db9d18"]]), G = f({
  inject: ["$isTabSelected", "$qLayoutMounted"],
  computed: {
    showComponent() {
      const e = this == null ? void 0 : this.$isTabSelected;
      return e === void 0 || e;
    },
    qLayoutMounted() {
      return this.$qLayoutMounted;
    }
  }
}), Ut = f({
  name: "BsTabTitle",
  extends: G,
  inject: ["$tabName", "$defaultTabUsed"],
  emits: ["calculated"],
  props: {
    calculateWidth: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      tabTitleWidth: "0px"
    };
  },
  computed: {
    tabName() {
      return this.$tabName;
    },
    defaultDrawer() {
      return this.$defaultDrawer;
    },
    defaultTabUsed() {
      return this.$defaultTabUsed;
    },
    tabTitleWidthSet() {
      return !this.widthNotSet(this.tabTitleWidth);
    }
  },
  methods: {
    calculateTabTitleWidth() {
      const { width: e } = this.$el ? getComputedStyle(this.$el) : { width: "0px" };
      this.widthNotSet(e) || (this.tabTitleWidth = e, this.$emit("calculated", e));
    },
    widthNotSet(e) {
      return ["0px", "auto"].includes(e);
    },
    calculateWidthIfNeeded() {
      !this.calculateWidth || !this.showComponent || this.tabTitleWidthSet || this.$nextTick(() => this.calculateTabTitleWidth());
    }
  },
  watch: {
    showComponent() {
      this.calculateWidthIfNeeded();
    },
    calculateWidth() {
      this.calculateWidthIfNeeded();
    }
  }
});
function Ht(e, t, s, o, n, i) {
  return e.defaultTabUsed ? g("", !0) : (r(), I("div", j({ key: 0 }, e.$attrs, { class: "text-primary bs-tab-title dku-medium-title-sb q-px-md" }), N(e.tabName), 17));
}
const ue = /* @__PURE__ */ S(Ut, [["render", Ht], ["__scopeId", "data-v-9ace8c82"]]), Wt = f({
  name: "BsDrawer",
  extends: G,
  components: {
    BsTabTitle: ue
  }
});
const Yt = { class: "bs-drawer-container" };
function qt(e, t, s, o, n, i) {
  const a = d("BsTabTitle");
  return e.qLayoutMounted ? (r(), p(K, {
    key: 0,
    to: ".q-drawer"
  }, [
    L(b("div", Yt, [
      m(a),
      D(e.$slots, "default", {}, void 0, !0)
    ], 512), [
      [R, e.showComponent]
    ])
  ])) : g("", !0);
}
const q = /* @__PURE__ */ S(Wt, [["render", qt], ["__scopeId", "data-v-ef244777"]]), Zt = f({
  name: "BsHeader",
  components: {
    BsTabTitle: ue
  },
  extends: G,
  inject: ["$defaultTabUsed", "$drawerOpen"],
  data() {
    return {
      headerTabTitleWidth: "0px",
      wrapperTransitions: !1,
      calculateHeaderTabTitleWidth: !1
    };
  },
  computed: {
    appendTabTitleToHeader() {
      return !this.defaultTabUsed;
    },
    defaultTabUsed() {
      return this.$defaultTabUsed;
    },
    drawerOpen() {
      return this.$drawerOpen;
    },
    tabHeaderStyles() {
      return {
        "--header-tab-title-width": this.headerTabTitleWidth
      };
    },
    headerTabTitleWidthExists() {
      return !this.widthNonExistant(this.headerTabTitleWidth);
    }
  },
  methods: {
    widthUpdated() {
      this.toggleTransitions();
    },
    toggleTransitions() {
      setTimeout(() => {
        this.wrapperTransitions = !0;
      }, 0);
    },
    widthNonExistant(e) {
      return ["0px", "auto"].includes(e);
    },
    updateHeaderTabTitleWidth(e) {
      this.headerTabTitleWidth = e, this.widthUpdated();
    }
  }
});
function Rt(e, t, s, o, n, i) {
  const a = d("BsTabTitle");
  return e.qLayoutMounted ? (r(), p(K, {
    key: 0,
    to: ".bs-header"
  }, [
    L(b("div", {
      onVnodeMounted: t[0] || (t[0] = (l) => e.calculateHeaderTabTitleWidth = !0),
      style: z(e.tabHeaderStyles),
      class: O([
        "bs-header-wrapper",
        e.wrapperTransitions && "bs-header-wrapper--transition",
        e.showComponent && e.drawerOpen && e.headerTabTitleWidthExists && "bs-header-wrapper--hide-tab-name"
      ])
    }, [
      L(m(a, {
        ref: "headerTabTitle",
        "calculate-width": e.calculateHeaderTabTitleWidth,
        onCalculated: e.updateHeaderTabTitleWidth
      }, null, 8, ["calculate-width", "onCalculated"]), [
        [R, e.appendTabTitleToHeader]
      ]),
      D(e.$slots, "default", {}, void 0, !0)
    ], 6), [
      [R, e.showComponent]
    ])
  ])) : g("", !0);
}
const Z = /* @__PURE__ */ S(Zt, [["render", Rt], ["__scopeId", "data-v-f4a44855"]]), Ft = f({
  name: "BsTabIcon",
  inject: ["$menuTabsMounted", "$tabId"],
  components: {
    QIcon: Q
  },
  props: {
    name: String
  },
  computed: {
    iconName() {
      return this.name === void 0 ? this.$slots.default ? void 0 : "tab" : this.name;
    },
    menuTabsMounted() {
      return this.$menuTabsMounted;
    },
    tabId() {
      return this == null ? void 0 : this.$tabId;
    },
    bsMenuTabId() {
      return Ce(this.tabId);
    },
    bsMenuTabCSSSelector() {
      return `#${this.bsMenuTabId}`;
    }
  }
});
function Gt(e, t, s, o, n, i) {
  const a = d("q-icon");
  return e.menuTabsMounted ? (r(), p(K, {
    key: 0,
    to: e.bsMenuTabCSSSelector
  }, [
    e.iconName ? (r(), p(a, j({ key: 0 }, e.$attrs, { name: e.iconName }), null, 16, ["name"])) : g("", !0),
    D(e.$slots, "default")
  ], 8, ["to"])) : g("", !0);
}
const J = /* @__PURE__ */ S(Ft, [["render", Gt]]), Xt = f({
  name: "BsDrawerBtn",
  extends: G,
  props: {
    modelValue: {
      type: Boolean,
      required: !0
    },
    show: {
      type: Boolean,
      default: !0
    }
  },
  data() {
    return {
      hide: !1,
      hidden: !1,
      hideTransitionDuration: 200
    };
  },
  watch: {
    show() {
      this.toggleShown(this.show);
    }
  },
  methods: {
    toggleLeftPanel() {
      this.$emit("update:modelValue", !this.modelValue);
    },
    toggleShown(e) {
      const t = !e;
      ve(
        () => this.hide = t,
        () => this.hidden = t,
        t,
        this.hideTransitionDuration
      );
    }
  }
}), Jt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTYgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDRDMTAuNjI3NCAwIDE2IDUuMzcyNTggMTYgMTJWODhDMTYgOTQuNjI3NCAxMC42Mjc0IDEwMCA0IDEwMEgwVjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjUiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjkiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMV8xNjY4IiB4PSI1IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMV8xNjY4IiB4PSI5IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=";
const xt = (e) => (U("data-v-9969ac6c"), e = e(), H(), e), Kt = /* @__PURE__ */ xt(() => /* @__PURE__ */ b("img", { src: Jt }, null, -1)), es = [
  Kt
];
function ts(e, t, s, o, n, i) {
  return L((r(), I("div", {
    onClick: t[0] || (t[0] = (...a) => e.toggleLeftPanel && e.toggleLeftPanel(...a)),
    class: O([e.hide && "hide", e.hidden && "hidden", "toggle-left-button"]),
    style: z({
      "--hide-transition-duration": `.${e.hideTransitionDuration}s`
    })
  }, es, 6)), [
    [R, e.showComponent]
  ]);
}
const Pe = /* @__PURE__ */ S(Xt, [["render", ts], ["__scopeId", "data-v-9969ac6c"]]), ss = f({
  name: "BsLayoutDrawer",
  components: {
    QDrawer: Ge,
    BsDrawerBtn: Pe
  },
  props: {
    collapsedWidth: {
      type: Number,
      default: 50
    },
    panelWidth: {
      type: Number,
      default: 300
    },
    mini: {
      type: Boolean,
      default: !1
    },
    expandable: {
      type: Boolean,
      default: !0
    },
    modelValue: Boolean
  },
  data() {
    return {
      expand: !0
    };
  },
  computed: {
    collapsed() {
      return !this.displayExpanded;
    },
    displayExpanded() {
      return this.expand && this.expandable;
    },
    expandedWidth() {
      return +this.mini * this.collapsedWidth + this.panelWidth;
    },
    miniDrawerProps() {
      return {
        mini: this.collapsed,
        modelValue: !0
      };
    },
    defaultDrawerProps() {
      return {
        modelValue: this.displayExpanded
      };
    },
    drawerProps() {
      return this.mini ? this.miniDrawerProps : this.defaultDrawerProps;
    }
  },
  watch: {
    modelValue() {
      this.expand = this.modelValue;
    }
  },
  methods: {
    toggleDrawer(e) {
      this.expand = e, this.$emit("update:model-value", e);
    }
  },
  mounted() {
    this.modelValue !== void 0 && (this.expand = !0);
  }
});
function os(e, t, s, o, n, i) {
  const a = d("BsDrawerBtn"), l = d("QDrawer");
  return r(), p(l, j(e.drawerProps, {
    "mini-width": e.collapsedWidth,
    width: e.expandedWidth,
    side: "left",
    behavior: "desktop",
    bordered: ""
  }), {
    default: h(() => [
      m(a, {
        "model-value": e.expand,
        "onUpdate:modelValue": e.toggleDrawer,
        show: e.expandable
      }, null, 8, ["model-value", "onUpdate:modelValue", "show"])
    ]),
    _: 1
  }, 16, ["mini-width", "width"]);
}
const je = /* @__PURE__ */ S(ss, [["render", os], ["__scopeId", "data-v-8f8c14f8"]]), ns = f({
  name: "BsLayoutHeader",
  components: {
    QHeader: Xe
  }
});
function as(e, t, s, o, n, i) {
  const a = d("QHeader");
  return r(), p(a, {
    bordered: "",
    class: "bg-white bs-header"
  });
}
const Oe = /* @__PURE__ */ S(ns, [["render", as], ["__scopeId", "data-v-9ba496fa"]]), is = f({
  name: "BsMenuTab",
  components: {
    QTab: Je,
    QTooltip: Ie
  },
  props: {
    name: {
      type: String
    },
    icon: {
      type: String
    },
    tabIndex: {
      type: Number
    },
    tabId: {
      type: String
    }
  },
  methods: {
    getBsMenuTabId(e) {
      return e = e || `${this.tabIndex}` || "", Ce(e);
    }
  }
});
const rs = { class: "tab-name-tooltip" }, ls = ["id"];
function ds(e, t, s, o, n, i) {
  const a = d("QTooltip"), l = d("QTab");
  return r(), p(l, {
    name: e.tabIndex,
    icon: e.icon,
    ripple: !1
  }, {
    default: h(() => [
      m(a, {
        offset: [9, 10],
        anchor: "center right",
        self: "center left",
        "transition-show": "jump-right",
        "transition-hide": "jump-left"
      }, {
        default: h(() => [
          b("span", rs, N(e.name), 1)
        ]),
        _: 1
      }),
      e.tabId ? (r(), I("span", {
        key: 0,
        id: e.getBsMenuTabId(e.tabId)
      }, null, 8, ls)) : g("", !0)
    ]),
    _: 1
  }, 8, ["name", "icon"]);
}
const Ae = /* @__PURE__ */ S(is, [["render", ds], ["__scopeId", "data-v-61b2252d"]]), us = f({
  name: "BsMenuTabs",
  components: {
    QTabs: xe
  },
  props: {
    modelValue: [Number, String]
  },
  data() {
    return {
      leftPanelFull: !0
    };
  },
  methods: {
    emitUpdatedValue(e) {
      this.$emit("update:model-value", e);
    }
  }
});
const cs = { class: "tabs-container" };
function hs(e, t, s, o, n, i) {
  const a = d("q-tabs");
  return r(), I("div", cs, [
    m(a, {
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[0] || (t[0] = (l) => e.$emit("update:model-value", l)),
      vertical: "",
      "active-color": "primary",
      "indicator-color": "primary",
      "active-bg-color": "white"
    }, {
      default: h(() => [
        D(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["model-value"])
  ]);
}
const ke = /* @__PURE__ */ S(us, [["render", hs], ["__scopeId", "data-v-0b4a6261"]]);
class ze {
  constructor() {
    this.seen = {}, this.seen = {};
  }
  serialize(t) {
    return t.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(t, s) {
    let o = t, n = 0;
    if (this.seen.hasOwnProperty(o)) {
      n = this.seen[t];
      do
        n++, o = t + "-" + n;
      while (this.seen.hasOwnProperty(o));
    }
    return s || (this.seen[t] = n, this.seen[o] = 0), o;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
  */
  slug(t, s = {}) {
    const o = { dryrun: !!s.dryrun }, n = this.serialize(t);
    return this.getNextSafeSlug(n, o.dryrun);
  }
}
const x = class {
  constructor(e = "default") {
    typeof e != "string" && (console.error("instanceKey param should be of type string! Using default instance."), e = "default"), x.instances.hasOwnProperty(e) || (x.instances[e] = new ze()), this.instance = x.instances[e];
  }
  slug(e, t = {}) {
    return this.instance.slug(e, t);
  }
};
let Le = x;
Le.instances = {};
const ps = new Le("tabs"), ms = f({
  name: "BsTab",
  mixins: [le, re],
  components: {
    BsDrawer: q,
    BsHeader: Z,
    BsDocumentation: se,
    BsContent: te,
    BsTabIcon: J,
    QPageContainer: Ke,
    QPage: et
  },
  data() {
    return {
      index: 0,
      tabId: ps.slug(this.name),
      isActive: !1,
      openDoc: !1,
      qPageMounted: !1
    };
  },
  inject: ["$tabs", "$selectedTab", "$defaultTabUsed", "$defaultDrawer", "$defaultHeader"],
  provide() {
    return this.provideComputed([
      "isTabSelected",
      "tabName",
      // documention
      "tabDocsProps",
      "tabId",
      "qPageMounted"
    ]);
  },
  props: {
    name: {
      type: String,
      default: "tab-name-not-set"
    },
    icon: {
      type: String
    },
    docTitle: {
      type: String
    },
    docIcon: {
      type: String
    },
    docImageDimensions: {
      type: Object
    }
  },
  computed: {
    tabContentId() {
      return we(this.tabId);
    },
    tabName() {
      return this.name;
    },
    tabDocsProps() {
      return {
        docImageDimensions: this.docImageDimensions,
        docTitle: this.docTitle,
        docIcon: this.docIcon
      };
    },
    isTabSelected() {
      var e;
      return ((e = this.selectedTab) == null ? void 0 : e.tabId) === this.tabId;
    },
    selectedTab() {
      return this.$selectedTab;
    },
    defaultDrawer() {
      return this.$defaultDrawer;
    },
    defaultHeader() {
      return this.$defaultHeader;
    },
    defaultTabUsed() {
      return this.$defaultTabUsed;
    },
    tabs() {
      return this.$tabs;
    },
    tab() {
      const { tabId: e, drawer: t, header: s, name: o } = this;
      return {
        tabId: e,
        drawer: t,
        header: s,
        name: o,
        icon: Te(() => this.tabIcon)
      };
    },
    header() {
      return this.usingComponent(Z) || this.usingSlotHeader || this.defaultHeader;
    },
    drawer() {
      return this.usingComponent(q) || this.usingSlotDrawer || this.defaultDrawer;
    },
    tabIcon() {
      return this.usingComponent(J) || this.usingSlotTabIcon ? void 0 : this.icon;
    },
    usingSlotHeader() {
      return this.usingSlot(Z, "header", "head");
    },
    usingSlotDrawer() {
      return this.usingSlot(q, "leftpanel", "drawer");
    },
    usingSlotDocumentation() {
      return this.usingSlot(se, "documentation");
    },
    usingSlotContent() {
      return this.usingSlot(te, "content");
    },
    usingSlotTabIcon() {
      return this.usingSlot(J, "tabicon");
    },
    appendTabTitleToHeader() {
      return !this.defaultTabUsed;
    },
    slotsKeys() {
      return Object.keys(this.$slots);
    }
  },
  methods: {
    registerTab() {
      this.tabs.push(this.tab);
    },
    unregisterTab() {
      const e = this.tabs.indexOf(this.tab);
      e !== -1 && this.tabs.splice(e, 1);
    },
    onQPageMounted() {
      this.qPageMounted = !0, this.$emit("mounted:q-page");
    },
    usingComponent(e) {
      return !!this.getSlotComponents(e.name || "").length;
    },
    usingSlot(e, ...t) {
      return this.usingComponent(e) ? !1 : t.reduce((o, n) => o && this.slotsKeys.includes(n), !0);
    }
  },
  emits: ["mounted:q-page"],
  mounted() {
    this.registerTab();
  },
  unmounted() {
    this.unregisterTab();
  }
});
const gs = ["id"];
function bs(e, t, s, o, n, i) {
  const a = d("BsHeader"), l = d("BsDrawer"), u = d("BsDocumentation"), c = d("BsTabIcon"), T = d("BsContent"), _ = d("QPage"), $ = d("QPageContainer");
  return r(), I(F, null, [
    e.usingSlotHeader || !(e.header || e.defaultTabUsed) ? (r(), p(a, { key: 0 }, {
      default: h(() => [
        e.$slots.header ? g("", !0) : D(e.$slots, "head", { key: 0 }, void 0, !0),
        D(e.$slots, "header", {}, void 0, !0)
      ]),
      _: 3
    })) : g("", !0),
    e.usingSlotDrawer ? (r(), p(l, { key: 1 }, {
      default: h(() => [
        e.$slots.drawer ? g("", !0) : D(e.$slots, "leftpanel", { key: 0 }, void 0, !0),
        D(e.$slots, "drawer", {}, void 0, !0)
      ]),
      _: 3
    })) : g("", !0),
    e.usingSlotDocumentation ? (r(), p(u, {
      key: 2,
      modelValue: e.openDoc,
      "onUpdate:modelValue": t[0] || (t[0] = (C) => e.openDoc = C)
    }, {
      default: h(() => [
        D(e.$slots, "documentation", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue"])) : g("", !0),
    !e.defaultTabUsed && e.usingSlotTabIcon ? (r(), p(c, { key: 3 }, {
      default: h(() => [
        D(e.$slots, "tabicon", {}, void 0, !0)
      ]),
      _: 3
    })) : g("", !0),
    L(m($, null, {
      default: h(() => [
        m(_, { onVnodeMounted: e.onQPageMounted }, {
          default: h(() => [
            b("div", {
              class: "content",
              id: e.tabContentId
            }, [
              e.usingSlotContent ? (r(), p(T, { key: 0 }, {
                default: h(() => [
                  D(e.$slots, "content", {}, void 0, !0)
                ]),
                _: 3
              })) : g("", !0)
            ], 8, gs)
          ]),
          _: 3
        }, 8, ["onVnodeMounted"])
      ]),
      _: 3
    }, 512), [
      [R, e.isTabSelected]
    ]),
    D(e.$slots, "default", {}, void 0, !0)
  ], 64);
}
const Ve = /* @__PURE__ */ S(ms, [["render", bs], ["__scopeId", "data-v-694ef9e9"]]), fs = new ze(), Ss = f({
  name: "BsLayoutDefault",
  mixins: [re, le],
  components: {
    BsTab: Ve,
    BsMenuTab: Ae,
    BsMenuTabs: ke,
    BsLayoutDrawer: je,
    BsLayoutHeader: Oe,
    QLayout: tt
  },
  props: {
    docTitle: {
      type: String
    },
    docIcon: {
      type: String
    },
    docImageDimensions: {
      type: Object
    },
    tabMenuWidth: {
      type: Number,
      default: 50
    },
    leftPanelWidth: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      tabIndex: 0,
      tabs: [],
      mounted: !1,
      headerMounted: !1,
      drawerMounted: !1,
      qPageMounted: !1,
      menuTabsMounted: !1,
      drawerOpen: !0,
      tabSlotNames: [
        "header",
        "head",
        "leftpanel",
        "drawer",
        "documentation",
        "content"
      ],
      defaultLayoutTabName: "Layout Default",
      defaultTabUsed: !0
    };
  },
  provide() {
    let e = this.provideComputed([
      "tabs",
      "selectedTab",
      "qLayoutMounted",
      "menuTabsMounted",
      "layoutDocsProps",
      "defaultTabUsed",
      "drawerOpen"
    ]);
    if (this.defaultTabUsed) {
      const s = this.provideComputed([
        "tabContentId",
        "qPageMounted",
        "defaultDrawer",
        "defaultHeader"
      ]);
      e = B(B({}, e), s);
    }
    return e;
  },
  methods: {
    getTabIndex(e) {
      return this.tabs.findIndex(({ tabId: t }) => e === t);
    }
  },
  computed: {
    tabContentId() {
      return `tab-content-id-${fs.slug(this.defaultLayoutTabName)}`;
    },
    activeTabSlots() {
      return Object.keys(this.$slots).filter((e) => this.tabSlotNames.includes(e));
    },
    selectedTab() {
      return this.tabs[this.tabIndex];
    },
    selectedTabDrawer() {
      var e;
      return (e = this.selectedTab) == null ? void 0 : e.drawer;
    },
    layoutDocsProps() {
      const { docTitle: e, docIcon: t, docImageDimensions: s } = this;
      return { docTitle: e, docIcon: t, docImageDimensions: s };
    },
    qLayoutMounted() {
      return this.drawerMounted && this.headerMounted;
    },
    defaultDrawer() {
      return !!this.getSlotComponents(q.name).length;
    },
    defaultHeader() {
      return !!this.getSlotComponents(Z.name).length;
    },
    layoutStyles() {
      return {
        "--bs-drawer-width": `${this.leftPanelWidth}px`
      };
    }
  },
  watch: {
    "tabs.length"(e) {
      this.defaultTabUsed = e === 0 || e === 1 && this.tabs[0].name === this.defaultLayoutTabName;
    }
  },
  mounted() {
    this.mounted = !0;
  }
});
function Ts(e, t, s, o, n, i) {
  const a = d("BsLayoutDrawer"), l = d("BsLayoutHeader"), u = d("BsMenuTab"), c = d("BsMenuTabs"), T = d("BsTab"), _ = d("QLayout");
  return r(), p(_, {
    view: "lHh LpR lFf",
    class: "bg-white",
    style: z(e.layoutStyles)
  }, {
    default: h(() => [
      m(a, {
        modelValue: e.drawerOpen,
        "onUpdate:modelValue": t[0] || (t[0] = ($) => e.drawerOpen = $),
        onVnodeMounted: t[1] || (t[1] = ($) => e.drawerMounted = !0),
        expandable: e.selectedTabDrawer,
        "collapsed-width": e.tabMenuWidth,
        "panel-width": e.leftPanelWidth,
        mini: !e.defaultTabUsed
      }, null, 8, ["modelValue", "expandable", "collapsed-width", "panel-width", "mini"]),
      m(l, {
        onVnodeMounted: t[2] || (t[2] = ($) => e.headerMounted = !0)
      }, null, 512),
      e.mounted && !e.defaultTabUsed ? (r(), p(c, {
        key: 0,
        modelValue: e.tabIndex,
        "onUpdate:modelValue": t[3] || (t[3] = ($) => e.tabIndex = $),
        onVnodeMounted: t[4] || (t[4] = ($) => e.menuTabsMounted = !0)
      }, {
        default: h(() => [
          (r(!0), I(F, null, w(e.tabs, ({ name: $, icon: C, tabId: A }, k) => (r(), p(u, {
            name: $,
            "tab-id": A,
            icon: C,
            "tab-index": k
          }, null, 8, ["name", "tab-id", "icon", "tab-index"]))), 256))
        ]),
        _: 1
      }, 8, ["modelValue"])) : g("", !0),
      e.mounted && e.defaultTabUsed ? (r(), p(T, {
        key: 1,
        "onMounted:qPage": t[5] || (t[5] = ($) => e.qPageMounted = !0),
        name: e.defaultLayoutTabName
      }, P({
        default: h(() => [
          D(e.$slots, "default")
        ]),
        _: 2
      }, [
        w(e.activeTabSlots, ($) => ({
          name: $,
          fn: h(() => [
            D(e.$slots, $)
          ])
        }))
      ]), 1032, ["name"])) : D(e.$slots, "default", { key: 2 })
    ]),
    _: 3
  }, 8, ["style"]);
}
const Ds = /* @__PURE__ */ S(Ss, [["render", Ts]]), ys = {
  xs: 18,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 34
}, Is = function(e, t = ys) {
  return e !== void 0 ? e in t ? `${t[e]}px` : e : null;
}, $s = {
  size: {
    type: String,
    default: "sm"
  },
  modelValue: {
    required: !0,
    default: null
  },
  val: {},
  trueValue: { default: !0 },
  falseValue: { default: !1 },
  labelLeft: String,
  labelRight: String,
  labelClass: { type: String, default: "dku-text" },
  color: { type: String, default: "rgba(111, 125, 137, 0.8)" },
  disable: Boolean,
  tabindex: [String, Number]
}, _s = ["update:modelValue"];
function be(e) {
  e.cancelable !== !1 && e.preventDefault(), e.stopPropagation();
}
const Ms = f({
  name: "BsToggle",
  data() {
    return {};
  },
  props: B({}, $s),
  emits: _s,
  computed: {
    modelIsArray() {
      return this.val !== void 0 && Array.isArray(this.modelValue);
    },
    index() {
      const e = this.val;
      return this.modelIsArray === !0 ? this.modelValue.findIndex((t) => t === e) : -1;
    },
    isTrue() {
      return this.modelIsArray === !0 ? this.index > -1 : this.modelValue === this.trueValue;
    },
    isFalse() {
      return this.modelIsArray === !0 ? this.index === -1 : this.modelValue === this.falseValue;
    },
    tabIndex() {
      return this.disable === !0 ? -1 : this.tabindex || 0;
    },
    fontSize() {
      return Is(this.size);
    }
  },
  methods: {
    getNextValue() {
      if (this.modelIsArray === !0) {
        if (this.isTrue === !0) {
          const e = this.modelValue.slice();
          return e.splice(this.index, 1), e;
        }
        return this.modelValue.concat([this.val]);
      }
      if (this.isTrue === !0)
        return this.falseValue;
      if (this.isFalse === !0)
        return this.trueValue;
    },
    onClick(e) {
      e !== void 0 && be(e), this.disable !== !0 && (console.log("next value"), console.log(this.isTrue), console.log(this.getNextValue()), this.$emit("update:modelValue", this.getNextValue(), e));
    },
    onKeydown(e) {
      (e.keyCode === 13 || e.keyCode === 32) && be(e);
    },
    onKeyup(e) {
      (e.keyCode === 13 || e.keyCode === 32) && this.onClick(e);
    }
  }
}), vs = ["checked", "value"], Cs = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function ws(e, t, s, o, n, i) {
  return r(), I("div", {
    class: O([{
      "bs-toggle--is-disabled": e.disable
    }, "bs-toggle"]),
    style: z({ "font-size": e.fontSize })
  }, [
    e.labelLeft ? (r(), I("label", {
      key: 0,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelLeft), 3)) : g("", !0),
    b("input", {
      type: "checkbox",
      checked: e.isTrue === !0,
      value: e.modelIsArray === !0 ? e.val : e.trueValue,
      class: "bs-toggle__input"
    }, null, 8, vs),
    b("div", {
      "aria-checked": e.isTrue === !0,
      "aria-disabled": e.disable,
      "aria-readonly": e.disable,
      class: O([
        "bs-toggle__content",
        e.isTrue === !0 ? "bs-toggle__content__active" : ""
      ]),
      style: z({ "background-color": e.isTrue === !0 ? e.color : "" }),
      role: "checkbox",
      onClick: t[0] || (t[0] = (...a) => e.onClick && e.onClick(...a)),
      onKeydown: t[1] || (t[1] = (...a) => e.onKeydown && e.onKeydown(...a)),
      onKeyup: t[2] || (t[2] = (...a) => e.onKeyup && e.onKeyup(...a)),
      tabindex: e.tabIndex
    }, null, 46, Cs),
    e.labelRight ? (r(), I("label", {
      key: 1,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelRight), 3)) : g("", !0)
  ], 6);
}
const Ns = /* @__PURE__ */ S(Ms, [["render", ws]]), Bs = f({
  name: "BsSelect",
  data() {
    return {
      width: 0
    };
  },
  props: {
    bsLabel: {
      type: String
    },
    placeHolder: {
      type: String
    }
  },
  components: {
    QSelect: st
  },
  methods: {
    popupShow() {
      this.width = this.$refs.bsSelect.$el.offsetWidth;
    },
    popupHide() {
      this.width = 0;
    }
  },
  computed: {
    popupStyle() {
      return {
        width: this.width,
        maxWidth: this.width,
        wordBreak: "break-all"
      };
    },
    computedLabel() {
      if (this.placeHolder && !this.$attrs.modelValue)
        return this.placeHolder;
    }
  }
}), Ps = {
  key: 0,
  class: "bs-select__label dss-caption-400 q-mb-xs"
};
function js(e, t, s, o, n, i) {
  const a = d("QSelect");
  return r(), I("div", null, [
    e.bsLabel ? (r(), I("label", Ps, N(e.bsLabel), 1)) : g("", !0),
    m(a, j({ ref: "bsSelect" }, e.$attrs, {
      "dropdown-icon": "r_expand_more",
      class: "bs-select",
      outlined: "",
      dense: "",
      "popup-content-class": "bs-select__popup dds-text-400",
      onPopupShow: e.popupShow,
      onPopupHide: e.popupHide,
      "popup-content-style": e.popupStyle,
      label: e.computedLabel,
      "label-color": "#CCCCCC"
    }), P({ _: 2 }, [
      w(e.$slots, (l, u) => ({
        name: u,
        fn: h((c) => [
          D(e.$slots, u, M(v(c || {})))
        ])
      }))
    ]), 1040, ["onPopupShow", "onPopupHide", "popup-content-style", "label"])
  ]);
}
const Os = /* @__PURE__ */ S(Bs, [["render", js]]), As = f({
  name: "BsButton",
  components: {
    QBtn: W
  }
});
function ks(e, t, s, o, n, i) {
  const a = d("QBtn");
  return r(), p(a, j(e.$attrs, { unelevated: "" }), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const zs = /* @__PURE__ */ S(As, [["render", ks]]), Ls = f({
  name: "BsTooltip",
  components: {
    QTooltip: Ie
  }
});
function Vs(e, t, s, o, n, i) {
  const a = d("QTooltip");
  return r(), p(a, M(v(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Qs = /* @__PURE__ */ S(Ls, [["render", Vs]]), Es = f({
  name: "BsSlider",
  components: {
    QSlider: ot
  },
  props: {
    sliderWidth: {
      type: Number,
      default: 192
    }
  },
  computed: {
    inputData() {
      return {
        value: this.$attrs.modelValue,
        min: this.$attrs.min,
        max: this.$attrs.max,
        step: this.$attrs.step
      };
    }
  },
  methods: {
    // TODO : Round to step in needed
    updateSliderFromInput(e) {
      let t = Number(e.target.value);
      t < this.$attrs.min && (t = this.$attrs.min), t > this.$attrs.max && (t = this.$attrs.max), this.$emit("update:model-value", t);
    }
  }
}), Us = { class: "flex row bs-slider no-wrap" }, Hs = ["value", "min", "max", "step"];
function Ws(e, t, s, o, n, i) {
  const a = d("QSlider");
  return r(), I("div", Us, [
    m(a, j(e.$attrs, {
      style: { width: e.sliderWidth + "px" },
      "thumb-size": "15px",
      "track-size": "3.5px"
    }), P({ _: 2 }, [
      w(e.$slots, (l, u) => ({
        name: u,
        fn: h((c) => [
          D(e.$slots, u, M(v(c || {})))
        ])
      }))
    ]), 1040, ["style"]),
    b("input", {
      class: "bs-slider__input dku-text",
      type: "number",
      value: e.inputData.value,
      onInput: t[0] || (t[0] = (...l) => e.updateSliderFromInput && e.updateSliderFromInput(...l)),
      min: e.inputData.min,
      max: e.inputData.max,
      step: e.inputData.step
    }, null, 40, Hs)
  ]);
}
const Ys = /* @__PURE__ */ S(Es, [["render", Ws]]), qs = f({
  name: "BsRange",
  components: {
    QRange: nt
  }
});
function Zs(e, t, s, o, n, i) {
  const a = d("QRange");
  return r(), p(a, M(v(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Rs = /* @__PURE__ */ S(qs, [["render", Zs]]), Fs = f({
  name: "BsSpinner",
  components: {
    QSpinner: at
  }
});
function Gs(e, t, s, o, n, i) {
  const a = d("QSpinner");
  return r(), p(a, M(v(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Xs = /* @__PURE__ */ S(Fs, [["render", Gs]]), Js = f({
  name: "BsDSSTable",
  props: {
    dssTableName: {
      type: String
    },
    serverSidePagination: Object,
    filters: Object
  },
  emits: ["update:fetching", "update:rows", "update:columns", "update:columns-count"],
  data() {
    return {
      DSSColumns: void 0,
      DSSData: void 0,
      fetchingChunk: !1,
      fetchingSchema: !1
    };
  },
  watch: {
    dssTableName(e, t) {
      this.updateTableDataOnWatchedChanged(e, t);
    },
    "serverSidePagination.batchSize"(e, t) {
      this.updateTableDataOnWatchedChanged(e, t);
    },
    "serverSidePagination.batchOffset"(e, t) {
      this.updateTableDataOnWatchedChanged(e, t);
    },
    filters(e, t) {
      this.updateTableDataOnWatchedChanged(e, t);
    }
  },
  methods: {
    setFetching({ fetchingChunk: e, fetchingSchema: t }) {
      e !== void 0 && (this.fetchingChunk = e), t !== void 0 && (this.fetchingSchema = t);
      const s = this.fetchingChunk || this.fetchingSchema;
      this.$emit("update:fetching", s);
    },
    setFetchingSchema(e) {
      this.setFetching({ fetchingSchema: e });
    },
    setFetchingChunk(e) {
      this.setFetching({ fetchingChunk: e });
    },
    fetchDSSData(...e) {
      return new Promise((t, s) => {
        this.setFetchingChunk(!0), Y.getDatasetChunk(...e).then((o) => {
          const n = this.transformDSSDataToQTableRow(o);
          t(n);
        }).catch(s).finally(() => {
          this.setFetchingChunk(!1);
        });
      });
    },
    fetchFilteredDSSDataset(...e) {
      return new Promise((t, s) => {
        this.setFetchingChunk(!0), Y.getFilteredDataset(
          ...e
        ).then((o) => {
          const n = this.transformDSSDataToQTableRow(o);
          t(n);
        }).catch(s).finally(() => {
          this.setFetchingChunk(!1);
        });
      });
    },
    fetchDSSColumns(...e) {
      return this.setFetchingSchema(!0), new Promise((t, s) => {
        Y.getDatasetGenericData(...e).then(({ schema: o, columnsCount: n }) => {
          const a = o.columns.map((l) => this.createBsTableCol({ name: l.name, dataType: l.type }));
          t({ columns: a, columnsCount: n });
        }).catch(s).finally(() => {
          this.setFetchingSchema(!1);
        });
      });
    },
    updateColumns(...e) {
      this.fetchDSSColumns(...e).then(({ columns: t, columnsCount: s }) => {
        this.$emit("update:columns", t), this.$emit("update:columns-count", s);
      });
    },
    updateRows(...e) {
      this.fetchFilteredDSSDataset(...e).then((t) => {
        this.$emit("update:rows", t);
      });
    },
    parseDSSColumn(e) {
      return e === "index" ? "in_dss_index" : e;
    },
    createBsTableCol(e) {
      const t = (e == null ? void 0 : e.name) || "default";
      return B({
        name: t,
        label: t,
        field: t,
        sortable: !0,
        align: "left"
      }, e);
    },
    transformDSSDataToQTableRow(e) {
      if (e === "None")
        return;
      const t = Object.entries(e);
      if (!(t != null && t.length))
        return;
      const s = Object.entries(t[0][1]).length, o = Array(s).fill(void 0).map((n, i) => ({}));
      return t.forEach(([n, i]) => {
        n = this.parseDSSColumn(n);
        const a = Object.values(i), { batchSize: l, batchOffset: u } = this.serverSidePagination || { batchSize: 0, batchOffset: 0 };
        a.forEach((c, T) => {
          const _ = o[T];
          _[n] = c, _.index = l * u + T;
        });
      }), o;
    },
    updateTableData() {
      const { batchSize: e, batchOffset: t } = this.serverSidePagination || {};
      this.dssTableName && e && t !== void 0 && (this.updateColumns(this.dssTableName), this.updateRows(this.dssTableName, e, t, this.filters));
    },
    updateTableDataOnWatchedChanged(e, t) {
      ft(e, t) || this.updateTableData();
    }
  },
  mounted() {
    this.updateTableData();
  }
});
function xs(e, t, s, o, n, i) {
  return null;
}
const Ks = /* @__PURE__ */ S(Js, [["render", xs]]), eo = 45, to = 250;
let oe = () => {
};
{
  let e = function(o, n, i, ...a) {
    i === void 0 && (i = o), t.set(i, Date.now()), s.set(i, n), setTimeout(() => {
      if (!t.has(i))
        return;
      const l = s.get(i), u = t.get(i);
      (l < to || Date.now() - u > l - eo) && (a ? o(...a) : o(), t.delete(i));
    }, n);
  };
  const t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  oe = e;
}
function Qe(e, t, s, ...o) {
  return o ? oe(e, t, s, ...o) : oe(e, t, s);
}
function so(e, t, s = !1) {
  let o = e.length, n = 0, i = [];
  if (o) {
    const a = (l = 0) => t.indexOf(e, l);
    s || (t = t.toLowerCase(), e = e.toLowerCase());
    for (let l = a(n); l > -1; l = a(n))
      i.push(l), n = l + o;
  }
  return i;
}
function oo(e, t) {
  return e.hasOwnProperty(t) ? e[t] : void 0;
}
function fe(e, t, s, o) {
  {
    const n = o(e, t) + "";
    return (n === "undefined" || n === "null" ? "" : n.toLowerCase()).includes(s);
  }
}
function no(e) {
  return e ? `${e}`.toLowerCase() : "";
}
function ao(e, { columns: t, searchVal: s }, o, n) {
  let i = e;
  const a = Object.keys(t);
  if (a.length) {
    const l = o.filter((u) => a.includes(u.name));
    i = i.filter((u) => l.every((c) => {
      const T = t[c.name];
      return fe(c, u, T, n);
    }));
  }
  return s && (i = i.filter((l) => o.some((u) => fe(u, l, s, n)))), i;
}
const io = f({
  name: "BsInputDebounce",
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    valueSearchDebounce: {
      type: [Number, String],
      default: 500
    },
    formatInput: {
      type: Boolean,
      default: !1
    },
    formatInputMethod: {
      type: Function,
      default: no
    }
  },
  components: { QInput: $e },
  emits: ["update:model-value", "update:loading", "update:formatted-value", "update:no-debounce:formatted-value"],
  data() {
    return {
      inputDebouncing: !1,
      value: null,
      id: St("bs-input-debounce-")
    };
  },
  watch: {
    modelValue() {
      this.syncModelValue();
    }
  },
  methods: {
    setLoading(e) {
      this.inputDebouncing = e, this.$emit("update:loading", e);
    },
    updateSearchedValue(e) {
      this.$emit("update:model-value", e), this.updateFormattedValue(e);
    },
    updateFormattedValue(e) {
      this.formatInput && this.$emit("update:formatted-value", this.formatInputMethod(e));
    },
    updateValueDebounce(e) {
      this.updateValueNoDebounce(e), this.setLoading(!0), Qe(
        () => {
          this.updateSearchedValue(e), this.setLoading(!1);
        },
        +this.valueSearchDebounce,
        this.id
      );
    },
    updateValueNoDebounce(e) {
      this.value = e, this.$emit("update:no-debounce:formatted-value", this.formatInputMethod(e));
    },
    syncModelValue() {
      this.updateValueNoDebounce(this.modelValue), this.updateFormattedValue(this.modelValue);
    }
  },
  mounted() {
    this.syncModelValue();
  }
});
function ro(e, t, s, o, n, i) {
  const a = d("QInput");
  return r(), p(a, j({
    "model-value": e.value,
    "onUpdate:modelValue": e.updateValueDebounce,
    loading: e.inputDebouncing
  }, e.$attrs), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040, ["model-value", "onUpdate:modelValue", "loading"]);
}
const Ee = /* @__PURE__ */ S(io, [["render", ro]]), lo = f({
  name: "BsSearchTable",
  components: {
    QIcon: Q,
    BsInputDebounce: Ee
  },
  data() {
    return {
      searchColIcon: ie
    };
  }
});
const uo = { class: "bs-search-table-container" };
function co(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsInputDebounce");
  return r(), I("div", uo, [
    m(l, j({
      width: "190",
      label: "Search items",
      filled: "",
      dense: "",
      "format-input": ""
    }, e.$attrs), P({
      append: h(() => [
        m(a, {
          name: e.searchColIcon,
          size: "1rem"
        }, null, 8, ["name"])
      ]),
      _: 2
    }, [
      w(e.$slots, (u, c) => ({
        name: c,
        fn: h((T) => [
          D(e.$slots, c, M(v(T || {})), void 0, !0)
        ])
      }))
    ]), 1040)
  ]);
}
const ho = /* @__PURE__ */ S(lo, [["render", co], ["__scopeId", "data-v-02144179"]]), po = f({
  name: "BSTableColHeader",
  components: {
    QIcon: Q,
    QTh: ne,
    QMenu: it,
    QItem: rt,
    QItemSection: lt,
    QList: dt
  },
  directives: {
    ClosePopup: ut
  },
  emits: ["search-col"],
  data() {
    return {
      mdiArrowUpThin: yt,
      mdiSortAscending: me,
      mdiSortDescending: ge,
      mdiChevronDown: It,
      searchColIcon: ie,
      noDebounceValue: "",
      sortAsc: !1,
      sorted: !1
    };
  },
  computed: {
    sortable() {
      var e;
      return !!((e = this.col) != null && e._sortable);
    },
    sortColIcon() {
      return this.sortAsc ? me : ge;
    },
    sortText() {
      return this.sortAsc ? "descending" : "ascending";
    }
  },
  props: {
    sort: Function,
    col: Object,
    sortedCol: String
  },
  methods: {
    sortColumn() {
      this.sortable && this.sort && this.sort(this.col), this.sortAsc = this.sorted ? !this.sortAsc : !0;
    },
    searchColumn() {
      var e;
      this.$emit("search-col", (e = this.col) == null ? void 0 : e.name);
    }
  },
  watch: {
    sortedCol(e) {
      var t;
      e === ((t = this.col) == null ? void 0 : t.name) ? (this.sortAsc = this.sorted ? !this.sortAsc : !0, this.sorted = !0) : (this.sorted = !1, this.sortAsc = !1);
    }
  }
});
const mo = (e) => (U("data-v-24b689ca"), e = e(), H(), e), go = { class: "bs-table-col-header-container" }, bo = {
  class: "bs-table-col-header-title-container",
  ref: "BsTableColHeaderTitleContainer"
}, fo = { class: "bs-table-col-header-title" }, So = { class: "bs-table-col-header-title-label" }, To = { class: "bs-table-col-header-title-icon" }, Do = /* @__PURE__ */ mo(() => /* @__PURE__ */ b("div", null, "Search", -1)), yo = {
  key: 0,
  class: "bs-table-col-header-data-type"
};
function Io(e, t, s, o, n, i) {
  var $, C, A, k;
  const a = d("q-icon"), l = d("q-item-section"), u = d("q-item"), c = d("q-list"), T = d("q-menu"), _ = ye("close-popup");
  return r(), I("div", go, [
    b("div", bo, [
      b("div", fo, [
        b("div", So, N((($ = e.col) == null ? void 0 : $.label) || ((C = e.col) == null ? void 0 : C.name) || ""), 1),
        b("div", To, [
          m(a, {
            name: e.mdiChevronDown,
            size: "1rem"
          }, {
            default: h(() => [
              m(T, {
                anchor: "bottom middle",
                self: "top middle",
                "transition-show": "scale",
                "transition-hide": "scale",
                offset: [0, 10]
              }, {
                default: h(() => [
                  m(c, {
                    ref: "BsTableColHeaderActions",
                    class: "bs-table-col-header-actions q-py-xs q-px-sm rounded-borders"
                  }, {
                    default: h(() => [
                      e.sortable ? (r(), p(u, { key: 0 }, {
                        default: h(() => [
                          m(l, null, {
                            default: h(() => [
                              b("div", {
                                class: "bs-table-col-header-action-section cursor-pointer",
                                onClick: t[0] || (t[0] = (...y) => e.sortColumn && e.sortColumn(...y))
                              }, [
                                m(a, {
                                  name: e.sortColIcon,
                                  size: "0.8rem",
                                  class: O(["sort-icon", { sorted: e.sorted }])
                                }, null, 8, ["name", "class"]),
                                b("div", null, " Sort " + N(e.sortText), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : g("", !0),
                      L((r(), p(u, null, {
                        default: h(() => [
                          m(l, null, {
                            default: h(() => [
                              b("div", {
                                class: "bs-table-col-header-action-section cursor-pointer",
                                onClick: t[1] || (t[1] = (...y) => e.searchColumn && e.searchColumn(...y))
                              }, [
                                m(a, {
                                  name: e.searchColIcon,
                                  size: "0.8rem"
                                }, null, 8, ["name"]),
                                Do
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })), [
                        [_]
                      ])
                    ]),
                    _: 1
                  }, 512)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["name"])
        ])
      ]),
      (A = e.col) != null && A.dataType ? (r(), I("div", yo, N((k = e.col) == null ? void 0 : k.dataType), 1)) : g("", !0)
    ], 512)
  ]);
}
const $o = /* @__PURE__ */ S(po, [["render", Io], ["__scopeId", "data-v-24b689ca"]]), _o = f({
  name: "BSTableHeader",
  components: {
    QTr: ae,
    QTh: ne,
    BsTableColHeader: $o,
    QCheckbox: _e
  },
  props: {
    props: {
      type: Object,
      required: !0
    },
    selection: String,
    allSelected: {
      type: Boolean,
      default: !1
    },
    loading: Boolean
  },
  data() {
    return {
      sortedCol: "",
      sortedDesc: !1,
      isChecked: !1
    };
  },
  emits: ["search-col", "select-all"],
  methods: {
    activateSearchCol(e) {
      this.$emit("search-col", e);
    },
    sort(e) {
      const t = this.sortedCol;
      this.sortedCol = t !== e.name ? e.name : this.sortedDesc ? "" : e.name, this.sortedDesc = t !== e.name ? !1 : !this.sortedDesc, this.props.sort(e);
    },
    toggleCheckbox() {
      this.$emit("select-all", this.isChecked);
    }
  },
  computed: {
    cols() {
      return this.props.cols.filter((e) => e.name !== "clearAllCol");
    }
  },
  watch: {
    allSelected(e) {
      this.isChecked = e;
    }
  }
});
function Mo(e, t, s, o, n, i) {
  const a = d("q-checkbox"), l = d("q-th"), u = d("BsTableColHeader"), c = d("q-tr");
  return r(), p(c, { props: e.props }, {
    default: h(() => [
      e.selection === "multiple" ? (r(), p(l, {
        "auto-width": "",
        key: "selectAll"
      }, {
        default: h(() => [
          m(a, {
            modelValue: e.isChecked,
            "onUpdate:modelValue": [
              t[0] || (t[0] = (T) => e.isChecked = T),
              e.toggleCheckbox
            ],
            disable: e.loading
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disable"])
        ]),
        _: 1
      })) : g("", !0),
      e.selection === "single" ? (r(), p(l, {
        "auto-width": "",
        key: "select"
      })) : g("", !0),
      (r(!0), I(F, null, w(e.cols, (T) => (r(), p(l, {
        key: T.name,
        props: e.props
      }, {
        default: h(() => [
          m(u, {
            sort: e.sort,
            col: T,
            "sorted-col": e.sortedCol,
            onSearchCol: e.activateSearchCol
          }, null, 8, ["sort", "col", "sorted-col", "onSearchCol"])
        ]),
        _: 2
      }, 1032, ["props"]))), 128)),
      (r(), p(l, {
        "auto-width": "",
        key: "clearAllCol"
      }))
    ]),
    _: 1
  }, 8, ["props"]);
}
const vo = /* @__PURE__ */ S(_o, [["render", Mo], ["__scopeId", "data-v-e4895239"]]), Co = f({
  name: "BsTextHighlight",
  components: {},
  data() {
    return {};
  },
  props: {
    queries: Array,
    text: [String, Number, Boolean]
  },
  computed: {
    highlightedText() {
      let e = V(this.text) || Tt(this.text) ? "" : Dt(`${this.text}`);
      const t = (this.queries || []).filter((c) => !V(c));
      if (!(e && t.length))
        return e;
      let s = /* @__PURE__ */ new Map([
        [0, { from: [], to: [] }],
        [e.length, { from: [], to: [] }]
      ]);
      t.forEach(
        (c, T) => so(c, e).forEach((_) => {
          const $ = _, C = _ + c.length;
          s.has($) || s.set($, { from: [], to: [] }), s.has(C) || s.set(C, { from: [], to: [] });
          const A = s.get($), k = s.get(C);
          A.from.push(T), k.to.push(T);
        })
      );
      const o = Array.from(s.keys()).sort((c, T) => c - T);
      if (!o.length)
        return e;
      const n = o.length - 1, i = [], a = new Array(n).fill("").map((c, T) => e.substring(o[T], o[T + 1]));
      let l = 0;
      for (; l < n; ) {
        const { from: c, to: T } = s.get(o[l]);
        c.forEach(($) => {
          i.includes($) || i.push($);
          const C = T.indexOf($);
          C !== -1 && i.splice(C, 1);
        }), T.forEach(($) => {
          const C = i.indexOf($);
          C !== -1 && i.splice(C, 1);
        });
        const _ = this.createClassesFromQueries(i);
        a[l] = `<span class="text-underline ${_}">${a[l]}</span>`, l++;
      }
      return a.join("");
    }
  },
  methods: {
    createClassesFromQueries(e) {
      return e.map((t) => `resolved-query-${t}`).join(" ");
    }
  }
});
const wo = ["innerHTML"];
function No(e, t, s, o, n, i) {
  return r(), I("span", { innerHTML: e.highlightedText }, null, 8, wo);
}
const Se = /* @__PURE__ */ S(Co, [["render", No]]), Bo = f({
  name: "BsTablePagination",
  components: {
    QBtn: W
  },
  props: {
    scope: {
      type: Object,
      required: !0
    },
    serverSidePagination: Object,
    startOfThePage: {
      type: Function,
      required: !0
    }
  },
  data() {
    return {
      batchSize: 0,
      batchOffset: 0,
      recordsCount: 0
    };
  },
  computed: {
    pagination() {
      return this.scope.pagination;
    },
    recordsShown() {
      const e = this.pagination.rowsPerPage;
      let t = this.pagination.page * e + this.batchSize * this.batchOffset;
      const s = t - e;
      return this.recordsCount && (t = Math.min(t, this.recordsCount)), `${s} - ${t}`;
    }
  },
  watch: {
    "serverSidePagination.batchOffset"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.batchSize"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.recordsCount"() {
      this.syncServerSidePagination();
    }
  },
  methods: {
    syncServerSidePagination() {
      var e, t, s, o, n;
      V((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (o = this.serverSidePagination) != null && o.recordsCount && (this.recordsCount = (n = this.serverSidePagination) == null ? void 0 : n.recordsCount);
    },
    executeAndGoToTop(e) {
      e(), this.startOfThePage && this.startOfThePage();
    }
  }
});
const Po = { class: "bs-table-pagination" }, jo = { class: "bs-table-pagination-controls" }, Oo = { class: "bs-table-records-info" };
function Ao(e, t, s, o, n, i) {
  const a = d("q-btn");
  return r(), I("div", Po, [
    b("div", jo, [
      e.scope.pagesNumber > 2 ? (r(), p(a, {
        key: 0,
        icon: "first_page",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[0] || (t[0] = (l) => e.executeAndGoToTop(e.scope.firstPage))
      }, null, 8, ["disable"])) : g("", !0),
      m(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[1] || (t[1] = (l) => e.executeAndGoToTop(e.scope.prevPage))
      }, null, 8, ["disable"]),
      b("div", Oo, N(e.recordsShown), 1),
      m(a, {
        icon: "chevron_right",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isLastPage,
        onClick: t[2] || (t[2] = (l) => e.executeAndGoToTop(e.scope.nextPage))
      }, null, 8, ["disable"]),
      e.scope.pagesNumber > 2 ? (r(), p(a, {
        key: 1,
        icon: "last_page",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isLastPage,
        onClick: t[3] || (t[3] = (l) => e.executeAndGoToTop(e.scope.lastPage))
      }, null, 8, ["disable"])) : g("", !0)
    ])
  ]);
}
const ko = /* @__PURE__ */ S(Bo, [["render", Ao], ["__scopeId", "data-v-4c15147d"]]), zo = f({
  name: "BsTableVirtualScrollIndicator",
  components: {
    QLinearProgress: ct
  },
  props: {
    fetchedRowsLength: Number,
    serverSidePagination: Object,
    scrollDetails: Object
  },
  data() {
    return {
      progress: 0,
      showProgressBar: !1
    };
  },
  computed: {},
  methods: {
    updateProgress() {
      Qe(() => {
        this.showProgressBar = this.scrollDetails ? this.scrollDetails.scrollHeight > 0 : !1, this.progress = this.showProgressBar && this.scrollDetails ? this.scrollDetails.scrollTop / this.scrollDetails.scrollHeight : 1;
      }, 250, "bs-table-scroll-update-indicator");
    }
  },
  mounted() {
    this.updateProgress();
  },
  watch: {
    "serverSidePagination.batchOffset"() {
      this.updateProgress();
    },
    "serverSidePagination.batchSize"() {
      this.updateProgress();
    },
    "serverSidePagination.recordsCount"() {
      this.updateProgress();
    },
    scrollDetails(e) {
      this.updateProgress();
    }
  }
});
const Lo = { class: "bs-table-virtual-scroll-progress-bar" };
function Vo(e, t, s, o, n, i) {
  const a = d("q-linear-progress");
  return r(), I("div", {
    class: O(["bs-table-virtual-scroll", e.showProgressBar && "bs-table-virtual-scroll--active"])
  }, [
    b("div", Lo, [
      m(a, {
        value: e.progress,
        rounded: "",
        size: "5px"
      }, null, 8, ["value"])
    ])
  ], 2);
}
const Qo = /* @__PURE__ */ S(zo, [["render", Vo], ["__scopeId", "data-v-195a0692"]]), Eo = f({
  name: "BsTableBottom",
  components: {
    BsTablePagination: ko,
    BsTableVirtualScrollIndicator: Qo,
    QIcon: Q
  },
  props: {
    scope: {
      type: Object,
      required: !0
    },
    serverSidePagination: Object,
    searching: Boolean,
    virtualScroll: {
      type: Boolean,
      required: !0
    },
    fetchedRowsLength: Number,
    startOfThePage: {
      type: Function,
      required: !0
    },
    scrollDetails: Object || void 0
  },
  data() {
    return {
      recordsCount: 0,
      mdiAlert: $t,
      recordsNumber: 0,
      virtualScrollOn: !1
    };
  },
  computed: {
    pagination() {
      return this.scope.pagination;
    },
    isFullDataset() {
      return V(this.serverSidePagination);
    },
    recordsTotal() {
      if (this.recordsCount)
        return this.recordsCount;
      if (this.isFullDataset)
        return this.fetchedRowsLength;
    }
  },
  watch: {
    "serverSidePagination.recordsCount"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.batchOffset"() {
      this.updateRecordNumber(0);
    },
    scrollDetails(e) {
      this.virtualScrollOn = e.scrollHeight > 0, this.updateRecordNumber(e.index);
    }
  },
  methods: {
    syncServerSidePagination() {
      var e, t;
      (e = this.serverSidePagination) != null && e.recordsCount && (this.recordsCount = (t = this.serverSidePagination) == null ? void 0 : t.recordsCount);
    },
    updateRecordNumber(e) {
      this.serverSidePagination ? this.recordsNumber = e + 1 + this.serverSidePagination.batchOffset * this.serverSidePagination.batchSize : this.fetchedRowsLength ? this.recordsNumber = e + 1 : this.recordsNumber = 0;
    }
  },
  mounted() {
    this.syncServerSidePagination();
  }
});
const Uo = (e) => (U("data-v-79b28020"), e = e(), H(), e), Ho = { class: "bs-table-bottom-container" }, Wo = /* @__PURE__ */ Uo(() => /* @__PURE__ */ b("div", { class: "bs-table-warning-text" }, "the search is applied only to the sampled records!", -1)), Yo = {
  key: 3,
  class: "bs-table-records-total"
}, qo = { key: 0 };
function Zo(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsTablePagination"), u = d("BsTableVirtualScrollIndicator");
  return r(), I("div", Ho, [
    e.isFullDataset ? g("", !0) : (r(), I("div", {
      key: 0,
      class: O(["bs-table-warning", e.searching && "bs-table-warning-active"])
    }, [
      m(a, { name: e.mdiAlert }, null, 8, ["name"]),
      Wo
    ], 2)),
    e.virtualScroll ? e.virtualScrollOn ? (r(), p(u, {
      key: 2,
      "server-side-pagination": e.serverSidePagination,
      "scroll-details": e.scrollDetails,
      "fetched-rows-length": e.fetchedRowsLength
    }, null, 8, ["server-side-pagination", "scroll-details", "fetched-rows-length"])) : g("", !0) : (r(), p(l, {
      key: 1,
      scope: e.scope,
      "server-side-pagination": e.serverSidePagination,
      "start-of-the-page": e.startOfThePage
    }, null, 8, ["scope", "server-side-pagination", "start-of-the-page"])),
    e.recordsTotal && e.virtualScroll ? (r(), I("div", Yo, [
      e.virtualScrollOn ? (r(), I("span", qo, N(e.recordsNumber) + " on  ", 1)) : g("", !0),
      De(N(e.recordsTotal) + " rows", 1)
    ])) : g("", !0)
  ]);
}
const Ro = /* @__PURE__ */ S(Eo, [["render", Zo], ["__scopeId", "data-v-79b28020"]]), Fo = f({
  name: "default",
  components: {
    QBtn: W
  },
  emits: ["update:batch-offset"],
  data() {
    return {
      batchSize: 0,
      batchOffset: 0,
      recordsCount: 0
    };
  },
  props: {
    serverSidePagination: Object
  },
  computed: {
    sampleFrom() {
      return this.batchSize * this.batchOffset;
    },
    sampleTo() {
      let e = this.sampleFrom + this.batchSize;
      return this.recordsCount && (e = Math.min(e, this.recordsCount)), e;
    },
    isFirstBatch() {
      return this.batchOffset === 0;
    },
    isLastBatch() {
      return !(V(this.lastBatchIndex) || this.batchOffset !== this.lastBatchIndex);
    },
    lastBatchIndex() {
      if (this.recordsCount && this.batchSize)
        return Math.floor((this.recordsCount - 1) / this.batchSize);
    }
  },
  watch: {
    "serverSidePagination.batchOffset"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.batchSize"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.recordsCount"() {
      this.syncServerSidePagination();
    }
  },
  methods: {
    prevBatch() {
      this.changeCurrentBatchOffsetBy(-1);
    },
    nextBatch() {
      this.changeCurrentBatchOffsetBy(1);
    },
    changeCurrentBatchOffsetBy(e) {
      this.$emit("update:batch-offset", this.batchOffset + e);
    },
    syncServerSidePagination() {
      var e, t, s, o, n;
      V((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (o = this.serverSidePagination) != null && o.recordsCount && (this.recordsCount = (n = this.serverSidePagination) == null ? void 0 : n.recordsCount);
    }
  },
  mounted() {
    this.syncServerSidePagination();
  }
});
const Go = (e) => (U("data-v-b7be3388"), e = e(), H(), e), Xo = {
  key: 0,
  class: "bs-table-server-side-pagination"
}, Jo = { class: "bs-table-server-side-pagination-controls" }, xo = { class: "bs-table-server-side-pagination-offset" }, Ko = /* @__PURE__ */ Go(() => /* @__PURE__ */ b("div", { class: "bs-table-server-side-pagination-label" }, " sampled rows ", -1));
function en(e, t, s, o, n, i) {
  const a = d("q-btn");
  return e.lastBatchIndex !== 0 ? (r(), I("div", Xo, [
    b("div", Jo, [
      m(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.isFirstBatch,
        onClick: e.prevBatch
      }, null, 8, ["disable", "onClick"]),
      b("div", xo, N(e.sampleFrom) + " - " + N(e.sampleTo), 1),
      m(a, {
        icon: "chevron_right",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.isLastBatch,
        onClick: e.nextBatch
      }, null, 8, ["disable", "onClick"])
    ]),
    Ko
  ])) : g("", !0);
}
const tn = /* @__PURE__ */ S(Fo, [["render", en], ["__scopeId", "data-v-b7be3388"]]), sn = f({
  name: "BsSearchTableCol",
  components: { BsInputDebounce: Ee, QIcon: Q },
  props: {
    icon: String,
    clear: Boolean,
    colName: String,
    searchedCols: Object
  },
  data() {
    return {
      value: null,
      mdiTrashCanOutline: _t
    };
  },
  emits: ["clear-search"],
  watch: {
    clear() {
      this.value = null;
    },
    searchedCols(e) {
      this.colName && e.hasOwnProperty(this.colName) ? this.value = e[this.colName] : this.value = "";
    }
  },
  methods: {
    clearField() {
      this.$emit("clear-search", this.colName);
    }
  }
});
const on = { class: "bs-search-table-col-search-box" };
function nn(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsInputDebounce");
  return r(), I("div", on, [
    m(l, j({
      class: "bs-search-table-col-input",
      width: "102",
      label: "Search",
      clearable: "",
      "clear-icon": "close",
      borderless: "",
      dense: "",
      "format-input": "",
      autofocus: "",
      modelValue: e.value,
      "onUpdate:modelValue": t[0] || (t[0] = (u) => e.value = u)
    }, e.$attrs), P({
      prepend: h(() => [
        m(a, {
          name: e.icon,
          size: "1rem"
        }, null, 8, ["name"])
      ]),
      _: 2
    }, [
      w(e.$slots, (u, c) => ({
        name: c,
        fn: h((T) => [
          D(e.$slots, c, M(v(T || {})), void 0, !0)
        ])
      }))
    ]), 1040, ["modelValue"]),
    b("div", null, [
      m(a, {
        name: e.mdiTrashCanOutline,
        onClick: e.clearField,
        size: "1rem",
        class: "cursor-pointer"
      }, null, 8, ["name", "onClick"])
    ])
  ]);
}
const an = /* @__PURE__ */ S(sn, [["render", nn], ["__scopeId", "data-v-79755b04"]]), rn = f({
  name: "BSTableSearchHeader",
  components: {
    QTr: ae,
    QTh: ne,
    BsSearchTableCol: an
  },
  props: {
    props: {
      type: Object,
      required: !0
    },
    searchedCols: Object,
    searchedCol: String || void 0,
    selectionOn: Boolean
  },
  emits: ["search-col", "clear-all"],
  data() {
    return {
      noDebounceValue: "",
      searchColIcon: ie
    };
  },
  watch: {
    searchedCol(e) {
      e && this.activateSearchCol(e);
    }
  },
  methods: {
    activateSearchCol(e) {
      var t;
      (t = this.searchedCols) != null && t.hasOwnProperty(e) || this.$emit("search-col", e, "");
    },
    searchColumn(e, t) {
      this.$emit("search-col", e, t);
    },
    clearAll() {
      this.$emit("clear-all");
    }
  },
  computed: {
    noSearches() {
      return Me(this.searchedCols);
    },
    cols() {
      return this.props.cols.filter((e) => e.name !== "clearAllCol");
    }
  }
});
const ln = { class: "bs-table-search-header" };
function dn(e, t, s, o, n, i) {
  const a = d("q-th"), l = d("BsSearchTableCol"), u = d("q-tr");
  return e.noSearches ? g("", !0) : (r(), p(u, {
    key: 0,
    props: e.props
  }, {
    default: h(() => [
      e.selectionOn ? (r(), p(a, {
        key: 0,
        "auto-width": ""
      })) : g("", !0),
      (r(!0), I(F, null, w(e.cols, (c) => (r(), p(a, {
        key: c.name,
        style: z({ "text-align": c.align ? c.align : "left" })
      }, {
        default: h(() => {
          var T;
          return [
            b("div", ln, [
              (T = e.searchedCols) != null && T.hasOwnProperty(c.name) ? (r(), p(l, {
                key: 0,
                icon: e.searchColIcon,
                searchedCols: e.searchedCols,
                "col-name": c.name,
                "onUpdate:formattedValue": (_) => e.searchColumn(c.name, _),
                "onUpdate:noDebounce:formattedValue": t[0] || (t[0] = (_) => e.noDebounceValue = _),
                onClearSearch: (_) => e.searchColumn(c.name, null)
              }, null, 8, ["icon", "searchedCols", "col-name", "onUpdate:formattedValue", "onClearSearch"])) : g("", !0)
            ])
          ];
        }),
        _: 2
      }, 1032, ["style"]))), 128)),
      e.noSearches ? g("", !0) : (r(), p(a, { key: "clearAllCol" }, {
        default: h(() => [
          b("span", {
            onClick: t[1] || (t[1] = (...c) => e.clearAll && e.clearAll(...c)),
            class: "bs-table-header-clear-all-btn"
          }, " Clear all ")
        ]),
        _: 1
      }))
    ]),
    _: 1
  }, 8, ["props"]));
}
const un = /* @__PURE__ */ S(rn, [["render", dn], ["__scopeId", "data-v-7f9a0bde"]]), cn = f({
  name: "BsTable",
  components: {
    QTable: ht,
    QTr: ae,
    QTd: pt,
    QBtn: W,
    BsDSSTableFunctional: Ks,
    BsSearchWholeTable: ho,
    BSTableHeader: vo,
    BsTextHighlight: Se,
    BsTableBottom: Ro,
    BsTableServerSidePagination: tn,
    BSTableSearchHeader: un
  },
  emits: ["update:rows", "update:columns", "update:loading", "update:server-side-pagination", "virtual-scroll", "update:selection"],
  inheritAttrs: !1,
  props: {
    dssTableName: String,
    title: String,
    serverSidePagination: [Object, Boolean],
    loading: {
      type: Boolean,
      default: !1
    },
    rows: Array,
    columns: Array,
    virtualScroll: {
      type: Boolean,
      default: !0
    },
    stickyHeader: {
      type: Boolean,
      default: !0
    },
    globalSearch: {
      type: Boolean,
      default: !0
    },
    serverSidePaginationControls: {
      type: Boolean,
      default: !0
    },
    style: [Object, String],
    class: [Array, String],
    filters: Object,
    selection: {
      type: String,
      default: void 0
    },
    rowKey: String
  },
  data() {
    return {
      searching: !1,
      fetching: !1,
      searchedCols: {},
      searchedCol: void 0,
      searchedValue: null,
      searchedValueFormatted: "",
      _serverSidePagination: void 0,
      _rows: void 0,
      _columns: void 0,
      lastBatchIndex: -1,
      scrollDetails: { from: 0 },
      passedRowsLength: 0,
      tableEl: void 0,
      mdiCloseCircleMultiple: Mt,
      selectedRowsByBatch: {},
      selected: [],
      allSelected: {},
      prevBatchIndex: 0
    };
  },
  computed: {
    isDSSTable() {
      return this.dssTableName !== void 0;
    },
    isLoading() {
      return this.loading || this.searching || this.fetching;
    },
    anyColumnSearched() {
      return !(!this.searchedValue && Me(this.searchedCols));
    },
    isServerSidePaginationObject() {
      return typeof this.serverSidePagination != "boolean";
    },
    passedRows() {
      return this.isDSSTable ? this._rows : this.rows;
    },
    passedColumns() {
      return this.isDSSTable ? this._columns : this.columns;
    },
    colSlotsUsed() {
      if (this.passedColumns)
        return this.passedColumns.filter((e) => this.colBodySlotUsed(e));
    },
    formattedColumns() {
      if (this.passedColumns) {
        const e = this.passedColumns.map((s) => E(B({}, s), { sortable: !1, _sortable: s.sortable })), t = {
          name: "clearAllCol",
          required: !0,
          label: "",
          field: "",
          sortable: !1,
          _sortable: !1
        };
        return e.push(t), e;
      }
    },
    filter() {
      return {
        columns: this.searchedCols,
        searchVal: this.searchedValueFormatted
      };
    },
    classParsed() {
      let e = this.class || "";
      return typeof e == "string" && (e = [e]), e;
    },
    tableClasses() {
      return ["bs-table", this.stickyHeader && "bs-table-sticky"];
    },
    filteredSlots() {
      const e = ["top"];
      return Object.fromEntries(
        Object.entries(this.$slots).filter(
          ([t]) => !(e.includes(t) || t.includes("body-cell"))
        )
      );
    },
    selectionOn() {
      return this.selection === "multiple" || this.selection === "single";
    },
    allSelectedBatch() {
      return V(this.allSelected[this.currentBatchIndex]) ? !1 : this.allSelected[this.currentBatchIndex];
    },
    currentBatchIndex() {
      var e;
      return this.isLoading ? this.prevBatchIndex : ((e = this._serverSidePagination) == null ? void 0 : e.batchOffset) || 0;
    }
  },
  watch: {
    "serverSidePagination.batchOffset"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.batchSize"() {
      this.syncServerSidePagination();
    },
    "serverSidePagination.recordsCount"() {
      this.syncServerSidePagination();
    },
    "passedRows.length"(e) {
      this.passedRowsLength = e;
    },
    isLoading(e) {
      this.$emit("update:loading", e);
    },
    selected(e) {
      var s, o, n;
      this.selectedRowsByBatch[this.currentBatchIndex] = this.passedRows ? this.passedRows.filter((i) => e.findIndex((a) => a[this.rowKey] === i[this.rowKey]) >= 0) : [], ((s = this.selectedRowsByBatch[this.currentBatchIndex]) == null ? void 0 : s.length) === ((o = this.passedRows) == null ? void 0 : o.length) ? this.allSelected[this.currentBatchIndex] = !0 : ((n = this.selectedRowsByBatch[this.currentBatchIndex]) == null ? void 0 : n.length) === 0 ? this.allSelected[this.currentBatchIndex] = !1 : this.allSelected[this.currentBatchIndex] = null, this.$emit("update:selection", this.selected);
    }
  },
  methods: {
    updateDSSRows(e) {
      e || (e = []);
      const { batchSize: t, batchOffset: s } = this._serverSidePagination, o = Object.keys(e).length;
      if (o < t) {
        const n = {};
        n.recordsCount = s * t + o, o == 0 && (n.batchOffset = s - 1), this.setServerSidePagination(n, !0);
      }
      this._rows = e, this.$emit("update:rows", this._rows);
    },
    updateDSSColumns(e) {
      this._columns = e, this.$emit("update:columns", this._columns);
    },
    searchTableFilter(...e) {
      return ao(...e);
    },
    updateSearchedCols(e, t) {
      t == null ? (delete this.searchedCols[e], e === this.searchedCol && (this.searchedCol = void 0)) : this.searchedCols[e] = t;
    },
    searchCol(e) {
      this.searchedCol = e;
    },
    colBodySlotUsed(e) {
      return this.$slots.hasOwnProperty(this.getColBodySlot(e));
    },
    getColBodySlot(e) {
      return `body-cell-${e.name}`;
    },
    getColSearchedValue(e) {
      return oo(this.searchedCols, e);
    },
    setBatchOffset(e, t = !1) {
      this.setServerSidePagination({ batchOffset: e }, t), this.startOfTheTable();
    },
    setBatchSize(e, t = !1) {
      this.setServerSidePagination({ batchSize: e }, t);
    },
    setRecordsCount(e, t = !1) {
      this.setServerSidePagination({ recordsCount: e }, t);
    },
    setServerSidePagination(e, t = !1) {
      this.prevBatchIndex = this.currentBatchIndex, e = B({}, e), Object.entries(e).forEach(([s, o]) => {
        o < 0 && (o = 0), e[s] = o, this._serverSidePagination[s] = o;
      }), t && this.$emit("update:server-side-pagination", e);
    },
    syncServerSidePagination() {
      this.isServerSidePaginationObject && this.setServerSidePagination(this.serverSidePagination);
    },
    createServerSidePagination() {
      this._serverSidePagination = {
        batchOffset: 0,
        batchSize: 100,
        recordsCount: void 0
      };
    },
    clearAllSearch() {
      this.searchedValue = null, this.searchedCol = void 0, this.searchedCols = {};
    },
    onVirtualScroll(e) {
      var s;
      const t = (s = this.tableEl) == null ? void 0 : s.getElementsByClassName("q-table__middle")[0];
      this.scrollDetails = E(B({}, e), { scrollHeight: t.scrollHeight - t.clientHeight, scrollTop: t.scrollTop }), this.$emit("virtual-scroll", this.scrollDetails);
    },
    startOfTheTable() {
      this.virtualScroll || this.firstPage(), this.startOfThePage();
    },
    startOfThePage() {
      this.scrollTo(0);
    },
    firstPage() {
      return this.$refs.qTable.firstPage();
    },
    scrollTo(e, t) {
      return this.$refs.qTable.scrollTo(e, t);
    },
    getBodyCellProps(e) {
      return E(B({}, e), {
        cellValueComponent: Se,
        cellValueComponentProps: {
          queries: [this.searchedValueFormatted, this.getColSearchedValue(e.col.name)],
          text: e.value
        }
      });
    },
    selectAllHandler(e) {
      if (e && this.passedRows && this.allSelectedBatch != null)
        this.selectedRowsByBatch[this.currentBatchIndex] = [...this.passedRows], this.selected = [...this.selected, ...this.passedRows];
      else {
        this.selectedRowsByBatch[this.currentBatchIndex] = [];
        const t = [];
        Object.values(this.selectedRowsByBatch).forEach((s) => t.push(...s)), this.selected = t;
      }
    }
  },
  mounted() {
    var e, t;
    (this.dssTableName || this.serverSidePagination) && (this.createServerSidePagination(), this.syncServerSidePagination()), this.passedRowsLength = ((e = this.passedRows) == null ? void 0 : e.length) || 0, this.tableEl = (t = this.$refs.qTable) == null ? void 0 : t.$el;
  }
});
const hn = (e) => (U("data-v-e4060177"), e = e(), H(), e), pn = { class: "bs-table-top-container bs-table-name bordered" }, mn = { key: 1 }, gn = { class: "bs-table-search-container bordered" }, bn = { class: "bs-table-top-slot-container bordered" }, fn = /* @__PURE__ */ hn(() => /* @__PURE__ */ b("div", { class: "my-table-details" }, null, -1));
function Sn(e, t, s, o, n, i) {
  const a = d("BsDSSTableFunctional"), l = d("BsSearchWholeTable"), u = d("q-btn"), c = d("BsTableServerSidePagination"), T = d("BsTextHighlight"), _ = d("q-td"), $ = d("BSTableHeader"), C = d("BSTableSearchHeader"), A = d("BsTableBottom"), k = d("QTable");
  return r(), I(F, null, [
    e.isDSSTable ? (r(), p(a, {
      key: 0,
      "dss-table-name": e.dssTableName,
      "server-side-pagination": e._serverSidePagination,
      filters: e.filters,
      "onUpdate:fetching": t[0] || (t[0] = (y) => e.fetching = y),
      "onUpdate:rows": e.updateDSSRows,
      "onUpdate:columns": e.updateDSSColumns,
      "onUpdate:columnsCount": t[1] || (t[1] = (y) => e.setRecordsCount(y, !0))
    }, null, 8, ["dss-table-name", "server-side-pagination", "filters", "onUpdate:rows", "onUpdate:columns"])) : g("", !0),
    m(k, j({
      ref: "qTable",
      rows: e.passedRows,
      columns: e.formattedColumns,
      filter: e.filter,
      "filter-method": e.searchTableFilter,
      loading: e.isLoading
    }, e.$attrs, {
      "header-align": "left",
      "virtual-scroll": e.virtualScroll,
      "rows-per-page-options": e.virtualScroll ? [0] : void 0,
      class: [...e.classParsed, ...e.tableClasses],
      onVirtualScroll: e.onVirtualScroll,
      selected: e.selected,
      "onUpdate:selected": t[6] || (t[6] = (y) => e.selected = y),
      selection: e.selection,
      "row-key": e.rowKey
    }), P({
      top: h(() => [
        b("div", pn, [
          e.$slots.title ? D(e.$slots, "title", { key: 0 }, void 0, !0) : (r(), I("span", mn, N(e.title || e.dssTableName || ""), 1))
        ]),
        b("div", gn, [
          e.globalSearch ? (r(), p(l, {
            key: 0,
            modelValue: e.searchedValue,
            "onUpdate:modelValue": t[2] || (t[2] = (y) => e.searchedValue = y),
            "onUpdate:formattedValue": t[3] || (t[3] = (y) => e.searchedValueFormatted = y),
            "onUpdate:loading": t[4] || (t[4] = (y) => e.searching = y)
          }, null, 8, ["modelValue"])) : g("", !0),
          b("div", {
            class: O(["bs-table-clear-all-btn", e.anyColumnSearched && "bs-table-clear-all-btn--active"])
          }, [
            m(u, {
              flat: "",
              round: "",
              color: "primary",
              icon: e.mdiCloseCircleMultiple,
              onClick: e.clearAllSearch
            }, null, 8, ["icon", "onClick"])
          ], 2)
        ]),
        e._serverSidePagination && e.serverSidePaginationControls && e.passedColumns ? (r(), p(c, {
          key: 0,
          "server-side-pagination": e._serverSidePagination,
          "onUpdate:batchOffset": t[5] || (t[5] = (y) => e.setBatchOffset(y, !0)),
          class: "bordered"
        }, null, 8, ["server-side-pagination"])) : g("", !0),
        b("div", bn, [
          D(e.$slots, "top", {}, void 0, !0)
        ])
      ]),
      "body-cell": h((y) => [
        e.$slots.hasOwnProperty("body-cell") ? D(e.$slots, "body-cell", M(j({ key: 0 }, e.getBodyCellProps(y))), void 0, !0) : (r(), p(_, {
          key: 1,
          props: y
        }, {
          default: h(() => [
            m(T, {
              queries: [e.searchedValueFormatted, e.getColSearchedValue(y.col.name)],
              text: y.value
            }, null, 8, ["queries", "text"])
          ]),
          _: 2
        }, 1032, ["props"]))
      ]),
      "body-cell-clearAllCol": h((y) => [
        m(_, { props: y }, {
          default: h(() => [
            fn
          ]),
          _: 2
        }, 1032, ["props"])
      ]),
      header: h((y) => [
        e.passedColumns ? (r(), p($, {
          key: 0,
          props: y,
          onSearchCol: e.searchCol,
          onSelectAll: e.selectAllHandler,
          loading: e.isLoading,
          selection: e.selection,
          "all-selected": e.allSelectedBatch
        }, null, 8, ["props", "onSearchCol", "onSelectAll", "loading", "selection", "all-selected"])) : g("", !0),
        e.passedColumns ? (r(), p(C, {
          key: 1,
          class: "bordered",
          props: y,
          "searched-cols": e.searchedCols,
          "searched-col": e.searchedCol,
          "selection-on": e.selectionOn,
          onSearchCol: e.updateSearchedCols,
          onClearAll: e.clearAllSearch
        }, null, 8, ["props", "searched-cols", "searched-col", "selection-on", "onSearchCol", "onClearAll"])) : g("", !0)
      ]),
      bottom: h((y) => [
        m(A, {
          scope: y,
          "server-side-pagination": e._serverSidePagination,
          "start-of-the-page": e.startOfThePage,
          searching: e.anyColumnSearched,
          "virtual-scroll": e.virtualScroll,
          "scroll-details": e.scrollDetails,
          "fetched-rows-length": e.passedRowsLength
        }, null, 8, ["scope", "server-side-pagination", "start-of-the-page", "searching", "virtual-scroll", "scroll-details", "fetched-rows-length"])
      ]),
      _: 2
    }, [
      w(e.colSlotsUsed, (y) => ({
        name: e.getColBodySlot(y),
        fn: h((X) => [
          D(e.$slots, e.getColBodySlot(y), M(v(e.getBodyCellProps(X))), void 0, !0)
        ])
      })),
      w(e.filteredSlots, (y, X) => ({
        name: X,
        fn: h((Ue) => [
          D(e.$slots, X, M(v(Ue || {})), void 0, !0)
        ])
      }))
    ]), 1040, ["rows", "columns", "filter", "filter-method", "loading", "virtual-scroll", "rows-per-page-options", "class", "onVirtualScroll", "selected", "selection", "row-key"])
  ], 64);
}
const Tn = /* @__PURE__ */ S(cn, [["render", Sn], ["__scopeId", "data-v-e4060177"]]), Dn = f({
  name: "BsImg",
  components: {
    QImg: mt
  }
});
function yn(e, t, s, o, n, i) {
  const a = d("QImg");
  return r(), p(a, M(v(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const In = /* @__PURE__ */ S(Dn, [["render", yn]]), $n = f({
  name: "BsIcon",
  components: {
    QIcon: Q
  }
});
function _n(e, t, s, o, n, i) {
  const a = d("QIcon");
  return r(), p(a, M(v(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        D(e.$slots, u, M(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Mn = /* @__PURE__ */ S($n, [["render", _n]]), vn = f({
  name: "BsCheckbox",
  components: {
    QCheckbox: _e
  },
  props: {
    hint: {
      type: String
    }
  },
  computed: {
    labelFromHint() {
      return this.$attrs.label ? this.$attrs.label : this.hint ? this.hint : null;
    },
    isHintOnly() {
      return !this.$attrs.label && this.hint;
    },
    isDisabled() {
      return this.$attrs.disable != null;
    }
  }
}), Cn = {
  key: 0,
  class: "dku-tiny-text bs-checkbox__hint"
};
function wn(e, t, s, o, n, i) {
  const a = d("QCheckbox");
  return r(), I("div", {
    class: O(["bs-checkbox", { hint: e.isHintOnly, disabled: e.isDisabled }])
  }, [
    m(a, j(e.$attrs, {
      size: "29.57px",
      tabindex: 0,
      label: e.labelFromHint
    }), P({ _: 2 }, [
      w(e.$slots, (l, u) => ({
        name: u,
        fn: h((c) => [
          D(e.$slots, u, M(v(c || {})))
        ])
      }))
    ]), 1040, ["label"]),
    e.hint && e.$attrs.label ? (r(), I("div", Cn, N(e.hint), 1)) : g("", !0)
  ], 2);
}
const Nn = /* @__PURE__ */ S(vn, [["render", wn]]), Bn = f({
  name: "BsDateRange",
  components: {
    QInput: $e,
    QDate: gt,
    QPopupProxy: bt,
    QIcon: Q,
    QBtn: W
  },
  props: {
    bsLabel: {
      type: String
    }
  },
  computed: {
    inputValue() {
      return this.$attrs.modelValue && this.$attrs.modelValue.from && this.$attrs.modelValue.to ? this.$attrs.modelValue.from + " - " + this.$attrs.modelValue.to : "";
    }
  }
}), Pn = {
  key: 0,
  class: "bs-date-range__label dss-caption-400 q-mb-xs"
}, jn = { class: "row items-center justify-end" };
function On(e, t, s, o, n, i) {
  const a = d("QBtn"), l = d("QDate"), u = d("QPopupProxy"), c = d("QIcon"), T = d("QInput"), _ = ye("close-popup");
  return r(), I("div", null, [
    e.bsLabel ? (r(), I("label", Pn, N(e.bsLabel), 1)) : g("", !0),
    m(T, {
      dense: "",
      outlined: "",
      readonly: "",
      modelValue: e.inputValue,
      "onUpdate:modelValue": t[0] || (t[0] = ($) => e.inputValue = $)
    }, {
      append: h(() => [
        m(c, {
          name: "event",
          class: "cursor-pointer"
        }, {
          default: h(() => [
            m(u, {
              cover: "",
              "transition-show": "scale",
              "transition-hide": "scale"
            }, {
              default: h(() => [
                m(l, j({ range: "" }, e.$attrs), {
                  default: h(() => [
                    b("div", jn, [
                      L(m(a, {
                        label: "Close",
                        color: "primary",
                        flat: ""
                      }, null, 512), [
                        [_]
                      ])
                    ])
                  ]),
                  _: 1
                }, 16)
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["modelValue"])
  ]);
}
const An = /* @__PURE__ */ S(Bn, [["render", On]]);
const kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BsButton: zs,
  BsCheckbox: Nn,
  BsContent: te,
  BsDateRange: An,
  BsDocumentation: se,
  BsDrawer: q,
  BsDrawerBtn: Pe,
  BsHeader: Z,
  BsIcon: Mn,
  BsImg: In,
  BsLayoutDefault: Ds,
  BsLayoutDrawer: je,
  BsLayoutHeader: Oe,
  BsMenuTab: Ae,
  BsMenuTabs: ke,
  BsRange: Rs,
  BsSelect: Os,
  BsSlider: Ys,
  BsSpinner: Xs,
  BsTab: Ve,
  BsTabChild: G,
  BsTabIcon: J,
  BsTabPageChildWrapper: de,
  BsTabTitle: ue,
  BsTable: Tn,
  BsToggle: Ns,
  BsTooltip: Qs,
  CheckSlotComponentsMixin: le,
  ProvideMixin: re
}, Symbol.toStringTag, { value: "Module" })), Hn = {
  version: "1.4.1",
  install(e) {
    Ct(e, { components: kn });
  }
}, Wn = "1.4.1";
export {
  zs as BsButton,
  Nn as BsCheckbox,
  te as BsContent,
  An as BsDateRange,
  se as BsDocumentation,
  q as BsDrawer,
  Pe as BsDrawerBtn,
  Z as BsHeader,
  Mn as BsIcon,
  In as BsImg,
  Ds as BsLayoutDefault,
  je as BsLayoutDrawer,
  Oe as BsLayoutHeader,
  Ae as BsMenuTab,
  ke as BsMenuTabs,
  Rs as BsRange,
  Os as BsSelect,
  Ys as BsSlider,
  Xs as BsSpinner,
  Ve as BsTab,
  G as BsTabChild,
  J as BsTabIcon,
  de as BsTabPageChildWrapper,
  ue as BsTabTitle,
  Tn as BsTable,
  Ns as BsToggle,
  Qs as BsTooltip,
  le as CheckSlotComponentsMixin,
  re as ProvideMixin,
  Hn as QuasarBs,
  Y as ServerApi,
  Wn as version
};
