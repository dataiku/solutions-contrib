var Oe = Object.defineProperty, Ae = Object.defineProperties;
var ke = Object.getOwnPropertyDescriptors;
var de = Object.getOwnPropertySymbols;
var ze = Object.prototype.hasOwnProperty, Le = Object.prototype.propertyIsEnumerable;
var ue = (e, t, s) => t in e ? Oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, w = (e, t) => {
  for (var s in t || (t = {}))
    ze.call(t, s) && ue(e, s, t[s]);
  if (de)
    for (var s of de(t))
      Le.call(t, s) && ue(e, s, t[s]);
  return e;
}, Z = (e, t) => Ae(e, ke(t));
var ee = (e, t, s) => new Promise((n, o) => {
  var i = (u) => {
    try {
      r(s.next(u));
    } catch (c) {
      o(c);
    }
  }, a = (u) => {
    try {
      r(s.throw(u));
    } catch (c) {
      o(c);
    }
  }, r = (u) => u.done ? n(u.value) : Promise.resolve(u.value).then(i, a);
  r((s = s.apply(e, t)).next());
});
import { defineComponent as m, computed as pe, openBlock as d, createBlock as g, Teleport as R, renderSlot as f, createCommentVNode as S, resolveComponent as l, withCtx as h, createVNode as p, normalizeStyle as z, normalizeClass as O, createElementVNode as T, createElementBlock as D, createTextVNode as Ve, toDisplayString as N, pushScopeId as x, popScopeId as X, mergeProps as A, withDirectives as V, vShow as U, Fragment as J, renderList as C, createSlots as P, normalizeProps as y, guardReactiveProps as v, withModifiers as Qe, resolveDirective as Ee } from "vue";
import { QCard as Ue, QBtn as K, QIcon as H, QDrawer as We, QHeader as He, QTab as qe, QTooltip as me, QTabs as Ye, QPageContainer as Ze, QPage as Fe, QLayout as Ge, QSelect as Re, QSlider as xe, QRange as Xe, QSpinner as Je, QInput as ge, QTh as Ke, QMenu as et, QItem as tt, QItemSection as st, QList as nt, QTr as be, QLinearProgress as ot, QTable as at, QImg as it, QCheckbox as rt, QDate as lt, QPopupProxy as dt } from "quasar";
import ut from "axios";
import { mdiTableSearch as ct, mdiArrowUpThin as ht, mdiMagnify as pt, mdiAlert as mt, mdiCloseCircleMultiple as gt } from "@quasar/extras/mdi-v6";
import { isNull as fe, isUndefined as L, escape as bt, isEmpty as ft } from "lodash";
function St(e) {
  return e !== null && typeof e == "object" && Array.isArray(e) !== !0;
}
function Tt(e, t) {
  t.components !== void 0 && Object.values(t.components).forEach((s) => {
    St(s) === !0 && s.name !== void 0 && e.component(s.name, s);
  });
}
const ae = m({
  name: "ProvideMixin",
  methods: {
    providePrefixed(e, t) {
      const { prefix: s, getter: n } = w({
        prefix: "$",
        getter: (o) => this[o]
      }, t);
      return e.reduce((o, i) => {
        const a = s + i;
        return o[a] = n(i), o;
      }, {});
    },
    createComputedFromKey(e) {
      return pe(() => this[e]);
    },
    provideComputed(e, t) {
      const s = Z(w({}, t), {
        getter: (n) => this.createComputedFromKey(n)
      });
      return this.providePrefixed(e, s);
    },
    provideStatic(e, t) {
      const s = Z(w({}, t), {
        getter: (n) => this[n]
      });
      return this.providePrefixed(e, s);
    }
  }
}), ie = m({
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
      return ((o) => this.$slots.hasOwnProperty(o) ? this.$slots[o]() : [])(t).filter((o) => {
        const i = o.type;
        return (i == null ? void 0 : i.name) && i.name === e;
      });
    }
  }
});
function Mt(...e) {
  e.forEach(([t, s]) => {
    setTimeout(() => {
      t();
    }, s);
  });
}
function Se(e, t, s, n, o = 50) {
  Mt(
    [e, o * +!s],
    [t, n * +s]
  );
}
const Te = (e) => `bs-menu-tab-${e}`, Me = (e) => `tab-content-id-${e}`, Dt = m({
  name: "BsTabPageChildWrapper",
  inject: ["$qPageMounted", "$tabId"],
  computed: {
    contentCSSSelector() {
      return `#${this.tabContentId}`;
    },
    tabContentId() {
      return Me(this.tabId);
    },
    tabId() {
      return this == null ? void 0 : this.$tabId;
    },
    qPageMounted() {
      return this == null ? void 0 : this.$qPageMounted;
    }
  }
}), b = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [n, o] of t)
    s[n] = o;
  return s;
};
function $t(e, t, s, n, o, i) {
  return e.qPageMounted ? (d(), g(R, {
    key: 0,
    to: e.contentCSSSelector
  }, [
    f(e.$slots, "default")
  ], 8, ["to"])) : S("", !0);
}
const re = /* @__PURE__ */ b(Dt, [["render", $t]]), It = m({
  name: "BsContent",
  components: {
    BsTabPageChildWrapper: re
  }
});
function _t(e, t, s, n, o, i) {
  const a = l("BsTabPageChildWrapper");
  return d(), g(a, null, {
    default: h(() => [
      f(e.$slots, "default")
    ]),
    _: 3
  });
}
const se = /* @__PURE__ */ b(It, [["render", _t]]), yt = m({
  name: "BsDocumentation",
  components: {
    QCard: Ue,
    QBtn: K,
    BsTabPageChildWrapper: re
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
      return w(w(w(w({}, this.defaultDocsPropValues), this.layoutDocsProps), this.tabDocsProps), this.docsProps);
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
      return Object.entries(e).reduce((s, [n, o]) => (o !== void 0 && (s[n] = o), s), {});
    }
  },
  watch: {
    modelValue() {
      this.open = this.modelValue;
    },
    open() {
      Se(
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
}), De = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNjQ2IDAuNzAzNjEzQzAuNzM2ODU3IDAuNzAzNjEzIDAgMS40MTMxOCAwIDIuMjg4NjVWNy43ODUyNEMwIDguNjYwNzEgMC43MzY4NTcgOS4zNzAyOCAxLjY0NiA5LjM3MDI4SDQuMDkwNjVDNC4wMzExMSA5LjA1ODAyIDQgOC43MzYxNyA0IDguNDA3MzJIMy43NVYxLjY2NjU4SDEwLjM1NEMxMC43MTA5IDEuNjY2NTggMTEgMS45NDUwMSAxMSAyLjI4ODY1VjMuMzEwMzFDMTEuMzQ4NiAzLjQwNTI0IDExLjY4MzIgMy41MzI0NCAxMiAzLjY4ODM1VjIuMjg4NjVDMTIgMS40MTMxOCAxMS4yNjMxIDAuNzAzNjEzIDEwLjM1NCAwLjcwMzYxM0gxLjY0NlpNMi43NSAxLjY2NjU4VjguNDA3MzJIMS42NDZDMS4yODkxNCA4LjQwNzMyIDEgOC4xMjg4OCAxIDcuNzg1MjRWMi4yODg2NUMxIDEuOTQ1MDEgMS4yODkxNCAxLjY2NjU4IDEuNjQ2IDEuNjY2NThIMi43NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNDk5OSA3LjUxODVDOC45ODk5IDcuNTE4NSA4LjU3Njg5IDcuOTE2MjEgOC41NzY4OSA4LjQwNzMyQzguNTc2ODkgOC44OTg0MyA4Ljk4OTkgOS4yOTYxMyA5LjQ5OTkgOS4yOTYxM0MxMC4wMDk5IDkuMjk2MTMgMTAuNDIyOSA4Ljg5ODQzIDEwLjQyMjkgOC40MDczMkMxMC40MjI5IDcuOTE2MjEgMTAuMDA5OSA3LjUxODUgOS40OTk5IDcuNTE4NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNSAxMi43NDA2QzExLjk4NSAxMi43NDA2IDE0IDEwLjgwMDMgMTQgOC40MDczMkMxNCA2LjAxNDM1IDExLjk4NSA0LjA3Mzk4IDkuNSA0LjA3Mzk4QzcuMDE1IDQuMDczOTggNSA2LjAxNDM1IDUgOC40MDczMkM1IDEwLjgwMDMgNy4wMTUgMTIuNzQwNiA5LjUgMTIuNzQwNlpNOS41MDI5IDUuNTE4NDNDOS43Mjg5IDUuNTIxMzIgOS45NTM5IDUuNTQ2MzUgMTAuMTczOSA1LjU5MzU0QzEwLjI2OTkgNS42MTM3NiAxMC4zNDE5IDUuNjkxNzYgMTAuMzUyOSA1Ljc4NjEzTDEwLjQwNDkgNi4yMzg3MkMxMC40Mjg5IDYuNDQ2NzIgMTAuNjEwOSA2LjYwMzY5IDEwLjgyNzkgNi42MDM2OUMxMC44ODU5IDYuNjAzNjkgMTAuOTQzOSA2LjU5MjEzIDEwLjk5NzkgNi41NjkwMkwxMS40Mjg5IDYuMzg3MDJDMTEuNTE4OSA2LjM0OTQ3IDExLjYyMjkgNi4zNjk2OSAxMS42ODk5IDYuNDM5MDJDMTIuMDAwOSA2Ljc1OTY5IDEyLjIzMjkgNy4xNDM5MSAxMi4zNjc5IDcuNTYyOEMxMi4zOTY5IDcuNjUzMzIgMTIuMzYzOSA3Ljc1MTU0IDEyLjI4NDkgNy44MDczOUwxMS45MDI5IDguMDc4OTVDMTEuNzkzOSA4LjE1NTk4IDExLjcyOTkgOC4yNzgyOCAxMS43Mjk5IDguNDA4MjhDMTEuNzI5OSA4LjUzODI4IDExLjc5MzkgOC42NjA1OCAxMS45MDM5IDguNzM4NThMMTIuMjg1OSA5LjAxMDEzQzEyLjM2NDkgOS4wNjU5OCAxMi4zOTg5IDkuMTY0MjEgMTIuMzY5OSA5LjI1NDcyQzEyLjIzNDkgOS42NzM2MSAxMi4wMDI5IDEwLjA1NzggMTEuNjkxOSAxMC4zNzg1QzExLjYyNDkgMTAuNDQ2OSAxMS41MTk5IDEwLjQ2ODEgMTEuNDMwOSAxMC40MzA1TDEwLjk5NzkgMTAuMjQ3NUMxMC44NzM5IDEwLjE5NTUgMTAuNzMxOSAxMC4yMDMyIDEwLjYxNDkgMTAuMjY3OEMxMC40OTc5IDEwLjMzMzIgMTAuNDE5OSAxMC40NDc4IDEwLjQwNDkgMTAuNTc2OUwxMC4zNTI5IDExLjAyOTVDMTAuMzQxOSAxMS4xMjI5IDEwLjI3MTkgMTEuMTk5OSAxMC4xNzY5IDExLjIyMTFDOS43MzA5IDExLjMyMzIgOS4yNjY5IDExLjMyMzIgOC44MjA5IDExLjIyMTFDOC43MjU5IDExLjE5ODkgOC42NTU5IDExLjEyMjkgOC42NDQ5IDExLjAyOTVMOC41OTI5IDEwLjU3NzhDOC41Nzc5IDEwLjQ0ODggOC40OTk5IDEwLjMzNDIgOC4zODI5IDEwLjI2OTdDOC4yNjU5IDEwLjIwNTIgOC4xMjM5IDEwLjE5NzUgOC4wMDA5IDEwLjI0OTVMNy41Njc4OSAxMC40MzI0QzcuNDc3OSAxMC40NyA3LjM3MzkgMTAuNDQ5OCA3LjMwNjkgMTAuMzgwNEM2Ljk5NTkgMTAuMDU5OCA2Ljc2MzkgOS42NzU1NCA2LjYyODg5IDkuMjU1NjlDNi41OTk5IDkuMTY1MTcgNi42MzM5IDkuMDY2OTUgNi43MTI5IDkuMDExMDlMNy4wOTU4OSA4LjczOTU0QzcuMjA0OSA4LjY2MjUgNy4yNjg5IDguNTQwMjEgNy4yNjg5IDguNDEwMjFDNy4yNjg5IDguMjgwMjEgNy4yMDQ5IDguMTU3OTEgNy4wOTU4OSA4LjA3OTkxTDYuNzEzODkgNy44MDkzMkM2LjYzNDkgNy43NTM0NiA2LjYwMDkgNy42NTUyNCA2LjYyOTkgNy41NjQ3MkM2Ljc2NDkgNy4xNDU4MyA2Ljk5Njg5IDYuNzYxNjEgNy4zMDc4OSA2LjQ0MDk1QzcuMzc0OSA2LjM3MjU4IDcuNDc5OSA2LjM1MTM5IDcuNTY4OSA2LjM4ODk1TDcuOTk5OSA2LjU3MDk1QzguMTIzOSA2LjYyMjk1IDguMjY1ODkgNi42MTUyNCA4LjM4Mzg5IDYuNTQ5NzZDOC41MDA5IDYuNDg0MjggOC41Nzg5IDYuMzY5NjkgOC41OTM4OSA2LjIzOTY5TDguNjQ1OSA1Ljc4ODA2QzguNjU2OSA1LjY5MzY5IDguNzI4OSA1LjYxNjY1IDguODI0OSA1LjU5NTQ2QzkuMDQ1OSA1LjU0ODI4IDkuMjcwOSA1LjUyMzI0IDkuNTAxOSA1LjUyMDM1TDkuNTAyOSA1LjUxODQzWiIgZmlsbD0iIzAxQjJBQSIvPgo8L3N2Zz4K";
const $e = (e) => (x("data-v-47db9d18"), e = e(), X(), e), vt = /* @__PURE__ */ $e(() => /* @__PURE__ */ T("div", { class: "row items-center q-gutter-sm no-wrap" }, [
  /* @__PURE__ */ T("img", {
    src: De,
    width: "15",
    height: "16"
  }),
  /* @__PURE__ */ T("span", { class: "btn-solution-text" }, "Dataiku Solutions")
], -1)), Ct = { class: "flex row items-center q-gutter-sm q-mb-lg" }, wt = ["src", "width", "height"], Nt = { class: "dku-large-title-sb" }, jt = { class: "doc-body" }, Pt = /* @__PURE__ */ $e(() => /* @__PURE__ */ T("div", { class: "doc-footer flex row items-center" }, [
  /* @__PURE__ */ T("span", { class: "doc-footer__icon" }, [
    /* @__PURE__ */ T("img", {
      src: De,
      width: "14",
      height: "12.5"
    })
  ]),
  /* @__PURE__ */ T("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
], -1));
function Bt(e, t, s, n, o, i) {
  const a = l("QBtn"), r = l("QCard"), u = l("BsTabPageChildWrapper");
  return d(), g(u, null, {
    default: h(() => [
      p(a, {
        unelevated: "",
        outline: "",
        "no-caps": "",
        "no-wrap": "",
        class: "btn-solution absolute",
        square: "",
        onClick: t[0] || (t[0] = (c) => e.toggleDoc())
      }, {
        default: h(() => [
          vt
        ]),
        _: 1
      }),
      p(r, {
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
          T("div", Ct, [
            e.mDocsProps.docIcon ? (d(), D("img", {
              key: 0,
              src: e.mDocsProps.docIcon,
              width: e.mDocsProps.docImageDimensions.width,
              height: e.mDocsProps.docImageDimensions.height
            }, null, 8, wt)) : S("", !0),
            T("span", Nt, [
              e.$slots.title ? f(e.$slots, "title", { key: 0 }, void 0, !0) : S("", !0),
              Ve(" " + N(e.$slots.title ? "" : e.mDocsProps.docTitle), 1)
            ])
          ]),
          T("div", jt, [
            f(e.$slots, "default", {}, void 0, !0)
          ]),
          Pt
        ]),
        _: 3
      }, 8, ["style", "class"])
    ]),
    _: 3
  });
}
const ne = /* @__PURE__ */ b(yt, [["render", Bt], ["__scopeId", "data-v-47db9d18"]]), q = m({
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
}), Ot = m({
  name: "BsTabTitle",
  extends: q,
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
function At(e, t, s, n, o, i) {
  return e.defaultTabUsed ? S("", !0) : (d(), D("div", A({ key: 0 }, e.$attrs, { class: "text-primary bs-tab-title dku-medium-title-sb q-px-md" }), N(e.tabName), 17));
}
const le = /* @__PURE__ */ b(Ot, [["render", At], ["__scopeId", "data-v-9ace8c82"]]), kt = m({
  name: "BsDrawer",
  extends: q,
  components: {
    BsTabTitle: le
  }
});
const zt = { class: "bs-drawer-container" };
function Lt(e, t, s, n, o, i) {
  const a = l("BsTabTitle");
  return e.qLayoutMounted ? (d(), g(R, {
    key: 0,
    to: ".q-drawer"
  }, [
    V(T("div", zt, [
      p(a),
      f(e.$slots, "default", {}, void 0, !0)
    ], 512), [
      [U, e.showComponent]
    ])
  ])) : S("", !0);
}
const Q = /* @__PURE__ */ b(kt, [["render", Lt], ["__scopeId", "data-v-ef244777"]]), Vt = m({
  name: "BsHeader",
  components: {
    BsTabTitle: le
  },
  extends: q,
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
function Qt(e, t, s, n, o, i) {
  const a = l("BsTabTitle");
  return e.qLayoutMounted ? (d(), g(R, {
    key: 0,
    to: ".bs-header"
  }, [
    V(T("div", {
      onVnodeMounted: t[0] || (t[0] = (r) => e.calculateHeaderTabTitleWidth = !0),
      style: z(e.tabHeaderStyles),
      class: O([
        "bs-header-wrapper",
        e.wrapperTransitions && "bs-header-wrapper--transition",
        e.showComponent && e.drawerOpen && e.headerTabTitleWidthExists && "bs-header-wrapper--hide-tab-name"
      ])
    }, [
      V(p(a, {
        ref: "headerTabTitle",
        "calculate-width": e.calculateHeaderTabTitleWidth,
        onCalculated: e.updateHeaderTabTitleWidth
      }, null, 8, ["calculate-width", "onCalculated"]), [
        [U, e.appendTabTitleToHeader]
      ]),
      f(e.$slots, "default", {}, void 0, !0)
    ], 6), [
      [U, e.showComponent]
    ])
  ])) : S("", !0);
}
const E = /* @__PURE__ */ b(Vt, [["render", Qt], ["__scopeId", "data-v-f4a44855"]]), Et = m({
  name: "BsTabIcon",
  inject: ["$menuTabsMounted", "$tabId"],
  components: {
    QIcon: H
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
      return Te(this.tabId);
    },
    bsMenuTabCSSSelector() {
      return `#${this.bsMenuTabId}`;
    }
  }
});
function Ut(e, t, s, n, o, i) {
  const a = l("q-icon");
  return e.menuTabsMounted ? (d(), g(R, {
    key: 0,
    to: e.bsMenuTabCSSSelector
  }, [
    e.iconName ? (d(), g(a, A({ key: 0 }, e.$attrs, { name: e.iconName }), null, 16, ["name"])) : S("", !0),
    f(e.$slots, "default")
  ], 8, ["to"])) : S("", !0);
}
const F = /* @__PURE__ */ b(Et, [["render", Ut]]), Wt = m({
  name: "BsDrawerBtn",
  extends: q,
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
      Se(
        () => this.hide = t,
        () => this.hidden = t,
        t,
        this.hideTransitionDuration
      );
    }
  }
}), Ht = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTYgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDRDMTAuNjI3NCAwIDE2IDUuMzcyNTggMTYgMTJWODhDMTYgOTQuNjI3NCAxMC42Mjc0IDEwMCA0IDEwMEgwVjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjUiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjkiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMV8xNjY4IiB4PSI1IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMV8xNjY4IiB4PSI5IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=";
const qt = (e) => (x("data-v-9969ac6c"), e = e(), X(), e), Yt = /* @__PURE__ */ qt(() => /* @__PURE__ */ T("img", { src: Ht }, null, -1)), Zt = [
  Yt
];
function Ft(e, t, s, n, o, i) {
  return V((d(), D("div", {
    onClick: t[0] || (t[0] = (...a) => e.toggleLeftPanel && e.toggleLeftPanel(...a)),
    class: O([e.hide && "hide", e.hidden && "hidden", "toggle-left-button"]),
    style: z({
      "--hide-transition-duration": `.${e.hideTransitionDuration}s`
    })
  }, Zt, 6)), [
    [U, e.showComponent]
  ]);
}
const Ie = /* @__PURE__ */ b(Wt, [["render", Ft], ["__scopeId", "data-v-9969ac6c"]]), Gt = m({
  name: "BsLayoutDrawer",
  components: {
    QDrawer: We,
    BsDrawerBtn: Ie
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
function Rt(e, t, s, n, o, i) {
  const a = l("BsDrawerBtn"), r = l("QDrawer");
  return d(), g(r, A(e.drawerProps, {
    "mini-width": e.collapsedWidth,
    width: e.expandedWidth,
    side: "left",
    behavior: "desktop",
    bordered: ""
  }), {
    default: h(() => [
      p(a, {
        "model-value": e.expand,
        "onUpdate:modelValue": e.toggleDrawer,
        show: e.expandable
      }, null, 8, ["model-value", "onUpdate:modelValue", "show"])
    ]),
    _: 1
  }, 16, ["mini-width", "width"]);
}
const _e = /* @__PURE__ */ b(Gt, [["render", Rt], ["__scopeId", "data-v-7ae9438e"]]), xt = m({
  name: "BsLayoutHeader",
  components: {
    QHeader: He
  }
});
function Xt(e, t, s, n, o, i) {
  const a = l("QHeader");
  return d(), g(a, {
    bordered: "",
    class: "bg-white bs-header"
  });
}
const ye = /* @__PURE__ */ b(xt, [["render", Xt], ["__scopeId", "data-v-9ba496fa"]]), Jt = m({
  name: "BsMenuTab",
  components: {
    QTab: qe,
    QTooltip: me
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
      return e = e || `${this.tabIndex}` || "", Te(e);
    }
  }
});
const Kt = { class: "tab-name-tooltip" }, es = ["id"];
function ts(e, t, s, n, o, i) {
  const a = l("QTooltip"), r = l("QTab");
  return d(), g(r, {
    name: e.tabIndex,
    icon: e.icon,
    ripple: !1
  }, {
    default: h(() => [
      p(a, {
        offset: [9, 10],
        anchor: "center right",
        self: "center left",
        "transition-show": "jump-right",
        "transition-hide": "jump-left"
      }, {
        default: h(() => [
          T("span", Kt, N(e.name), 1)
        ]),
        _: 1
      }),
      e.tabId ? (d(), D("span", {
        key: 0,
        id: e.getBsMenuTabId(e.tabId)
      }, null, 8, es)) : S("", !0)
    ]),
    _: 1
  }, 8, ["name", "icon"]);
}
const ve = /* @__PURE__ */ b(Jt, [["render", ts], ["__scopeId", "data-v-61b2252d"]]), ss = m({
  name: "BsMenuTabs",
  components: {
    QTabs: Ye
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
const ns = { class: "tabs-container" };
function os(e, t, s, n, o, i) {
  const a = l("q-tabs");
  return d(), D("div", ns, [
    p(a, {
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:model-value", r)),
      vertical: "",
      "active-color": "primary",
      "indicator-color": "primary",
      "active-bg-color": "white"
    }, {
      default: h(() => [
        f(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["model-value"])
  ]);
}
const Ce = /* @__PURE__ */ b(ss, [["render", os], ["__scopeId", "data-v-08cabe0b"]]);
class we {
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
    let n = t, o = 0;
    if (this.seen.hasOwnProperty(n)) {
      o = this.seen[t];
      do
        o++, n = t + "-" + o;
      while (this.seen.hasOwnProperty(n));
    }
    return s || (this.seen[t] = o, this.seen[n] = 0), n;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
  */
  slug(t, s = {}) {
    const n = { dryrun: !!s.dryrun }, o = this.serialize(t);
    return this.getNextSafeSlug(o, n.dryrun);
  }
}
const G = class {
  constructor(e = "default") {
    typeof e != "string" && (console.error("instanceKey param should be of type string! Using default instance."), e = "default"), G.instances.hasOwnProperty(e) || (G.instances[e] = new we()), this.instance = G.instances[e];
  }
  slug(e, t = {}) {
    return this.instance.slug(e, t);
  }
};
let Ne = G;
Ne.instances = {};
const as = new Ne("tabs"), is = m({
  name: "BsTab",
  mixins: [ie, ae],
  components: {
    BsDrawer: Q,
    BsHeader: E,
    BsDocumentation: ne,
    BsContent: se,
    BsTabIcon: F,
    QPageContainer: Ze,
    QPage: Fe
  },
  data() {
    return {
      index: 0,
      tabId: as.slug(this.name),
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
      return Me(this.tabId);
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
      const { tabId: e, drawer: t, header: s, name: n } = this;
      return {
        tabId: e,
        drawer: t,
        header: s,
        name: n,
        icon: pe(() => this.tabIcon)
      };
    },
    header() {
      return this.usingComponent(E) || this.usingSlotHeader || this.defaultHeader;
    },
    drawer() {
      return this.usingComponent(Q) || this.usingSlotDrawer || this.defaultDrawer;
    },
    tabIcon() {
      return this.usingComponent(F) || this.usingSlotTabIcon ? void 0 : this.icon;
    },
    usingSlotHeader() {
      return this.usingSlot(E, "header", "head");
    },
    usingSlotDrawer() {
      return this.usingSlot(Q, "leftpanel", "drawer");
    },
    usingSlotDocumentation() {
      return this.usingSlot(ne, "documentation");
    },
    usingSlotContent() {
      return this.usingSlot(se, "content");
    },
    usingSlotTabIcon() {
      return this.usingSlot(F, "tabicon");
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
      return this.usingComponent(e) ? !1 : t.reduce((n, o) => n && this.slotsKeys.includes(o), !0);
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
const rs = ["id"];
function ls(e, t, s, n, o, i) {
  const a = l("BsHeader"), r = l("BsDrawer"), u = l("BsDocumentation"), c = l("BsTabIcon"), $ = l("BsContent"), j = l("QPage"), M = l("QPageContainer");
  return d(), D(J, null, [
    e.usingSlotHeader || !(e.header || e.defaultTabUsed) ? (d(), g(a, { key: 0 }, {
      default: h(() => [
        e.$slots.header ? S("", !0) : f(e.$slots, "head", { key: 0 }, void 0, !0),
        f(e.$slots, "header", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    e.usingSlotDrawer ? (d(), g(r, { key: 1 }, {
      default: h(() => [
        e.$slots.drawer ? S("", !0) : f(e.$slots, "leftpanel", { key: 0 }, void 0, !0),
        f(e.$slots, "drawer", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    e.usingSlotDocumentation ? (d(), g(u, {
      key: 2,
      modelValue: e.openDoc,
      "onUpdate:modelValue": t[0] || (t[0] = (_) => e.openDoc = _)
    }, {
      default: h(() => [
        f(e.$slots, "documentation", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue"])) : S("", !0),
    !e.defaultTabUsed && e.usingSlotTabIcon ? (d(), g(c, { key: 3 }, {
      default: h(() => [
        f(e.$slots, "tabicon", {}, void 0, !0)
      ]),
      _: 3
    })) : S("", !0),
    V(p(M, null, {
      default: h(() => [
        p(j, { onVnodeMounted: e.onQPageMounted }, {
          default: h(() => [
            T("div", {
              class: "content",
              id: e.tabContentId
            }, [
              e.usingSlotContent ? (d(), g($, { key: 0 }, {
                default: h(() => [
                  f(e.$slots, "content", {}, void 0, !0)
                ]),
                _: 3
              })) : S("", !0)
            ], 8, rs)
          ]),
          _: 3
        }, 8, ["onVnodeMounted"])
      ]),
      _: 3
    }, 512), [
      [U, e.isTabSelected]
    ]),
    f(e.$slots, "default", {}, void 0, !0)
  ], 64);
}
const je = /* @__PURE__ */ b(is, [["render", ls], ["__scopeId", "data-v-694ef9e9"]]), ds = new we(), us = m({
  name: "BsLayoutDefault",
  mixins: [ae, ie],
  components: {
    BsTab: je,
    BsMenuTab: ve,
    BsMenuTabs: Ce,
    BsLayoutDrawer: _e,
    BsLayoutHeader: ye,
    QLayout: Ge
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
      e = w(w({}, e), s);
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
      return `tab-content-id-${ds.slug(this.defaultLayoutTabName)}`;
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
      return !!this.getSlotComponents(Q.name).length;
    },
    defaultHeader() {
      return !!this.getSlotComponents(E.name).length;
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
function cs(e, t, s, n, o, i) {
  const a = l("BsLayoutDrawer"), r = l("BsLayoutHeader"), u = l("BsMenuTab"), c = l("BsMenuTabs"), $ = l("BsTab"), j = l("QLayout");
  return d(), g(j, {
    view: "lHh LpR lFf",
    class: "bg-white",
    style: z(e.layoutStyles)
  }, {
    default: h(() => [
      p(a, {
        modelValue: e.drawerOpen,
        "onUpdate:modelValue": t[0] || (t[0] = (M) => e.drawerOpen = M),
        onVnodeMounted: t[1] || (t[1] = (M) => e.drawerMounted = !0),
        expandable: e.selectedTabDrawer,
        "collapsed-width": e.tabMenuWidth,
        "panel-width": e.leftPanelWidth,
        mini: !e.defaultTabUsed
      }, null, 8, ["modelValue", "expandable", "collapsed-width", "panel-width", "mini"]),
      p(r, {
        onVnodeMounted: t[2] || (t[2] = (M) => e.headerMounted = !0)
      }, null, 512),
      e.mounted && !e.defaultTabUsed ? (d(), g(c, {
        key: 0,
        modelValue: e.tabIndex,
        "onUpdate:modelValue": t[3] || (t[3] = (M) => e.tabIndex = M),
        onVnodeMounted: t[4] || (t[4] = (M) => e.menuTabsMounted = !0)
      }, {
        default: h(() => [
          (d(!0), D(J, null, C(e.tabs, ({ name: M, icon: _, tabId: k }, I) => (d(), g(u, {
            name: M,
            "tab-id": k,
            icon: _,
            "tab-index": I
          }, null, 8, ["name", "tab-id", "icon", "tab-index"]))), 256))
        ]),
        _: 1
      }, 8, ["modelValue"])) : S("", !0),
      e.mounted && e.defaultTabUsed ? (d(), g($, {
        key: 1,
        "onMounted:qPage": t[5] || (t[5] = (M) => e.qPageMounted = !0),
        name: e.defaultLayoutTabName
      }, P({
        default: h(() => [
          f(e.$slots, "default")
        ]),
        _: 2
      }, [
        C(e.activeTabSlots, (M) => ({
          name: M,
          fn: h(() => [
            f(e.$slots, M)
          ])
        }))
      ]), 1032, ["name"])) : f(e.$slots, "default", { key: 2 })
    ]),
    _: 3
  }, 8, ["style"]);
}
const hs = /* @__PURE__ */ b(us, [["render", cs]]), ps = {
  xs: 18,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 34
}, ms = function(e, t = ps) {
  return e !== void 0 ? e in t ? `${t[e]}px` : e : null;
}, gs = {
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
}, bs = ["update:modelValue"];
function ce(e) {
  e.cancelable !== !1 && e.preventDefault(), e.stopPropagation();
}
const fs = m({
  name: "BsToggle",
  data() {
    return {};
  },
  props: w({}, gs),
  emits: bs,
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
      return ms(this.size);
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
      e !== void 0 && ce(e), this.disable !== !0 && (console.log("next value"), console.log(this.isTrue), console.log(this.getNextValue()), this.$emit("update:modelValue", this.getNextValue(), e));
    },
    onKeydown(e) {
      (e.keyCode === 13 || e.keyCode === 32) && ce(e);
    },
    onKeyup(e) {
      (e.keyCode === 13 || e.keyCode === 32) && this.onClick(e);
    }
  }
}), Ss = ["checked", "value"], Ts = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function Ms(e, t, s, n, o, i) {
  return d(), D("div", {
    class: O([{
      "bs-toggle--is-disabled": e.disable
    }, "bs-toggle"]),
    style: z({ "font-size": e.fontSize })
  }, [
    e.labelLeft ? (d(), D("label", {
      key: 0,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelLeft), 3)) : S("", !0),
    T("input", {
      type: "checkbox",
      checked: e.isTrue === !0,
      value: e.modelIsArray === !0 ? e.val : e.trueValue,
      class: "bs-toggle__input"
    }, null, 8, Ss),
    T("div", {
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
    }, null, 46, Ts),
    e.labelRight ? (d(), D("label", {
      key: 1,
      class: O(["bs-toggle__label", [e.labelClass]])
    }, N(e.labelRight), 3)) : S("", !0)
  ], 6);
}
const Ds = /* @__PURE__ */ b(fs, [["render", Ms]]), $s = m({
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
    QSelect: Re
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
}), Is = {
  key: 0,
  class: "bs-select__label dss-caption-400 q-mb-xs"
};
function _s(e, t, s, n, o, i) {
  const a = l("QSelect");
  return d(), D("div", null, [
    e.bsLabel ? (d(), D("label", Is, N(e.bsLabel), 1)) : S("", !0),
    p(a, A({ ref: "bsSelect" }, e.$attrs, {
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
      C(e.$slots, (r, u) => ({
        name: u,
        fn: h((c) => [
          f(e.$slots, u, y(v(c || {})))
        ])
      }))
    ]), 1040, ["onPopupShow", "onPopupHide", "popup-content-style", "label"])
  ]);
}
const ys = /* @__PURE__ */ b($s, [["render", _s]]), vs = m({
  name: "BsButton",
  components: {
    QBtn: K
  }
});
function Cs(e, t, s, n, o, i) {
  const a = l("QBtn");
  return d(), g(a, A(e.$attrs, { unelevated: "" }), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const ws = /* @__PURE__ */ b(vs, [["render", Cs]]), Ns = m({
  name: "BsTooltip",
  components: {
    QTooltip: me
  }
});
function js(e, t, s, n, o, i) {
  const a = l("QTooltip");
  return d(), g(a, y(v(e.$attrs)), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Ps = /* @__PURE__ */ b(Ns, [["render", js]]), Bs = m({
  name: "BsSlider",
  components: {
    QSlider: xe
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
}), Os = { class: "flex row bs-slider no-wrap" }, As = ["value", "min", "max", "step"];
function ks(e, t, s, n, o, i) {
  const a = l("QSlider");
  return d(), D("div", Os, [
    p(a, A(e.$attrs, {
      style: { width: e.sliderWidth + "px" },
      "thumb-size": "15px",
      "track-size": "3.5px"
    }), P({ _: 2 }, [
      C(e.$slots, (r, u) => ({
        name: u,
        fn: h((c) => [
          f(e.$slots, u, y(v(c || {})))
        ])
      }))
    ]), 1040, ["style"]),
    T("input", {
      class: "bs-slider__input dku-text",
      type: "number",
      value: e.inputData.value,
      onInput: t[0] || (t[0] = (...r) => e.updateSliderFromInput && e.updateSliderFromInput(...r)),
      min: e.inputData.min,
      max: e.inputData.max,
      step: e.inputData.step
    }, null, 40, As)
  ]);
}
const zs = /* @__PURE__ */ b(Bs, [["render", ks]]), Ls = m({
  name: "BsRange",
  components: {
    QRange: Xe
  }
});
function Vs(e, t, s, n, o, i) {
  const a = l("QRange");
  return d(), g(a, y(v(e.$attrs)), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Qs = /* @__PURE__ */ b(Ls, [["render", Vs]]), Es = m({
  name: "BsSpinner",
  components: {
    QSpinner: Je
  }
});
function Us(e, t, s, n, o, i) {
  const a = l("QSpinner");
  return d(), g(a, y(v(e.$attrs)), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const Ws = /* @__PURE__ */ b(Es, [["render", Us]]), Hs = process.env.NODE_ENV, qs = Hs === "production", Ys = "http://127.0.0.1:15000";
function te(e) {
  return new Promise((t, s) => {
    e.then((n) => t(n == null ? void 0 : n.data)).catch((n) => s(n));
  });
}
class W {
  static initClient() {
    const t = qs ? window.getWebAppBackendUrl("") : Ys;
    this._restApiEndpoint = `${t}/bs_api/`, this.client = ut.create({ baseURL: this._restApiEndpoint }), this.client.interceptors.response.use(
      (s) => s,
      (s) => {
        console.error(s), this.errors.push(s.response);
      }
    );
  }
  static requestWrapper(t) {
    const s = t.bind(this);
    return (...n) => ee(this, null, function* () {
      if (this.client)
        return yield s(...n);
    });
  }
  static init() {
    this.initialized || (this.initClient(), this.doDelete = this.requestWrapper(this.doDelete), this.doPost = this.requestWrapper(this.doPost), this.doGet = this.requestWrapper(this.doGet), this.doPut = this.requestWrapper(this.doPut), this.initialized = !0);
  }
  static doPost(t, s) {
    return te(this.client.post(t, s));
  }
  static doPut(t, s) {
    return te(this.client.put(t, s));
  }
  static doGet(t) {
    return te(this.client.get(t));
  }
  static doDelete(t) {
    return ee(this, null, function* () {
      return new Promise((s, n) => {
        this.client.delete(t).then((o) => s(!!o)).catch((o) => n(o));
      });
    });
  }
  static getDatasetChunk(t, s = 1e4, n = 0) {
    return this.doGet(`dataset/get/dataset_name=${t}/chunksize=${s}/chunk_index=${n}`);
  }
  static getDatasetSchema(t) {
    return this.doGet(`dataset/get_schema/dataset_name=${t}`);
  }
  static getDatasetGenericData(t) {
    return this.doGet(`dataset/get_generic_data/dataset_name=${t}`);
  }
}
W.errors = [];
W.initialized = !1;
W.init();
const Zs = m({
  name: "BsDSSTable",
  props: {
    dssTableName: {
      type: String
    },
    serverSidePagination: Object
  },
  emts: ["update:fetching", "update:rows", "update:columns", "update:columns-count"],
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
        this.setFetchingChunk(!0), W.getDatasetChunk(...e).then((n) => {
          const o = this.transformDSSDataToQTableRow(n);
          this.setFetchingChunk(!1), t(o);
        }).catch(s);
      });
    },
    fetchDSSColumns(...e) {
      return this.setFetchingSchema(!0), new Promise((t, s) => {
        W.getDatasetGenericData(...e).then(({ schema: n, columnsCount: o }) => {
          const a = n.columns.map((r) => this.createBsTableCol({ name: r.name, dataType: r.type }));
          this.setFetchingSchema(!1), t({ columns: a, columnsCount: o });
        }).catch(s);
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
      return w({
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
      const s = Object.entries(t[0][1]).length, n = Array(s).fill(void 0).map((o, i) => ({}));
      return t.forEach(([o, i]) => {
        o = this.parseDSSColumn(o), Object.values(i).forEach((r, u) => {
          const c = n[u];
          c[o] = r;
        });
      }), n;
    },
    updateTableData() {
      const { batchSize: e, batchOffset: t } = this.serverSidePagination || {};
      this.dssTableName && e && t !== void 0 && (this.updateColumns(this.dssTableName), this.updateRows(this.dssTableName, e, t));
    },
    watchedChanged(e, t) {
      return e !== t;
    },
    updateTableDataOnWatchedChanged(e, t) {
      this.watchedChanged(e, t) && this.updateTableData();
    }
  },
  mounted() {
    this.updateTableData();
  }
});
function Fs(e, t, s, n, o, i) {
  return null;
}
const Gs = /* @__PURE__ */ b(Zs, [["render", Fs]]), Rs = 45, xs = 250;
let oe = () => {
};
{
  let e = function(n, o, i, ...a) {
    i === void 0 && (i = n), t.set(i, Date.now()), s.set(i, o), setTimeout(() => {
      if (!t.has(i))
        return;
      const r = s.get(i), u = t.get(i);
      (r < xs || Date.now() - u > r - Rs) && (a ? n(...a) : n(), t.delete(i));
    }, o);
  };
  const t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  oe = e;
}
function Pe(e, t, s, ...n) {
  return n ? oe(e, t, s, ...n) : oe(e, t, s);
}
function Xs(e, t, s = !1) {
  let n = e.length, o = 0, i = [];
  if (n) {
    const a = (r = 0) => t.indexOf(e, r);
    s || (t = t.toLowerCase(), e = e.toLowerCase());
    for (let r = a(o); r > -1; r = a(o))
      i.push(r), o = r + n;
  }
  return i;
}
function Js(e, t) {
  return e.hasOwnProperty(t) ? e[t] : void 0;
}
function he(e, t, s, n) {
  {
    const o = n(e, t) + "";
    return (o === "undefined" || o === "null" ? "" : o.toLowerCase()).includes(s);
  }
}
function Ks(e) {
  return e ? `${e}`.toLowerCase() : "";
}
function en(e, { columns: t, searchVal: s }, n, o) {
  let i = e;
  const a = Object.keys(t);
  if (a.length) {
    const r = n.filter((u) => a.includes(u.name));
    i = i.filter((u) => r.every((c) => {
      const $ = t[c.name];
      return he(c, u, $, o);
    }));
  }
  return s && (i = i.filter((r) => n.some((u) => he(u, r, s, o)))), i;
}
const tn = m({
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
      default: Ks
    }
  },
  components: { QInput: ge },
  emits: ["update:model-value", "update:loading", "update:formatted-value", "update:no-debounce:formatted-value"],
  data() {
    return {
      inputDebouncing: !1,
      value: null
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
      this.updateValueNoDebounce(e), this.setLoading(!0), Pe(
        () => {
          this.updateSearchedValue(e), this.setLoading(!1);
        },
        +this.valueSearchDebounce,
        "bs-search-table-search-text"
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
function sn(e, t, s, n, o, i) {
  const a = l("QInput");
  return d(), g(a, A({
    "model-value": e.value,
    "onUpdate:modelValue": e.updateValueDebounce,
    loading: e.inputDebouncing
  }, e.$attrs), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040, ["model-value", "onUpdate:modelValue", "loading"]);
}
const Be = /* @__PURE__ */ b(tn, [["render", sn]]), nn = m({
  name: "BsSearchTable",
  components: { BsInputDebounce: Be },
  data() {
    return {
      mdiTableSearch: ct
    };
  }
});
const on = { class: "bs-search-table-container" };
function an(e, t, s, n, o, i) {
  const a = l("q-icon"), r = l("BsInputDebounce");
  return d(), D("div", on, [
    p(r, A({
      width: "190",
      label: "Table Search",
      clearable: "",
      dense: "",
      filled: "",
      "format-input": ""
    }, e.$attrs), P({
      append: h(() => [
        p(a, { name: e.mdiTableSearch }, null, 8, ["name"])
      ]),
      _: 2
    }, [
      C(e.$slots, (u, c) => ({
        name: c,
        fn: h(($) => [
          f(e.$slots, c, y(v($ || {})), void 0, !0)
        ])
      }))
    ]), 1040)
  ]);
}
const rn = /* @__PURE__ */ b(nn, [["render", an], ["__scopeId", "data-v-b03630dc"]]), ln = m({
  name: "BsSearchTableCol",
  components: { BsInputDebounce: Be },
  props: {
    icon: String
  }
});
function dn(e, t, s, n, o, i) {
  const a = l("q-icon"), r = l("BsInputDebounce");
  return d(), g(r, A({
    width: "150",
    label: "Column Search",
    clearable: "",
    borderless: "",
    dense: "",
    "format-input": "",
    autofocus: ""
  }, e.$attrs), P({
    append: h(() => [
      p(a, { name: e.icon }, null, 8, ["name"])
    ]),
    _: 2
  }, [
    C(e.$slots, (u, c) => ({
      name: c,
      fn: h(($) => [
        f(e.$slots, c, y(v($ || {})))
      ])
    }))
  ]), 1040);
}
const un = /* @__PURE__ */ b(ln, [["render", dn]]), cn = m({
  name: "BSTableColHeader",
  components: {
    QIcon: H,
    QTh: Ke,
    QMenu: et,
    QItem: tt,
    QItemSection: st,
    QList: nt,
    BsSearchTableCol: un
  },
  emits: ["search-col"],
  data() {
    return {
      mdiArrowUpThin: ht,
      searchColIcon: pt,
      searchPopupActive: !1,
      lastSearchedValue: "",
      noDebounceValue: ""
    };
  },
  computed: {
    sortable() {
      var e;
      return !!((e = this.col) != null && e._sortable);
    },
    searching() {
      const e = this.lastSearchedValue;
      return !(fe(e) || L(e)) && !!(e != null && e.length);
    }
  },
  props: {
    sort: Function,
    col: Object,
    searchedCols: Object
  },
  watch: {
    searchPopupActive(e, t) {
      e || !t || this.searchColumn(this.noDebounceValue);
    },
    searchedCols(e) {
      var t;
      console.log(this.searchedCols), (t = this.col) != null && t.name && e.hasOwnProperty(this.col.name) ? this.lastSearchedValue = e[this.col.name] : this.lastSearchedValue = "";
    }
  },
  methods: {
    sortColumn() {
      this.sortable && this.sort && this.sort(this.col);
    },
    searchColumn(e) {
      var t;
      this.lastSearchedValue = e, this.$emit("search-col", (t = this.col) == null ? void 0 : t.name, e);
    }
  }
});
const hn = { class: "bs-table-col-header-title-container" }, pn = { class: "bs-table-col-header-title" }, mn = {
  key: 0,
  class: "bs-table-col-header-data-type"
}, gn = ["onClick"];
function bn(e, t, s, n, o, i) {
  var M, _, k, I;
  const a = l("q-icon"), r = l("BsSearchTableCol"), u = l("q-item-section"), c = l("q-item"), $ = l("q-list"), j = l("q-menu");
  return d(), D("div", {
    class: "bs-table-col-header-container",
    style: z({ "--bs-table-header-cursor-type": e.sortable ? "pointer" : "default" }),
    onClick: t[3] || (t[3] = (...B) => e.sortColumn && e.sortColumn(...B))
  }, [
    T("div", hn, [
      T("div", pn, N(((M = e.col) == null ? void 0 : M.label) || ((_ = e.col) == null ? void 0 : _.name) || ""), 1),
      (k = e.col) != null && k.dataType ? (d(), D("div", mn, N((I = e.col) == null ? void 0 : I.dataType), 1)) : S("", !0)
    ]),
    T("div", {
      ref: "BsTableColHeaderActions",
      class: "bs-table-col-header-actions q-py-xs q-px-sm rounded-borders",
      onClick: Qe((B) => 1, ["stop"])
    }, [
      e.sortable ? (d(), g(a, {
        key: 0,
        onClick: e.sortColumn,
        name: e.mdiArrowUpThin,
        size: "1rem",
        class: "sort-icon"
      }, null, 8, ["onClick", "name"])) : S("", !0),
      p(a, {
        class: O([
          e.searchPopupActive && "bs-table-col-header-action-interacting",
          e.searching && "bs-table-col-header-action-active"
        ]),
        name: e.searchColIcon,
        size: "1rem"
      }, {
        default: h(() => [
          p(j, {
            anchor: "top middle",
            self: "bottom middle",
            "transition-show": "scale",
            "transition-hide": "scale",
            offset: [0, 10],
            modelValue: e.searchPopupActive,
            "onUpdate:modelValue": t[2] || (t[2] = (B) => e.searchPopupActive = B)
          }, {
            default: h(() => [
              p($, null, {
                default: h(() => [
                  p(c, null, {
                    default: h(() => [
                      p(u, null, {
                        default: h(() => [
                          p(r, {
                            icon: e.searchColIcon,
                            modelValue: e.lastSearchedValue,
                            "onUpdate:modelValue": t[0] || (t[0] = (B) => e.lastSearchedValue = B),
                            "onUpdate:formattedValue": e.searchColumn,
                            "onUpdate:noDebounce:formattedValue": t[1] || (t[1] = (B) => e.noDebounceValue = B)
                          }, null, 8, ["icon", "modelValue", "onUpdate:formattedValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]),
        _: 1
      }, 8, ["class", "name"])
    ], 8, gn)
  ], 4);
}
const fn = /* @__PURE__ */ b(cn, [["render", bn], ["__scopeId", "data-v-970d4ee7"]]), Sn = m({
  name: "BSTableHeader",
  components: {
    QTr: be,
    BsTableColHeader: fn
  },
  props: {
    props: {
      type: Object,
      required: !0
    },
    searchedCols: Object
  },
  emits: ["search-col"]
});
function Tn(e, t, s, n, o, i) {
  const a = l("BsTableColHeader"), r = l("q-th"), u = l("q-tr");
  return d(), g(u, { props: e.props }, {
    default: h(() => [
      (d(!0), D(J, null, C(e.props.cols, (c) => (d(), g(r, {
        key: c.name,
        props: e.props
      }, {
        default: h(() => [
          p(a, {
            sort: e.props.sort,
            col: c,
            "searched-cols": e.searchedCols,
            onSearchCol: t[0] || (t[0] = (...$) => e.$emit("search-col", ...$))
          }, null, 8, ["sort", "col", "searched-cols"])
        ]),
        _: 2
      }, 1032, ["props"]))), 128))
    ]),
    _: 1
  }, 8, ["props"]);
}
const Mn = /* @__PURE__ */ b(Sn, [["render", Tn], ["__scopeId", "data-v-1c31ba07"]]), Dn = m({
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
      let e = L(this.text) || fe(this.text) ? "" : bt(`${this.text}`);
      const t = (this.queries || []).filter((c) => !L(c));
      if (!(e && t.length))
        return e;
      let s = /* @__PURE__ */ new Map([
        [0, { from: [], to: [] }],
        [e.length, { from: [], to: [] }]
      ]);
      t.forEach(
        (c, $) => Xs(c, e).forEach((j) => {
          const M = j, _ = j + c.length;
          s.has(M) || s.set(M, { from: [], to: [] }), s.has(_) || s.set(_, { from: [], to: [] });
          const k = s.get(M), I = s.get(_);
          k.from.push($), I.to.push($);
        })
      );
      const n = Array.from(s.keys()).sort((c, $) => c - $);
      if (!n.length)
        return e;
      const o = n.length - 1, i = [], a = new Array(o).fill("").map((c, $) => e.substring(n[$], n[$ + 1]));
      let r = 0;
      for (; r < o; ) {
        const { from: c, to: $ } = s.get(n[r]);
        c.forEach((M) => {
          i.includes(M) || i.push(M);
          const _ = $.indexOf(M);
          _ !== -1 && i.splice(_, 1);
        }), $.forEach((M) => {
          const _ = i.indexOf(M);
          _ !== -1 && i.splice(_, 1);
        });
        const j = this.createClassesFromQueries(i);
        a[r] = `<span class="text-underline ${j}">${a[r]}</span>`, r++;
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
const $n = ["innerHTML"];
function In(e, t, s, n, o, i) {
  return d(), D("span", { innerHTML: e.highlightedText }, null, 8, $n);
}
const _n = /* @__PURE__ */ b(Dn, [["render", In]]), yn = m({
  name: "BsTablePagination",
  components: {
    QBtn: K
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
      var e, t, s, n, o;
      L((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (n = this.serverSidePagination) != null && n.recordsCount && (this.recordsCount = (o = this.serverSidePagination) == null ? void 0 : o.recordsCount);
    },
    executeAndGoToTop(e) {
      e(), this.startOfThePage && this.startOfThePage();
    }
  }
});
const vn = { class: "bs-table-pagination" }, Cn = { class: "bs-table-pagination-controls" }, wn = { class: "bs-table-records-info" };
function Nn(e, t, s, n, o, i) {
  const a = l("q-btn");
  return d(), D("div", vn, [
    T("div", Cn, [
      e.scope.pagesNumber > 2 ? (d(), g(a, {
        key: 0,
        icon: "first_page",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[0] || (t[0] = (r) => e.executeAndGoToTop(e.scope.firstPage))
      }, null, 8, ["disable"])) : S("", !0),
      p(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isFirstPage,
        onClick: t[1] || (t[1] = (r) => e.executeAndGoToTop(e.scope.prevPage))
      }, null, 8, ["disable"]),
      T("div", wn, N(e.recordsShown), 1),
      p(a, {
        icon: "chevron_right",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isLastPage,
        onClick: t[2] || (t[2] = (r) => e.executeAndGoToTop(e.scope.nextPage))
      }, null, 8, ["disable"]),
      e.scope.pagesNumber > 2 ? (d(), g(a, {
        key: 1,
        icon: "last_page",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.scope.isLastPage,
        onClick: t[3] || (t[3] = (r) => e.executeAndGoToTop(e.scope.lastPage))
      }, null, 8, ["disable"])) : S("", !0)
    ])
  ]);
}
const jn = /* @__PURE__ */ b(yn, [["render", Nn], ["__scopeId", "data-v-2f16ad4e"]]), Pn = m({
  name: "BsTableVirtualScrollIndicator",
  components: {
    QLinearProgress: ot
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
      Pe(() => {
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
const Bn = { class: "bs-table-virtual-scroll-progress-bar" };
function On(e, t, s, n, o, i) {
  const a = l("q-linear-progress");
  return d(), D("div", {
    class: O(["bs-table-virtual-scroll", e.showProgressBar && "bs-table-virtual-scroll--active"])
  }, [
    T("div", Bn, [
      p(a, {
        value: e.progress,
        rounded: "",
        size: "5px"
      }, null, 8, ["value"])
    ])
  ], 2);
}
const An = /* @__PURE__ */ b(Pn, [["render", On], ["__scopeId", "data-v-15d38d19"]]), kn = m({
  name: "BsTableBottom",
  components: {
    BsTablePagination: jn,
    BsTableVirtualScrollIndicator: An,
    QIcon: H
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
      mdiAlert: mt
    };
  },
  computed: {
    pagination() {
      return this.scope.pagination;
    },
    isFullDataset() {
      return L(this.serverSidePagination);
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
const zn = (e) => (x("data-v-e7e3b82f"), e = e(), X(), e), Ln = { class: "bs-table-bottom-container" }, Vn = /* @__PURE__ */ zn(() => /* @__PURE__ */ T("div", { class: "bs-table-warning-text" }, "the search is applied only to the sampled records!", -1)), Qn = {
  key: 1,
  class: "bs-table-records-total"
};
function En(e, t, s, n, o, i) {
  const a = l("q-icon"), r = l("BsTablePagination"), u = l("BsTableVirtualScrollIndicator");
  return d(), D("div", Ln, [
    e.isFullDataset ? S("", !0) : (d(), D("div", {
      key: 0,
      class: O(["bs-table-warning", e.searching && "bs-table-warning-active"])
    }, [
      p(a, { name: e.mdiAlert }, null, 8, ["name"]),
      Vn
    ], 2)),
    e.recordsTotal && !e.virtualScroll || !e.isFullDataset && e.recordsCount ? (d(), D("div", Qn, "records total: " + N(e.recordsTotal), 1)) : S("", !0),
    e.virtualScroll ? (d(), g(u, {
      key: 3,
      "q-table-middle": e.qTableMiddle
    }, null, 8, ["q-table-middle"])) : (d(), g(r, {
      key: 2,
      scope: e.scope,
      "server-side-pagination": e.serverSidePagination,
      "start-of-the-page": e.startOfThePage
    }, null, 8, ["scope", "server-side-pagination", "start-of-the-page"]))
  ]);
}
const Un = /* @__PURE__ */ b(kn, [["render", En], ["__scopeId", "data-v-e7e3b82f"]]), Wn = m({
  name: "default",
  components: {},
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
      return !(L(this.lastBatchIndex) || this.batchOffset !== this.lastBatchIndex);
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
      var e, t, s, n, o;
      L((e = this.serverSidePagination) == null ? void 0 : e.batchOffset) || (this.batchOffset = this.serverSidePagination.batchOffset), (t = this.serverSidePagination) != null && t.batchSize && (this.batchSize = (s = this.serverSidePagination) == null ? void 0 : s.batchSize), (n = this.serverSidePagination) != null && n.recordsCount && (this.recordsCount = (o = this.serverSidePagination) == null ? void 0 : o.recordsCount);
    }
  },
  mounted() {
    this.syncServerSidePagination();
  }
});
const Hn = (e) => (x("data-v-9c8eccd1"), e = e(), X(), e), qn = {
  key: 0,
  class: "bs-table-server-side-pagination"
}, Yn = /* @__PURE__ */ Hn(() => /* @__PURE__ */ T("div", { class: "bs-table-server-side-pagination-label" }, " sampled records: ", -1)), Zn = { class: "bs-table-server-side-pagination-controls" }, Fn = { class: "bs-table-server-side-pagination-offset" };
function Gn(e, t, s, n, o, i) {
  const a = l("q-btn");
  return e.lastBatchIndex !== 0 ? (d(), D("div", qn, [
    Yn,
    T("div", Zn, [
      p(a, {
        icon: "chevron_left",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.isFirstBatch,
        onClick: e.prevBatch
      }, null, 8, ["disable", "onClick"]),
      T("div", Fn, N(e.sampleFrom) + " - " + N(e.sampleTo), 1),
      p(a, {
        icon: "chevron_right",
        color: "grey-8",
        round: "",
        dense: "",
        flat: "",
        disable: e.isLastBatch,
        onClick: e.nextBatch
      }, null, 8, ["disable", "onClick"])
    ])
  ])) : S("", !0);
}
const Rn = /* @__PURE__ */ b(Wn, [["render", Gn], ["__scopeId", "data-v-9c8eccd1"]]), xn = m({
  name: "BsTable",
  components: {
    QTable: at,
    QTr: be,
    BsDSSTableFunctional: Gs,
    BsSearchWholeTable: rn,
    BSTableHeader: Mn,
    BsTextHighlight: _n,
    BsTableBottom: Un,
    BsTableServerSidePagination: Rn
  },
  emits: ["update:rows", "update:columns", "update:server-side-pagination", "virtual-scroll"],
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
      mdiCloseCircleMultiple: gt
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
      return !(!this.searchedValue && ft(this.searchedCols));
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
    formattedColumns() {
      if (this.passedColumns)
        return this.passedColumns.map((e) => Z(w({}, e), { sortable: !1, _sortable: e.sortable }));
    },
    filter() {
      return {
        columns: this.searchedCols,
        searchVal: this.searchedValueFormatted
      };
    },
    colSlots() {
      return (this.passedColumns || []).map((t) => [this.getColBodySlot(t.name), t.name]);
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
          ([t]) => !e.includes(t)
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
    }
  },
  methods: {
    updateDSSRows(e) {
      e || (e = []);
      const { batchSize: t, batchOffset: s } = this._serverSidePagination, n = Object.keys(e).length;
      if (n < t) {
        const o = {};
        o.recordsCount = s * t + n, n == 0 && (o.batchOffset = s - 1), this.setServerSidePagination(o, !0);
      }
      this._rows = e, this.$emit("update:rows", this._rows);
    },
    updateDSSColumns(e) {
      this._columns = e, this.$emit("update:columns", this._columns);
    },
    searchTableFilter(...e) {
      return en(...e);
    },
    updateSearchedCols(e, t) {
      t && (this.searchedCols[e] = t), this.searchedCols.hasOwnProperty(e) && (t || delete this.searchedCols[e], this.searchedCols = w({}, this.searchedCols));
    },
    getColBodySlot(e) {
      return `body-cell-${e}`;
    },
    getColSearchedValue(e) {
      return Js(this.searchedCols, e);
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
      e = w({}, e), Object.entries(e).forEach(([s, n]) => {
        n < 0 && (n = 0), e[s] = n, this._serverSidePagination[s] = n;
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
      this.searchedValue = null, this.searchedCols = {};
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
    }
  },
  mounted() {
    var e, t, s;
    (this.dssTableName || this.serverSidePagination) && (this.createServerSidePagination(), this.syncServerSidePagination()), this.passedRowsLength = ((e = this.passedRows) == null ? void 0 : e.length) || 0, this.tableEl = (t = this.$refs.qTable) == null ? void 0 : t.$el, this.qTableMiddle = (s = this.tableEl) == null ? void 0 : s.getElementsByClassName("q-table__middle")[0];
  }
});
const Xn = { class: "bs-table-top-container" }, Jn = { class: "bs-table-name" }, Kn = { key: 1 }, eo = { class: "bs-table-search-container" }, to = {
  key: 1,
  class: "bs-table-top-slot-container"
};
function so(e, t, s, n, o, i) {
  const a = l("BsDSSTableFunctional"), r = l("BsSearchWholeTable"), u = l("q-btn"), c = l("BsTableServerSidePagination"), $ = l("BsTextHighlight"), j = l("q-td"), M = l("BSTableHeader"), _ = l("BsTableBottom"), k = l("QTable");
  return d(), D(J, null, [
    e.isDSSTable ? (d(), g(a, {
      key: 0,
      "dss-table-name": e.dssTableName,
      "server-side-pagination": e._serverSidePagination,
      "onUpdate:fetching": t[0] || (t[0] = (I) => e.fetching = I),
      "onUpdate:rows": e.updateDSSRows,
      "onUpdate:columns": e.updateDSSColumns,
      "onUpdate:columnsCount": t[1] || (t[1] = (I) => e.setRecordsCount(I, !0))
    }, null, 8, ["dss-table-name", "server-side-pagination", "onUpdate:rows", "onUpdate:columns"])) : S("", !0),
    p(k, A({
      ref: "qTable",
      rows: e.passedRows,
      columns: e.formattedColumns,
      filter: e.filter,
      "filter-method": e.searchTableFilter,
      loading: e.isLoading
    }, e.$attrs, {
      "virtual-scroll": e.virtualScroll,
      "rows-per-page-options": e.virtualScroll ? [0] : void 0,
      class: [...e.classParsed, ...e.tableClasses],
      onVirtualScroll: e.onVirtualScroll
    }), P({
      top: h(() => [
        T("div", Xn, [
          T("div", Jn, [
            e.$slots.title ? f(e.$slots, "title", { key: 0 }, void 0, !0) : (d(), D("span", Kn, N(e.title || e.dssTableName || ""), 1))
          ]),
          T("div", eo, [
            e.globalSearch ? (d(), g(r, {
              key: 0,
              modelValue: e.searchedValue,
              "onUpdate:modelValue": t[2] || (t[2] = (I) => e.searchedValue = I),
              "onUpdate:formattedValue": t[3] || (t[3] = (I) => e.searchedValueFormatted = I),
              "onUpdate:loading": t[4] || (t[4] = (I) => e.searching = I)
            }, null, 8, ["modelValue"])) : S("", !0),
            T("div", {
              class: O(["bs-table-clear-all-btn", e.anyColumnSearched && "bs-table-clear-all-btn--active"])
            }, [
              p(u, {
                flat: "",
                round: "",
                color: "primary",
                icon: e.mdiCloseCircleMultiple,
                onClick: e.clearAllSearch
              }, null, 8, ["icon", "onClick"])
            ], 2)
          ])
        ]),
        e._serverSidePagination && e.serverSidePaginationControls ? (d(), g(c, {
          key: 0,
          "server-side-pagination": e._serverSidePagination,
          "onUpdate:batchOffset": t[5] || (t[5] = (I) => {
            e.setBatchOffset(I, !0);
          })
        }, null, 8, ["server-side-pagination"])) : S("", !0),
        e.$slots.top ? (d(), D("div", to, [
          f(e.$slots, "top", {}, void 0, !0)
        ])) : S("", !0)
      ]),
      header: h((I) => [
        p(M, {
          props: I,
          "searched-cols": e.searchedCols,
          onSearchCol: e.updateSearchedCols
        }, null, 8, ["props", "searched-cols", "onSearchCol"])
      ]),
      bottom: h((I) => [
        p(_, {
          scope: I,
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
      C(e.colSlots, ([I, B]) => ({
        name: I,
        fn: h((Y) => [
          p(j, { props: Y }, {
            default: h(() => [
              p($, {
                queries: [e.searchedValueFormatted, e.getColSearchedValue(B)],
                text: Y.value
              }, null, 8, ["queries", "text"])
            ]),
            _: 2
          }, 1032, ["props"])
        ])
      })),
      C(e.filteredSlots, (I, B) => ({
        name: B,
        fn: h((Y) => [
          f(e.$slots, B, y(v(Y || {})), void 0, !0)
        ])
      }))
    ]), 1040, ["rows", "columns", "filter", "filter-method", "loading", "virtual-scroll", "rows-per-page-options", "class", "onVirtualScroll"])
  ], 64);
}
const no = /* @__PURE__ */ b(xn, [["render", so], ["__scopeId", "data-v-88d257da"]]), oo = m({
  name: "BsImg",
  components: {
    QImg: it
  }
});
function ao(e, t, s, n, o, i) {
  const a = l("QImg");
  return d(), g(a, y(v(e.$attrs)), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const io = /* @__PURE__ */ b(oo, [["render", ao]]), ro = m({
  name: "BsIcon",
  components: {
    QIcon: H
  }
});
function lo(e, t, s, n, o, i) {
  const a = l("QIcon");
  return d(), g(a, y(v(e.$attrs)), P({ _: 2 }, [
    C(e.$slots, (r, u) => ({
      name: u,
      fn: h((c) => [
        f(e.$slots, u, y(v(c || {})))
      ])
    }))
  ]), 1040);
}
const uo = /* @__PURE__ */ b(ro, [["render", lo]]), co = m({
  name: "BsCheckbox",
  components: {
    QCheckbox: rt
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
}), ho = {
  key: 0,
  class: "dku-tiny-text bs-checkbox__hint"
};
function po(e, t, s, n, o, i) {
  const a = l("QCheckbox");
  return d(), D("div", {
    class: O(["bs-checkbox", { hint: e.isHintOnly, disabled: e.isDisabled }])
  }, [
    p(a, A(e.$attrs, {
      size: "29.57px",
      tabindex: 0,
      label: e.labelFromHint
    }), P({ _: 2 }, [
      C(e.$slots, (r, u) => ({
        name: u,
        fn: h((c) => [
          f(e.$slots, u, y(v(c || {})))
        ])
      }))
    ]), 1040, ["label"]),
    e.hint && e.$attrs.label ? (d(), D("div", ho, N(e.hint), 1)) : S("", !0)
  ], 2);
}
const mo = /* @__PURE__ */ b(co, [["render", po]]), go = m({
  name: "BsDateRange",
  components: {
    QInput: ge,
    QDate: lt,
    QPopupProxy: dt,
    QIcon: H,
    QBtn: K
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
}), bo = {
  key: 0,
  class: "bs-date-range__label dss-caption-400 q-mb-xs"
}, fo = { class: "row items-center justify-end" };
function So(e, t, s, n, o, i) {
  const a = l("QBtn"), r = l("QDate"), u = l("QPopupProxy"), c = l("QIcon"), $ = l("QInput"), j = Ee("close-popup");
  return d(), D("div", null, [
    e.bsLabel ? (d(), D("label", bo, N(e.bsLabel), 1)) : S("", !0),
    p($, {
      dense: "",
      outlined: "",
      readonly: "",
      modelValue: e.inputValue,
      "onUpdate:modelValue": t[0] || (t[0] = (M) => e.inputValue = M)
    }, {
      append: h(() => [
        p(c, {
          name: "event",
          class: "cursor-pointer"
        }, {
          default: h(() => [
            p(u, {
              cover: "",
              "transition-show": "scale",
              "transition-hide": "scale"
            }, {
              default: h(() => [
                p(r, A({ range: "" }, e.$attrs), {
                  default: h(() => [
                    T("div", fo, [
                      V(p(a, {
                        label: "Close",
                        color: "primary",
                        flat: ""
                      }, null, 512), [
                        [j]
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
const To = /* @__PURE__ */ b(go, [["render", So]]);
const Mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BsButton: ws,
  BsCheckbox: mo,
  BsContent: se,
  BsDateRange: To,
  BsDocumentation: ne,
  BsDrawer: Q,
  BsDrawerBtn: Ie,
  BsHeader: E,
  BsIcon: uo,
  BsImg: io,
  BsLayoutDefault: hs,
  BsLayoutDrawer: _e,
  BsLayoutHeader: ye,
  BsMenuTab: ve,
  BsMenuTabs: Ce,
  BsRange: Qs,
  BsSelect: ys,
  BsSlider: zs,
  BsSpinner: Ws,
  BsTab: je,
  BsTabChild: q,
  BsTabIcon: F,
  BsTabPageChildWrapper: re,
  BsTabTitle: le,
  BsTable: no,
  BsToggle: Ds,
  BsTooltip: Ps,
  CheckSlotComponentsMixin: ie,
  ProvideMixin: ae
}, Symbol.toStringTag, { value: "Module" })), Co = {
  version: "1.3.8",
  install(e) {
    Tt(e, { components: Mo });
  }
}, wo = "1.3.8";
export {
  ws as BsButton,
  mo as BsCheckbox,
  se as BsContent,
  To as BsDateRange,
  ne as BsDocumentation,
  Q as BsDrawer,
  Ie as BsDrawerBtn,
  E as BsHeader,
  uo as BsIcon,
  io as BsImg,
  hs as BsLayoutDefault,
  _e as BsLayoutDrawer,
  ye as BsLayoutHeader,
  ve as BsMenuTab,
  Ce as BsMenuTabs,
  Qs as BsRange,
  ys as BsSelect,
  zs as BsSlider,
  Ws as BsSpinner,
  je as BsTab,
  q as BsTabChild,
  F as BsTabIcon,
  re as BsTabPageChildWrapper,
  le as BsTabTitle,
  no as BsTable,
  Ds as BsToggle,
  Ps as BsTooltip,
  ie as CheckSlotComponentsMixin,
  ae as ProvideMixin,
  Co as QuasarBs,
  wo as version
};
