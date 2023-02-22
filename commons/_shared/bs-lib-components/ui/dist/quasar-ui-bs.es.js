var Te = Object.defineProperty, fe = Object.defineProperties;
var ye = Object.getOwnPropertyDescriptors;
var F = Object.getOwnPropertySymbols;
var _e = Object.prototype.hasOwnProperty, Ne = Object.prototype.propertyIsEnumerable;
var q = (e, t, n) => t in e ? Te(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, N = (e, t) => {
  for (var n in t || (t = {}))
    _e.call(t, n) && q(e, n, t[n]);
  if (F)
    for (var n of F(t))
      Ne.call(t, n) && q(e, n, t[n]);
  return e;
}, U = (e, t) => fe(e, ye(t));
import { defineComponent as T, computed as ee, openBlock as r, createBlock as h, Teleport as E, renderSlot as c, createCommentVNode as b, resolveComponent as d, withCtx as u, createVNode as M, normalizeStyle as C, normalizeClass as j, createElementVNode as I, createElementBlock as D, createTextVNode as $e, toDisplayString as S, pushScopeId as te, popScopeId as ne, mergeProps as A, withDirectives as O, vShow as L, Fragment as se, renderList as $, createSlots as w, normalizeProps as y, guardReactiveProps as _, resolveDirective as we } from "vue";
import { QCard as je, QBtn as Z, QIcon as H, QDrawer as Se, QHeader as Ae, QTab as Ce, QTooltip as oe, QTabs as Oe, QPageContainer as ke, QPage as ve, QLayout as ze, QSelect as Be, QSlider as Le, QRange as Qe, QSpinner as Pe, QTable as xe, QImg as Ee, QCheckbox as Ve, QInput as Ue, QDate as We, QPopupProxy as Ye } from "quasar";
function Ze(e) {
  return e !== null && typeof e == "object" && Array.isArray(e) !== !0;
}
function He(e, t) {
  t.components !== void 0 && Object.values(t.components).forEach((n) => {
    Ze(n) === !0 && n.name !== void 0 && e.component(n.name, n);
  });
}
const G = T({
  name: "ProvideMixin",
  methods: {
    providePrefixed(e, t) {
      const { prefix: n, getter: o } = N({
        prefix: "$",
        getter: (i) => this[i]
      }, t);
      return e.reduce((i, s) => {
        const a = n + s;
        return i[a] = o(s), i;
      }, {});
    },
    createComputedFromKey(e) {
      return ee(() => this[e]);
    },
    provideComputed(e, t) {
      const n = U(N({}, t), {
        getter: (o) => this.createComputedFromKey(o)
      });
      return this.providePrefixed(e, n);
    },
    provideStatic(e, t) {
      const n = U(N({}, t), {
        getter: (o) => this[o]
      });
      return this.providePrefixed(e, n);
    }
  }
}), J = T({
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
      return ((i) => this.$slots.hasOwnProperty(i) ? this.$slots[i]() : [])(t).filter((i) => {
        const s = i.type;
        return (s == null ? void 0 : s.name) && s.name === e;
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
function ae(e, t, n, o, i = 50) {
  Ge(
    [e, i * +!n],
    [t, o * +n]
  );
}
const ie = (e) => `bs-menu-tab-${e}`, re = (e) => `tab-content-id-${e}`, Je = T({
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
}), g = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
};
function Xe(e, t, n, o, i, s) {
  return e.qPageMounted ? (r(), h(E, {
    key: 0,
    to: e.contentCSSSelector
  }, [
    c(e.$slots, "default")
  ], 8, ["to"])) : b("", !0);
}
const X = /* @__PURE__ */ g(Je, [["render", Xe]]), Re = T({
  name: "BsContent",
  components: {
    BsTabPageChildWrapper: X
  }
});
function Fe(e, t, n, o, i, s) {
  const a = d("BsTabPageChildWrapper");
  return r(), h(a, null, {
    default: u(() => [
      c(e.$slots, "default")
    ]),
    _: 3
  });
}
const W = /* @__PURE__ */ g(Re, [["render", Fe]]), qe = T({
  name: "BsDocumentation",
  components: {
    QCard: je,
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
      return Object.entries(e).reduce((n, [o, i]) => (i !== void 0 && (n[o] = i), n), {});
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
const le = (e) => (te("data-v-47db9d18"), e = e(), ne(), e), Ke = /* @__PURE__ */ le(() => /* @__PURE__ */ I("div", { class: "row items-center q-gutter-sm no-wrap" }, [
  /* @__PURE__ */ I("img", {
    src: de,
    width: "15",
    height: "16"
  }),
  /* @__PURE__ */ I("span", { class: "btn-solution-text" }, "Dataiku Solutions")
], -1)), et = { class: "flex row items-center q-gutter-sm q-mb-lg" }, tt = ["src", "width", "height"], nt = { class: "dku-large-title-sb" }, st = { class: "doc-body" }, ot = /* @__PURE__ */ le(() => /* @__PURE__ */ I("div", { class: "doc-footer flex row items-center" }, [
  /* @__PURE__ */ I("span", { class: "doc-footer__icon" }, [
    /* @__PURE__ */ I("img", {
      src: de,
      width: "14",
      height: "12.5"
    })
  ]),
  /* @__PURE__ */ I("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
], -1));
function at(e, t, n, o, i, s) {
  const a = d("QBtn"), p = d("QCard"), l = d("BsTabPageChildWrapper");
  return r(), h(l, null, {
    default: u(() => [
      M(a, {
        unelevated: "",
        outline: "",
        "no-caps": "",
        "no-wrap": "",
        class: "btn-solution absolute",
        square: "",
        onClick: t[0] || (t[0] = (m) => e.toggleDoc())
      }, {
        default: u(() => [
          Ke
        ]),
        _: 1
      }),
      M(p, {
        style: C(e.docContentStyleVariables),
        class: j([
          "doc-content",
          "flex",
          "row",
          e.docHide && "doc-hide",
          e.docHidden && "doc-hidden"
        ])
      }, {
        default: u(() => [
          I("div", et, [
            e.mDocsProps.docIcon ? (r(), D("img", {
              key: 0,
              src: e.mDocsProps.docIcon,
              width: e.mDocsProps.docImageDimensions.width,
              height: e.mDocsProps.docImageDimensions.height
            }, null, 8, tt)) : b("", !0),
            I("span", nt, [
              e.$slots.title ? c(e.$slots, "title", { key: 0 }, void 0, !0) : b("", !0),
              $e(" " + S(e.$slots.title ? "" : e.mDocsProps.docTitle), 1)
            ])
          ]),
          I("div", st, [
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
const Y = /* @__PURE__ */ g(qe, [["render", at], ["__scopeId", "data-v-47db9d18"]]), Q = T({
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
}), it = T({
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
function rt(e, t, n, o, i, s) {
  return e.defaultTabUsed ? b("", !0) : (r(), D("div", A({ key: 0 }, e.$attrs, { class: "text-primary bs-tab-title dku-medium-title-sb q-px-md" }), S(e.tabName), 17));
}
const R = /* @__PURE__ */ g(it, [["render", rt], ["__scopeId", "data-v-9ace8c82"]]), dt = T({
  name: "BsDrawer",
  extends: Q,
  components: {
    BsTabTitle: R
  }
});
const lt = { class: "bs-drawer-container" };
function ut(e, t, n, o, i, s) {
  const a = d("BsTabTitle");
  return e.qLayoutMounted ? (r(), h(E, {
    key: 0,
    to: ".q-drawer"
  }, [
    O(I("div", lt, [
      M(a),
      c(e.$slots, "default", {}, void 0, !0)
    ], 512), [
      [L, e.showComponent]
    ])
  ])) : b("", !0);
}
const z = /* @__PURE__ */ g(dt, [["render", ut], ["__scopeId", "data-v-ef244777"]]), ct = T({
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
function pt(e, t, n, o, i, s) {
  const a = d("BsTabTitle");
  return e.qLayoutMounted ? (r(), h(E, {
    key: 0,
    to: ".bs-header"
  }, [
    O(I("div", {
      onVnodeMounted: t[0] || (t[0] = (p) => e.calculateHeaderTabTitleWidth = !0),
      style: C(e.tabHeaderStyles),
      class: j([
        "bs-header-wrapper",
        e.wrapperTransitions && "bs-header-wrapper--transition",
        e.showComponent && e.drawerOpen && e.headerTabTitleWidthExists && "bs-header-wrapper--hide-tab-name"
      ])
    }, [
      O(M(a, {
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
  ])) : b("", !0);
}
const B = /* @__PURE__ */ g(ct, [["render", pt], ["__scopeId", "data-v-f4a44855"]]), mt = T({
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
function ht(e, t, n, o, i, s) {
  const a = d("q-icon");
  return e.menuTabsMounted ? (r(), h(E, {
    key: 0,
    to: e.bsMenuTabCSSSelector
  }, [
    e.iconName ? (r(), h(a, A({ key: 0 }, e.$attrs, { name: e.iconName }), null, 16, ["name"])) : b("", !0),
    c(e.$slots, "default")
  ], 8, ["to"])) : b("", !0);
}
const P = /* @__PURE__ */ g(mt, [["render", ht]]), gt = T({
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
const Mt = (e) => (te("data-v-9969ac6c"), e = e(), ne(), e), It = /* @__PURE__ */ Mt(() => /* @__PURE__ */ I("img", { src: bt }, null, -1)), Dt = [
  It
];
function Tt(e, t, n, o, i, s) {
  return O((r(), D("div", {
    onClick: t[0] || (t[0] = (...a) => e.toggleLeftPanel && e.toggleLeftPanel(...a)),
    class: j([e.hide && "hide", e.hidden && "hidden", "toggle-left-button"]),
    style: C({
      "--hide-transition-duration": `.${e.hideTransitionDuration}s`
    })
  }, Dt, 6)), [
    [L, e.showComponent]
  ]);
}
const ue = /* @__PURE__ */ g(gt, [["render", Tt], ["__scopeId", "data-v-9969ac6c"]]), ft = T({
  name: "BsLayoutDrawer",
  components: {
    QDrawer: Se,
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
function yt(e, t, n, o, i, s) {
  const a = d("BsDrawerBtn"), p = d("QDrawer");
  return r(), h(p, A(e.drawerProps, {
    "mini-width": e.collapsedWidth,
    width: e.expandedWidth,
    side: "left",
    behavior: "desktop",
    bordered: ""
  }), {
    default: u(() => [
      M(a, {
        "model-value": e.expand,
        "onUpdate:modelValue": e.toggleDrawer,
        show: e.expandable
      }, null, 8, ["model-value", "onUpdate:modelValue", "show"])
    ]),
    _: 1
  }, 16, ["mini-width", "width"]);
}
const ce = /* @__PURE__ */ g(ft, [["render", yt], ["__scopeId", "data-v-7ae9438e"]]), _t = T({
  name: "BsLayoutHeader",
  components: {
    QHeader: Ae
  }
});
function Nt(e, t, n, o, i, s) {
  const a = d("QHeader");
  return r(), h(a, {
    bordered: "",
    class: "bg-white bs-header"
  });
}
const pe = /* @__PURE__ */ g(_t, [["render", Nt], ["__scopeId", "data-v-9ba496fa"]]), $t = T({
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
const wt = { class: "tab-name-tooltip" }, jt = ["id"];
function St(e, t, n, o, i, s) {
  const a = d("QTooltip"), p = d("QTab");
  return r(), h(p, {
    name: e.tabIndex,
    icon: e.icon,
    ripple: !1
  }, {
    default: u(() => [
      M(a, {
        offset: [9, 10],
        anchor: "center right",
        self: "center left",
        "transition-show": "jump-right",
        "transition-hide": "jump-left"
      }, {
        default: u(() => [
          I("span", wt, S(e.name), 1)
        ]),
        _: 1
      }),
      e.tabId ? (r(), D("span", {
        key: 0,
        id: e.getBsMenuTabId(e.tabId)
      }, null, 8, jt)) : b("", !0)
    ]),
    _: 1
  }, 8, ["name", "icon"]);
}
const me = /* @__PURE__ */ g($t, [["render", St], ["__scopeId", "data-v-61b2252d"]]), At = T({
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
function Ot(e, t, n, o, i, s) {
  const a = d("q-tabs");
  return r(), D("div", Ct, [
    M(a, {
      "model-value": e.modelValue,
      "onUpdate:modelValue": t[0] || (t[0] = (p) => e.$emit("update:model-value", p)),
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
const he = /* @__PURE__ */ g(At, [["render", Ot], ["__scopeId", "data-v-08cabe0b"]]);
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
    let o = t, i = 0;
    if (this.seen.hasOwnProperty(o)) {
      i = this.seen[t];
      do
        i++, o = t + "-" + i;
      while (this.seen.hasOwnProperty(o));
    }
    return n || (this.seen[t] = i, this.seen[o] = 0), o;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
  */
  slug(t, n = {}) {
    const o = { dryrun: !!n.dryrun }, i = this.serialize(t);
    return this.getNextSafeSlug(i, o.dryrun);
  }
}
const x = class {
  constructor(e = "default") {
    typeof e != "string" && (console.error("instanceKey param should be of type string! Using default instance."), e = "default"), x.instances.hasOwnProperty(e) || (x.instances[e] = new ge()), this.instance = x.instances[e];
  }
  slug(e, t = {}) {
    return this.instance.slug(e, t);
  }
};
let be = x;
be.instances = {};
const kt = new be("tabs"), vt = T({
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
      const { tabId: e, drawer: t, header: n, name: o } = this;
      return {
        tabId: e,
        drawer: t,
        header: n,
        name: o,
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
      return this.usingComponent(e) ? !1 : t.reduce((o, i) => o && this.slotsKeys.includes(i), !0);
    }
  },
  emits: ["mounted:q-page"],
  mounted() {
    this.registerTab();
  }
});
const zt = ["id"];
function Bt(e, t, n, o, i, s) {
  const a = d("BsHeader"), p = d("BsDrawer"), l = d("BsDocumentation"), m = d("BsTabIcon"), k = d("BsContent"), v = d("QPage"), f = d("QPageContainer");
  return r(), D(se, null, [
    e.usingSlotHeader || !(e.header || e.defaultTabUsed) ? (r(), h(a, { key: 0 }, {
      default: u(() => [
        e.$slots.header ? b("", !0) : c(e.$slots, "head", { key: 0 }, void 0, !0),
        c(e.$slots, "header", {}, void 0, !0)
      ]),
      _: 3
    })) : b("", !0),
    e.usingSlotDrawer ? (r(), h(p, { key: 1 }, {
      default: u(() => [
        e.$slots.drawer ? b("", !0) : c(e.$slots, "leftpanel", { key: 0 }, void 0, !0),
        c(e.$slots, "drawer", {}, void 0, !0)
      ]),
      _: 3
    })) : b("", !0),
    e.usingSlotDocumentation ? (r(), h(l, {
      key: 2,
      modelValue: e.openDoc,
      "onUpdate:modelValue": t[0] || (t[0] = (V) => e.openDoc = V)
    }, {
      default: u(() => [
        c(e.$slots, "documentation", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue"])) : b("", !0),
    !e.defaultTabUsed && e.usingSlotTabIcon ? (r(), h(m, { key: 3 }, {
      default: u(() => [
        c(e.$slots, "tabicon", {}, void 0, !0)
      ]),
      _: 3
    })) : b("", !0),
    O(M(f, null, {
      default: u(() => [
        M(v, { onVnodeMounted: e.onQPageMounted }, {
          default: u(() => [
            I("div", {
              class: "content",
              id: e.tabContentId
            }, [
              e.usingSlotContent ? (r(), h(k, { key: 0 }, {
                default: u(() => [
                  c(e.$slots, "content", {}, void 0, !0)
                ]),
                _: 3
              })) : b("", !0)
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
const Me = /* @__PURE__ */ g(vt, [["render", Bt], ["__scopeId", "data-v-1c1c69bf"]]), Lt = new ge(), Qt = T({
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
      const o = this.provideComputed([
        "tabContentId",
        "qPageMounted",
        "defaultDrawer",
        "defaultHeader"
      ]);
      t = N(N({}, t), o);
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
function Pt(e, t, n, o, i, s) {
  const a = d("BsLayoutDrawer"), p = d("BsLayoutHeader"), l = d("BsMenuTab"), m = d("BsMenuTabs"), k = d("BsTab"), v = d("QLayout");
  return r(), h(v, {
    view: "lHh LpR lFf",
    class: "bg-white",
    style: C(e.layoutStyles)
  }, {
    default: u(() => [
      M(a, {
        modelValue: e.drawerOpen,
        "onUpdate:modelValue": t[0] || (t[0] = (f) => e.drawerOpen = f),
        onVnodeMounted: t[1] || (t[1] = (f) => e.drawerMounted = !0),
        expandable: e.selectedTabDrawer,
        "collapsed-width": e.tabMenuWidth,
        "panel-width": e.leftPanelWidth,
        mini: e.isTabsMultiple
      }, null, 8, ["modelValue", "expandable", "collapsed-width", "panel-width", "mini"]),
      M(p, {
        onVnodeMounted: t[2] || (t[2] = (f) => e.headerMounted = !0)
      }, null, 512),
      e.mounted && e.isTabsMultiple ? (r(), h(m, {
        key: 0,
        modelValue: e.tabIndex,
        "onUpdate:modelValue": t[3] || (t[3] = (f) => e.tabIndex = f),
        onVnodeMounted: t[4] || (t[4] = (f) => e.menuTabsMounted = !0)
      }, {
        default: u(() => [
          (r(!0), D(se, null, $(e.tabs, ({ name: f, icon: V, tabId: Ie }, De) => (r(), h(l, {
            name: f,
            "tab-id": Ie,
            icon: V,
            "tab-index": De
          }, null, 8, ["name", "tab-id", "icon", "tab-index"]))), 256))
        ]),
        _: 1
      }, 8, ["modelValue"])) : b("", !0),
      e.mounted && e.defaultTabUsed ? (r(), h(k, {
        key: 1,
        "onMounted:qPage": t[5] || (t[5] = (f) => e.qPageMounted = !0),
        name: e.defaultLayoutTabName
      }, w({
        default: u(() => [
          c(e.$slots, "default")
        ]),
        _: 2
      }, [
        $(e.activeTabSlots, (f) => ({
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
const xt = /* @__PURE__ */ g(Qt, [["render", Pt]]), Et = {
  xs: 18,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 34
}, Vt = function(e, t = Et) {
  return e !== void 0 ? e in t ? `${t[e]}px` : e : null;
}, Ut = {
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
const Yt = {
  name: "BsToggle",
  data() {
    return {};
  },
  props: N({}, Ut),
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
      return Vt(this.size);
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
}, Zt = ["checked", "value"], Ht = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function Gt(e, t, n, o, i, s) {
  return r(), D("div", {
    class: j([{
      "bs-toggle--is-disabled": e.disable
    }, "bs-toggle"]),
    style: C({ "font-size": s.fontSize })
  }, [
    e.labelLeft ? (r(), D("label", {
      key: 0,
      class: j(["bs-toggle__label", [e.labelClass]])
    }, S(e.labelLeft), 3)) : b("", !0),
    I("input", {
      type: "checkbox",
      checked: s.isTrue === !0,
      value: s.modelIsArray === !0 ? e.val : e.trueValue,
      class: "bs-toggle__input"
    }, null, 8, Zt),
    I("div", {
      "aria-checked": s.isTrue === !0,
      "aria-disabled": e.disable,
      "aria-readonly": e.disable,
      class: j(["bs-toggle__content", s.isTrue === !0 ? "bs-toggle__content__active" : ""]),
      style: C({ "background-color": s.isTrue === !0 ? e.color : "" }),
      role: "checkbox",
      onClick: t[0] || (t[0] = (...a) => s.onClick && s.onClick(...a)),
      onKeydown: t[1] || (t[1] = (...a) => s.onKeydown && s.onKeydown(...a)),
      onKeyup: t[2] || (t[2] = (...a) => s.onKeyup && s.onKeyup(...a)),
      tabindex: s.tabIndex
    }, null, 46, Ht),
    e.labelRight ? (r(), D("label", {
      key: 1,
      class: j(["bs-toggle__label", [e.labelClass]])
    }, S(e.labelRight), 3)) : b("", !0)
  ], 6);
}
const Jt = /* @__PURE__ */ g(Yt, [["render", Gt]]), Xt = {
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
}, Rt = {
  key: 0,
  class: "bs-select__label dss-caption-400 q-mb-xs"
};
function Ft(e, t, n, o, i, s) {
  const a = d("QSelect");
  return r(), D("div", null, [
    n.bsLabel ? (r(), D("label", Rt, S(n.bsLabel), 1)) : b("", !0),
    M(a, A({ ref: "bsSelect" }, e.$attrs, {
      "dropdown-icon": "r_expand_more",
      class: "bs-select",
      outlined: "",
      dense: "",
      "popup-content-class": "bs-select__popup dds-text-400",
      onPopupShow: s.popupShow,
      onPopupHide: s.popupHide,
      "popup-content-style": s.popupStyle,
      label: s.computedLabel,
      "label-color": "#CCCCCC"
    }), w({ _: 2 }, [
      $(e.$slots, (p, l) => ({
        name: l,
        fn: u((m) => [
          c(e.$slots, l, y(_(m || {})))
        ])
      }))
    ]), 1040, ["onPopupShow", "onPopupHide", "popup-content-style", "label"])
  ]);
}
const qt = /* @__PURE__ */ g(Xt, [["render", Ft]]), Kt = {
  name: "BsButton",
  components: {
    QBtn: Z
  }
};
function en(e, t, n, o, i, s) {
  const a = d("QBtn");
  return r(), h(a, A(e.$attrs, { unelevated: "" }), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const tn = /* @__PURE__ */ g(Kt, [["render", en]]), nn = {
  name: "BsTooltip",
  components: {
    QTooltip: oe
  }
};
function sn(e, t, n, o, i, s) {
  const a = d("QTooltip");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const on = /* @__PURE__ */ g(nn, [["render", sn]]), an = {
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
}, rn = { class: "flex row bs-slider no-wrap" }, dn = ["value", "min", "max", "step"];
function ln(e, t, n, o, i, s) {
  const a = d("QSlider");
  return r(), D("div", rn, [
    M(a, A(e.$attrs, {
      style: { width: n.sliderWidth + "px" },
      "thumb-size": "15px",
      "track-size": "3.5px"
    }), w({ _: 2 }, [
      $(e.$slots, (p, l) => ({
        name: l,
        fn: u((m) => [
          c(e.$slots, l, y(_(m || {})))
        ])
      }))
    ]), 1040, ["style"]),
    I("input", {
      class: "bs-slider__input dku-text",
      type: "number",
      value: s.inputData.value,
      onInput: t[0] || (t[0] = (...p) => s.updateSliderFromInput && s.updateSliderFromInput(...p)),
      min: s.inputData.min,
      max: s.inputData.max,
      step: s.inputData.step
    }, null, 40, dn)
  ]);
}
const un = /* @__PURE__ */ g(an, [["render", ln]]), cn = {
  name: "BsRange",
  components: {
    QRange: Qe
  }
};
function pn(e, t, n, o, i, s) {
  const a = d("QRange");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const mn = /* @__PURE__ */ g(cn, [["render", pn]]), hn = {
  name: "BsSpinner",
  components: {
    QSpinner: Pe
  }
};
function gn(e, t, n, o, i, s) {
  const a = d("QSpinner");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const bn = /* @__PURE__ */ g(hn, [["render", gn]]), Mn = {
  name: "BsTable",
  components: {
    QTable: xe
  }
};
function In(e, t, n, o, i, s) {
  const a = d("QTable");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const Dn = /* @__PURE__ */ g(Mn, [["render", In]]), Tn = {
  name: "BsImg",
  components: {
    QImg: Ee
  }
};
function fn(e, t, n, o, i, s) {
  const a = d("QImg");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const yn = /* @__PURE__ */ g(Tn, [["render", fn]]), _n = {
  name: "BsIcon",
  components: {
    QIcon: H
  }
};
function Nn(e, t, n, o, i, s) {
  const a = d("QIcon");
  return r(), h(a, y(_(e.$attrs)), w({ _: 2 }, [
    $(e.$slots, (p, l) => ({
      name: l,
      fn: u((m) => [
        c(e.$slots, l, y(_(m || {})))
      ])
    }))
  ]), 1040);
}
const $n = /* @__PURE__ */ g(_n, [["render", Nn]]), wn = {
  name: "BsCheckbox",
  components: {
    QCheckbox: Ve
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
}, jn = {
  key: 0,
  class: "dku-tiny-text bs-checkbox__hint"
};
function Sn(e, t, n, o, i, s) {
  const a = d("QCheckbox");
  return r(), D("div", {
    class: j(["bs-checkbox", { hint: s.isHintOnly, disabled: s.isDisabled }])
  }, [
    M(a, A(e.$attrs, {
      size: "29.57px",
      tabindex: 0,
      label: s.labelFromHint
    }), w({ _: 2 }, [
      $(e.$slots, (p, l) => ({
        name: l,
        fn: u((m) => [
          c(e.$slots, l, y(_(m || {})))
        ])
      }))
    ]), 1040, ["label"]),
    n.hint && e.$attrs.label ? (r(), D("div", jn, S(n.hint), 1)) : b("", !0)
  ], 2);
}
const An = /* @__PURE__ */ g(wn, [["render", Sn]]), Cn = {
  name: "BsDateRange",
  components: {
    QInput: Ue,
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
}, On = {
  key: 0,
  class: "bs-date-range__label dss-caption-400 q-mb-xs"
}, kn = { class: "row items-center justify-end" };
function vn(e, t, n, o, i, s) {
  const a = d("QBtn"), p = d("QDate"), l = d("QPopupProxy"), m = d("QIcon"), k = d("QInput"), v = we("close-popup");
  return r(), D("div", null, [
    n.bsLabel ? (r(), D("label", On, S(n.bsLabel), 1)) : b("", !0),
    M(k, {
      dense: "",
      outlined: "",
      readonly: "",
      modelValue: s.inputValue,
      "onUpdate:modelValue": t[0] || (t[0] = (f) => s.inputValue = f)
    }, {
      append: u(() => [
        M(m, {
          name: "event",
          class: "cursor-pointer"
        }, {
          default: u(() => [
            M(l, {
              cover: "",
              "transition-show": "scale",
              "transition-hide": "scale"
            }, {
              default: u(() => [
                M(p, A({ range: "" }, e.$attrs), {
                  default: u(() => [
                    I("div", kn, [
                      O(M(a, {
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
const zn = /* @__PURE__ */ g(Cn, [["render", vn]]);
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
  BsIcon: $n,
  BsImg: yn,
  BsLayoutDefault: xt,
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
}, Symbol.toStringTag, { value: "Module" })), xn = {
  version: 1.3,
  install(e) {
    He(
      e,
      { components: Bn }
    );
  }
}, En = 1.3;
export {
  tn as BsButton,
  An as BsCheckbox,
  W as BsContent,
  zn as BsDateRange,
  Y as BsDocumentation,
  z as BsDrawer,
  ue as BsDrawerBtn,
  B as BsHeader,
  $n as BsIcon,
  yn as BsImg,
  xt as BsLayoutDefault,
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
  xn as QuasarBs,
  En as version
};
