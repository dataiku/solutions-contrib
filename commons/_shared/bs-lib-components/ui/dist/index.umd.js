/*!
 * quasar-ui-bs v1.3
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('quasar'), require('vue')) :
    typeof define === 'function' && define.amd ? define(['quasar', 'vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.QuasarBs = factory(global.Quasar, global.Vue));
})(this, (function (quasar, vue) { 'use strict';

    function isObject (v) {
        return v !== null && typeof v === 'object' && Array.isArray(v) !== true
    }

    function installApp(app, uiOpts) {
        uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach(function (c) {
            if (isObject(c) === true && c.name !== void 0) {
              app.component(c.name, c);
            }
        });
    }

    var img$1 = "data:image/svg+xml,%3csvg width='16' height='100' viewBox='0 0 16 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0H4C10.6274 0 16 5.37258 16 12V88C16 94.6274 10.6274 100 4 100H0V0Z' fill='%23CCCCCC'/%3e%3cg filter='url(%23filter0_d_1_1668)'%3e%3crect x='5' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cg filter='url(%23filter1_d_1_1668)'%3e%3crect x='9' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cdefs%3e%3cfilter id='filter0_d_1_1668' x='5' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3cfilter id='filter1_d_1_1668' x='9' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e";

    var script$c = {
            name:"BsLayoutDefault",
            data: function data() {
                return {
                    showLeftPanel : true,
                    btnImg : img$1,
                    openDoc: false
                }  
            },
            components: {
                QLayout: quasar.QLayout, 
                QHeader: quasar.QHeader, 
                QDrawer: quasar.QDrawer, 
                QPageContainer: quasar.QPageContainer,
                QBtn: quasar.QBtn,
                QCard: quasar.QCard
            },
            methods: {
                toggleLeftPanel: function toggleLeftPanel() {
                    this.showLeftPanel = !this.showLeftPanel;
                },
                toggleDoc: function toggleDoc() {
                    this.openDoc = !this.openDoc;
                },
            },
            computed: {
                leftDist: function leftDist() {
                    return this.showLeftPanel ? 300 : 0;
                }
            },
            props: {
                header: {
                    type: Boolean,
                    default: true
                },
                leftpanel: {
                    type: Boolean,
                    default: true
                },
                docTitle: {
                    type: String,
                },
                docIcon: {
                    type: String,
                },
                doc: {
                    type: Boolean,
                    default: true
                },
                docImageDimensions: {
                    type: Object,
                    default: function () { return ({
                        width: 36,
                        height: 40,
                    }); }
                }
            }
        };

    var img = "data:image/svg+xml,%3csvg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1.646 0.703613C0.736857 0.703613 0 1.41318 0 2.28865V7.78524C0 8.66071 0.736857 9.37028 1.646 9.37028H4.09065C4.03111 9.05802 4 8.73617 4 8.40732H3.75V1.66658H10.354C10.7109 1.66658 11 1.94501 11 2.28865V3.31031C11.3486 3.40524 11.6832 3.53244 12 3.68835V2.28865C12 1.41318 11.2631 0.703613 10.354 0.703613H1.646ZM2.75 1.66658V8.40732H1.646C1.28914 8.40732 1 8.12888 1 7.78524V2.28865C1 1.94501 1.28914 1.66658 1.646 1.66658H2.75Z' fill='%2301B2AA'/%3e%3cpath d='M9.4999 7.5185C8.9899 7.5185 8.57689 7.91621 8.57689 8.40732C8.57689 8.89843 8.9899 9.29613 9.4999 9.29613C10.0099 9.29613 10.4229 8.89843 10.4229 8.40732C10.4229 7.91621 10.0099 7.5185 9.4999 7.5185Z' fill='%2301B2AA'/%3e%3cpath d='M9.5 12.7406C11.985 12.7406 14 10.8003 14 8.40732C14 6.01435 11.985 4.07398 9.5 4.07398C7.015 4.07398 5 6.01435 5 8.40732C5 10.8003 7.015 12.7406 9.5 12.7406ZM9.5029 5.51843C9.7289 5.52132 9.9539 5.54635 10.1739 5.59354C10.2699 5.61376 10.3419 5.69176 10.3529 5.78613L10.4049 6.23872C10.4289 6.44672 10.6109 6.60369 10.8279 6.60369C10.8859 6.60369 10.9439 6.59213 10.9979 6.56902L11.4289 6.38702C11.5189 6.34947 11.6229 6.36969 11.6899 6.43902C12.0009 6.75969 12.2329 7.14391 12.3679 7.5628C12.3969 7.65332 12.3639 7.75154 12.2849 7.80739L11.9029 8.07895C11.7939 8.15598 11.7299 8.27828 11.7299 8.40828C11.7299 8.53828 11.7939 8.66058 11.9039 8.73858L12.2859 9.01013C12.3649 9.06598 12.3989 9.16421 12.3699 9.25472C12.2349 9.67361 12.0029 10.0578 11.6919 10.3785C11.6249 10.4469 11.5199 10.4681 11.4309 10.4305L10.9979 10.2475C10.8739 10.1955 10.7319 10.2032 10.6149 10.2678C10.4979 10.3332 10.4199 10.4478 10.4049 10.5769L10.3529 11.0295C10.3419 11.1229 10.2719 11.1999 10.1769 11.2211C9.7309 11.3232 9.2669 11.3232 8.8209 11.2211C8.7259 11.1989 8.6559 11.1229 8.6449 11.0295L8.5929 10.5778C8.5779 10.4488 8.4999 10.3342 8.3829 10.2697C8.2659 10.2052 8.1239 10.1975 8.0009 10.2495L7.56789 10.4324C7.4779 10.47 7.3739 10.4498 7.3069 10.3804C6.9959 10.0598 6.7639 9.67554 6.62889 9.25569C6.5999 9.16517 6.6339 9.06695 6.7129 9.01109L7.09589 8.73954C7.2049 8.6625 7.2689 8.54021 7.2689 8.41021C7.2689 8.28021 7.2049 8.15791 7.09589 8.07991L6.71389 7.80932C6.6349 7.75346 6.6009 7.65524 6.6299 7.56472C6.7649 7.14583 6.99689 6.76161 7.30789 6.44095C7.3749 6.37258 7.4799 6.35139 7.5689 6.38895L7.9999 6.57095C8.1239 6.62295 8.26589 6.61524 8.38389 6.54976C8.5009 6.48428 8.5789 6.36969 8.59389 6.23969L8.6459 5.78806C8.6569 5.69369 8.7289 5.61665 8.8249 5.59546C9.0459 5.54828 9.2709 5.52324 9.5019 5.52035L9.5029 5.51843Z' fill='%2301B2AA'/%3e%3c/svg%3e";

    var _hoisted_1$5 = /*#__PURE__*/vue.createElementVNode("img", { src: img$1 }, null, -1);
    var _hoisted_2$3 = [
      _hoisted_1$5
    ];
    var _hoisted_3 = { class: "content" };
    var _hoisted_4 = /*#__PURE__*/vue.createElementVNode("div", { class: "row items-center q-gutter-sm no-wrap" }, [
      /*#__PURE__*/vue.createElementVNode("img", {
        src: img,
        width: "15",
        height: "16"
      }),
      /*#__PURE__*/vue.createElementVNode("span", { class: "btn-solution-text" }, "Dataiku Solutions")
    ], -1);
    var _hoisted_5 = { class: "flex row items-center q-gutter-sm q-mb-lg" };
    var _hoisted_6 = ["src", "width", "height"];
    var _hoisted_7 = { class: "dku-large-title-sb" };
    var _hoisted_8 = { class: "doc-body" };
    var _hoisted_9 = /*#__PURE__*/vue.createElementVNode("div", { class: "doc-footer flex row items-center" }, [
      /*#__PURE__*/vue.createElementVNode("span", { class: "doc-footer__icon" }, [
        /*#__PURE__*/vue.createElementVNode("img", {
          src: img,
          width: "14",
          height: "12.5"
        })
      ]),
      /*#__PURE__*/vue.createElementVNode("span", { class: "doc-footer__text dku-tiny-text-sb" }, "Dataiku Solutions")
    ], -1);

    function render$c(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QHeader = vue.resolveComponent("QHeader");
      var _component_QDrawer = vue.resolveComponent("QDrawer");
      var _component_QBtn = vue.resolveComponent("QBtn");
      var _component_QCard = vue.resolveComponent("QCard");
      var _component_QPageContainer = vue.resolveComponent("QPageContainer");
      var _component_QLayout = vue.resolveComponent("QLayout");

      return (vue.openBlock(), vue.createBlock(_component_QLayout, {
        view: "lHh LpR lFf",
        class: "bg-white"
      }, {
        default: vue.withCtx(function () { return [
          ($props.leftpanel)
            ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: "toggle-left-button",
                style: vue.normalizeStyle({ 'left' : $options.leftDist + 'px'})
              }, [
                vue.createElementVNode("div", {
                  onClick: _cache[0] || (_cache[0] = function () {
                    var args = [], len = arguments.length;
                    while ( len-- ) args[ len ] = arguments[ len ];

                    return ($options.toggleLeftPanel && $options.toggleLeftPanel.apply($options, args));
          })
                }, _hoisted_2$3)
              ], 4))
            : vue.createCommentVNode("", true),
          ($props.header)
            ? (vue.openBlock(), vue.createBlock(_component_QHeader, {
                key: 1,
                bordered: "",
                class: "bg-white bs-header"
              }, {
                default: vue.withCtx(function () { return [
                  vue.renderSlot(_ctx.$slots, "header")
                ]; }),
                _: 3
              }))
            : vue.createCommentVNode("", true),
          ($props.leftpanel)
            ? (vue.openBlock(), vue.createBlock(_component_QDrawer, {
                key: 2,
                modelValue: $data.showLeftPanel,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) { return (($data.showLeftPanel) = $event); }),
                side: "left",
                bordered: "",
                behavior: "desktop"
              }, {
                default: vue.withCtx(function () { return [
                  vue.renderSlot(_ctx.$slots, "leftpanel")
                ]; }),
                _: 3
              }, 8, ["modelValue"]))
            : vue.createCommentVNode("", true),
          vue.createVNode(_component_QPageContainer, null, {
            default: vue.withCtx(function () { return [
              vue.createElementVNode("div", _hoisted_3, [
                ($props.doc)
                  ? (vue.openBlock(), vue.createBlock(_component_QBtn, {
                      key: 0,
                      unelevated: "",
                      outline: "",
                      "no-caps": "",
                      "no-wrap": "",
                      class: "btn-solution absolute",
                      square: "",
                      onClick: $options.toggleDoc
                    }, {
                      default: vue.withCtx(function () { return [
                        _hoisted_4
                      ]; }),
                      _: 1
                    }, 8, ["onClick"]))
                  : vue.createCommentVNode("", true),
                ($props.doc && $data.openDoc)
                  ? (vue.openBlock(), vue.createBlock(_component_QCard, {
                      key: 1,
                      class: "doc-content flex row"
                    }, {
                      default: vue.withCtx(function () { return [
                        vue.createElementVNode("div", _hoisted_5, [
                          ($props.docIcon)
                            ? (vue.openBlock(), vue.createElementBlock("img", {
                                key: 0,
                                src: $props.docIcon,
                                width: $props.docImageDimensions.width,
                                height: $props.docImageDimensions.height
                              }, null, 8, _hoisted_6))
                            : vue.createCommentVNode("", true),
                          vue.createElementVNode("span", _hoisted_7, vue.toDisplayString($props.docTitle), 1)
                        ]),
                        vue.createElementVNode("div", _hoisted_8, [
                          vue.renderSlot(_ctx.$slots, "documentation")
                        ]),
                        _hoisted_9
                      ]; }),
                      _: 3
                    }))
                  : vue.createCommentVNode("", true),
                vue.renderSlot(_ctx.$slots, "content")
              ])
            ]; }),
            _: 3
          })
        ]; }),
        _: 3
      }))
    }

    script$c.render = render$c;

    var useSizeDefaults = {
        xs: 18,
        sm: 22,
        md: 26,
        lg: 30,
        xl: 34
    };

      
    var fontSize = function (size, sizes) {
      if ( sizes === void 0 ) sizes = useSizeDefaults;

      // return sizeStyle
      return size !== void 0
          ? size in sizes ? ((sizes[ size ]) + "px") : size 
          : null
      
    };

    var useToggleProps = {
        size: {
            type: String,
            default: "sm",
        },
        modelValue: {
            required: true,
            default: null
        },
        val: {},
        trueValue: { default: true },
        falseValue: { default: false },
        labelLeft: String,
        labelRight: String,
        labelClass: { type: String, default: "dku-text"},
        color : { type: String, default: 'rgba(111, 125, 137, 0.8)' },
        disable: Boolean,
        tabindex: [ String, Number ]
    };

    var useToggleEmits = [ 'update:modelValue' ];

    function stopAndPrevent (e) {
      e.cancelable !== false && e.preventDefault();
      e.stopPropagation();
    }

    var script$b = {
            name: "BsToggle",
            data: function data() {
                return {

                }
            },
            props: Object.assign({}, useToggleProps),
            emits: useToggleEmits,
            computed: {
                modelIsArray: function modelIsArray() {
                    return this.val !== void 0 && Array.isArray(this.modelValue)
                },
                index: function index() {
                    var val = this.val;
                    return this.modelIsArray === true
                        ? this.modelValue.findIndex(function (opt) { return opt === val; })
                        : -1
                },
                isTrue: function isTrue() {
                    return this.modelIsArray === true 
                    ? this.index > -1
                    : this.modelValue === this.trueValue
                },
                isFalse: function isFalse() {
                    return this.modelIsArray === true 
                    ? this.index === -1
                    : this.modelValue === this.falseValue
                },
                tabIndex: function tabIndex() {
                    return this.disable === true ? -1 : this.tabindex || 0;
                },
                fontSize: function fontSize$1() {
                    return fontSize(this.size);
                }
            },
            methods: {
                getNextValue: function getNextValue() {
                    
                    if (this.modelIsArray === true) {
                        if (this.isTrue === true) {
                            var val = this.modelValue.slice();
                            val.splice(this.index, 1);
                            return val
                        }

                    return this.modelValue.concat([ this.val ])
                    }
                    
                    if (this.isTrue === true) {
                        return this.falseValue;
                    }
                    if (this.isFalse === true) {
                        return this.trueValue;
                    }
                    
                },
                onClick: function onClick(e) {
                    if (e !== void 0) {
                        stopAndPrevent(e);
                    }
                    if (this.disable !== true) {
                        console.log('next value');
                        console.log(this.isTrue);
                        console.log(this.getNextValue());
                        this.$emit('update:modelValue', this.getNextValue(),e);
                    }
                },
                onKeydown: function onKeydown(e) {
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        stopAndPrevent(e);
                    }
                },
                onKeyup: function onKeyup (e) {
                    if (e.keyCode === 13 || e.keyCode === 32) {
                        this.onClick(e);
                    }
                }
            }

        };

    var _hoisted_1$4 = ["checked", "value"];
    var _hoisted_2$2 = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];

    function render$b(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass([{
          'bs-toggle--is-disabled': _ctx.disable,
        }, "bs-toggle"]),
        style: vue.normalizeStyle({ 'font-size' : $options.fontSize})
      }, [
        (_ctx.labelLeft)
          ? (vue.openBlock(), vue.createElementBlock("label", {
              key: 0,
              class: vue.normalizeClass(["bs-toggle__label", [_ctx.labelClass]])
            }, vue.toDisplayString(_ctx.labelLeft), 3))
          : vue.createCommentVNode("", true),
        vue.createElementVNode("input", {
          type: "checkbox",
          checked: $options.isTrue === true,
          value: $options.modelIsArray === true ? _ctx.val : _ctx.trueValue,
          class: "bs-toggle__input"
        }, null, 8, _hoisted_1$4),
        vue.createElementVNode("div", {
          "aria-checked": $options.isTrue === true,
          "aria-disabled": _ctx.disable,
          "aria-readonly": _ctx.disable,
          class: vue.normalizeClass(['bs-toggle__content', $options.isTrue === true ? 'bs-toggle__content__active' : '']),
          style: vue.normalizeStyle({'background-color': $options.isTrue === true ? _ctx.color : ''}),
          role: "checkbox",
          onClick: _cache[0] || (_cache[0] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.onClick && $options.onClick.apply($options, args));
      }),
          onKeydown: _cache[1] || (_cache[1] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.onKeydown && $options.onKeydown.apply($options, args));
      }),
          onKeyup: _cache[2] || (_cache[2] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.onKeyup && $options.onKeyup.apply($options, args));
      }),
          tabindex: $options.tabIndex
        }, null, 46, _hoisted_2$2),
        (_ctx.labelRight)
          ? (vue.openBlock(), vue.createElementBlock("label", {
              key: 1,
              class: vue.normalizeClass(["bs-toggle__label", [_ctx.labelClass]])
            }, vue.toDisplayString(_ctx.labelRight), 3))
          : vue.createCommentVNode("", true)
      ], 6))
    }

    script$b.render = render$b;

    var script$a = {
        name: "BsSelect",
        data: function data() {
            return {
                width: 0,
                // TODO : optimize this behaviour of copying options in future releases
                allOptions: JSON.parse(JSON.stringify(this.$attrs.options)),
                bsOptions: JSON.parse(JSON.stringify(this.$attrs.options)),
            }
        },
        props: {
            bsLabel: {
                type: String,
            }, 
            placeHolder: {
                type: String,
            },
            filter: {
                type: Boolean,
                default: true,
            }
        },
        components: {
            QSelect: quasar.QSelect,
        },
        methods: {
            popupShow: function popupShow() {
                this.width = this.$refs.bsSelect.$el.offsetWidth;
            },
            popupHide: function popupHide() {
                this.width = 0;
            },
            filterFn: function(val, update, abort) {
                var this$1$1 = this;

                update(function () {
                    if (val === '') {
                        this$1$1.bsOptions = this$1$1.allOptions;
                    } else {
                        var needle = val.toLowerCase();
                        if (this$1$1.allOptions.some(function (element) {
                            return typeof element === 'object' 
                                && !Array.isArray(element)
                                && element !== null
                        })) {
                            // Case where it is an object
                            this$1$1.bsOptions = this$1$1.allOptions.filter(function (v) { return (v.label || "").toLowerCase().indexOf(needle) > -1; });
                        } else {
                            // Case primitive types (string)
                            this$1$1.bsOptions = this$1$1.allOptions.filter(function (v) { return v.toLowerCase().indexOf(needle) > -1; });
                        }    
                    } 
                });
            }
        },
        computed: {
            popupStyle: function popupStyle() {
                return {
                    width : this.width,
                    maxWidth : this.width,
                    wordBreak : 'break-all'
                }   
            },
            computedLabel: function computedLabel() {
                if (this.placeHolder && !this.$attrs.modelValue) {
                    return this.placeHolder;
                }
                return undefined;
            }
        }
        
    };

    var _hoisted_1$3 = {
      key: 0,
      class: "bs-select__label dss-caption-400 q-mb-xs"
    };

    function render$a(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QSelect = vue.resolveComponent("QSelect");

      return (vue.openBlock(), vue.createElementBlock("div", null, [
        ($props.bsLabel)
          ? (vue.openBlock(), vue.createElementBlock("label", _hoisted_1$3, vue.toDisplayString($props.bsLabel), 1))
          : vue.createCommentVNode("", true),
        vue.createVNode(_component_QSelect, vue.mergeProps({ ref: "bsSelect" }, _ctx.$attrs, {
          options: $data.bsOptions,
          "dropdown-icon": "r_expand_more",
          class: "bs-select",
          outlined: "",
          dense: "",
          "use-input": $props.filter,
          "input-debounce": "0",
          "popup-content-class": "bs-select__popup dds-text-400",
          onPopupShow: $options.popupShow,
          onPopupHide: $options.popupHide,
          "popup-content-style": $options.popupStyle,
          label: $options.computedLabel,
          "label-color": "#CCCCCC",
          onFilter: $options.filterFn
        }), vue.createSlots({ _: 2 }, [
          vue.renderList(_ctx.$slots, function (_, slot) {
            return {
              name: slot,
              fn: vue.withCtx(function (scope) { return [
                vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
              ]; })
            }
          })
        ]), 1040, ["options", "use-input", "onPopupShow", "onPopupHide", "popup-content-style", "label", "onFilter"])
      ]))
    }

    script$a.render = render$a;

    var script$9 = {
            name: "BsButton",
            components: {
                QBtn: quasar.QBtn, 
            }
        };

    function render$9(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QBtn = vue.resolveComponent("QBtn");

      return (vue.openBlock(), vue.createBlock(_component_QBtn, vue.mergeProps(_ctx.$attrs, { unelevated: "" }), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$9.render = render$9;

    var script$8 = {
            name: "BsTooltip",
            components: {
                QTooltip: quasar.QTooltip  
            }
        };

    function render$8(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QTooltip = vue.resolveComponent("QTooltip");

      return (vue.openBlock(), vue.createBlock(_component_QTooltip, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$8.render = render$8;

    var script$7 = {
            name: "BsSlider",
            components: {
                QSlider: quasar.QSlider,
            },
            props: {
                sliderWidth: {
                    type: Number,
                    default: 192,
                }
            },
            computed: {
                inputData: function inputData() {
                    return {
                        value: this.$attrs.modelValue,
                        min: this.$attrs.min,
                        max: this.$attrs.max,
                        step: this.$attrs.step,
                    }
                }
            },
            methods: {
                // TODO : Round to step in needed
                updateSliderFromInput: function updateSliderFromInput(e) {
                    var newValue = Number(e.target.value);
                    if (newValue < this.$attrs.min) {
                        newValue = this.$attrs.min;
                    }
                    if (newValue > this.$attrs.max) {
                        newValue = this.$attrs.max;
                    }
                    this.$emit("update:model-value",newValue);
                }
            }
        };

    var _hoisted_1$2 = { class: "flex row bs-slider no-wrap" };
    var _hoisted_2$1 = ["value", "min", "max", "step"];

    function render$7(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QSlider = vue.resolveComponent("QSlider");

      return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
        vue.createVNode(_component_QSlider, vue.mergeProps(_ctx.$attrs, {
          style: {width : $props.sliderWidth + 'px'},
          "thumb-size": "15px",
          "track-size": "3.5px"
        }), vue.createSlots({ _: 2 }, [
          vue.renderList(_ctx.$slots, function (_, slot) {
            return {
              name: slot,
              fn: vue.withCtx(function (scope) { return [
                vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
              ]; })
            }
          })
        ]), 1040, ["style"]),
        vue.createElementVNode("input", {
          class: "bs-slider__input dku-text",
          type: "number",
          value: $options.inputData.value,
          onInput: _cache[0] || (_cache[0] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return ($options.updateSliderFromInput && $options.updateSliderFromInput.apply($options, args));
      }),
          min: $options.inputData.min,
          max: $options.inputData.max,
          step: $options.inputData.step
        }, null, 40, _hoisted_2$1)
      ]))
    }

    script$7.render = render$7;

    var script$6 = {
            name: "BsRange",
            components: {
                QRange: quasar.QRange  
            }
        };

    function render$6(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QRange = vue.resolveComponent("QRange");

      return (vue.openBlock(), vue.createBlock(_component_QRange, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$6.render = render$6;

    var script$5 = {
            name: "BsSpinner",
            components: {
                QSpinner: quasar.QSpinner 
            }
        };

    function render$5(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QSpinner = vue.resolveComponent("QSpinner");

      return (vue.openBlock(), vue.createBlock(_component_QSpinner, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$5.render = render$5;

    var script$4 = {
            name: "BsTable",
            components: {
                QTable: quasar.QTable  
            }
        };

    function render$4(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QTable = vue.resolveComponent("QTable");

      return (vue.openBlock(), vue.createBlock(_component_QTable, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$4.render = render$4;

    var script$3 = {
            name: "BsImg",
            components: {
                QImg: quasar.QImg
            }
        };

    function render$3(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QImg = vue.resolveComponent("QImg");

      return (vue.openBlock(), vue.createBlock(_component_QImg, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$3.render = render$3;

    var script$2 = {
            name: "BsIcon",
            components: {
                QIcon: quasar.QIcon
            }
        };

    function render$2(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QIcon = vue.resolveComponent("QIcon");

      return (vue.openBlock(), vue.createBlock(_component_QIcon, vue.normalizeProps(vue.guardReactiveProps(_ctx.$attrs)), vue.createSlots({ _: 2 }, [
        vue.renderList(_ctx.$slots, function (_, slot) {
          return {
            name: slot,
            fn: vue.withCtx(function (scope) { return [
              vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
            ]; })
          }
        })
      ]), 1040))
    }

    script$2.render = render$2;

    var script$1 = {
            name: "BsCheckbox",
            components: {
                QCheckbox: quasar.QCheckbox,
            },
            props: {
                hint: {
                    type: String,
                }
            },
            computed: {
                labelFromHint: function labelFromHint() {
                    if (this.$attrs.label) {
                        return this.$attrs.label;
                    } else if (this.hint) {
                        return this.hint;
                    }
                    return null;
                },
                isHintOnly: function isHintOnly() {
                    return !this.$attrs.label && this.hint
                },
                isDisabled: function isDisabled() {
                    return this.$attrs.disable != null ? true : false;
                }
                
            }
        };

    var _hoisted_1$1 = {
      key: 0,
      class: "dku-tiny-text bs-checkbox__hint"
    };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QCheckbox = vue.resolveComponent("QCheckbox");

      return (vue.openBlock(), vue.createElementBlock("div", {
        class: vue.normalizeClass(["bs-checkbox", { hint : $options.isHintOnly, disabled : $options.isDisabled}])
      }, [
        vue.createVNode(_component_QCheckbox, vue.mergeProps(_ctx.$attrs, {
          size: "29.57px",
          tabindex: 0,
          label: $options.labelFromHint
        }), vue.createSlots({ _: 2 }, [
          vue.renderList(_ctx.$slots, function (_, slot) {
            return {
              name: slot,
              fn: vue.withCtx(function (scope) { return [
                vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
              ]; })
            }
          })
        ]), 1040, ["label"]),
        (($props.hint && _ctx.$attrs.label))
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, vue.toDisplayString($props.hint), 1))
          : vue.createCommentVNode("", true)
      ], 2))
    }

    script$1.render = render$1;

    var script = {
            name: "BsDateRange",
            components: {
                QInput: quasar.QInput, QDate: quasar.QDate, QPopupProxy: quasar.QPopupProxy, QIcon: quasar.QIcon, QBtn: quasar.QBtn
            },
            props: {
                bsLabel: {
                    type: String,
                }
            },
            computed: {
                inputValue: function inputValue() {
                    if (this.$attrs.modelValue) {
                        if (this.$attrs.modelValue.from && this.$attrs.modelValue.to) {
                            return this.$attrs.modelValue.from + " - " + this.$attrs.modelValue.to;
                        }
                        return ""
                    }
                    return ""
                }
            }
        };

    var _hoisted_1 = {
      key: 0,
      class: "bs-date-range__label dss-caption-400 q-mb-xs"
    };
    var _hoisted_2 = { class: "row items-center justify-end" };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_QBtn = vue.resolveComponent("QBtn");
      var _component_QDate = vue.resolveComponent("QDate");
      var _component_QPopupProxy = vue.resolveComponent("QPopupProxy");
      var _component_QIcon = vue.resolveComponent("QIcon");
      var _component_QInput = vue.resolveComponent("QInput");
      var _directive_close_popup = vue.resolveDirective("close-popup");

      return (vue.openBlock(), vue.createElementBlock("div", null, [
        ($props.bsLabel)
          ? (vue.openBlock(), vue.createElementBlock("label", _hoisted_1, vue.toDisplayString($props.bsLabel), 1))
          : vue.createCommentVNode("", true),
        vue.createVNode(_component_QInput, {
          dense: "",
          outlined: "",
          readonly: "",
          modelValue: $options.inputValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) { return (($options.inputValue) = $event); })
        }, {
          append: vue.withCtx(function () { return [
            vue.createVNode(_component_QIcon, {
              name: "event",
              class: "cursor-pointer"
            }, {
              default: vue.withCtx(function () { return [
                vue.createVNode(_component_QPopupProxy, {
                  cover: "",
                  "transition-show": "scale",
                  "transition-hide": "scale"
                }, {
                  default: vue.withCtx(function () { return [
                    vue.createVNode(_component_QDate, vue.mergeProps({ range: "" }, _ctx.$attrs), {
                      default: vue.withCtx(function () { return [
                        vue.createElementVNode("div", _hoisted_2, [
                          vue.withDirectives(vue.createVNode(_component_QBtn, {
                            label: "Close",
                            color: "primary",
                            flat: ""
                          }, null, 512), [
                            [_directive_close_popup]
                          ])
                        ])
                      ]; }),
                      _: 1
                    }, 16)
                  ]; }),
                  _: 1
                })
              ]; }),
              _: 1
            })
          ]; }),
          _: 1
        }, 8, ["modelValue"])
      ]))
    }

    script.render = render;

    var components = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BsLayoutDefault: script$c,
        BsToggle: script$b,
        BsSelect: script$a,
        BsButton: script$9,
        BsTooltip: script$8,
        BsSlider: script$7,
        BsRange: script$6,
        BsSpinner: script$5,
        BsTable: script$4,
        BsImg: script$3,
        BsIcon: script$2,
        BsCheckbox: script$1,
        BsDateRange: script
    });

    var index_umd = Object.assign({}, {version: '1.3',
      install: function install (app) {
        installApp(app, {
          components: components,
        });
      }},
      components);

    return index_umd;

}));
