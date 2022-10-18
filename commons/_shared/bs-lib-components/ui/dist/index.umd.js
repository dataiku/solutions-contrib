/*!
 * quasar-ui-bs v0.0.1
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('quasar'), require('vue')) :
    typeof define === 'function' && define.amd ? define(['quasar', 'vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.global = factory(global.Quasar, global.Vue));
})(this, (function (quasar, vue) { 'use strict';

    function installApp(app, uiOpts) {
        uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach(function (c) {
            // if (isObject(c) === true && c.name !== void 0) {
              app.component(c.name, c);
            // }
        });
    }

    var script = {
        name: 'BsButton',
        props: {
            label: {
                type: String,
                required: true,
            }
        },
        components: {
            QBtn: quasar.QBtn
        }
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      var _component_q_btn = vue.resolveComponent("q-btn");

      return (vue.openBlock(), vue.createBlock(_component_q_btn, {
        label: $props.label,
        color: "secondary"
      }, null, 8, ["label"]))
    }

    script.render = render;

    var components = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BsButton: script
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
