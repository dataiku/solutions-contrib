/*!
 * quasar-ui-bs v1.3
 * (c) 2022 anas laaroussi <anas.laaroussi@dataiku.com>
 * Released under the MIT License.
 */
import{QLayout,QHeader,QDrawer,QPageContainer,QBtn,QCard,QSelect,QTooltip,QSlider,QRange,QSpinner,QTable,QImg,QIcon,QCheckbox,QInput,QDate,QPopupProxy}from"quasar";import{resolveComponent,openBlock,createBlock,withCtx,createElementBlock,normalizeStyle,createElementVNode,createCommentVNode,renderSlot,createVNode,toDisplayString,normalizeClass,mergeProps,createSlots,renderList,normalizeProps,guardReactiveProps,resolveDirective,withDirectives}from"vue";function isObject(e){return null!==e&&"object"==typeof e&&!0!==Array.isArray(e)}function installApp(t,e){void 0!==e.components&&Object.values(e.components).forEach(function(e){!0===isObject(e)&&void 0!==e.name&&t.component(e.name,e)})}var img$1="data:image/svg+xml,%3csvg width='16' height='100' viewBox='0 0 16 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0H4C10.6274 0 16 5.37258 16 12V88C16 94.6274 10.6274 100 4 100H0V0Z' fill='%23CCCCCC'/%3e%3cg filter='url(%23filter0_d_1_1668)'%3e%3crect x='5' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cg filter='url(%23filter1_d_1_1668)'%3e%3crect x='9' y='20' width='1' height='60' fill='%23F5F5F5'/%3e%3c/g%3e%3cdefs%3e%3cfilter id='filter0_d_1_1668' x='5' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3cfilter id='filter1_d_1_1668' x='9' y='20' width='2' height='60' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3e%3cfeFlood flood-opacity='0' result='BackgroundImageFix'/%3e%3cfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3e%3cfeOffset dx='1'/%3e%3cfeComposite in2='hardAlpha' operator='out'/%3e%3cfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0'/%3e%3cfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1_1668'/%3e%3cfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1_1668' result='shape'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e",script$c={name:"BsLayoutDefault",data:function(){return{showLeftPanel:!0,btnImg:img$1,openDoc:!1}},components:{QLayout:QLayout,QHeader:QHeader,QDrawer:QDrawer,QPageContainer:QPageContainer,QBtn:QBtn,QCard:QCard},methods:{toggleLeftPanel:function(){this.showLeftPanel=!this.showLeftPanel},toggleDoc:function(){this.openDoc=!this.openDoc}},computed:{leftDist:function(){return this.showLeftPanel?300:0}},props:{header:{type:Boolean,default:!0},leftpanel:{type:Boolean,default:!0},docTitle:{type:String},docIcon:{type:String},doc:{type:Boolean,default:!0},docImageDimensions:{type:Object,default:function(){return{width:36,height:40}}}}},img="data:image/svg+xml,%3csvg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1.646 0.703613C0.736857 0.703613 0 1.41318 0 2.28865V7.78524C0 8.66071 0.736857 9.37028 1.646 9.37028H4.09065C4.03111 9.05802 4 8.73617 4 8.40732H3.75V1.66658H10.354C10.7109 1.66658 11 1.94501 11 2.28865V3.31031C11.3486 3.40524 11.6832 3.53244 12 3.68835V2.28865C12 1.41318 11.2631 0.703613 10.354 0.703613H1.646ZM2.75 1.66658V8.40732H1.646C1.28914 8.40732 1 8.12888 1 7.78524V2.28865C1 1.94501 1.28914 1.66658 1.646 1.66658H2.75Z' fill='%2301B2AA'/%3e%3cpath d='M9.4999 7.5185C8.9899 7.5185 8.57689 7.91621 8.57689 8.40732C8.57689 8.89843 8.9899 9.29613 9.4999 9.29613C10.0099 9.29613 10.4229 8.89843 10.4229 8.40732C10.4229 7.91621 10.0099 7.5185 9.4999 7.5185Z' fill='%2301B2AA'/%3e%3cpath d='M9.5 12.7406C11.985 12.7406 14 10.8003 14 8.40732C14 6.01435 11.985 4.07398 9.5 4.07398C7.015 4.07398 5 6.01435 5 8.40732C5 10.8003 7.015 12.7406 9.5 12.7406ZM9.5029 5.51843C9.7289 5.52132 9.9539 5.54635 10.1739 5.59354C10.2699 5.61376 10.3419 5.69176 10.3529 5.78613L10.4049 6.23872C10.4289 6.44672 10.6109 6.60369 10.8279 6.60369C10.8859 6.60369 10.9439 6.59213 10.9979 6.56902L11.4289 6.38702C11.5189 6.34947 11.6229 6.36969 11.6899 6.43902C12.0009 6.75969 12.2329 7.14391 12.3679 7.5628C12.3969 7.65332 12.3639 7.75154 12.2849 7.80739L11.9029 8.07895C11.7939 8.15598 11.7299 8.27828 11.7299 8.40828C11.7299 8.53828 11.7939 8.66058 11.9039 8.73858L12.2859 9.01013C12.3649 9.06598 12.3989 9.16421 12.3699 9.25472C12.2349 9.67361 12.0029 10.0578 11.6919 10.3785C11.6249 10.4469 11.5199 10.4681 11.4309 10.4305L10.9979 10.2475C10.8739 10.1955 10.7319 10.2032 10.6149 10.2678C10.4979 10.3332 10.4199 10.4478 10.4049 10.5769L10.3529 11.0295C10.3419 11.1229 10.2719 11.1999 10.1769 11.2211C9.7309 11.3232 9.2669 11.3232 8.8209 11.2211C8.7259 11.1989 8.6559 11.1229 8.6449 11.0295L8.5929 10.5778C8.5779 10.4488 8.4999 10.3342 8.3829 10.2697C8.2659 10.2052 8.1239 10.1975 8.0009 10.2495L7.56789 10.4324C7.4779 10.47 7.3739 10.4498 7.3069 10.3804C6.9959 10.0598 6.7639 9.67554 6.62889 9.25569C6.5999 9.16517 6.6339 9.06695 6.7129 9.01109L7.09589 8.73954C7.2049 8.6625 7.2689 8.54021 7.2689 8.41021C7.2689 8.28021 7.2049 8.15791 7.09589 8.07991L6.71389 7.80932C6.6349 7.75346 6.6009 7.65524 6.6299 7.56472C6.7649 7.14583 6.99689 6.76161 7.30789 6.44095C7.3749 6.37258 7.4799 6.35139 7.5689 6.38895L7.9999 6.57095C8.1239 6.62295 8.26589 6.61524 8.38389 6.54976C8.5009 6.48428 8.5789 6.36969 8.59389 6.23969L8.6459 5.78806C8.6569 5.69369 8.7289 5.61665 8.8249 5.59546C9.0459 5.54828 9.2709 5.52324 9.5019 5.52035L9.5029 5.51843Z' fill='%2301B2AA'/%3e%3c/svg%3e",_hoisted_1$5=createElementVNode("img",{src:img$1},null,-1),_hoisted_2$3=[_hoisted_1$5],_hoisted_3={class:"content"},_hoisted_4=createElementVNode("div",{class:"row items-center q-gutter-sm no-wrap"},[createElementVNode("img",{src:img,width:"15",height:"16"}),createElementVNode("span",{class:"btn-solution-text"},"Dataiku Solutions")],-1),_hoisted_5={class:"flex row items-center q-gutter-sm q-mb-lg"},_hoisted_6=["src","width","height"],_hoisted_7={class:"dku-large-title-sb"},_hoisted_8={class:"doc-body"},_hoisted_9=createElementVNode("div",{class:"doc-footer flex row items-center"},[createElementVNode("span",{class:"doc-footer__icon"},[createElementVNode("img",{src:img,width:"14",height:"12.5"})]),createElementVNode("span",{class:"doc-footer__text dku-tiny-text-sb"},"Dataiku Solutions")],-1);function render$c(e,t,o,r,n,s){var l=resolveComponent("QHeader"),i=resolveComponent("QDrawer"),a=resolveComponent("QBtn"),c=resolveComponent("QCard"),d=resolveComponent("QPageContainer"),u=resolveComponent("QLayout");return openBlock(),createBlock(u,{view:"lHh LpR lFf",class:"bg-white"},{default:withCtx(function(){return[o.leftpanel?(openBlock(),createElementBlock("div",{key:0,class:"toggle-left-button",style:normalizeStyle({left:s.leftDist+"px"})},[createElementVNode("div",{onClick:t[0]||(t[0]=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return s.toggleLeftPanel&&s.toggleLeftPanel.apply(s,e)})},_hoisted_2$3)],4)):createCommentVNode("",!0),o.header?(openBlock(),createBlock(l,{key:1,bordered:"",class:"bg-white bs-header"},{default:withCtx(function(){return[renderSlot(e.$slots,"header")]}),_:3})):createCommentVNode("",!0),o.leftpanel?(openBlock(),createBlock(i,{key:2,modelValue:n.showLeftPanel,"onUpdate:modelValue":t[1]||(t[1]=function(e){return n.showLeftPanel=e}),side:"left",bordered:"",behavior:"desktop"},{default:withCtx(function(){return[renderSlot(e.$slots,"leftpanel")]}),_:3},8,["modelValue"])):createCommentVNode("",!0),createVNode(d,null,{default:withCtx(function(){return[createElementVNode("div",_hoisted_3,[o.doc?(openBlock(),createBlock(a,{key:0,unelevated:"",outline:"","no-caps":"","no-wrap":"",class:"btn-solution absolute",square:"",onClick:s.toggleDoc},{default:withCtx(function(){return[_hoisted_4]}),_:1},8,["onClick"])):createCommentVNode("",!0),o.doc&&n.openDoc?(openBlock(),createBlock(c,{key:1,class:"doc-content flex row"},{default:withCtx(function(){return[createElementVNode("div",_hoisted_5,[o.docIcon?(openBlock(),createElementBlock("img",{key:0,src:o.docIcon,width:o.docImageDimensions.width,height:o.docImageDimensions.height},null,8,_hoisted_6)):createCommentVNode("",!0),createElementVNode("span",_hoisted_7,toDisplayString(o.docTitle),1)]),createElementVNode("div",_hoisted_8,[renderSlot(e.$slots,"documentation")]),_hoisted_9]}),_:3})):createCommentVNode("",!0),renderSlot(e.$slots,"content")])]}),_:3})]}),_:3})}script$c.render=render$c;var useSizeDefaults={xs:18,sm:22,md:26,lg:30,xl:34},fontSize=function(e,t){return void 0===t&&(t=useSizeDefaults),void 0!==e?e in t?t[e]+"px":e:null},useToggleProps={size:{type:String,default:"sm"},modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},labelLeft:String,labelRight:String,labelClass:{type:String,default:"dku-text"},color:{type:String,default:"rgba(111, 125, 137, 0.8)"},disable:Boolean,tabindex:[String,Number]},useToggleEmits=["update:modelValue"];function stopAndPrevent(e){!1!==e.cancelable&&e.preventDefault(),e.stopPropagation()}var script$b={name:"BsToggle",data:function(){return{}},props:Object.assign({},useToggleProps),emits:useToggleEmits,computed:{modelIsArray:function(){return void 0!==this.val&&Array.isArray(this.modelValue)},index:function(){var t=this.val;return!0===this.modelIsArray?this.modelValue.findIndex(function(e){return e===t}):-1},isTrue:function(){return!0===this.modelIsArray?-1<this.index:this.modelValue===this.trueValue},isFalse:function(){return!0===this.modelIsArray?-1===this.index:this.modelValue===this.falseValue},tabIndex:function(){return!0===this.disable?-1:this.tabindex||0},fontSize:function(){return fontSize(this.size)}},methods:{getNextValue:function(){var e;return!0===this.modelIsArray?!0===this.isTrue?((e=this.modelValue.slice()).splice(this.index,1),e):this.modelValue.concat([this.val]):!0===this.isTrue?this.falseValue:!0===this.isFalse?this.trueValue:void 0},onClick:function(e){void 0!==e&&stopAndPrevent(e),!0!==this.disable&&(console.log("next value"),console.log(this.isTrue),console.log(this.getNextValue()),this.$emit("update:modelValue",this.getNextValue(),e))},onKeydown:function(e){13!==e.keyCode&&32!==e.keyCode||stopAndPrevent(e)},onKeyup:function(e){13!==e.keyCode&&32!==e.keyCode||this.onClick(e)}}},_hoisted_1$4=["checked","value"],_hoisted_2$2=["aria-checked","aria-disabled","aria-readonly","tabindex"];function render$b(e,t,o,r,n,s){return openBlock(),createElementBlock("div",{class:normalizeClass([{"bs-toggle--is-disabled":e.disable},"bs-toggle"]),style:normalizeStyle({"font-size":s.fontSize})},[e.labelLeft?(openBlock(),createElementBlock("label",{key:0,class:normalizeClass(["bs-toggle__label",[e.labelClass]])},toDisplayString(e.labelLeft),3)):createCommentVNode("",!0),createElementVNode("input",{type:"checkbox",checked:!0===s.isTrue,value:!0===s.modelIsArray?e.val:e.trueValue,class:"bs-toggle__input"},null,8,_hoisted_1$4),createElementVNode("div",{"aria-checked":!0===s.isTrue,"aria-disabled":e.disable,"aria-readonly":e.disable,class:normalizeClass(["bs-toggle__content",!0===s.isTrue?"bs-toggle__content__active":""]),style:normalizeStyle({"background-color":!0===s.isTrue?e.color:""}),role:"checkbox",onClick:t[0]||(t[0]=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return s.onClick&&s.onClick.apply(s,e)}),onKeydown:t[1]||(t[1]=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return s.onKeydown&&s.onKeydown.apply(s,e)}),onKeyup:t[2]||(t[2]=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return s.onKeyup&&s.onKeyup.apply(s,e)}),tabindex:s.tabIndex},null,46,_hoisted_2$2),e.labelRight?(openBlock(),createElementBlock("label",{key:1,class:normalizeClass(["bs-toggle__label",[e.labelClass]])},toDisplayString(e.labelRight),3)):createCommentVNode("",!0)],6)}script$b.render=render$b;var script$a={name:"BsSelect",data:function(){return{width:0,allOptions:JSON.parse(JSON.stringify(this.$attrs.options)),bsOptions:JSON.parse(JSON.stringify(this.$attrs.options))}},props:{bsLabel:{type:String},placeHolder:{type:String},filter:{type:Boolean,default:!0}},components:{QSelect:QSelect},methods:{popupShow:function(){this.width=this.$refs.bsSelect.$el.offsetWidth},popupHide:function(){this.width=0},filterFn:function(e,t,o){var r=this;t(function(){var t;""===e?r.bsOptions=r.allOptions:(t=e.toLowerCase(),r.allOptions.some(function(e){return"object"==typeof e&&!Array.isArray(e)&&null!==e})?r.bsOptions=r.allOptions.filter(function(e){return-1<(e.label||"").toLowerCase().indexOf(t)}):r.bsOptions=r.allOptions.filter(function(e){return-1<e.toLowerCase().indexOf(t)}))})}},computed:{popupStyle:function(){return{width:this.width,maxWidth:this.width,wordBreak:"break-all"}},computedLabel:function(){if(this.placeHolder&&!this.$attrs.modelValue)return this.placeHolder}}},_hoisted_1$3={key:0,class:"bs-select__label dss-caption-400 q-mb-xs"};function render$a(o,e,t,r,n,s){var l=resolveComponent("QSelect");return openBlock(),createElementBlock("div",null,[t.bsLabel?(openBlock(),createElementBlock("label",_hoisted_1$3,toDisplayString(t.bsLabel),1)):createCommentVNode("",!0),createVNode(l,mergeProps({ref:"bsSelect"},o.$attrs,{options:n.bsOptions,"dropdown-icon":"r_expand_more",class:"bs-select",outlined:"",dense:"","use-input":t.filter,"input-debounce":"0","popup-content-class":"bs-select__popup dds-text-400",onPopupShow:s.popupShow,onPopupHide:s.popupHide,"popup-content-style":s.popupStyle,label:s.computedLabel,"label-color":"#CCCCCC",onFilter:s.filterFn}),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040,["options","use-input","onPopupShow","onPopupHide","popup-content-style","label","onFilter"])])}script$a.render=render$a;var script$9={name:"BsButton",components:{QBtn:QBtn}};function render$9(o,e,t,r,n,s){var l=resolveComponent("QBtn");return openBlock(),createBlock(l,mergeProps(o.$attrs,{unelevated:""}),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$9.render=render$9;var script$8={name:"BsTooltip",components:{QTooltip:QTooltip}};function render$8(o,e,t,r,n,s){var l=resolveComponent("QTooltip");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$8.render=render$8;var script$7={name:"BsSlider",components:{QSlider:QSlider},props:{sliderWidth:{type:Number,default:192}},computed:{inputData:function(){return{value:this.$attrs.modelValue,min:this.$attrs.min,max:this.$attrs.max,step:this.$attrs.step}}},methods:{updateSliderFromInput:function(e){e=Number(e.target.value);(e=e<this.$attrs.min?this.$attrs.min:e)>this.$attrs.max&&(e=this.$attrs.max),this.$emit("update:model-value",e)}}},_hoisted_1$2={class:"flex row bs-slider no-wrap"},_hoisted_2$1=["value","min","max","step"];function render$7(o,e,t,r,n,s){var l=resolveComponent("QSlider");return openBlock(),createElementBlock("div",_hoisted_1$2,[createVNode(l,mergeProps(o.$attrs,{style:{width:t.sliderWidth+"px"},"thumb-size":"15px","track-size":"3.5px"}),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040,["style"]),createElementVNode("input",{class:"bs-slider__input dku-text",type:"number",value:s.inputData.value,onInput:e[0]||(e[0]=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];return s.updateSliderFromInput&&s.updateSliderFromInput.apply(s,e)}),min:s.inputData.min,max:s.inputData.max,step:s.inputData.step},null,40,_hoisted_2$1)])}script$7.render=render$7;var script$6={name:"BsRange",components:{QRange:QRange}};function render$6(o,e,t,r,n,s){var l=resolveComponent("QRange");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$6.render=render$6;var script$5={name:"BsSpinner",components:{QSpinner:QSpinner}};function render$5(o,e,t,r,n,s){var l=resolveComponent("QSpinner");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$5.render=render$5;var script$4={name:"BsTable",components:{QTable:QTable}};function render$4(o,e,t,r,n,s){var l=resolveComponent("QTable");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$4.render=render$4;var script$3={name:"BsImg",components:{QImg:QImg}};function render$3(o,e,t,r,n,s){var l=resolveComponent("QImg");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$3.render=render$3;var script$2={name:"BsIcon",components:{QIcon:QIcon}};function render$2(o,e,t,r,n,s){var l=resolveComponent("QIcon");return openBlock(),createBlock(l,normalizeProps(guardReactiveProps(o.$attrs)),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040)}script$2.render=render$2;var script$1={name:"BsCheckbox",components:{QCheckbox:QCheckbox},props:{hint:{type:String}},computed:{labelFromHint:function(){return this.$attrs.label||this.hint||null},isHintOnly:function(){return!this.$attrs.label&&this.hint},isDisabled:function(){return null!=this.$attrs.disable}}},_hoisted_1$1={key:0,class:"dku-tiny-text bs-checkbox__hint"};function render$1(o,e,t,r,n,s){var l=resolveComponent("QCheckbox");return openBlock(),createElementBlock("div",{class:normalizeClass(["bs-checkbox",{hint:s.isHintOnly,disabled:s.isDisabled}])},[createVNode(l,mergeProps(o.$attrs,{size:"29.57px",tabindex:0,label:s.labelFromHint}),createSlots({_:2},[renderList(o.$slots,function(e,t){return{name:t,fn:withCtx(function(e){return[renderSlot(o.$slots,t,normalizeProps(guardReactiveProps(e||{})))]})}})]),1040,["label"]),t.hint&&o.$attrs.label?(openBlock(),createElementBlock("div",_hoisted_1$1,toDisplayString(t.hint),1)):createCommentVNode("",!0)],2)}script$1.render=render$1;var script={name:"BsDateRange",components:{QInput:QInput,QDate:QDate,QPopupProxy:QPopupProxy,QIcon:QIcon,QBtn:QBtn},props:{bsLabel:{type:String}},computed:{inputValue:function(){return this.$attrs.modelValue&&this.$attrs.modelValue.from&&this.$attrs.modelValue.to?this.$attrs.modelValue.from+" - "+this.$attrs.modelValue.to:""}}},_hoisted_1={key:0,class:"bs-date-range__label dss-caption-400 q-mb-xs"},_hoisted_2={class:"row items-center justify-end"};function render(e,t,o,r,n,s){var l=resolveComponent("QBtn"),i=resolveComponent("QDate"),a=resolveComponent("QPopupProxy"),c=resolveComponent("QIcon"),d=resolveComponent("QInput"),u=resolveDirective("close-popup");return openBlock(),createElementBlock("div",null,[o.bsLabel?(openBlock(),createElementBlock("label",_hoisted_1,toDisplayString(o.bsLabel),1)):createCommentVNode("",!0),createVNode(d,{dense:"",outlined:"",readonly:"",modelValue:s.inputValue,"onUpdate:modelValue":t[0]||(t[0]=function(e){return s.inputValue=e})},{append:withCtx(function(){return[createVNode(c,{name:"event",class:"cursor-pointer"},{default:withCtx(function(){return[createVNode(a,{cover:"","transition-show":"scale","transition-hide":"scale"},{default:withCtx(function(){return[createVNode(i,mergeProps({range:""},e.$attrs),{default:withCtx(function(){return[createElementVNode("div",_hoisted_2,[withDirectives(createVNode(l,{label:"Close",color:"primary",flat:""},null,512),[[u]])])]}),_:1},16)]}),_:1})]}),_:1})]}),_:1},8,["modelValue"])])}script.render=render;var components=Object.freeze({__proto__:null,BsLayoutDefault:script$c,BsToggle:script$b,BsSelect:script$a,BsButton:script$9,BsTooltip:script$8,BsSlider:script$7,BsRange:script$6,BsSpinner:script$5,BsTable:script$4,BsImg:script$3,BsIcon:script$2,BsCheckbox:script$1,BsDateRange:script}),QuasarBs={version:"1.3",install:function(e){installApp(e,{components:components})}},version="1.3";export{script$9 as BsButton,script$1 as BsCheckbox,script as BsDateRange,script$2 as BsIcon,script$3 as BsImg,script$c as BsLayoutDefault,script$6 as BsRange,script$a as BsSelect,script$7 as BsSlider,script$5 as BsSpinner,script$4 as BsTable,script$b as BsToggle,script$8 as BsTooltip,QuasarBs,version};