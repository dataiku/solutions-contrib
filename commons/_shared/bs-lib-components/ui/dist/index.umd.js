/*!
 * quasar-ui-bs v0.0.1
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
    typeof define === 'function' && define.amd ? define(['vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.global = factory(global.Vue));
})(this, (function (vue) { 'use strict';

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

    var img = "data:image/svg+xml,%3csvg width='16' height='100' viewBox='0 0 16 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0H4C10.6274 0 16 5.37258 16 12V88C16 94.6274 10.6274 100 4 100H0V0Z' fill='%23CCCCCC'/%3e%3cg filter='url(%23filter0_d_1_1668)'%3e%3crect x='5' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cg filter='url(%23filter1_d_1_1668)'%3e%3crect x='9' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cdefs%3e%3cfilter id='filter0_d_1_1668' x='5' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3cfilter id='filter1_d_1_1668' x='9' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e";

    var script$a = {
            name:"BSLayoutDefault",
            data: function data() {
                return {
                    isHidden : false,
                    btnImg : img,
                }  
            },
            methods: {
                toggleLeftPanel: function toggleLeftPanel() {
                    this.isHidden = !this.isHidden;
                }
            },
            props: {
                LeftPanelTitle: {
                    type: String,
                }
            }
        };

    var _hoisted_1$2 = { class: "row bs-layout" };
    var _hoisted_2$1 = {
      key: 0,
      class: "bs-left-panel"
    };
    var _hoisted_3 = {
      class: "full-width column wrap justify-center items-stretch",
      style: {"padding":"16px"}
    };
    var _hoisted_4 = {
      class: "dku-medium-title",
      style: {"margin-bottom":"16px"}
    };
    var _hoisted_5 = { class: "col-grow bs-right-panel" };
    var _hoisted_6 = { class: "full-width column content-stretch" };
    var _hoisted_7 = { class: "bs-header" };
    var _hoisted_8 = { class: "row bs-content" };
    var _hoisted_9 = { class: "col-grow bs-toggle-left" };
    var _hoisted_10 = { class: "bs-toggle-left-button" };
    var _hoisted_11 = ["src"];
    var _hoisted_12 = { class: "col-grow bs-content-main" };

    function render$a(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
        (!$data.isHidden)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, [
              vue.createElementVNode("div", _hoisted_3, [
                vue.createElementVNode("div", _hoisted_4, vue.toDisplayString($props.LeftPanelTitle), 1),
                vue.renderSlot(_ctx.$slots, "leftpanel")
              ])
            ]))
          : vue.createCommentVNode("", true),
        vue.createElementVNode("div", _hoisted_5, [
          vue.createElementVNode("div", _hoisted_6, [
            vue.createElementVNode("div", _hoisted_7, [
              vue.renderSlot(_ctx.$slots, "header")
            ]),
            vue.createElementVNode("div", _hoisted_8, [
              vue.createElementVNode("div", _hoisted_9, [
                vue.createElementVNode("div", _hoisted_10, [
                  vue.createElementVNode("div", {
                    onClick: _cache[0] || (_cache[0] = function () {
                      var args = [], len = arguments.length;
                      while ( len-- ) args[ len ] = arguments[ len ];

                      return ($options.toggleLeftPanel && $options.toggleLeftPanel.apply($options, args));
      })
                  }, [
                    vue.createElementVNode("img", { src: $data.btnImg }, null, 8, _hoisted_11)
                  ])
                ])
              ]),
              vue.createElementVNode("div", _hoisted_12, [
                vue.renderSlot(_ctx.$slots, "content")
              ])
            ])
          ])
        ])
      ]))
    }

    script$a.render = render$a;

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

    var script$9 = {
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

    var _hoisted_1$1 = ["checked", "value"];
    var _hoisted_2 = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];

    function render$9(_ctx, _cache, $props, $setup, $data, $options) {
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
        }, null, 8, _hoisted_1$1),
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
        }, null, 46, _hoisted_2),
        (_ctx.labelRight)
          ? (vue.openBlock(), vue.createElementBlock("label", {
              key: 1,
              class: vue.normalizeClass(["bs-toggle__label", [_ctx.labelClass]])
            }, vue.toDisplayString(_ctx.labelRight), 3))
          : vue.createCommentVNode("", true)
      ], 6))
    }

    script$9.render = render$9;

    var script$8 = {
        name: "BsSelect",
        props: {
            bsLabel: {
                type: String,
            },
            bsLabelId: {
                type: String,
            },
        },
        
    };

    var _hoisted_1 = ["for"];

    function render$8(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_select = vue.resolveComponent("q-select");

      return (vue.openBlock(), vue.createElementBlock("div", null, [
        ($props.bsLabel)
          ? (vue.openBlock(), vue.createElementBlock("label", {
              key: 0,
              class: "bs-select__label dss-caption-400 q-mb-xs",
              for: $props.bsLabelId
            }, vue.toDisplayString($props.bsLabel), 9, _hoisted_1))
          : vue.createCommentVNode("", true),
        vue.createVNode(_component_q_select, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners), {
          "dropdown-icon": "r_expand_more",
          class: "bs-select",
          "popup-content-class": "bs-select__popup dds-text-400"
        }), vue.createSlots({ _: 2 }, [
          vue.renderList(_ctx.$slots, function (_, slot) {
            return {
              name: slot,
              fn: vue.withCtx(function (scope) { return [
                vue.renderSlot(_ctx.$slots, slot, vue.normalizeProps(vue.guardReactiveProps(scope || {})))
              ]; })
            }
          })
        ]), 1040)
      ]))
    }

    script$8.render = render$8;

    var script$7 = {
            name: "BsButton",
        };

    function render$7(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_btn = vue.resolveComponent("q-btn");

      return (vue.openBlock(), vue.createBlock(_component_q_btn, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners), { unelevated: "" }), vue.createSlots({ _: 2 }, [
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

    script$7.render = render$7;

    var script$6 = {
            name: "BsTooltip",
        };

    function render$6(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_tooltip = vue.resolveComponent("q-tooltip");

      return (vue.openBlock(), vue.createBlock(_component_q_tooltip, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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
            name: "BsSlider"
        };

    function render$5(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_slider = vue.resolveComponent("q-slider");

      return (vue.openBlock(), vue.createBlock(_component_q_slider, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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
            name: "BsRange",
        };

    function render$4(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_range = vue.resolveComponent("q-range");

      return (vue.openBlock(), vue.createBlock(_component_q_range, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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
            name: "BsSpinner",
        };

    function render$3(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_spinner = vue.resolveComponent("q-spinner");

      return (vue.openBlock(), vue.createBlock(_component_q_spinner, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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
            name: "BsTable",
        };

    function render$2(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_table = vue.resolveComponent("q-table");

      return (vue.openBlock(), vue.createBlock(_component_q_table, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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
            name: "BsImg",
        };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_img = vue.resolveComponent("q-img");

      return (vue.openBlock(), vue.createBlock(_component_q_img, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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

    script$1.render = render$1;

    var script = {
            name: "BsIcon",
        };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_icon = vue.resolveComponent("q-icon");

      return (vue.openBlock(), vue.createBlock(_component_q_icon, vue.mergeProps(_ctx.$attrs, vue.toHandlers(_ctx.$listeners)), vue.createSlots({ _: 2 }, [
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

    script.render = render;

    var components = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BsLayoutDefault: script$a,
        BsToggle: script$9,
        BsSelect: script$8,
        BsButton: script$7,
        BsTooltip: script$6,
        BsSlider: script$5,
        BsRange: script$4,
        BsSpinner: script$3,
        BsTable: script$2,
        BsImg: script$1,
        BsIcon: script
    });

    var index_umd = Object.assign({}, {version: '0.0.1',
      install: function install (app) {
        installApp(app, {
          components: components,
        });
      }},
      components);

    return index_umd;

}));
