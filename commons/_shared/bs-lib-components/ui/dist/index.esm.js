/*!
 * quasar-ui-bs v0.0.1
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */
import{QBtn}from"quasar";import{resolveComponent,openBlock,createBlock}from"vue";var script={name:"BsButton",props:{label:{type:String,required:!0}},components:{QBtn:QBtn}};function render(e,n,r,t,o,l){var s=resolveComponent("q-btn");return openBlock(),createBlock(s,{label:r.label,color:"secondary"},null,8,["label"])}script.render=render;var version="0.0.1";function install(e){e.component(script.name,script)}var VuePlugin=Object.freeze({__proto__:null,version:version,BsButton:script,install:install});export{script as BsButton,VuePlugin as default,install,version};