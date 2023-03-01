var Te = Object.defineProperty, fe = Object.defineProperties;
var $e = Object.getOwnPropertyDescriptors;
var F = Object.getOwnPropertySymbols;
var ye = Object.prototype.hasOwnProperty, Ne = Object.prototype.propertyIsEnumerable;
var q = (e, t, n) => t in e ? Te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, N = (e, t) => {
  for (var n in t || (t = {}))
    ye.call(t, n) && q(e, n, t[n]);
  if (F)
    for (var n of F(t))
      Ne.call(t, n) && q(e, n, t[n]);
  return e;
}, x = (e, t) => fe(e, $e(t));
import { defineComponent as p, computed as ee, openBlock as i, createBlock as g, Teleport as V, renderSlot as c, createCommentVNode as M, resolveComponent as r, withCtx as u, createVNode as I, normalizeStyle as C, normalizeClass as S, createElementVNode as D, createElementBlock as T, createTextVNode as we, toDisplayString as _, pushScopeId as te, popScopeId as ne, mergeProps as A, withDirectives as O, vShow as L, Fragment as se, renderList as w, createSlots as j, normalizeProps as $, guardReactiveProps as y, resolveDirective as je } from "vue";
import { QCard as Se, QBtn as Z, QIcon as H, QDrawer as _e, QHeader as Ae, QTab as Ce, QTooltip as oe, QTabs as Oe, QPageContainer as ke, QPage as ve, QLayout as ze, QSelect as Be, QSlider as Le, QRange as Qe, QSpinner as Pe, QTable as Ee, QImg as Ve, QCheckbox as Ue, QInput as xe, QDate as We, QPopupProxy as Ye } from "quasar";
function Ze(e) {
  return e !== null && typeof e == "object" && Array.isArray(e) !== !0;
}
function He(e, t) {
  t.components !== void 0 && Object.values(t.components).forEach((n) => {
    Ze(n) === !0 && n.name !== void 0 && e.component(n.name, n);
  });
}
const G = p({
  name: "ProvideMixin",
  methods: {
    providePrefixed(e, t) {
      const { prefix: n, getter: s } = N({
        prefix: "$",
        getter: (a) => this[a]
      }, t);
      return e.reduce((a, l) => {
        const o = n + l;
        return a[o] = s(l), a;
      }, {});
    },
    createComputedFromKey(e) {
      return ee(() => this[e]);
    },
    provideComputed(e, t) {
      const n = x(N({}, t), {
        getter: (s) => this.createComputedFromKey(s)
      });
      return this.providePrefixed(e, n);
    },
    provideStatic(e, t) {
      const n = x(N({}, t), {
        getter: (s) => this[s]
      });
      return this.providePrefixed(e, n);
    }
  }
}), J = p({
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
      return ((a) => this.$slots.hasOwnProperty(a) ? this.$slots[a]() : [])(t).filter((a) => {
        const l = a.type;
        return (l == null ? void 0 : l.name) && l.name === e;
      });
    }
  }
});
function Ge(...e) {
  e.forEach(([t, n]) => {
    setTimeout(() => {
      t();
    }, n);
  });
}
function ae(e, t, n, s, a = 50) {
  Ge(
    [e, a * +!n],
    [t, s * +n]
  );
}
const ie = (e) => `bs-menu-tab-${e}`, re = (e) => `tab-content-id-${e}`, Je = p({
  name: "BsTabPageChildWrapper",
  inject: ["$qPageMounted", "$tabId"],
  computed: {
    contentCSSSelector() {
      return `#${this.tabContentId}`;
    },
    tabContentId() {
      return re(this.tabId);
    },
    tabId() {
      return this == null ? void 0 : this.$tabId;
    },
    qPageMounted() {
      return this == null ? void 0 : this.$qPageMounted;
    }
  }
}), b = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
};
function Xe(e, t, n, s, a, l) {
  return e.qPageMounted ? (i(), g(V, {
    key: 0,
    to: e.contentCSSSelector
  }, [
    c(e.$slots, "default")
  ], 8, ["to"])) : M("", !0);
}
const X = /* @__PURE__ */ b(Je, [["render", Xe]]), Re = p({
  name: "BsContent",
  components: {
    BsTabPageChildWrapper: X
  }
});
function Fe(e, t, n, s, a, l) {
  const o = r("BsTabPageChildWrapper");
  return i(), g(o, null, {
    default: u(() => [
      c(e.$slots, "default")
    ]),
    _: 3
  });
}
const W = /* @__PURE__ */ b(Re, [["render", Fe]]), qe = p({
  name: "BsDocumentation",
  components: {
    QCard: Se,
    QBtn: Z,
    BsTabPageChildWrapper: X
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
      return N(N(N(N({}, this.defaultDocsPropValues), this.layoutDocsProps), this.tabDocsProps), this.docsProps);
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
      return Object.entries(e).reduce((n, [s, a]) => (a !== void 0 && (n[s] = a), n), {});
    }
  },
  watch: {
    modelValue() {
      this.open = this.modelValue;
    },
    open() {
      ae(
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
}), de = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxNCAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNjQ2IDAuNzAzNjEzQzAuNzM2ODU3IDAuNzAzNjEzIDAgMS40MTMxOCAwIDIuMjg4NjVWNy43ODUyNEMwIDguNjYwNzEgMC43MzY4NTcgOS4zNzAyOCAxLjY0NiA5LjM3MDI4SDQuMDkwNjVDNC4wMzExMSA5LjA1ODAyIDQgOC43MzYxNyA0IDguNDA3MzJIMy43NVYxLjY2NjU4SDEwLjM1NEMxMC43MTA5IDEuNjY2NTggMTEgMS45NDUwMSAxMSAyLjI4ODY1VjMuMzEwMzFDMTEuMzQ4NiAzLjQwNTI0IDExLjY4MzIgMy41MzI0NCAxMiAzLjY4ODM1VjIuMjg4NjVDMTIgMS40MTMxOCAxMS4yNjMxIDAuNzAzNjEzIDEwLjM1NCAwLjcwMzYxM0gxLjY0NlpNMi43NSAxLjY2NjU4VjguNDA3MzJIMS42NDZDMS4yODkxNCA4LjQwNzMyIDEgOC4xMjg4OCAxIDcuNzg1MjRWMi4yODg2NUMxIDEuOTQ1MDEgMS4yODkxNCAxLjY2NjU4IDEuNjQ2IDEuNjY2NThIMi43NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNDk5OSA3LjUxODVDOC45ODk5IDcuNTE4NSA4LjU3Njg5IDcuOTE2MjEgOC41NzY4OSA4LjQwNzMyQzguNTc2ODkgOC44OTg0MyA4Ljk4OTkgOS4yOTYxMyA5LjQ5OTkgOS4yOTYxM0MxMC4wMDk5IDkuMjk2MTMgMTAuNDIyOSA4Ljg5ODQzIDEwLjQyMjkgOC40MDczMkMxMC40MjI5IDcuOTE2MjEgMTAuMDA5OSA3LjUxODUgOS40OTk5IDcuNTE4NVoiIGZpbGw9IiMwMUIyQUEiLz4KPHBhdGggZD0iTTkuNSAxMi43NDA2QzExLjk4NSAxMi43NDA2IDE0IDEwLjgwMDMgMTQgOC40MDczMkMxNCA2LjAxNDM1IDExLjk4NSA0LjA3Mzk4IDkuNSA0LjA3Mzk4QzcuMDE1IDQuMDczOTggNSA2LjAxNDM1IDUgOC40MDczMkM1IDEwLjgwMDMgNy4wMTUgMTIuNzQwNiA5LjUgMTIuNzQwNlpNOS41MDI5IDUuNTE4NDNDOS43Mjg5IDUuNTIxMzIgOS45NTM5IDUuNTQ2MzUgMTAuMTczOSA1LjU5MzU0QzEwLjI2OTkgNS42MTM3NiAxMC4zNDE5IDUuNjkxNzYgMTAuMzUyOSA1Ljc4NjEzTDEwLjQwNDkgNi4yMzg3MkMxMC40Mjg5IDYuNDQ2NzIgMTAuNjEwOSA2LjYwMzY5IDEwLjgyNzkgNi42MDM2OUMxMC44ODU5IDYuNjAzNjkgMTAuOTQzOSA2LjU5MjEzIDEwLjk5NzkgNi41NjkwMkwxMS40Mjg5IDYuMzg3MDJDMTEuNTE4OSA2LjM0OTQ3IDExLjYyMjkgNi4zNjk2OSAxMS42ODk5IDYuNDM5MDJDMTIuMDAwOSA2Ljc1OTY5IDEyLjIzMjkgNy4xNDM5MSAxMi4zNjc5IDcuNTYyOEMxMi4zOTY5IDcuNjUzMzIgMTIuMzYzOSA3Ljc1MTU0IDEyLjI4NDkgNy44MDczOUwxMS45MDI5IDguMDc4OTVDMTEuNzkzOSA4LjE1NTk4IDExLjcyOTkgOC4yNzgyOCAxMS43Mjk5IDguNDA4MjhDMTEuNzI5OSA4LjUzODI4IDExLjc5MzkgOC42NjA1OCAxMS45MDM5IDguNzM4NThMMTIuMjg1OSA5LjAxMDEzQzEyLjM2NDkgOS4wNjU5OCAxMi4zOTg5IDkuMTY0MjEgMTIuMzY5OSA5LjI1NDcyQzEyLjIzNDkgOS42NzM2MSAxMi4wMDI5IDEwLjA1NzggMTEuNjkxOSAxMC4zNzg1QzExLjYyNDkgMTAuNDQ2OSAxMS41MTk5IDEwLjQ2ODEgMTEuNDMwOSAxMC40MzA1TDEwLjk5NzkgMTAuMjQ3NUMxMC44NzM5IDEwLjE5NTUgMTAuNzMxOSAxMC4yMDMyIDEwLjYxNDkgMTAuMjY3OEMxMC40OTc5IDEwLjMzMzIgMTAuNDE5OSAxMC40NDc4IDEwLjQwNDkgMTAuNTc2OUwxMC4zNTI5IDExLjAyOTVDMTAuMzQxOSAxMS4xMjI5IDEwLjI3MTkgMTEuMTk5OSAxMC4xNzY5IDExLjIyMTFDOS43MzA5IDExLjMyMzIgOS4yNjY5IDExLjMyMzIgOC44MjA5IDExLjIyMTFDOC43MjU5IDExLjE5ODkgOC42NTU5IDExLjEyMjkgOC42NDQ5IDExLjAyOTVMOC41OTI5IDEwLjU3NzhDOC41Nzc5IDEwLjQ0ODggOC40OTk5IDEwLjMzNDIgOC4zODI5IDEwLjI2OTdDOC4yNjU5IDEwLjIwNTIgOC4xMjM5IDEwLjE5NzUgOC4wMDA5IDEwLjI0OTVMNy41Njc4OSAxMC40MzI0QzcuNDc3OSAxMC40NyA3LjM3MzkgMTAuNDQ5OCA3LjMwNjkgMTAuMzgwNEM2Ljk5NTkgMTAuMDU5OCA2Ljc2MzkgOS42NzU1NCA2LjYyODg5IDkuMjU1NjlDNi41OTk5IDkuMTY1MTcgNi42MzM5IDkuMDY2OTUgNi43MTI5IDkuMDExMDlMNy4wOTU4OSA4LjczOTU0QzcuMjA0OSA4LjY2MjUgNy4yNjg5IDguNTQwMjEgNy4yNjg5IDguNDEwMjFDNy4yNjg5IDguMjgwMjEgNy4yMDQ5IDguMTU3OTEgNy4wOTU4OSA4LjA3OTkxTDYuNzEzODkgNy44MDkzMkM2LjYzNDkgNy43NTM0NiA2LjYwMDkgNy42NTUyNCA2LjYyOTkgNy41NjQ3MkM2Ljc2NDkgNy4xNDU4MyA2Ljk5Njg5IDYuNzYxNjEgNy4zMDc4OSA2LjQ0MDk1QzcuMzc0OSA2LjM3MjU4IDcuNDc5OSA2LjM1MTM5IDcuNTY4OSA2LjM4ODk1TDcuOTk5OSA2LjU3MDk1QzguMTIzOSA2LjYyMjk1IDguMjY1ODkgNi42MTUyNCA4LjM4Mzg5IDYuNTQ5NzZDOC41MDA5IDYuNDg0MjggOC41Nzg5IDYuMzY5NjkgOC41OTM4OSA2LjIzOTY5TDguNjQ1OSA1Ljc4ODA2QzguNjU2OSA1LjY5MzY5IDguNzI4OSA1LjYxNjY1IDguODI0OSA1LjU5NTQ2QzkuMDQ1OSA1LjU0ODI4IDkuMjcwOSA1LjUyMzI0IDkuNTAxOSA1LjUyMDM1TDkuNTAyOSA1LjUxODQzWiIgZmlsbD0iIzAxQjJBQSIvPgo8L3N2Zz4K";
const le = (e) => (te("data-v-47db9d18"), e = e(), ne(), e), Ke = /* @__PURE__ */ le(() => /* @__PURE__ */ D("div", { class: "row items-center q-gutter-sm no-wrap" }, [
  /* @__PURE__ */ D("img", {
    src: de,
    width: "15",
    height: "16"
  }),
  /* @__PURE__ */ D("span", { class: "btn-solution-text" }, "Dataiku Solutions")
], -1)), et = { class: "flex row items-center q-gutter-sm q-mb-lg" }, tt = ["src", "width", "height"], nt = { class: "dku-large-title-sb" }, st = { class: "doc-body" }, ot = /* @__PURE__ */ le(() => /* @__PURE__ */ D("div", { class: "doc-footer flex row items-center" }, [
  /* @__PURE__ */ D("span", { class: "doc-footer__icon" }, [
    /* @__PURE__ */ D("img", {
      src: de,
      width: "14",
      height: "12.5"
    })
  ]),
  /* @__PURE__ */ D("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
], -1));
function at(e, t, n, s, a, l) {
  const o = r("QBtn"), m = r("QCard"), d = r("BsTabPageChildWrapper");
  return i(), g(d, null, {
    default: u(() => [
      I(o, {
        unelevated: "",
        outline: "",
        "no-caps": "",
        "no-wrap": "",
        class: "btn-solution absolute",
        square: "",
        onClick: t[0] || (t[0] = (h) => e.toggleDoc())
      }, {
        default: u(() => [
          Ke
        ]),
        _: 1
      }),
      I(m, {
        style: C(e.docContentStyleVariables),
        class: S([
          "doc-content",
          "flex",
          "row",
          e.docHide && "doc-hide",
          e.docHidden && "doc-hidden"
        ])
      }, {
        default: u(() => [
          D("div", et, [
            e.mDocsProps.docIcon ? (i(), T("img", {
              key: 0,
              src: e.mDocsProps.docIcon,
              width: e.mDocsProps.docImageDimensions.width,
              height: e.mDocsProps.docImageDimensions.height
            }, null, 8, tt)) : M("", !0),
            D("span", nt, [
              e.$slots.title ? c(e.$slots, "title", { key: 0 }, void 0, !0) : M("", !0),
              we(" " + _(e.$slots.title ? "" : e.mDocsProps.docTitle), 1)
            ])
          ]),
          D("div", st, [
            c(e.$slots, "default", {}, void 0, !0)
          ]),
          ot
        ]),
        _: 3
      }, 8, ["style", "class"])
    ]),
    _: 3
  });
}
const Y = /* @__PURE__ */ b(qe, [["render", at], ["__scopeId", "data-v-47db9d18"]]), Q = p({
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
}), it = p({
  name: "BsTabTitle",
  extends: Q,
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
function rt(e, t, n, s, a, l) {
  return e.defaultTabUsed ? M("", !0) : (i(), T("div", A({ key: 0 }, e.$attrs, { class: "text-primary bs-tab-title dku-medium-title-sb q-px-md" }), _(e.tabName), 17));
}
const R = /* @__PURE__ */ b(it, [["render", rt], ["__scopeId", "data-v-9ace8c82"]]), dt = p({
  name: "BsDrawer",
  extends: Q,
  components: {
    BsTabTitle: R
  }
});
const lt = { class: "bs-drawer-container" };
function ut(e, t, n, s, a, l) {
  const o = r("BsTabTitle");
  return e.qLayoutMounted ? (i(), g(V, {
    key: 0,
    to: ".q-drawer"
  }, [
    O(D("div", lt, [
      I(o),
      c(e.$slots, "default", {}, void 0, !0)
    ], 512), [
      [L, e.showComponent]
    ])
  ])) : M("", !0);
}
const z = /* @__PURE__ */ b(dt, [["render", ut], ["__scopeId", "data-v-ef244777"]]), ct = p({
  name: "BsHeader",
  components: {
    BsTabTitle: R
  },
  extends: Q,
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
function pt(e, t, n, s, a, l) {
  const o = r("BsTabTitle");
  return e.qLayoutMounted ? (i(), g(V, {
    key: 0,
    to: ".bs-header"
  }, [
    O(D("div", {
      onVnodeMounted: t[0] || (t[0] = (m) => e.calculateHeaderTabTitleWidth = !0),
      style: C(e.tabHeaderStyles),
      class: S([
        "bs-header-wrapper",
        e.wrapperTransitions && "bs-header-wrapper--transition",
        e.showComponent && e.drawerOpen && e.headerTabTitleWidthExists && "bs-header-wrapper--hide-tab-name"
      ])
    }, [
      O(I(o, {
        ref: "headerTabTitle",
        "calculate-width": e.calculateHeaderTabTitleWidth,
        onCalculated: e.updateHeaderTabTitleWidth
      }, null, 8, ["calculate-width", "onCalculated"]), [
        [L, e.appendTabTitleToHeader]
      ]),
      c(e.$slots, "default", {}, void 0, !0)
    ], 6), [
      [L, e.showComponent]
    ])
  ])) : M("", !0);
}
const B = /* @__PURE__ */ b(ct, [["render", pt], ["__scopeId", "data-v-f4a44855"]]), mt = p({
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
      return ie(this.tabId);
    },
    bsMenuTabCSSSelector() {
      return `#${this.bsMenuTabId}`;
    }
  }
});
function ht(e, t, n, s, a, l) {
  const o = r("q-icon");
  return e.menuTabsMounted ? (i(), g(V, {
    key: 0,
    to: e.bsMenuTabCSSSelector
  }, [
    e.iconName ? (i(), g(o, A({ key: 0 }, e.$attrs, { name: e.iconName }), null, 16, ["name"])) : M("", !0),
    c(e.$slots, "default")
  ], 8, ["to"])) : M("", !0);
}
const P = /* @__PURE__ */ b(mt, [["render", ht]]), gt = p({
  name: "BsDrawerBtn",
  extends: Q,
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
      ae(
        () => this.hide = t,
        () => this.hidden = t,
        t,
        this.hideTransitionDuration
      );
    }
  }
}), bt = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTYgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDRDMTAuNjI3NCAwIDE2IDUuMzcyNTggMTYgMTJWODhDMTYgOTQuNjI3NCAxMC42Mjc0IDEwMCA0IDEwMEgwVjBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjUiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIxX2RfMV8xNjY4KSI+CjxyZWN0IHg9IjkiIHk9IjIwIiB3aWR0aD0iMSIgaGVpZ2h0PSI2MCIgZmlsbD0iI0Y1RjVGNSIvPgo8L2c+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMV8xNjY4IiB4PSI1IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2RfMV8xNjY4IiB4PSI5IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNjAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeD0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTEgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xXzE2NjgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMV8xNjY4IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=";
const Mt = (e) => (te("data-v-9969ac6c"), e = e(), ne(), e), It = /* @__PURE__ */ Mt(() => /* @__PURE__ */ D("img", { src: bt }, null, -1)), Dt = [
  It
];
function Tt(e, t, n, s, a, l) {
  return O((i(), T("div", {
    onClick: t[0] || (t[0] = (...o) => e.toggleLeftPanel && e.toggleLeftPanel(...o)),
    class: S([e.hide && "hide", e.hidden && "hidden", "toggle-left-button"]),
    style: C({
      "--hide-transition-duration": `.${e.hideTransitionDuration}s`
    })
  }, Dt, 6)), [
    [L, e.showComponent]
  ]);
}
const ue = /* @__PURE__ */ b(gt, [["render", Tt], ["__scopeId", "data-v-9969ac6c"]]), ft = p({
  name: "BsLayoutDrawer",
  components: {
    QDrawer: _e,
    BsDrawerBtn: ue
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
function $t(e, t, n, s, a, l) {
  const o = r("BsDrawerBtn"), m = r("QDrawer");
  return i(), g(m, A(e.drawerProps, {
    "mini-width": e.collapsedWidth,
    width: e.expandedWidth,
    side: "left",
    behavior: "desktop",
    bordered: ""
  }), {
    default: u(() => [
      I(o, {
        "model-value": e.expand,
        "onUpdate:modelValue": e.toggleDrawer,
        show: e.expandable
      }, null, 8, ["model-value", "onUpdate:modelValue", "show"])
    ]),
    _: 1
  }, 16, ["mini-width", "width"]);
}
const ce = /* @__PURE__ */ b(ft, [["render", $t], ["__scopeId", "data-v-7ae9438e"]]), yt = p({
  name: "BsLayoutHeader",
  components: {
    QHeader: Ae
  }
});
function Nt(e, t, n, s, a, l) {
  const o = r("QHeader");
  return i(), g(o, {
    bordered: "",
    class: "bg-white bs-header"
  });
}
const pe = /* @__PURE__ */ b(yt, [["render", Nt], ["__scopeId", "data-v-9ba496fa"]]), wt = p({
  name: "BsMenuTab",
  components: {
    QTab: Ce,
    QTooltip: oe
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
      return e = e || `${this.tabIndex}` || "", ie(e);
    }
  }
});
const jt = { class: "tab-name-tooltip" }, St = ["id"];
function _t(e, t, n, s, a, l) {
  const o = r("QTooltip"), m = r("QTab");
  return i(), g(m, {
    name: e.tabIndex,
    icon: e.icon,
    ripple: !1
  }, {
    default: u(() => [
      I(o, {
        offset: [9, 10],
        anchor: "center right",
        self: "center left",
        "transition-show": "jump-right",
        "transition-hide": "jump-left"
      }, {
        default: u(() => [
          D("span", jt, _(e.name), 1)
        ]),
        _: 1
      }),
      e.tabId ? (i(), T("span", {
        key: 0,
        id: e.getBsMenuTabId(e.tabId)
      }, null, 8, St)) : M("", !0)
    ]),
    _: 1
  }, 8, ["name", "icon"]);
}
const me = /* @__PURE__ */ b(wt, [["render", _t], ["__scopeId", "data-v-61b2252d"]]), At = p({
  name: "BsMenuTabs",
  components: {
    QTabs: Oe
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
const Ct = { class: "tabs-container" };
function Ot(e, t, n, s, a, l) {
  const o = r("q-tabs");
  return i(), T("div", Ct, [
    I(o, {
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[0] || (t[0] = (m) => e.$emit("update:model-value", m)),
      vertical: "",
      "active-color": "primary",
      "indicator-color": "primary",
      "active-bg-color": "white"
    }, {
      default: u(() => [
        c(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["model-value"])
  ]);
}
const he = /* @__PURE__ */ b(At, [["render", Ot], ["__scopeId", "data-v-08cabe0b"]]);
class ge {
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
  getNextSafeSlug(t, n) {
    let s = t, a = 0;
    if (this.seen.hasOwnProperty(s)) {
      a = this.seen[t];
      do
        a++, s = t + "-" + a;
      while (this.seen.hasOwnProperty(s));
    }
    return n || (this.seen[t] = a, this.seen[s] = 0), s;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
  */
  slug(t, n = {}) {
    const s = { dryrun: !!n.dryrun }, a = this.serialize(t);
    return this.getNextSafeSlug(a, s.dryrun);
  }
}
const E = class {
  constructor(e = "default") {
    typeof e != "string" && (console.error("instanceKey param should be of type string! Using default instance."), e = "default"), E.instances.hasOwnProperty(e) || (E.instances[e] = new ge()), this.instance = E.instances[e];
  }
  slug(e, t = {}) {
    return this.instance.slug(e, t);
  }
};
let be = E;
be.instances = {};
const kt = new be("tabs"), vt = p({
  name: "BsTab",
  mixins: [J, G],
  components: {
    BsDrawer: z,
    BsHeader: B,
    BsDocumentation: Y,
    BsContent: W,
    BsTabIcon: P,
    QPageContainer: ke,
    QPage: ve
  },
  data() {
    return {
      index: 0,
      tabId: kt.slug(this.name),
      isActive: !1,
      openDoc: !1,
      qPageMounted: !1
    };
  },
  inject: ["$tabs", "$selectedTab", "$defaultTabUsed", "$defaultDrawer"],
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
      return re(this.tabId);
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
      const { tabId: e, drawer: t, header: n, name: s } = this;
      return {
        tabId: e,
        drawer: t,
        header: n,
        name: s,
        icon: ee(() => this.tabIcon)
      };
    },
    header() {
      return this.usingComponent(B) || this.usingSlotHeader || this.defaultHeader;
    },
    drawer() {
      return this.usingComponent(z) || this.usingSlotDrawer || this.defaultDrawer;
    },
    tabIcon() {
      return this.usingComponent(P) || this.usingSlotTabIcon ? void 0 : this.icon;
    },
    usingSlotHeader() {
      return this.usingSlot(B, "header", "head");
    },
    usingSlotDrawer() {
      return this.usingSlot(z, "leftpanel", "drawer");
    },
    usingSlotDocumentation() {
      return this.usingSlot(Y, "documentation");
    },
    usingSlotContent() {
      return this.usingSlot(W, "content");
    },
    usingSlotTabIcon() {
      return this.usingSlot(P, "tabicon");
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
    onQPageMounted() {
      this.qPageMounted = !0, this.$emit("mounted:q-page");
    },
    usingComponent(e) {
      return !!this.getSlotComponents(e.name || "").length;
    },
    usingSlot(e, ...t) {
      return this.usingComponent(e) ? !1 : t.reduce((s, a) => s && this.slotsKeys.includes(a), !0);
    }
  },
  emits: ["mounted:q-page"],
  mounted() {
    this.registerTab();
  }
});
const zt = ["id"];
function Bt(e, t, n, s, a, l) {
  const o = r("BsHeader"), m = r("BsDrawer"), d = r("BsDocumentation"), h = r("BsTabIcon"), k = r("BsContent"), v = r("QPage"), f = r("QPageContainer");
  return i(), T(se, null, [
    e.usingSlotHeader || !(e.header || e.defaultTabUsed) ? (i(), g(o, { key: 0 }, {
      default: u(() => [
        e.$slots.header ? M("", !0) : c(e.$slots, "head", { key: 0 }, void 0, !0),
        c(e.$slots, "header", {}, void 0, !0)
      ]),
      _: 3
    })) : M("", !0),
    e.usingSlotDrawer ? (i(), g(m, { key: 1 }, {
      default: u(() => [
        e.$slots.drawer ? M("", !0) : c(e.$slots, "leftpanel", { key: 0 }, void 0, !0),
        c(e.$slots, "drawer", {}, void 0, !0)
      ]),
      _: 3
    })) : M("", !0),
    e.usingSlotDocumentation ? (i(), g(d, {
      key: 2,
      modelValue: e.openDoc,
      "onUpdate:modelValue": t[0] || (t[0] = (U) => e.openDoc = U)
    }, {
      default: u(() => [
        c(e.$slots, "documentation", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue"])) : M("", !0),
    !e.defaultTabUsed && e.usingSlotTabIcon ? (i(), g(h, { key: 3 }, {
      default: u(() => [
        c(e.$slots, "tabicon", {}, void 0, !0)
      ]),
      _: 3
    })) : M("", !0),
    O(I(f, null, {
      default: u(() => [
        I(v, { onVnodeMounted: e.onQPageMounted }, {
          default: u(() => [
            D("div", {
              class: "content",
              id: e.tabContentId
            }, [
              e.usingSlotContent ? (i(), g(k, { key: 0 }, {
                default: u(() => [
                  c(e.$slots, "content", {}, void 0, !0)
                ]),
                _: 3
              })) : M("", !0)
            ], 8, zt)
          ]),
          _: 3
        }, 8, ["onVnodeMounted"])
      ]),
      _: 3
    }, 512), [
      [L, e.isTabSelected]
    ]),
    c(e.$slots, "default", {}, void 0, !0)
  ], 64);
}
const Me = /* @__PURE__ */ b(vt, [["render", Bt], ["__scopeId", "data-v-1c1c69bf"]]), Lt = new ge(), Qt = p({
  name: "BsLayoutDefault",
  mixins: [G, J],
  components: {
    BsTab: Me,
    BsMenuTab: me,
    BsMenuTabs: he,
    BsLayoutDrawer: ce,
    BsLayoutHeader: pe,
    QLayout: ze
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
      defaultLayoutTabName: "Layout Default"
    };
  },
  provide() {
    const e = this.provideStatic(["tabs"]);
    let t = this.provideComputed([
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
      t = N(N({}, t), s);
    }
    const n = N(N({}, t), e);
    return console.log("DEBUG PROVIDED"), console.log(n), n;
  },
  methods: {
    getTabIndex(e) {
      return this.tabs.findIndex(({ tabId: t }) => e === t);
    }
  },
  computed: {
    tabContentId() {
      return `tab-content-id-${Lt.slug(this.defaultLayoutTabName)}`;
    },
    activeTabSlots() {
      return Object.keys(this.$slots).filter(
        (e) => this.tabSlotNames.includes(e)
      );
    },
    selectedTab() {
      return this.tabs[this.tabIndex];
    },
    selectedTabDrawer() {
      var e;
      return (e = this.selectedTab) == null ? void 0 : e.drawer;
    },
    isTabsMultiple() {
      return this.tabs.length > 1;
    },
    defaultTabUsed() {
      return this.tabs.length < 2;
    },
    layoutDocsProps() {
      const { docTitle: e, docIcon: t, docImageDimensions: n } = this;
      return { docTitle: e, docIcon: t, docImageDimensions: n };
    },
    qLayoutMounted() {
      return console.log("DEBUG FROM LAYOUT MOUNTED"), console.log(this.drawerMounted && this.headerMounted), this.drawerMounted && this.headerMounted;
    },
    defaultDrawer() {
      return !!this.getSlotComponents(z.name).length;
    },
    defaultHeader() {
      return !!this.getSlotComponents(B.name).length;
    },
    layoutStyles() {
      return {
        "--bs-drawer-width": `${this.leftPanelWidth}px`
      };
    }
  },
  mounted() {
    this.mounted = !0;
  }
});
function Pt(e, t, n, s, a, l) {
  const o = r("BsLayoutDrawer"), m = r("BsLayoutHeader"), d = r("BsMenuTab"), h = r("BsMenuTabs"), k = r("BsTab"), v = r("QLayout");
  return i(), g(v, {
    view: "lHh LpR lFf",
    class: "bg-white",
    style: C(e.layoutStyles)
  }, {
    default: u(() => [
      I(o, {
        modelValue: e.drawerOpen,
        "onUpdate:modelValue": t[0] || (t[0] = (f) => e.drawerOpen = f),
        onVnodeMounted: t[1] || (t[1] = (f) => e.drawerMounted = !0),
        expandable: e.selectedTabDrawer,
        "collapsed-width": e.tabMenuWidth,
        "panel-width": e.leftPanelWidth,
        mini: e.isTabsMultiple
      }, null, 8, ["modelValue", "expandable", "collapsed-width", "panel-width", "mini"]),
      I(m, {
        onVnodeMounted: t[2] || (t[2] = (f) => e.headerMounted = !0)
      }, null, 512),
      e.mounted && e.isTabsMultiple ? (i(), g(h, {
        key: 0,
        modelValue: e.tabIndex,
        "onUpdate:modelValue": t[3] || (t[3] = (f) => e.tabIndex = f),
        onVnodeMounted: t[4] || (t[4] = (f) => e.menuTabsMounted = !0)
      }, {
        default: u(() => [
          (i(!0), T(se, null, w(e.tabs, ({ name: f, icon: U, tabId: Ie }, De) => (i(), g(d, {
            name: f,
            "tab-id": Ie,
            icon: U,
            "tab-index": De
          }, null, 8, ["name", "tab-id", "icon", "tab-index"]))), 256))
        ]),
        _: 1
      }, 8, ["modelValue"])) : M("", !0),
      e.mounted && e.defaultTabUsed ? (i(), g(k, {
        key: 1,
        "onMounted:qPage": t[5] || (t[5] = (f) => e.qPageMounted = !0),
        name: e.defaultLayoutTabName
      }, j({
        default: u(() => [
          c(e.$slots, "default")
        ]),
        _: 2
      }, [
        w(e.activeTabSlots, (f) => ({
          name: f,
          fn: u(() => [
            c(e.$slots, f)
          ])
        }))
      ]), 1032, ["name"])) : c(e.$slots, "default", { key: 2 })
    ]),
    _: 3
  }, 8, ["style"]);
}
const Et = /* @__PURE__ */ b(Qt, [["render", Pt]]), Vt = {
  xs: 18,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 34
}, Ut = function(e, t = Vt) {
  return e !== void 0 ? e in t ? `${t[e]}px` : e : null;
}, xt = {
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
}, Wt = ["update:modelValue"];
function K(e) {
  e.cancelable !== !1 && e.preventDefault(), e.stopPropagation();
}
const Yt = p({
  name: "BsToggle",
  data() {
    return {};
  },
  props: N({}, xt),
  emits: Wt,
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
      return Ut(this.size);
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
      e !== void 0 && K(e), this.disable !== !0 && (console.log("next value"), console.log(this.isTrue), console.log(this.getNextValue()), this.$emit("update:modelValue", this.getNextValue(), e));
    },
    onKeydown(e) {
      (e.keyCode === 13 || e.keyCode === 32) && K(e);
    },
    onKeyup(e) {
      (e.keyCode === 13 || e.keyCode === 32) && this.onClick(e);
    }
  }
}), Zt = ["checked", "value"], Ht = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function Gt(e, t, n, s, a, l) {
  return i(), T("div", {
    class: S([{
      "bs-toggle--is-disabled": e.disable
    }, "bs-toggle"]),
    style: C({ "font-size": e.fontSize })
  }, [
    e.labelLeft ? (i(), T("label", {
      key: 0,
      class: S(["bs-toggle__label", [e.labelClass]])
    }, _(e.labelLeft), 3)) : M("", !0),
    D("input", {
      type: "checkbox",
      checked: e.isTrue === !0,
      value: e.modelIsArray === !0 ? e.val : e.trueValue,
      class: "bs-toggle__input"
    }, null, 8, Zt),
    D("div", {
      "aria-checked": e.isTrue === !0,
      "aria-disabled": e.disable,
      "aria-readonly": e.disable,
      class: S([
        "bs-toggle__content",
        e.isTrue === !0 ? "bs-toggle__content__active" : ""
      ]),
      style: C({ "background-color": e.isTrue === !0 ? e.color : "" }),
      role: "checkbox",
      onClick: t[0] || (t[0] = (...o) => e.onClick && e.onClick(...o)),
      onKeydown: t[1] || (t[1] = (...o) => e.onKeydown && e.onKeydown(...o)),
      onKeyup: t[2] || (t[2] = (...o) => e.onKeyup && e.onKeyup(...o)),
      tabindex: e.tabIndex
    }, null, 46, Ht),
    e.labelRight ? (i(), T("label", {
      key: 1,
      class: S(["bs-toggle__label", [e.labelClass]])
    }, _(e.labelRight), 3)) : M("", !0)
  ], 6);
}
const Jt = /* @__PURE__ */ b(Yt, [["render", Gt]]), Xt = p({
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
    QSelect: Be
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
}), Rt = {
  key: 0,
  class: "bs-select__label dss-caption-400 q-mb-xs"
};
function Ft(e, t, n, s, a, l) {
  const o = r("QSelect");
  return i(), T("div", null, [
    e.bsLabel ? (i(), T("label", Rt, _(e.bsLabel), 1)) : M("", !0),
    I(o, A({ ref: "bsSelect" }, e.$attrs, {
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
    }), j({ _: 2 }, [
      w(e.$slots, (m, d) => ({
        name: d,
        fn: u((h) => [
          c(e.$slots, d, $(y(h || {})))
        ])
      }))
    ]), 1040, ["onPopupShow", "onPopupHide", "popup-content-style", "label"])
  ]);
}
const qt = /* @__PURE__ */ b(Xt, [["render", Ft]]), Kt = p({
  name: "BsButton",
  components: {
    QBtn: Z
  }
});
function en(e, t, n, s, a, l) {
  const o = r("QBtn");
  return i(), g(o, A(e.$attrs, { unelevated: "" }), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const tn = /* @__PURE__ */ b(Kt, [["render", en]]), nn = p({
  name: "BsTooltip",
  components: {
    QTooltip: oe
  }
});
function sn(e, t, n, s, a, l) {
  const o = r("QTooltip");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const on = /* @__PURE__ */ b(nn, [["render", sn]]), an = p({
  name: "BsSlider",
  components: {
    QSlider: Le
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
}), rn = { class: "flex row bs-slider no-wrap" }, dn = ["value", "min", "max", "step"];
function ln(e, t, n, s, a, l) {
  const o = r("QSlider");
  return i(), T("div", rn, [
    I(o, A(e.$attrs, {
      style: { width: e.sliderWidth + "px" },
      "thumb-size": "15px",
      "track-size": "3.5px"
    }), j({ _: 2 }, [
      w(e.$slots, (m, d) => ({
        name: d,
        fn: u((h) => [
          c(e.$slots, d, $(y(h || {})))
        ])
      }))
    ]), 1040, ["style"]),
    D("input", {
      class: "bs-slider__input dku-text",
      type: "number",
      value: e.inputData.value,
      onInput: t[0] || (t[0] = (...m) => e.updateSliderFromInput && e.updateSliderFromInput(...m)),
      min: e.inputData.min,
      max: e.inputData.max,
      step: e.inputData.step
    }, null, 40, dn)
  ]);
}
const un = /* @__PURE__ */ b(an, [["render", ln]]), cn = p({
  name: "BsRange",
  components: {
    QRange: Qe
  }
});
function pn(e, t, n, s, a, l) {
  const o = r("QRange");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const mn = /* @__PURE__ */ b(cn, [["render", pn]]), hn = p({
  name: "BsSpinner",
  components: {
    QSpinner: Pe
  }
});
function gn(e, t, n, s, a, l) {
  const o = r("QSpinner");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const bn = /* @__PURE__ */ b(hn, [["render", gn]]), Mn = p({
  name: "BsTable",
  components: {
    QTable: Ee
  }
});
function In(e, t, n, s, a, l) {
  const o = r("QTable");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const Dn = /* @__PURE__ */ b(Mn, [["render", In]]), Tn = p({
  name: "BsImg",
  components: {
    QImg: Ve
  }
});
function fn(e, t, n, s, a, l) {
  const o = r("QImg");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const $n = /* @__PURE__ */ b(Tn, [["render", fn]]), yn = p({
  name: "BsIcon",
  components: {
    QIcon: H
  }
});
function Nn(e, t, n, s, a, l) {
  const o = r("QIcon");
  return i(), g(o, $(y(e.$attrs)), j({ _: 2 }, [
    w(e.$slots, (m, d) => ({
      name: d,
      fn: u((h) => [
        c(e.$slots, d, $(y(h || {})))
      ])
    }))
  ]), 1040);
}
const wn = /* @__PURE__ */ b(yn, [["render", Nn]]), jn = p({
  name: "BsCheckbox",
  components: {
    QCheckbox: Ue
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
}), Sn = {
  key: 0,
  class: "dku-tiny-text bs-checkbox__hint"
};
function _n(e, t, n, s, a, l) {
  const o = r("QCheckbox");
  return i(), T("div", {
    class: S(["bs-checkbox", { hint: e.isHintOnly, disabled: e.isDisabled }])
  }, [
    I(o, A(e.$attrs, {
      size: "29.57px",
      tabindex: 0,
      label: e.labelFromHint
    }), j({ _: 2 }, [
      w(e.$slots, (m, d) => ({
        name: d,
        fn: u((h) => [
          c(e.$slots, d, $(y(h || {})))
        ])
      }))
    ]), 1040, ["label"]),
    e.hint && e.$attrs.label ? (i(), T("div", Sn, _(e.hint), 1)) : M("", !0)
  ], 2);
}
const An = /* @__PURE__ */ b(jn, [["render", _n]]), Cn = p({
  name: "BsDateRange",
  components: {
    QInput: xe,
    QDate: We,
    QPopupProxy: Ye,
    QIcon: H,
    QBtn: Z
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
}), On = {
  key: 0,
  class: "bs-date-range__label dss-caption-400 q-mb-xs"
}, kn = { class: "row items-center justify-end" };
function vn(e, t, n, s, a, l) {
  const o = r("QBtn"), m = r("QDate"), d = r("QPopupProxy"), h = r("QIcon"), k = r("QInput"), v = je("close-popup");
  return i(), T("div", null, [
    e.bsLabel ? (i(), T("label", On, _(e.bsLabel), 1)) : M("", !0),
    I(k, {
      dense: "",
      outlined: "",
      readonly: "",
      modelValue: e.inputValue,
      "onUpdate:modelValue": t[0] || (t[0] = (f) => e.inputValue = f)
    }, {
      append: u(() => [
        I(h, {
          name: "event",
          class: "cursor-pointer"
        }, {
          default: u(() => [
            I(d, {
              cover: "",
              "transition-show": "scale",
              "transition-hide": "scale"
            }, {
              default: u(() => [
                I(m, A({ range: "" }, e.$attrs), {
                  default: u(() => [
                    D("div", kn, [
                      O(I(o, {
                        label: "Close",
                        color: "primary",
                        flat: ""
                      }, null, 512), [
                        [v]
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
const zn = /* @__PURE__ */ b(Cn, [["render", vn]]);
const Bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BsButton: tn,
  BsCheckbox: An,
  BsContent: W,
  BsDateRange: zn,
  BsDocumentation: Y,
  BsDrawer: z,
  BsDrawerBtn: ue,
  BsHeader: B,
  BsIcon: wn,
  BsImg: $n,
  BsLayoutDefault: Et,
  BsLayoutDrawer: ce,
  BsLayoutHeader: pe,
  BsMenuTab: me,
  BsMenuTabs: he,
  BsRange: mn,
  BsSelect: qt,
  BsSlider: un,
  BsSpinner: bn,
  BsTab: Me,
  BsTabChild: Q,
  BsTabIcon: P,
  BsTabPageChildWrapper: X,
  BsTabTitle: R,
  BsTable: Dn,
  BsToggle: Jt,
  BsTooltip: on,
  CheckSlotComponentsMixin: J,
  ProvideMixin: G
}, Symbol.toStringTag, { value: "Module" })), En = {
  version: "1.3.7",
  install(e) {
    He(e, { components: Bn });
  }
}, Vn = "1.3.7";
export {
  tn as BsButton,
  An as BsCheckbox,
  W as BsContent,
  zn as BsDateRange,
  Y as BsDocumentation,
  z as BsDrawer,
  ue as BsDrawerBtn,
  B as BsHeader,
  wn as BsIcon,
  $n as BsImg,
  Et as BsLayoutDefault,
  ce as BsLayoutDrawer,
  pe as BsLayoutHeader,
  me as BsMenuTab,
  he as BsMenuTabs,
  mn as BsRange,
  qt as BsSelect,
  un as BsSlider,
  bn as BsSpinner,
  Me as BsTab,
  Q as BsTabChild,
  P as BsTabIcon,
  X as BsTabPageChildWrapper,
  R as BsTabTitle,
  Dn as BsTable,
  Jt as BsToggle,
  on as BsTooltip,
  J as CheckSlotComponentsMixin,
  G as ProvideMixin,
  En as QuasarBs,
  Vn as version
};
