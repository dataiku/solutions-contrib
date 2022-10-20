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

    var script = {
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

    var _hoisted_1 = { class: "row bs-layout" };
    var _hoisted_2 = {
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

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
        (!$data.isHidden)
          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
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

    script.render = render;

    var components = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BsLayoutDefault: script
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
