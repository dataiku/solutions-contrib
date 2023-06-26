var Ee = Object.defineProperty, Ue = Object.defineProperties;
var He = Object.getOwnPropertyDescriptors;
var ce = Object.getOwnPropertySymbols;
var We = Object.prototype.hasOwnProperty, qe = Object.prototype.propertyIsEnumerable;
var he = (e, t, s) => t in e ? Ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, j = (e, t) => {
  for (var s in t || (t = {}))
    We.call(t, s) && he(e, s, t[s]);
  if (ce)
    for (var s of ce(t))
      qe.call(t, s) && he(e, s, t[s]);
  return e;
}, W = (e, t) => Ue(e, He(t));
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
import Ye from "axios";
import { defineComponent as g, computed as Te, openBlock as r, createBlock as p, Teleport as K, renderSlot as T, createCommentVNode as S, resolveComponent as d, withCtx as h, createVNode as m, normalizeStyle as z, normalizeClass as O, createElementVNode as b, createElementBlock as _, createTextVNode as Ze, toDisplayString as N, pushScopeId as E, popScopeId as U, mergeProps as B, withDirectives as L, vShow as Z, Fragment as F, renderList as w, createSlots as P, normalizeProps as I, guardReactiveProps as C, resolveDirective as _e } from "vue";
import { QCard as Fe, QBtn as H, QIcon as V, QDrawer as Ge, QHeader as Re, QTab as Xe, QTooltip as $e, QTabs as Je, QPageContainer as xe, QPage as Ke, QLayout as et, QSelect as tt, QSlider as st, QRange as ot, QSpinner as nt, QInput as De, QTh as ne, QMenu as at, QItem as it, QItemSection as rt, QList as lt, QTr as ae, QLinearProgress as dt, QTable as ut, QTd as ct, QImg as ht, QCheckbox as pt, QDate as mt, QPopupProxy as bt } from "quasar";
import { isEqual as gt, uniqueId as ft, isUndefined as Q, isNull as St, escape as Tt, isEmpty as Me } from "lodash";
import { mdiMagnify as ie, mdiArrowUpThin as _t, mdiSortAscending as me, mdiSortDescending as be, mdiChevronDown as $t, mdiAlert as Dt, mdiTrashCanOutline as Mt, mdiCloseCircleMultiple as yt } from "@quasar/extras/mdi-v6";
function It(e) {
  return e !== null && typeof e == "object" && Array.isArray(e) !== !0;
}
function Ct(e, t) {
  t.components !== void 0 && Object.values(t.components).forEach((s) => {
    It(s) === !0 && s.name !== void 0 && e.component(s.name, s);
  });
}
function ee(e) {
  return new Promise((t, s) => {
    e.then((o) => t(o == null ? void 0 : o.data)).catch((o) => s(o));
  });
}
class x {
  static initClient(t) {
    this._restApiEndpoint = t, this.client = Ye.create({ baseURL: this._restApiEndpoint }), this.client.interceptors.response.use(
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
  static getDatasetGenericData(t) {
    return this.doPost("bs_api/dataset/get_generic_data", {
      dataset_name: t
    });
  }
}
x.errors = [];
x.initialized = !1;
const re = g({
  name: "ProvideMixin",
  methods: {
    providePrefixed(e, t) {
      const { prefix: s, getter: o } = j({
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
      const s = W(j({}, t), {
        getter: (o) => this.createComputedFromKey(o)
      });
      return this.providePrefixed(e, s);
    },
    provideStatic(e, t) {
      const s = W(j({}, t), {
        getter: (o) => this[o]
      });
      return this.providePrefixed(e, s);
    }
  }
}), le = g({
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
function vt(...e) {
  e.forEach(([t, s]) => {
    setTimeout(() => {
      t();
    }, s);
  });
}
function ye(e, t, s, o, n = 50) {
  vt(
    [e, n * +!s],
    [t, o * +s]
  );
}
const Ie = (e) => `bs-menu-tab-${e}`, Ce = (e) => `tab-content-id-${e}`, wt = g({
  name: "BsTabPageChildWrapper",
  inject: ["$qPageMounted", "$tabId"],
  computed: {
    contentCSSSelector() {
      return `#${this.tabContentId}`;
    },
    tabContentId() {
      return Ce(this.tabId);
    },
    tabId() {
      return this == null ? void 0 : this.$tabId;
    },
    qPageMounted() {
      return this == null ? void 0 : this.$qPageMounted;
    }
  }
}), f = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [o, n] of t)
    s[o] = n;
  return s;
};
function Nt(e, t, s, o, n, i) {
  return e.qPageMounted ? (r(), p(K, {
    key: 0,
    to: e.contentCSSSelector
  }, [
    T(e.$slots, "default")
  ], 8, ["to"])) : S("", !0);
}
const de = /* @__PURE__ */ f(wt, [["render", Nt]]), jt = g({
  name: "BsContent",
  components: {
    BsTabPageChildWrapper: de
  }
});
function Pt(e, t, s, o, n, i) {
  const a = d("BsTabPageChildWrapper");
  return r(), p(a, null, {
    default: h(() => [
      T(e.$slots, "default")
    ]),
    _: 3
  });
}
const te = /* @__PURE__ */ f(jt, [["render", Pt]]), Bt = g({
  name: "BsDocumentation",
  components: {
    QCard: Fe,
    QBtn: H,
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
      return j(j(j(j({}, this.defaultDocsPropValues), this.layoutDocsProps), this.tabDocsProps), this.docsProps);
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
      ye(
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
}), ve = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNjQ2IDAuNzAzNjEzQzAuNzM2ODU3IDAuNzAzNjEzIDAgMS40MTMxOCAwIDIuMjg4NjVWNy43ODUyNEMwIDguNjYwNzEgMC43MzY4NTcgOS4zNzAyOCAxLjY0NiA5LjM3MDI4SDQuMDkwNjVDNC4wMzExMSA5LjA1ODAyIDQgOC43MzYxNyA0IDguNDA3MzJIMy43NVYxLjY2NjU4SDEwLjM1NEMxMC43MTA5IDEuNjY2NTggMTEgMS45NDUwMSAxMSAyLjI4ODY1VjMuMzEwMzFDMTEuMzQ4NiAzLjQwNTI0IDExLjY4MzIgMy41MzI0NCAxMiAzLjY4ODM1VjIuMjg4NjVDMTIgMS40MTMxOCAxMS4yNjMxIDAuNzAzNjEzIDEwLjM1NCAwLjcwMzYxM0gxLjY0NlpNMi43NSAxLjY2NjU4VjguNDA3MzJIMS42NDZDMS4yODkxNCA4LjQwNzMyIDEgOC4xMjg4OCAxIDcuNzg1MjRWMi4yODg2NUMxIDEuOTQ1MDEgMS4yODkxNCAxLjY2NjU4IDEuNjQ2IDEuNjY2NThIMi43NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNDk5OSA3LjUxODVDOC45ODk5IDcuNTE4NSA4LjU3Njg5IDcuOTE2MjEgOC41NzY4OSA4LjQwNzMyQzguNTc2ODkgOC44OTg0MyA4Ljk4OTkgOS4yOTYxMyA5LjQ5OTkgOS4yOTYxM0MxMC4wMDk5IDkuMjk2MTMgMTAuNDIyOSA4Ljg5ODQzIDEwLjQyMjkgOC40MDczMkMxMC40MjI5IDcuOTE2MjEgMTAuMDA5OSA3LjUxODUgOS40OTk5IDcuNTE4NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNSAxMi43NDA2QzExLjk4NSAxMi43NDA2IDE0IDEwLjgwMDMgMTQgOC40MDczMkMxNCA2LjAxNDM1IDExLjk4NSA0LjA3Mzk4IDkuNSA0LjA3Mzk4QzcuMDE1IDQuMDczOTggNSA2LjAxNDM1IDUgOC40MDczMkM1IDEwLjgwMDMgNy4wMTUgMTIuNzQwNiA5LjUgMTIuNzQwNlpNOS41MDI5IDUuNTE4NDNDOS43Mjg5IDUuNTIxMzIgOS45NTM5IDUuNTQ2MzUgMTAuMTczOSA1LjU5MzU0QzEwLjI2OTkgNS42MTM3NiAxMC4zNDE5IDUuNjkxNzYgMTAuMzUyOSA1Ljc4NjEzTDEwLjQwNDkgNi4yMzg3MkMxMC40Mjg5IDYuNDQ2NzIgMTAuNjEwOSA2LjYwMzY5IDEwLjgyNzkgNi42MDM2OUMxMC44ODU5IDYuNjAzNjkgMTAuOTQzOSA2LjU5MjEzIDEwLjk5NzkgNi41NjkwMkwxMS40Mjg5IDYuMzg3MDJDMTEuNTE4OSA2LjM0OTQ3IDExLjYyMjkgNi4zNjk2OSAxMS42ODk5IDYuNDM5MDJDMTIuMDAwOSA2Ljc1OTY5IDEyLjIzMjkgNy4xNDM5MSAxMi4zNjc5IDcuNTYyOEMxMi4zOTY5IDcuNjUzMzIgMTIuMzYzOSA3Ljc1MTU0IDEyLjI4NDkgNy44MDczOUwxMS45MDI5IDguMDc4OTVDMTEuNzkzOSA4LjE1NTk4IDExLjcyOTkgOC4yNzgyOCAxMS43Mjk5IDguNDA4MjhDMTEuNzI5OSA4LjUzODI4IDExLjc5MzkgOC42NjA1OCAxMS45MDM5IDguNzM4NThMMTIuMjg1OSA5LjAxMDEzQzEyLjM2NDkgOS4wNjU5OCAxMi4zOTg5IDkuMTY0MjEgMTIuMzY5OSA5LjI1NDcyQzEyLjIzNDkgOS42NzM2MSAxMi4wMDI5IDEwLjA1NzggMTEuNjkxOSAxMC4zNzg1QzExLjYyNDkgMTAuNDQ2OSAxMS41MTk5IDEwLjQ2ODEgMTEuNDMwOSAxMC40MzA1TDEwLjk5NzkgMTAuMjQ3NUMxMC44NzM5IDEwLjE5NTUgMTAuNzMxOSAxMC4yMDMyIDEwLjYxNDkgMTAuMjY3OEMxMC40OTc5IDEwLjMzMzIgMTAuNDE5OSAxMC40NDc4IDEwLjQwNDkgMTAuNTc2OUwxMC4zNTI5IDExLjAyOTVDMTAuMzQxOSAxMS4xMjI5IDEwLjI3MTkgMTEuMTk5OSAxMC4xNzY5IDExLjIyMTFDOS43MzA5IDExLjMyMzIgOS4yNjY5IDExLjMyMzIgOC44MjA5IDExLjIyMTFDOC43MjU5IDExLjE5ODkgOC42NTU5IDExLjEyMjkgOC42NDQ5IDExLjAyOTVMOC41OTI5IDEwLjU3NzhDOC41Nzc5IDEwLjQ0ODggOC40OTk5IDEwLjMzNDIgOC4zODI5IDEwLjI2OTdDOC4yNjU5IDEwLjIwNTIgOC4xMjM5IDEwLjE5NzUgOC4wMDA5IDEwLjI0OTVMNy41Njc4OSAxMC40MzI0QzcuNDc3OSAxMC40NyA3LjM3MzkgMTAuNDQ5OCA3LjMwNjkgMTAuMzgwNEM2Ljk5NTkgMTAuMDU5OCA2Ljc2MzkgOS42NzU1NCA2LjYyODg5IDkuMjU1NjlDNi41OTk5IDkuMTY1MTcgNi42MzM5IDkuMDY2OTUgNi43MTI5IDkuMDExMDlMNy4wOTU4OSA4LjczOTU0QzcuMjA0OSA4LjY2MjUgNy4yNjg5IDguNTQwMjEgNy4yNjg5IDguNDEwMjFDNy4yNjg5IDguMjgwMjEgNy4yMDQ5IDguMTU3OTEgNy4wOTU4OSA4LjA3OTkxTDYuNzEzODkgNy44MDkzMkM2LjYzNDkgNy43NTM0NiA2LjYwMDkgNy42NTUyNCA2LjYyOTkgNy41NjQ3MkM2Ljc2NDkgNy4xNDU4MyA2Ljk5Njg5IDYuNzYxNjEgNy4zMDc4OSA2LjQ0MDk1QzcuMzc0OSA2LjM3MjU4IDcuNDc5OSA2LjM1MTM5IDcuNTY4OSA2LjM4ODk1TDcuOTk5OSA2LjU3MDk1QzguMTIzOSA2LjYyMjk1IDguMjY1ODkgNi42MTUyNCA4LjM4Mzg5IDYuNTQ5NzZDOC41MDA5IDYuNDg0MjggOC41Nzg5IDYuMzY5NjkgOC41OTM4OSA2LjIzOTY5TDguNjQ1OSA1Ljc4ODA2QzguNjU2OSA1LjY5MzY5IDguNzI4OSA1LjYxNjY1IDguODI0OSA1LjU5NTQ2QzkuMDQ1OSA1LjU0ODI4IDkuMjcwOSA1LjUyMzI0IDkuNTAxOSA1LjUyMDM1TDkuNTAyOSA1LjUxODQzWiIgZmlsbD0iIzAxQjJBQSIvPgo8L3N2Zz4K";
const we = (e) => (E("data-v-47db9d18"), e = e(), U(), e), Ot = /* @__PURE__ */ we(() => /* @__PURE__ */ b("div", { class: "row items-center q-gutter-sm no-wrap" }, [
  /* @__PURE__ */ b("img", {
    src: ve,
    width: "15",
    height: "16"
  }),
  /* @__PURE__ */ b("span", { class: "btn-solution-text" }, "Dataiku Solutions")
], -1)), At = { class: "flex row items-center q-gutter-sm q-mb-lg" }, kt = ["src", "width", "height"], zt = { class: "dku-large-title-sb" }, Lt = { class: "doc-body" }, Vt = /* @__PURE__ */ we(() => /* @__PURE__ */ b("div", { class: "doc-footer flex row items-center" }, [
  /* @__PURE__ */ b("span", { class: "doc-footer__icon" }, [
    /* @__PURE__ */ b("img", {
      src: ve,
      width: "14",
      height: "12.5"
    })
  ]),
  /* @__PURE__ */ b("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
], -1));
function Qt(e, t, s, o, n, i) {
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
          Ot
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
          b("div", At, [
            e.mDocsProps.docIcon ? (r(), _("img", {
              key: 0,
              src: e.mDocsProps.docIcon,
              width: e.mDocsProps.docImageDimensions.width,
              height: e.mDocsProps.docImageDimensions.height
            }, null, 8, kt)) : S("", !0),
            b("span", zt, [
              e.$slots.title ? T(e.$slots, "title", { key: 0 }, void 0, !0) : S("", !0),
              Ze(" " + N(e.$slots.title ? "" : e.mDocsProps.docTitle), 1)
            ])
          ]),
          b("div", Lt, [
            T(e.$slots, "default", {}, void 0, !0)
          ]),
          Vt
        ]),
        _: 3
      }, 8, ["style", "class"])
    ]),
    _: 3
  });
}
const se = /* @__PURE__ */ f(Bt, [["render", Qt], ["__scopeId", "data-v-47db9d18"]]), G = g({
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
}), Et = g({
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
function Ut(e, t, s, o, n, i) {
  return e.defaultTabUsed ? S("", !0) : (r(), _("div", B({ key: 0 }, e.$attrs, { class: "text-primary bs-tab-title dku-medium-title-sb q-px-md" }), N(e.tabName), 17));
}
const ue = /* @__PURE__ */ f(Et, [["render", Ut], ["__scopeId", "data-v-9ace8c82"]]), Ht = g({
  name: "BsDrawer",
  extends: G,
  components: {
    BsTabTitle: ue
  }
});
const Wt = { class: "bs-drawer-container" };
function qt(e, t, s, o, n, i) {
  const a = d("BsTabTitle");
  return e.qLayoutMounted ? (r(), p(K, {
    key: 0,
    to: ".q-drawer"
  }, [
    L(b("div", Wt, [
      m(a),
      T(e.$slots, "default", {}, void 0, !0)
    ], 512), [
      [Z, e.showComponent]
    ])
  ])) : S("", !0);
}
const q = /* @__PURE__ */ f(Ht, [["render", qt], ["__scopeId", "data-v-ef244777"]]), Yt = g({
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
function Zt(e, t, s, o, n, i) {
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
        [Z, e.appendTabTitleToHeader]
      ]),
      T(e.$slots, "default", {}, void 0, !0)
    ], 6), [
      [Z, e.showComponent]
    ])
  ])) : S("", !0);
}
const Y = /* @__PURE__ */ f(Yt, [["render", Zt], ["__scopeId", "data-v-f4a44855"]]), Ft = g({
  name: "BsTabIcon",
  inject: ["$menuTabsMounted", "$tabId"],
  components: {
    QIcon: V
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
      return Ie(this.tabId);
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
    e.iconName ? (r(), p(a, B({ key: 0 }, e.$attrs, { name: e.iconName }), null, 16, ["name"])) : S("", !0),
    T(e.$slots, "default")
  ], 8, ["to"])) : S("", !0);
}
const X = /* @__PURE__ */ f(Ft, [["render", Gt]]), Rt = g({
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
      ye(
        () => this.hide = t,
        () => this.hidden = t,
        t,
        this.hideTransitionDuration
      );
    }
  }
}), Xt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTYgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDRDMTAuNjI3NCAwIDE2IDUuMzcyNTggMTYgMTJWODhDMTYgOTQuNjI3NCAxMC42Mjc0IDEwMCA0IDEwMEgwVjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjUiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjkiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMV8xNjY4IiB4PSI1IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMV8xNjY4IiB4PSI5IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=";
const Jt = (e) => (E("data-v-9969ac6c"), e = e(), U(), e), xt = /* @__PURE__ */ Jt(() => /* @__PURE__ */ b("img", { src: Xt }, null, -1)), Kt = [
  xt
];
function es(e, t, s, o, n, i) {
  return L((r(), _("div", {
    onClick: t[0] || (t[0] = (...a) => e.toggleLeftPanel && e.toggleLeftPanel(...a)),
    class: O([e.hide && "hide", e.hidden && "hidden", "toggle-left-button"]),
    style: z({
      "--hide-transition-duration": `.${e.hideTransitionDuration}s`
    })
  }, Kt, 6)), [
    [Z, e.showComponent]
  ]);
}
const Ne = /* @__PURE__ */ f(Rt, [["render", es], ["__scopeId", "data-v-9969ac6c"]]), ts = g({
  name: "BsLayoutDrawer",
  components: {
    QDrawer: Ge,
    BsDrawerBtn: Ne
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
function ss(e, t, s, o, n, i) {
  const a = d("BsDrawerBtn"), l = d("QDrawer");
  return r(), p(l, B(e.drawerProps, {
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
const je = /* @__PURE__ */ f(ts, [["render", ss], ["__scopeId", "data-v-8f8c14f8"]]), os = g({
  name: "BsLayoutHeader",
  components: {
    QHeader: Re
  }
});
function ns(e, t, s, o, n, i) {
  const a = d("QHeader");
  return r(), p(a, {
    bordered: "",
    class: "bg-white bs-header"
  });
}
const Pe = /* @__PURE__ */ f(os, [["render", ns], ["__scopeId", "data-v-9ba496fa"]]), as = g({
  name: "BsMenuTab",
  components: {
    QTab: Xe,
    QTooltip: $e
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
      return e = e || `${this.tabIndex}` || "", Ie(e);
    }
  }
});
const is = { class: "tab-name-tooltip" }, rs = ["id"];
function ls(e, t, s, o, n, i) {
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
          b("span", is, N(e.name), 1)
        ]),
        _: 1
      }),
      e.tabId ? (r(), _("span", {
        key: 0,
        id: e.getBsMenuTabId(e.tabId)
      }, null, 8, rs)) : S("", !0)
    ]),
    _: 1
  }, 8, ["name", "icon"]);
}
const Be = /* @__PURE__ */ f(as, [["render", ls], ["__scopeId", "data-v-61b2252d"]]), ds = g({
  name: "BsMenuTabs",
  components: {
    QTabs: Je
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
const us = { class: "tabs-container" };
function cs(e, t, s, o, n, i) {
  const a = d("q-tabs");
  return r(), _("div", us, [
    m(a, {
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[0] || (t[0] = (l) => e.$emit("update:model-value", l)),
      vertical: "",
      "active-color": "primary",
      "indicator-color": "primary",
      "active-bg-color": "white"
    }, {
      default: h(() => [
        T(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["model-value"])
  ]);
}
const Oe = /* @__PURE__ */ f(ds, [["render", cs], ["__scopeId", "data-v-0b4a6261"]]);
class Ae {
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
const J = class {
  constructor(e = "default") {
    typeof e != "string" && (console.error("instanceKey param should be of type string! Using default instance."), e = "default"), J.instances.hasOwnProperty(e) || (J.instances[e] = new Ae()), this.instance = J.instances[e];
  }
  slug(e, t = {}) {
    return this.instance.slug(e, t);
  }
};
let ke = J;
ke.instances = {};
const hs = new ke("tabs"), ps = g({
  name: "BsTab",
  mixins: [le, re],
  components: {
    BsDrawer: q,
    BsHeader: Y,
    BsDocumentation: se,
    BsContent: te,
    BsTabIcon: X,
    QPageContainer: xe,
    QPage: Ke
  },
  data() {
    return {
      index: 0,
      tabId: hs.slug(this.name),
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
      return Ce(this.tabId);
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
      return this.usingComponent(Y) || this.usingSlotHeader || this.defaultHeader;
    },
    drawer() {
      return this.usingComponent(q) || this.usingSlotDrawer || this.defaultDrawer;
    },
    tabIcon() {
      return this.usingComponent(X) || this.usingSlotTabIcon ? void 0 : this.icon;
    },
    usingSlotHeader() {
      return this.usingSlot(Y, "header", "head");
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
      return this.usingSlot(X, "tabicon");
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
const ms = ["id"];
function bs(e, t, s, o, n, i) {
  const a = d("BsHeader"), l = d("BsDrawer"), u = d("BsDocumentation"), c = d("BsTabIcon"), M = d("BsContent"), y = d("QPage"), $ = d("QPageContainer");
  return r(), _(F, null, [
    e.usingSlotHeader || !(e.header || e.defaultTabUsed) ? (r(), p(a, { key: 0 }, {
      default: h(() => [
        e.$slots.header ? S("", !0) : T(e.$slots, "head", { key: 0 }, void 0, !0),
        T(e.$slots, "header", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    e.usingSlotDrawer ? (r(), p(l, { key: 1 }, {
      default: h(() => [
        e.$slots.drawer ? S("", !0) : T(e.$slots, "leftpanel", { key: 0 }, void 0, !0),
        T(e.$slots, "drawer", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    e.usingSlotDocumentation ? (r(), p(u, {
      key: 2,
      modelValue: e.openDoc,
      "onUpdate:modelValue": t[0] || (t[0] = (v) => e.openDoc = v)
    }, {
      default: h(() => [
        T(e.$slots, "documentation", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue"])) : S("", !0),
    !e.defaultTabUsed && e.usingSlotTabIcon ? (r(), p(c, { key: 3 }, {
      default: h(() => [
        T(e.$slots, "tabicon", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    L(m($, null, {
      default: h(() => [
        m(y, { onVnodeMounted: e.onQPageMounted }, {
          default: h(() => [
            b("div", {
              class: "content",
              id: e.tabContentId
            }, [
              e.usingSlotContent ? (r(), p(M, { key: 0 }, {
                default: h(() => [
                  T(e.$slots, "content", {}, void 0, !0)
                ]),
                _: 3
              })) : S("", !0)
            ], 8, ms)
          ]),
          _: 3
        }, 8, ["onVnodeMounted"])
      ]),
      _: 3
    }, 512), [
      [Z, e.isTabSelected]
    ]),
    T(e.$slots, "default", {}, void 0, !0)
  ], 64);
}
const ze = /* @__PURE__ */ f(ps, [["render", bs], ["__scopeId", "data-v-694ef9e9"]]), gs = new Ae(), fs = g({
  name: "BsLayoutDefault",
  mixins: [re, le],
  components: {
    BsTab: ze,
    BsMenuTab: Be,
    BsMenuTabs: Oe,
    BsLayoutDrawer: je,
    BsLayoutHeader: Pe,
    QLayout: et
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
      e = j(j({}, e), s);
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
      return `tab-content-id-${gs.slug(this.defaultLayoutTabName)}`;
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
      return !!this.getSlotComponents(Y.name).length;
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
function Ss(e, t, s, o, n, i) {
  const a = d("BsLayoutDrawer"), l = d("BsLayoutHeader"), u = d("BsMenuTab"), c = d("BsMenuTabs"), M = d("BsTab"), y = d("QLayout");
  return r(), p(y, {
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
          (r(!0), _(F, null, w(e.tabs, ({ name: $, icon: v, tabId: A }, k) => (r(), p(u, {
            name: $,
            "tab-id": A,
            icon: v,
            "tab-index": k
          }, null, 8, ["name", "tab-id", "icon", "tab-index"]))), 256))
        ]),
        _: 1
      }, 8, ["modelValue"])) : S("", !0),
      e.mounted && e.defaultTabUsed ? (r(), p(M, {
        key: 1,
        "onMounted:qPage": t[5] || (t[5] = ($) => e.qPageMounted = !0),
        name: e.defaultLayoutTabName
      }, P({
        default: h(() => [
          T(e.$slots, "default")
        ]),
        _: 2
      }, [
        w(e.activeTabSlots, ($) => ({
          name: $,
          fn: h(() => [
            T(e.$slots, $)
          ])
        }))
      ]), 1032, ["name"])) : T(e.$slots, "default", { key: 2 })
    ]),
    _: 3
  }, 8, ["style"]);
}
const Ts = /* @__PURE__ */ f(fs, [["render", Ss]]), _s = {
  xs: 18,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 34
}, $s = function(e, t = _s) {
  return e !== void 0 ? e in t ? `${t[e]}px` : e : null;
}, Ds = {
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
}, Ms = ["update:modelValue"];
function ge(e) {
  e.cancelable !== !1 && e.preventDefault(), e.stopPropagation();
}
const ys = g({
  name: "BsToggle",
  data() {
    return {};
  },
  props: j({}, Ds),
  emits: Ms,
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
      return $s(this.size);
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
      e !== void 0 && ge(e), this.disable !== !0 && (console.log("next value"), console.log(this.isTrue), console.log(this.getNextValue()), this.$emit("update:modelValue", this.getNextValue(), e));
    },
    onKeydown(e) {
      (e.keyCode === 13 || e.keyCode === 32) && ge(e);
    },
    onKeyup(e) {
      (e.keyCode === 13 || e.keyCode === 32) && this.onClick(e);
    }
  }
}), Is = ["checked", "value"], Cs = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function vs(e, t, s, o, n, i) {
  return r(), _("div", {
    class: O([{
      "bs-toggle--is-disabled": e.disable
    }, "bs-toggle"]),
    style: z({ "font-size": e.fontSize })
  }, [
    e.labelLeft ? (r(), _("label", {
      key: 0,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelLeft), 3)) : S("", !0),
    b("input", {
      type: "checkbox",
      checked: e.isTrue === !0,
      value: e.modelIsArray === !0 ? e.val : e.trueValue,
      class: "bs-toggle__input"
    }, null, 8, Is),
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
    e.labelRight ? (r(), _("label", {
      key: 1,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelRight), 3)) : S("", !0)
  ], 6);
}
const ws = /* @__PURE__ */ f(ys, [["render", vs]]), Ns = g({
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
    QSelect: tt
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
}), js = {
  key: 0,
  class: "bs-select__label dss-caption-400 q-mb-xs"
};
function Ps(e, t, s, o, n, i) {
  const a = d("QSelect");
  return r(), _("div", null, [
    e.bsLabel ? (r(), _("label", js, N(e.bsLabel), 1)) : S("", !0),
    m(a, B({ ref: "bsSelect" }, e.$attrs, {
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
          T(e.$slots, u, I(C(c || {})))
        ])
      }))
    ]), 1040, ["onPopupShow", "onPopupHide", "popup-content-style", "label"])
  ]);
}
const Bs = /* @__PURE__ */ f(Ns, [["render", Ps]]), Os = g({
  name: "BsButton",
  components: {
    QBtn: H
  }
});
function As(e, t, s, o, n, i) {
  const a = d("QBtn");
  return r(), p(a, B(e.$attrs, { unelevated: "" }), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const ks = /* @__PURE__ */ f(Os, [["render", As]]), zs = g({
  name: "BsTooltip",
  components: {
    QTooltip: $e
  }
});
function Ls(e, t, s, o, n, i) {
  const a = d("QTooltip");
  return r(), p(a, I(C(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const Vs = /* @__PURE__ */ f(zs, [["render", Ls]]), Qs = g({
  name: "BsSlider",
  components: {
    QSlider: st
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
}), Es = { class: "flex row bs-slider no-wrap" }, Us = ["value", "min", "max", "step"];
function Hs(e, t, s, o, n, i) {
  const a = d("QSlider");
  return r(), _("div", Es, [
    m(a, B(e.$attrs, {
      style: { width: e.sliderWidth + "px" },
      "thumb-size": "15px",
      "track-size": "3.5px"
    }), P({ _: 2 }, [
      w(e.$slots, (l, u) => ({
        name: u,
        fn: h((c) => [
          T(e.$slots, u, I(C(c || {})))
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
    }, null, 40, Us)
  ]);
}
const Ws = /* @__PURE__ */ f(Qs, [["render", Hs]]), qs = g({
  name: "BsRange",
  components: {
    QRange: ot
  }
});
function Ys(e, t, s, o, n, i) {
  const a = d("QRange");
  return r(), p(a, I(C(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const Zs = /* @__PURE__ */ f(qs, [["render", Ys]]), Fs = g({
  name: "BsSpinner",
  components: {
    QSpinner: nt
  }
});
function Gs(e, t, s, o, n, i) {
  const a = d("QSpinner");
  return r(), p(a, I(C(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const Rs = /* @__PURE__ */ f(Fs, [["render", Gs]]), Xs = g({
  name: "BsDSSTable",
  props: {
    dssTableName: {
      type: String
    },
    serverSidePagination: Object
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
    dssTableName(...e) {
      this.updateTableDataOnWatchedChanged(...e);
    },
    "serverSidePagination.batchSize"(...e) {
      this.updateTableDataOnWatchedChanged(...e);
    },
    "serverSidePagination.batchOffset"(...e) {
      this.updateTableDataOnWatchedChanged(...e);
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
        this.setFetchingChunk(!0), x.getDatasetChunk(...e).then((o) => {
          const n = this.transformDSSDataToQTableRow(o);
          t(n);
        }).catch(s).finally(() => {
          this.setFetchingChunk(!1);
        });
      });
    },
    fetchDSSColumns(...e) {
      return this.setFetchingSchema(!0), new Promise((t, s) => {
        x.getDatasetGenericData(...e).then(({ schema: o, columnsCount: n }) => {
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
      this.fetchDSSData(...e).then((t) => {
        this.$emit("update:rows", t);
      });
    },
    parseDSSColumn(e) {
      return e === "index" ? "in_dss_index" : e;
    },
    createBsTableCol(e) {
      const t = (e == null ? void 0 : e.name) || "default";
      return j({
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
        n = this.parseDSSColumn(n), Object.values(i).forEach((l, u) => {
          const c = o[u];
          c[n] = l;
        });
      }), o;
    },
    updateTableData() {
      const { batchSize: e, batchOffset: t } = this.serverSidePagination || {};
      this.dssTableName && e && t !== void 0 && (this.updateColumns(this.dssTableName), this.updateRows(this.dssTableName, e, t));
    },
    updateTableDataOnWatchedChanged(e, t) {
      gt(e, t) || this.updateTableData();
    }
  },
  mounted() {
    this.updateTableData();
  }
});
function Js(e, t, s, o, n, i) {
  return null;
}
const xs = /* @__PURE__ */ f(Xs, [["render", Js]]), Ks = 45, eo = 250;
let oe = () => {
};
{
  let e = function(o, n, i, ...a) {
    i === void 0 && (i = o), t.set(i, Date.now()), s.set(i, n), setTimeout(() => {
      if (!t.has(i))
        return;
      const l = s.get(i), u = t.get(i);
      (l < eo || Date.now() - u > l - Ks) && (a ? o(...a) : o(), t.delete(i));
    }, n);
  };
  const t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  oe = e;
}
function Le(e, t, s, ...o) {
  return o ? oe(e, t, s, ...o) : oe(e, t, s);
}
function to(e, t, s = !1) {
  let o = e.length, n = 0, i = [];
  if (o) {
    const a = (l = 0) => t.indexOf(e, l);
    s || (t = t.toLowerCase(), e = e.toLowerCase());
    for (let l = a(n); l > -1; l = a(n))
      i.push(l), n = l + o;
  }
  return i;
}
function so(e, t) {
  return e.hasOwnProperty(t) ? e[t] : void 0;
}
function fe(e, t, s, o) {
  {
    const n = o(e, t) + "";
    return (n === "undefined" || n === "null" ? "" : n.toLowerCase()).includes(s);
  }
}
function oo(e) {
  return e ? `${e}`.toLowerCase() : "";
}
function no(e, { columns: t, searchVal: s }, o, n) {
  let i = e;
  const a = Object.keys(t);
  if (a.length) {
    const l = o.filter((u) => a.includes(u.name));
    i = i.filter((u) => l.every((c) => {
      const M = t[c.name];
      return fe(c, u, M, n);
    }));
  }
  return s && (i = i.filter((l) => o.some((u) => fe(u, l, s, n)))), i;
}
const ao = g({
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
      default: oo
    }
  },
  components: { QInput: De },
  emits: ["update:model-value", "update:loading", "update:formatted-value", "update:no-debounce:formatted-value"],
  data() {
    return {
      inputDebouncing: !1,
      value: null,
      id: ft("bs-input-debounce-")
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
      this.updateValueNoDebounce(e), this.setLoading(!0), Le(
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
function io(e, t, s, o, n, i) {
  const a = d("QInput");
  return r(), p(a, B({
    "model-value": e.value,
    "onUpdate:modelValue": e.updateValueDebounce,
    loading: e.inputDebouncing
  }, e.$attrs), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040, ["model-value", "onUpdate:modelValue", "loading"]);
}
const Ve = /* @__PURE__ */ f(ao, [["render", io]]), ro = g({
  name: "BsSearchTable",
  components: {
    QIcon: V,
    BsInputDebounce: Ve
  },
  data() {
    return {
      searchColIcon: ie
    };
  }
});
const lo = { class: "bs-search-table-container" };
function uo(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsInputDebounce");
  return r(), _("div", lo, [
    m(l, B({
      width: "190",
      label: "Search items",
      dense: "",
      filled: "",
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
        fn: h((M) => [
          T(e.$slots, c, I(C(M || {})), void 0, !0)
        ])
      }))
    ]), 1040)
  ]);
}
const co = /* @__PURE__ */ f(ro, [["render", uo], ["__scopeId", "data-v-fff3c7fd"]]), ho = g({
  name: "BSTableColHeader",
  components: {
    QIcon: V,
    QTh: ne,
    QMenu: at,
    QItem: it,
    QItemSection: rt,
    QList: lt
  },
  emits: ["search-col"],
  data() {
    return {
      mdiArrowUpThin: _t,
      mdiSortAscending: me,
      mdiSortDescending: be,
      mdiChevronDown: $t,
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
      return this.sortAsc ? me : be;
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
const po = (e) => (E("data-v-0cf707e9"), e = e(), U(), e), mo = { class: "bs-table-col-header-container" }, bo = {
  class: "bs-table-col-header-title-container",
  ref: "BsTableColHeaderTitleContainer"
}, go = { class: "bs-table-col-header-title" }, fo = { class: "bs-table-col-header-title-label" }, So = { class: "bs-table-col-header-title-icon" }, To = /* @__PURE__ */ po(() => /* @__PURE__ */ b("div", null, "Search", -1)), _o = {
  key: 0,
  class: "bs-table-col-header-data-type"
};
function $o(e, t, s, o, n, i) {
  var $, v, A, k;
  const a = d("q-icon"), l = d("q-item-section"), u = d("q-item"), c = d("q-list"), M = d("q-menu"), y = _e("close-popup");
  return r(), _("div", mo, [
    b("div", bo, [
      b("div", go, [
        b("div", fo, N((($ = e.col) == null ? void 0 : $.label) || ((v = e.col) == null ? void 0 : v.name) || ""), 1),
        b("div", So, [
          m(a, {
            name: e.mdiChevronDown,
            size: "1rem"
          }, {
            default: h(() => [
              m(M, {
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
                                onClick: t[0] || (t[0] = (...D) => e.sortColumn && e.sortColumn(...D))
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
                      })) : S("", !0),
                      L((r(), p(u, null, {
                        default: h(() => [
                          m(l, null, {
                            default: h(() => [
                              b("div", {
                                class: "bs-table-col-header-action-section cursor-pointer",
                                onClick: t[1] || (t[1] = (...D) => e.searchColumn && e.searchColumn(...D))
                              }, [
                                m(a, {
                                  name: e.searchColIcon,
                                  size: "0.8rem"
                                }, null, 8, ["name"]),
                                To
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })), [
                        [y]
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
      (A = e.col) != null && A.dataType ? (r(), _("div", _o, N((k = e.col) == null ? void 0 : k.dataType), 1)) : S("", !0)
    ], 512)
  ]);
}
const Do = /* @__PURE__ */ f(ho, [["render", $o], ["__scopeId", "data-v-0cf707e9"]]), Mo = g({
  name: "BSTableHeader",
  components: {
    QTr: ae,
    QTh: ne,
    BsTableColHeader: Do
  },
  props: {
    props: {
      type: Object,
      required: !0
    }
  },
  data() {
    return {
      sortedCol: "",
      sortedDesc: !1
    };
  },
  emits: ["search-col"],
  methods: {
    activateSearchCol(e) {
      this.$emit("search-col", e);
    },
    sort(e) {
      const t = this.sortedCol;
      this.sortedCol = t !== e.name ? e.name : this.sortedDesc ? "" : e.name, this.sortedDesc = t !== e.name ? !1 : !this.sortedDesc, this.props.sort(e);
    }
  },
  computed: {
    cols() {
      return this.props.cols.filter((e) => e.name !== "clearAllCol");
    }
  }
});
function yo(e, t, s, o, n, i) {
  const a = d("BsTableColHeader"), l = d("q-th"), u = d("q-tr");
  return r(), p(u, { props: e.props }, {
    default: h(() => [
      (r(!0), _(F, null, w(e.cols, (c) => (r(), p(l, {
        key: c.name,
        props: e.props
      }, {
        default: h(() => [
          m(a, {
            sort: e.sort,
            col: c,
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
const Io = /* @__PURE__ */ f(Mo, [["render", yo], ["__scopeId", "data-v-6897aae9"]]), Co = g({
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
      let e = Q(this.text) || St(this.text) ? "" : Tt(`${this.text}`);
      const t = (this.queries || []).filter((c) => !Q(c));
      if (!(e && t.length))
        return e;
      let s = /* @__PURE__ */ new Map([
        [0, { from: [], to: [] }],
        [e.length, { from: [], to: [] }]
      ]);
      t.forEach(
        (c, M) => to(c, e).forEach((y) => {
          const $ = y, v = y + c.length;
          s.has($) || s.set($, { from: [], to: [] }), s.has(v) || s.set(v, { from: [], to: [] });
          const A = s.get($), k = s.get(v);
          A.from.push(M), k.to.push(M);
        })
      );
      const o = Array.from(s.keys()).sort((c, M) => c - M);
      if (!o.length)
        return e;
      const n = o.length - 1, i = [], a = new Array(n).fill("").map((c, M) => e.substring(o[M], o[M + 1]));
      let l = 0;
      for (; l < n; ) {
        const { from: c, to: M } = s.get(o[l]);
        c.forEach(($) => {
          i.includes($) || i.push($);
          const v = M.indexOf($);
          v !== -1 && i.splice(v, 1);
        }), M.forEach(($) => {
          const v = i.indexOf($);
          v !== -1 && i.splice(v, 1);
        });
        const y = this.createClassesFromQueries(i);
        a[l] = `<span class="text-underline ${y}">${a[l]}</span>`, l++;
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
const vo = ["innerHTML"];
function wo(e, t, s, o, n, i) {
  return r(), _("span", { innerHTML: e.highlightedText }, null, 8, vo);
}
const Se = /* @__PURE__ */ f(Co, [["render", wo]]), No = g({
  name: "BsTablePagination",
  components: {
    QBtn: H
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
      Q((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (o = this.serverSidePagination) != null && o.recordsCount && (this.recordsCount = (n = this.serverSidePagination) == null ? void 0 : n.recordsCount);
    },
    executeAndGoToTop(e) {
      e(), this.startOfThePage && this.startOfThePage();
    }
  }
});
const jo = { class: "bs-table-pagination" }, Po = { class: "bs-table-pagination-controls" }, Bo = { class: "bs-table-records-info" };
function Oo(e, t, s, o, n, i) {
  const a = d("q-btn");
  return r(), _("div", jo, [
    b("div", Po, [
      e.scope.pagesNumber > 2 ? (r(), p(a, {
        key: 0,
        icon: "first_page",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[0] || (t[0] = (l) => e.executeAndGoToTop(e.scope.firstPage))
      }, null, 8, ["disable"])) : S("", !0),
      m(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[1] || (t[1] = (l) => e.executeAndGoToTop(e.scope.prevPage))
      }, null, 8, ["disable"]),
      b("div", Bo, N(e.recordsShown), 1),
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
      }, null, 8, ["disable"])) : S("", !0)
    ])
  ]);
}
const Ao = /* @__PURE__ */ f(No, [["render", Oo], ["__scopeId", "data-v-4c15147d"]]), ko = g({
  name: "BsTableVirtualScrollIndicator",
  components: {
    QLinearProgress: dt
  },
  props: {
    qTableMiddle: Object
  },
  data() {
    return {
      progress: 0,
      showProgressBar: !1
    };
  },
  computed: {},
  methods: {
    addScrollEventListener() {
      this.qTableMiddle && this.qTableMiddle.addEventListener("scroll", (e) => {
        this.onScroll();
      });
    },
    onScroll() {
      Le(() => {
        if (!this.qTableMiddle)
          return;
        const e = this.qTableMiddle.scrollTop, t = this.qTableMiddle.scrollHeight - this.qTableMiddle.clientHeight;
        this.showProgressBar = t > 0, this.progress = this.showProgressBar ? e / t : 1;
      }, 250, "bs-table-scroll-update-indicator");
    }
  },
  mounted() {
    this.addScrollEventListener(), this.onScroll();
  }
});
const zo = { class: "bs-table-virtual-scroll-progress-bar" };
function Lo(e, t, s, o, n, i) {
  const a = d("q-linear-progress");
  return r(), _("div", {
    class: O(["bs-table-virtual-scroll", e.showProgressBar && "bs-table-virtual-scroll--active"])
  }, [
    b("div", zo, [
      m(a, {
        value: e.progress,
        rounded: "",
        size: "5px"
      }, null, 8, ["value"])
    ])
  ], 2);
}
const Vo = /* @__PURE__ */ f(ko, [["render", Lo], ["__scopeId", "data-v-03818edd"]]), Qo = g({
  name: "BsTableBottom",
  components: {
    BsTablePagination: Ao,
    BsTableVirtualScrollIndicator: Vo,
    QIcon: V
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
    qTableMiddle: Object
  },
  data() {
    return {
      recordsCount: 0,
      mdiAlert: Dt
    };
  },
  computed: {
    pagination() {
      return this.scope.pagination;
    },
    isFullDataset() {
      return Q(this.serverSidePagination);
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
    }
  },
  methods: {
    syncServerSidePagination() {
      var e, t;
      (e = this.serverSidePagination) != null && e.recordsCount && (this.recordsCount = (t = this.serverSidePagination) == null ? void 0 : t.recordsCount);
    }
  },
  mounted() {
    this.syncServerSidePagination();
  }
});
const Eo = (e) => (E("data-v-5faff4dc"), e = e(), U(), e), Uo = { class: "bs-table-bottom-container" }, Ho = /* @__PURE__ */ Eo(() => /* @__PURE__ */ b("div", { class: "bs-table-warning-text" }, "the search is applied only to the sampled records!", -1)), Wo = {
  key: 3,
  class: "bs-table-records-total"
};
function qo(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsTablePagination"), u = d("BsTableVirtualScrollIndicator");
  return r(), _("div", Uo, [
    e.isFullDataset ? S("", !0) : (r(), _("div", {
      key: 0,
      class: O(["bs-table-warning", e.searching && "bs-table-warning-active"])
    }, [
      m(a, { name: e.mdiAlert }, null, 8, ["name"]),
      Ho
    ], 2)),
    e.virtualScroll ? (r(), p(u, {
      key: 2,
      "q-table-middle": e.qTableMiddle
    }, null, 8, ["q-table-middle"])) : (r(), p(l, {
      key: 1,
      scope: e.scope,
      "server-side-pagination": e.serverSidePagination,
      "start-of-the-page": e.startOfThePage
    }, null, 8, ["scope", "server-side-pagination", "start-of-the-page"])),
    e.recordsTotal && !e.virtualScroll || !e.isFullDataset && e.recordsCount ? (r(), _("div", Wo, "records total: " + N(e.recordsTotal), 1)) : S("", !0)
  ]);
}
const Yo = /* @__PURE__ */ f(Qo, [["render", qo], ["__scopeId", "data-v-5faff4dc"]]), Zo = g({
  name: "default",
  components: {
    QBtn: H
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
      return !(Q(this.lastBatchIndex) || this.batchOffset !== this.lastBatchIndex);
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
      Q((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (o = this.serverSidePagination) != null && o.recordsCount && (this.recordsCount = (n = this.serverSidePagination) == null ? void 0 : n.recordsCount);
    }
  },
  mounted() {
    this.syncServerSidePagination();
  }
});
const Fo = (e) => (E("data-v-b7be3388"), e = e(), U(), e), Go = {
  key: 0,
  class: "bs-table-server-side-pagination"
}, Ro = { class: "bs-table-server-side-pagination-controls" }, Xo = { class: "bs-table-server-side-pagination-offset" }, Jo = /* @__PURE__ */ Fo(() => /* @__PURE__ */ b("div", { class: "bs-table-server-side-pagination-label" }, " sampled rows ", -1));
function xo(e, t, s, o, n, i) {
  const a = d("q-btn");
  return e.lastBatchIndex !== 0 ? (r(), _("div", Go, [
    b("div", Ro, [
      m(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.isFirstBatch,
        onClick: e.prevBatch
      }, null, 8, ["disable", "onClick"]),
      b("div", Xo, N(e.sampleFrom) + " - " + N(e.sampleTo), 1),
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
    Jo
  ])) : S("", !0);
}
const Ko = /* @__PURE__ */ f(Zo, [["render", xo], ["__scopeId", "data-v-b7be3388"]]), en = g({
  name: "BsSearchTableCol",
  components: { BsInputDebounce: Ve, QIcon: V },
  props: {
    icon: String,
    clear: Boolean,
    colName: String,
    searchedCols: Object
  },
  data() {
    return {
      value: null,
      mdiTrashCanOutline: Mt
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
const tn = { class: "bs-search-table-col-search-box" };
function sn(e, t, s, o, n, i) {
  const a = d("q-icon"), l = d("BsInputDebounce");
  return r(), _("div", tn, [
    m(l, B({
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
        fn: h((M) => [
          T(e.$slots, c, I(C(M || {})), void 0, !0)
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
const on = /* @__PURE__ */ f(en, [["render", sn], ["__scopeId", "data-v-79755b04"]]), nn = g({
  name: "BSTableSearchHeader",
  components: {
    QTr: ae,
    QTh: ne,
    BsSearchTableCol: on
  },
  props: {
    props: {
      type: Object,
      required: !0
    },
    searchedCols: Object,
    searchedCol: String
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
const an = { class: "bs-table-search-header" };
function rn(e, t, s, o, n, i) {
  const a = d("BsSearchTableCol"), l = d("q-th"), u = d("q-tr");
  return e.noSearches ? S("", !0) : (r(), p(u, {
    key: 0,
    props: e.props
  }, {
    default: h(() => [
      (r(!0), _(F, null, w(e.cols, (c) => (r(), p(l, {
        key: c.name,
        style: z({ "text-align": c.align ? c.align : "left" })
      }, {
        default: h(() => {
          var M;
          return [
            b("div", an, [
              (M = e.searchedCols) != null && M.hasOwnProperty(c.name) ? (r(), p(a, {
                key: 0,
                icon: e.searchColIcon,
                searchedCols: e.searchedCols,
                "col-name": c.name,
                "onUpdate:formattedValue": (y) => e.searchColumn(c.name, y),
                "onUpdate:noDebounce:formattedValue": t[0] || (t[0] = (y) => e.noDebounceValue = y),
                onClearSearch: (y) => e.searchColumn(c.name, null)
              }, null, 8, ["icon", "searchedCols", "col-name", "onUpdate:formattedValue", "onClearSearch"])) : S("", !0)
            ])
          ];
        }),
        _: 2
      }, 1032, ["style"]))), 128)),
      e.noSearches ? S("", !0) : (r(), p(l, { key: "clearAllCol" }, {
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
const ln = /* @__PURE__ */ f(nn, [["render", rn], ["__scopeId", "data-v-5f778502"]]), dn = g({
  name: "BsTable",
  components: {
    QTable: ut,
    QTr: ae,
    QTd: ct,
    QBtn: H,
    BsDSSTableFunctional: xs,
    BsSearchWholeTable: co,
    BSTableHeader: Io,
    BsTextHighlight: Se,
    BsTableBottom: Yo,
    BsTableServerSidePagination: Ko,
    BSTableSearchHeader: ln
  },
  emits: ["update:rows", "update:columns", "update:loading", "update:server-side-pagination", "virtual-scroll"],
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
    class: [Array, String]
  },
  data() {
    return {
      searching: !1,
      fetching: !1,
      searchedCols: {},
      searchedCol: null,
      searchedValue: null,
      searchedValueFormatted: "",
      _serverSidePagination: void 0,
      _rows: void 0,
      _columns: void 0,
      lastBatchIndex: -1,
      scrollDetails: { from: 0 },
      passedRowsLength: 0,
      tableEl: void 0,
      qTableMiddle: void 0,
      mdiCloseCircleMultiple: yt
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
        const e = this.passedColumns.map((s) => W(j({}, s), { sortable: !1, _sortable: s.sortable })), t = {
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
      return no(...e);
    },
    updateSearchedCols(e, t) {
      t == null ? (delete this.searchedCols[e], e === this.searchedCol && (this.searchedCol = null)) : this.searchedCols[e] = t;
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
      return so(this.searchedCols, e);
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
      e = j({}, e), Object.entries(e).forEach(([s, o]) => {
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
      this.searchedValue = null, this.searchedCol = null, this.searchedCols = {};
    },
    onVirtualScroll(e) {
      this.scrollDetails = e, this.$emit("virtual-scroll", e);
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
      return W(j({}, e), {
        cellValueComponent: Se,
        cellValueComponentProps: {
          queries: [this.searchedValueFormatted, this.getColSearchedValue(e.col.name)],
          text: e.value
        }
      });
    }
  },
  mounted() {
    var e, t, s;
    (this.dssTableName || this.serverSidePagination) && (this.createServerSidePagination(), this.syncServerSidePagination()), this.passedRowsLength = ((e = this.passedRows) == null ? void 0 : e.length) || 0, this.tableEl = (t = this.$refs.qTable) == null ? void 0 : t.$el, this.qTableMiddle = (s = this.tableEl) == null ? void 0 : s.getElementsByClassName("q-table__middle")[0];
  }
});
const un = (e) => (E("data-v-a6fd2c49"), e = e(), U(), e), cn = { class: "bs-table-top-container bs-table-name bordered" }, hn = { key: 1 }, pn = { class: "bs-table-search-container bordered" }, mn = { class: "bs-table-top-slot-container bordered" }, bn = /* @__PURE__ */ un(() => /* @__PURE__ */ b("div", { class: "my-table-details" }, null, -1));
function gn(e, t, s, o, n, i) {
  const a = d("BsDSSTableFunctional"), l = d("BsSearchWholeTable"), u = d("q-btn"), c = d("BsTableServerSidePagination"), M = d("BsTextHighlight"), y = d("q-td"), $ = d("BSTableHeader"), v = d("BSTableSearchHeader"), A = d("BsTableBottom"), k = d("QTable");
  return r(), _(F, null, [
    e.isDSSTable ? (r(), p(a, {
      key: 0,
      "dss-table-name": e.dssTableName,
      "server-side-pagination": e._serverSidePagination,
      "onUpdate:fetching": t[0] || (t[0] = (D) => e.fetching = D),
      "onUpdate:rows": e.updateDSSRows,
      "onUpdate:columns": e.updateDSSColumns,
      "onUpdate:columnsCount": t[1] || (t[1] = (D) => e.setRecordsCount(D, !0))
    }, null, 8, ["dss-table-name", "server-side-pagination", "onUpdate:rows", "onUpdate:columns"])) : S("", !0),
    m(k, B({
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
      onVirtualScroll: e.onVirtualScroll
    }), P({
      top: h(() => [
        b("div", cn, [
          e.$slots.title ? T(e.$slots, "title", { key: 0 }, void 0, !0) : (r(), _("span", hn, N(e.title || e.dssTableName || ""), 1))
        ]),
        b("div", pn, [
          e.globalSearch ? (r(), p(l, {
            key: 0,
            modelValue: e.searchedValue,
            "onUpdate:modelValue": t[2] || (t[2] = (D) => e.searchedValue = D),
            "onUpdate:formattedValue": t[3] || (t[3] = (D) => e.searchedValueFormatted = D),
            "onUpdate:loading": t[4] || (t[4] = (D) => e.searching = D)
          }, null, 8, ["modelValue"])) : S("", !0),
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
          "onUpdate:batchOffset": t[5] || (t[5] = (D) => e.setBatchOffset(D, !0)),
          class: "bordered"
        }, null, 8, ["server-side-pagination"])) : S("", !0),
        b("div", mn, [
          T(e.$slots, "top", {}, void 0, !0)
        ])
      ]),
      "body-cell": h((D) => [
        e.$slots.hasOwnProperty("body-cell") ? T(e.$slots, "body-cell", I(B({ key: 0 }, e.getBodyCellProps(D))), void 0, !0) : (r(), p(y, {
          key: 1,
          props: D
        }, {
          default: h(() => [
            m(M, {
              queries: [e.searchedValueFormatted, e.getColSearchedValue(D.col.name)],
              text: D.value
            }, null, 8, ["queries", "text"])
          ]),
          _: 2
        }, 1032, ["props"]))
      ]),
      "body-cell-clearAllCol": h((D) => [
        m(y, { props: D }, {
          default: h(() => [
            bn
          ]),
          _: 2
        }, 1032, ["props"])
      ]),
      header: h((D) => [
        e.passedColumns ? (r(), p($, {
          key: 0,
          props: D,
          onSearchCol: e.searchCol
        }, null, 8, ["props", "onSearchCol"])) : S("", !0),
        e.passedColumns ? (r(), p(v, {
          key: 1,
          class: "bordered",
          props: D,
          "searched-cols": e.searchedCols,
          "searched-col": e.searchedCol,
          onSearchCol: e.updateSearchedCols,
          onClearAll: e.clearAllSearch
        }, null, 8, ["props", "searched-cols", "searched-col", "onSearchCol", "onClearAll"])) : S("", !0)
      ]),
      bottom: h((D) => [
        m(A, {
          scope: D,
          "server-side-pagination": e._serverSidePagination,
          "start-of-the-page": e.startOfThePage,
          searching: e.anyColumnSearched,
          "virtual-scroll": e.virtualScroll,
          "q-table-middle": e.qTableMiddle,
          "fetched-rows-length": e.passedRowsLength
        }, null, 8, ["scope", "server-side-pagination", "start-of-the-page", "searching", "virtual-scroll", "q-table-middle", "fetched-rows-length"])
      ]),
      _: 2
    }, [
      w(e.colSlotsUsed, (D) => ({
        name: e.getColBodySlot(D),
        fn: h((R) => [
          T(e.$slots, e.getColBodySlot(D), I(C(e.getBodyCellProps(R))), void 0, !0)
        ])
      })),
      w(e.filteredSlots, (D, R) => ({
        name: R,
        fn: h((Qe) => [
          T(e.$slots, R, I(C(Qe || {})), void 0, !0)
        ])
      }))
    ]), 1040, ["rows", "columns", "filter", "filter-method", "loading", "virtual-scroll", "rows-per-page-options", "class", "onVirtualScroll"])
  ], 64);
}
const fn = /* @__PURE__ */ f(dn, [["render", gn], ["__scopeId", "data-v-a6fd2c49"]]), Sn = g({
  name: "BsImg",
  components: {
    QImg: ht
  }
});
function Tn(e, t, s, o, n, i) {
  const a = d("QImg");
  return r(), p(a, I(C(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const _n = /* @__PURE__ */ f(Sn, [["render", Tn]]), $n = g({
  name: "BsIcon",
  components: {
    QIcon: V
  }
});
function Dn(e, t, s, o, n, i) {
  const a = d("QIcon");
  return r(), p(a, I(C(e.$attrs)), P({ _: 2 }, [
    w(e.$slots, (l, u) => ({
      name: u,
      fn: h((c) => [
        T(e.$slots, u, I(C(c || {})))
      ])
    }))
  ]), 1040);
}
const Mn = /* @__PURE__ */ f($n, [["render", Dn]]), yn = g({
  name: "BsCheckbox",
  components: {
    QCheckbox: pt
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
}), In = {
  key: 0,
  class: "dku-tiny-text bs-checkbox__hint"
};
function Cn(e, t, s, o, n, i) {
  const a = d("QCheckbox");
  return r(), _("div", {
    class: O(["bs-checkbox", { hint: e.isHintOnly, disabled: e.isDisabled }])
  }, [
    m(a, B(e.$attrs, {
      size: "29.57px",
      tabindex: 0,
      label: e.labelFromHint
    }), P({ _: 2 }, [
      w(e.$slots, (l, u) => ({
        name: u,
        fn: h((c) => [
          T(e.$slots, u, I(C(c || {})))
        ])
      }))
    ]), 1040, ["label"]),
    e.hint && e.$attrs.label ? (r(), _("div", In, N(e.hint), 1)) : S("", !0)
  ], 2);
}
const vn = /* @__PURE__ */ f(yn, [["render", Cn]]), wn = g({
  name: "BsDateRange",
  components: {
    QInput: De,
    QDate: mt,
    QPopupProxy: bt,
    QIcon: V,
    QBtn: H
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
}), Nn = {
  key: 0,
  class: "bs-date-range__label dss-caption-400 q-mb-xs"
}, jn = { class: "row items-center justify-end" };
function Pn(e, t, s, o, n, i) {
  const a = d("QBtn"), l = d("QDate"), u = d("QPopupProxy"), c = d("QIcon"), M = d("QInput"), y = _e("close-popup");
  return r(), _("div", null, [
    e.bsLabel ? (r(), _("label", Nn, N(e.bsLabel), 1)) : S("", !0),
    m(M, {
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
                m(l, B({ range: "" }, e.$attrs), {
                  default: h(() => [
                    b("div", jn, [
                      L(m(a, {
                        label: "Close",
                        color: "primary",
                        flat: ""
                      }, null, 512), [
                        [y]
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
const Bn = /* @__PURE__ */ f(wn, [["render", Pn]]);
const On = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BsButton: ks,
  BsCheckbox: vn,
  BsContent: te,
  BsDateRange: Bn,
  BsDocumentation: se,
  BsDrawer: q,
  BsDrawerBtn: Ne,
  BsHeader: Y,
  BsIcon: Mn,
  BsImg: _n,
  BsLayoutDefault: Ts,
  BsLayoutDrawer: je,
  BsLayoutHeader: Pe,
  BsMenuTab: Be,
  BsMenuTabs: Oe,
  BsRange: Zs,
  BsSelect: Bs,
  BsSlider: Ws,
  BsSpinner: Rs,
  BsTab: ze,
  BsTabChild: G,
  BsTabIcon: X,
  BsTabPageChildWrapper: de,
  BsTabTitle: ue,
  BsTable: fn,
  BsToggle: ws,
  BsTooltip: Vs,
  CheckSlotComponentsMixin: le,
  ProvideMixin: re
}, Symbol.toStringTag, { value: "Module" })), En = {
  version: "1.4.1",
  install(e) {
    Ct(e, { components: On });
  }
}, Un = "1.4.1";
export {
  ks as BsButton,
  vn as BsCheckbox,
  te as BsContent,
  Bn as BsDateRange,
  se as BsDocumentation,
  q as BsDrawer,
  Ne as BsDrawerBtn,
  Y as BsHeader,
  Mn as BsIcon,
  _n as BsImg,
  Ts as BsLayoutDefault,
  je as BsLayoutDrawer,
  Pe as BsLayoutHeader,
  Be as BsMenuTab,
  Oe as BsMenuTabs,
  Zs as BsRange,
  Bs as BsSelect,
  Ws as BsSlider,
  Rs as BsSpinner,
  ze as BsTab,
  G as BsTabChild,
  X as BsTabIcon,
  de as BsTabPageChildWrapper,
  ue as BsTabTitle,
  fn as BsTable,
  ws as BsToggle,
  Vs as BsTooltip,
  le as CheckSlotComponentsMixin,
  re as ProvideMixin,
  En as QuasarBs,
  x as ServerApi,
  Un as version
};
