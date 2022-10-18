/*!
 * quasar-ui-bs v0.0.1
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var quasar=require("quasar"),vue=require("vue"),script={name:"BsButton",props:{label:{type:String,required:!0}},components:{QBtn:quasar.QBtn}};function render(e,r,n,t,o,s){var l=vue.resolveComponent("q-btn");return vue.openBlock(),vue.createBlock(l,{label:n.label,color:"secondary"},null,8,["label"])}script.render=render;var version="0.0.1";function install(e){e.component(script.name,script)}exports.BsButton=script,exports.install=install,exports.version=version;