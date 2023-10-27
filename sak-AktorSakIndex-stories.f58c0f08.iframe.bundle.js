"use strict";(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[3028],{"./packages/kodeverk/src/fagsakStatus.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={OPPRETTET:"OPPR",UNDER_BEHANDLING:"UBEH",LOPENDE:"LOP",AVSLUTTET:"AVSLU"}},"./packages/kodeverk/src/fagsakYtelseType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={ENGANGSSTONAD:"ES",FORELDREPENGER:"FP",SVANGERSKAPSPENGER:"SVP",PLEIEPENGER:"PSB",OMSORGSPENGER:"OMP",OMSORGSPENGER_MIDLERTIDIG_ALENE:"OMP_MA",OMSORGSPENGER_KRONISK_SYKT_BARN:"OMP_KS",OMSORGSPENGER_ALENE_OM_OMSORGEN:"OMP_AO",FRISINN:"FRISINN",PLEIEPENGER_SLUTTFASE:"PPN",OPPLAERINGSPENGER:"OLP"}},"./packages/kodeverk/src/relasjonsRolleType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={MOR:"MORA"}},"./packages/storybook/decorators/withRouter.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_router_dom__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-router/dist/index.js");const __WEBPACK_DEFAULT_EXPORT__=Story=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__.VA,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Story,null));try{withRouter.displayName="withRouter",withRouter.__docgenInfo={description:"",displayName:"withRouter",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/storybook/decorators/withRouter.tsx#withRouter"]={docgenInfo:withRouter.__docgenInfo,name:"withRouter",path:"packages/storybook/decorators/withRouter.tsx#withRouter"})}catch(__react_docgen_typescript_loader_error){}},"./packages/storybook/stories/sak/AktorSakIndex.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,default:()=>AktorSakIndex_stories,visSakerOpprettetPaAktor:()=>visSakerOpprettetPaAktor,visningAvUgyldigAktorId:()=>visningAvUgyldigAktorId});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-knobs/dist/index.js"),utils=__webpack_require__("./node_modules/@formatjs/intl/lib/src/utils.js"),provider=__webpack_require__("./node_modules/react-intl/lib/src/components/provider.js"),injectIntl=__webpack_require__("./node_modules/react-intl/lib/src/components/injectIntl.js"),message=__webpack_require__("./node_modules/react-intl/lib/src/components/message.js"),lib=__webpack_require__("./node_modules/nav-frontend-typografi/lib/index.js"),nav_frontend_lenkepanel_lib=__webpack_require__("./node_modules/nav-frontend-lenkepanel/lib/index.js"),nav_frontend_lenkepanel_lib_default=__webpack_require__.n(nav_frontend_lenkepanel_lib),react_router_dom_dist=__webpack_require__("./node_modules/react-router-dom/dist/index.js"),kodeverkTyper=__webpack_require__("./packages/kodeverk/src/kodeverkTyper.ts"),sak_visittkort=__webpack_require__("./packages/sak-visittkort/index.ts"),packages_utils=__webpack_require__("./packages/utils/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),aktoerGrid_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-aktor/src/components/aktoerGrid.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(aktoerGrid_module.Z,options);const components_aktoerGrid_module=aktoerGrid_module.Z&&aktoerGrid_module.Z.locals?aktoerGrid_module.Z.locals:void 0;var AktoerGrid=_ref=>{var{aktorInfo,alleKodeverk,finnPathToFagsak}=_ref,getKodeverknavn=(0,packages_utils.$E)(alleKodeverk,kodeverkTyper.Z);return react.createElement(react.Fragment,null,react.createElement(sak_visittkort.Z,{alleKodeverk,fagsakPerson:aktorInfo.person}),react.createElement("div",{className:components_aktoerGrid_module.list},aktorInfo.fagsaker.length?aktorInfo.fagsaker.map((fagsak=>react.createElement(nav_frontend_lenkepanel_lib_default(),{linkCreator:props=>react.createElement(react_router_dom_dist.rU,{to:finnPathToFagsak(fagsak.saksnummer),className:props.className},props.children),key:fagsak.saksnummer,href:"#",tittelProps:"normaltekst"},getKodeverknavn(fagsak.sakstype)," (".concat(fagsak.saksnummer,") "),getKodeverknavn(fagsak.status)))):react.createElement(message.Z,{id:"AktoerGrid.IngenFagsaker"})))};const components_AktoerGrid=AktoerGrid;try{AktoerGrid.displayName="AktoerGrid",AktoerGrid.__docgenInfo={description:"",displayName:"AktoerGrid",props:{aktorInfo:{defaultValue:null,description:"",name:"aktorInfo",required:!0,type:{name:"{ fagsaker: Readonly<{ saksnummer: string; sakstype: Readonly<{ kode: string; kodeverk: string; }>; relasjonsRolleType: Readonly<{ kode: string; kodeverk: string; }>; status: Readonly<{ ...; }>; ... 9 more ...; erPbSak?: boolean; }>[]; person: Readonly<...>; }"}},alleKodeverk:{defaultValue:null,description:"",name:"alleKodeverk",required:!0,type:{name:"{ [key: string]: KodeverkMedNavn[]; }"}},finnPathToFagsak:{defaultValue:null,description:"",name:"finnPathToFagsak",required:!0,type:{name:"(saksnummer: string) => string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-aktor/src/components/AktoerGrid.tsx#AktoerGrid"]={docgenInfo:AktoerGrid.__docgenInfo,name:"AktoerGrid",path:"packages/sak-aktor/src/components/AktoerGrid.tsx#AktoerGrid"})}catch(__react_docgen_typescript_loader_error){}const nb_NO_namespaceObject=JSON.parse('{"AktoerGrid.IngenFagsaker":"Har ingen fagsaker i fpsak","AktorSakIndex.UgyldigAktorId":"Ugyldig aktørId: {id}"}');var cache=(0,utils.Sn)(),intl=(0,provider.d)({locale:"nb-NO",messages:nb_NO_namespaceObject},cache),AktorSakIndex=_ref=>{var{valgtAktorId,aktorInfo,alleKodeverk,finnPathToFagsak}=_ref;return react.createElement(injectIntl.zt,{value:intl},aktorInfo&&react.createElement(components_AktoerGrid,{aktorInfo,alleKodeverk,finnPathToFagsak}),!aktorInfo&&react.createElement(lib.Normaltekst,null,react.createElement(message.Z,{id:"AktorSakIndex.UgyldigAktorId",values:{id:valgtAktorId}})))};const src_AktorSakIndex=AktorSakIndex;try{AktorSakIndex.displayName="AktorSakIndex",AktorSakIndex.__docgenInfo={description:"",displayName:"AktorSakIndex",props:{valgtAktorId:{defaultValue:null,description:"",name:"valgtAktorId",required:!0,type:{name:"string"}},aktorInfo:{defaultValue:null,description:"",name:"aktorInfo",required:!1,type:{name:"Readonly<{ fagsaker: Readonly<{ saksnummer: string; sakstype: Readonly<{ kode: string; kodeverk: string; }>; relasjonsRolleType: Readonly<{ kode: string; kodeverk: string; }>; status: Readonly<...>; ... 9 more ...; erPbSak?: boolean; }>[]; person: Readonly<...>; }>"}},alleKodeverk:{defaultValue:null,description:"",name:"alleKodeverk",required:!0,type:{name:"{ [key: string]: KodeverkMedNavn[]; }"}},finnPathToFagsak:{defaultValue:null,description:"",name:"finnPathToFagsak",required:!0,type:{name:"(saksnummer: string) => string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-aktor/src/AktorSakIndex.tsx#AktorSakIndex"]={docgenInfo:AktorSakIndex.__docgenInfo,name:"AktorSakIndex",path:"packages/sak-aktor/src/AktorSakIndex.tsx#AktorSakIndex"})}catch(__react_docgen_typescript_loader_error){}var personstatusType=__webpack_require__("./packages/kodeverk/src/personstatusType.ts"),fagsakYtelseType=__webpack_require__("./packages/kodeverk/src/fagsakYtelseType.ts"),relasjonsRolleType=__webpack_require__("./packages/kodeverk/src/relasjonsRolleType.ts"),fagsakStatus=__webpack_require__("./packages/kodeverk/src/fagsakStatus.ts"),alleKodeverk=__webpack_require__("./packages/storybook/stories/mocks/alleKodeverk.json"),withRouter=__webpack_require__("./packages/storybook/decorators/withRouter.tsx");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var fagsak={saksnummer:"35425245",sakstype:{kode:fagsakYtelseType.Z.FORELDREPENGER,kodeverk:""},relasjonsRolleType:{kode:relasjonsRolleType.Z.MOR,kodeverk:""},status:{kode:fagsakStatus.Z.UNDER_BEHANDLING,kodeverk:""},barnFodt:"2020-01-01",opprettet:"2020-01-01",endret:"2020-01-01",antallBarn:1,kanRevurderingOpprettes:!1,skalBehandlesAvInfotrygd:!1,dekningsgrad:100};const AktorSakIndex_stories={title:"sak/sak-aktor",component:src_AktorSakIndex,decorators:[dist.withKnobs,withRouter.Z]};var visSakerOpprettetPaAktor=()=>react.createElement(src_AktorSakIndex,{valgtAktorId:"123",aktorInfo:{fagsaker:[fagsak,_objectSpread({saksnummer:"123"},fagsak)],person:{erDod:!1,navn:"Espen Utvikler",alder:41,personnummer:"123456233",erKvinne:!1,personstatusType:{kode:personstatusType.Z.BOSATT,kodeverk:""}}},alleKodeverk,finnPathToFagsak:()=>"path"}),visningAvUgyldigAktorId=()=>react.createElement(src_AktorSakIndex,{valgtAktorId:"123",alleKodeverk,finnPathToFagsak:()=>"path"}),__namedExportsOrder=["visSakerOpprettetPaAktor","visningAvUgyldigAktorId"]},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-aktor/src/components/aktoerGrid.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js"),_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".f42cTmP6UXwOY2PZNB0P {\n  margin: auto;\n  padding-top: 20px;\n  width: 50%;\n}\n",""]),___CSS_LOADER_EXPORT___.locals={list:"f42cTmP6UXwOY2PZNB0P"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/nav-frontend-lenkepanel-style/src/index.less":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__)},"./node_modules/nav-frontend-lenkepanel/lib/Lenkepanel-base.js":function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k),Object.defineProperty(o,k2,{enumerable:!0,get:function(){return m[k]}})}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(o,v){Object.defineProperty(o,"default",{enumerable:!0,value:v})}:function(o,v){o.default=v}),__importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)"default"!==k&&Object.prototype.hasOwnProperty.call(mod,k)&&__createBinding(result,mod,k);return __setModuleDefault(result,mod),result},__rest=this&&this.__rest||function(s,e){var t={};for(var p in s)Object.prototype.hasOwnProperty.call(s,p)&&e.indexOf(p)<0&&(t[p]=s[p]);if(null!=s&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(p=Object.getOwnPropertySymbols(s);i<p.length;i++)e.indexOf(p[i])<0&&Object.prototype.propertyIsEnumerable.call(s,p[i])&&(t[p[i]]=s[p[i]])}return t},__importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const PT=__importStar(__webpack_require__("./node_modules/prop-types/index.js")),React=__importStar(__webpack_require__("./node_modules/react/index.js")),classnames_1=__importDefault(__webpack_require__("./node_modules/classnames/index.js"));__webpack_require__("./node_modules/nav-frontend-lenkepanel-style/src/index.less");const cls=(className,border)=>(0,classnames_1.default)("lenkepanel",className,{"lenkepanel--border":border});class LenkepanelBase extends React.Component{render(){const _a=this.props,{className,children,linkCreator=props=>React.createElement("a",Object.assign({},props),props.children),border}=_a,renderProps=__rest(_a,["className","children","linkCreator","border"]);return linkCreator(Object.assign(Object.assign({},renderProps),{className:cls(className,border),children:[children,React.createElement("span",{key:"indikator",className:"lenkepanel__indikator"})]}))}}LenkepanelBase.defaultProps={border:!1},LenkepanelBase.propTypes={className:PT.string,href:PT.string.isRequired,children:PT.oneOfType([PT.arrayOf(PT.node),PT.node]).isRequired,linkCreator:PT.func,border:PT.bool},LenkepanelBase.defaultProps={className:void 0,linkCreator:props=>React.createElement("a",Object.assign({},props),props.children),border:!1},exports.default=LenkepanelBase},"./node_modules/nav-frontend-lenkepanel/lib/index.js":function(__unused_webpack_module,exports,__webpack_require__){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k),Object.defineProperty(o,k2,{enumerable:!0,get:function(){return m[k]}})}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(o,v){Object.defineProperty(o,"default",{enumerable:!0,value:v})}:function(o,v){o.default=v}),__importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)"default"!==k&&Object.prototype.hasOwnProperty.call(mod,k)&&__createBinding(result,mod,k);return __setModuleDefault(result,mod),result},__rest=this&&this.__rest||function(s,e){var t={};for(var p in s)Object.prototype.hasOwnProperty.call(s,p)&&e.indexOf(p)<0&&(t[p]=s[p]);if(null!=s&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(p=Object.getOwnPropertySymbols(s);i<p.length;i++)e.indexOf(p[i])<0&&Object.prototype.propertyIsEnumerable.call(s,p[i])&&(t[p[i]]=s[p[i]])}return t},__importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.LenkepanelBase=void 0;const PT=__importStar(__webpack_require__("./node_modules/prop-types/index.js")),React=__importStar(__webpack_require__("./node_modules/react/index.js")),nav_frontend_typografi_1=__importDefault(__webpack_require__("./node_modules/nav-frontend-typografi/lib/index.js"));__webpack_require__("./node_modules/nav-frontend-lenkepanel-style/src/index.less");const Lenkepanel_base_1=__importDefault(__webpack_require__("./node_modules/nav-frontend-lenkepanel/lib/Lenkepanel-base.js"));class Lenkepanel extends React.PureComponent{render(){const _a=this.props,{children,tittelProps="undertittel"}=_a,renderProps=__rest(_a,["children","tittelProps"]),headingConfig={type:tittelProps,tag:"span"},heading=React.createElement(nav_frontend_typografi_1.default,Object.assign({key:"heading"},headingConfig,{className:"lenkepanel__heading"}),children);return React.createElement(Lenkepanel_base_1.default,Object.assign({},renderProps),heading)}}Lenkepanel.propTypes={className:PT.string,href:PT.string.isRequired,children:PT.oneOfType([PT.arrayOf(PT.node),PT.node]).isRequired,tittelProps:PT.string,linkCreator:PT.func},Lenkepanel.defaultProps={className:void 0,tittelProps:"undertittel",linkCreator:props=>React.createElement("a",Object.assign({},props),props.children)},exports.default=Lenkepanel;var Lenkepanel_base_2=__webpack_require__("./node_modules/nav-frontend-lenkepanel/lib/Lenkepanel-base.js");Object.defineProperty(exports,"LenkepanelBase",{enumerable:!0,get:function(){return __importDefault(Lenkepanel_base_2).default}})}}]);