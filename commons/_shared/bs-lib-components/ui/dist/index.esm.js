/*!
 * quasar-ui-bs v0.0.1
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */
import{QBtn}from"quasar";import{resolveComponent,openBlock,createBlock}from"vue";function installApp(o,n){void 0!==n.components&&Object.values(n.components).forEach(function(n){o.component(n.name,n)})}var script={name:"BsButton",props:{label:{type:String,required:!0}},components:{QBtn:QBtn}};function render(n,o,e,t,r,s){var c=resolveComponent("q-btn");return openBlock(),createBlock(c,{label:e.label,color:"secondary"},null,8,["label"])}script.render=render;var components=Object.freeze({__proto__:null,BsButton:script}),QuasarBs={version:"0.0.1",install:function(n){installApp(n,{components:components})}};export{script as BsButton,QuasarBs};