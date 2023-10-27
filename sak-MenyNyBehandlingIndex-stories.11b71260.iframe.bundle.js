"use strict";(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[9145],{"./node_modules/@storybook/addon-actions/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{aD:()=>chunk_AY7I2SME.aD});var chunk_AY7I2SME=__webpack_require__("./node_modules/@storybook/addon-actions/dist/chunk-AY7I2SME.mjs")},"./packages/kodeverk/src/behandlingArsakType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={FEIL_I_LOVANDVENDELSE:"RE-LOV",FEIL_REGELVERKSFORSTAELSE:"RE-RGLF",FEIL_ELLER_ENDRET_FAKTA:"RE-FEFAKTA",FEIL_PROSESSUELL:"RE-PRSSL",ETTER_KLAGE:"ETTER_KLAGE",ANNET:"RE-ANNET",KLAGE_U_INNTK:"RE-KLAG-U-INNTK",KLAGE_M_INNTK:"RE-KLAG-M-INNTK",MEDLEMSKAP:"RE-MDL",OPPTJENING:"RE-OPTJ",FORDELING:"RE-FRDLING",INNTEKT:"RE-INNTK",FØDSEL:"RE-FØDSEL",DØD:"RE-DØD",SØKERS_RELASJON:"RE-SRTB",SØKNADSFRIST:"RE-FRIST",BEREEGNINGSGRUNNLAG:"RE-BER-GRUN",RE_TILSTØTENDE_YTELSE_INNVILGET:"RE-TILST-YT-INNVIL",RE_ENDRING_BEREGNINGSGRUNNLAG:"RE-ENDR-BER-GRUN",RE_TILSTØTENDE_YTELSE_OPPHØRT:"RE-TILST-YT-OPPH",RE_ENDRING_FRA_BRUKER:"RE-END-FRA-BRUKER",RE_ENDRET_INNTEKTSMELDING:"RE-END-INNTEKTSMELD",RE_KLAGE_KA:"RE_KLAGE_KA",RE_KLAGE_NFP:"RE_KLAGE_NFP",RE_VILKÅR:"RE_VILKÅR",RE_FORELDELSE:"RE_FORELDELSE",RE_FEILUTBETALT_BELØP_REDUSERT:"RE_FEILUTBETALT_BELØP_REDUSERT",UNNT_GENERELL:"UNNT_GENERELL"}},"./packages/kodeverk/src/behandlingType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__,q:()=>erTilbakekrevingType});var behandlingType={FORSTEGANGSSOKNAD:"BT-002",KLAGE:"BT-003",UNNTAK:"BT-010",REVURDERING:"BT-004",SOKNAD:"BT-005",DOKUMENTINNSYN:"BT-006",TILBAKEKREVING:"BT-007",ANKE:"BT-008",TILBAKEKREVING_REVURDERING:"BT-009"},erTilbakekrevingType=type=>behandlingType.TILBAKEKREVING===(null==type?void 0:type.kode)||behandlingType.TILBAKEKREVING_REVURDERING===(null==type?void 0:type.kode);const __WEBPACK_DEFAULT_EXPORT__=behandlingType},"./packages/kodeverk/src/fagsakYtelseType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={ENGANGSSTONAD:"ES",FORELDREPENGER:"FP",SVANGERSKAPSPENGER:"SVP",PLEIEPENGER:"PSB",OMSORGSPENGER:"OMP",OMSORGSPENGER_MIDLERTIDIG_ALENE:"OMP_MA",OMSORGSPENGER_KRONISK_SYKT_BARN:"OMP_KS",OMSORGSPENGER_ALENE_OM_OMSORGEN:"OMP_AO",FRISINN:"FRISINN",PLEIEPENGER_SLUTTFASE:"PPN",OPPLAERINGSPENGER:"OLP"}},"./packages/storybook/decorators/withRedux.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_k9_sak_web_sak_app_src_configureStore__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/sak-app/src/configureStore.ts");const __WEBPACK_DEFAULT_EXPORT__=Story=>{var store=(0,_k9_sak_web_sak_app_src_configureStore__WEBPACK_IMPORTED_MODULE_2__.Z)();return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.zt,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(Story,null))};try{withRedux.displayName="withRedux",withRedux.__docgenInfo={description:"",displayName:"withRedux",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/storybook/decorators/withRedux.tsx#withRedux"]={docgenInfo:withRedux.__docgenInfo,name:"withRedux",path:"packages/storybook/decorators/withRedux.tsx#withRedux"})}catch(__react_docgen_typescript_loader_error){}},"./packages/storybook/stories/sak/MenyNyBehandlingIndex.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,default:()=>MenyNyBehandlingIndex_stories,visMenyForÅLageNyBehandling:()=>visMenyForÅLageNyBehandling,visMenyForÅLageNyTilbakekrevingsbehandling:()=>visMenyForÅLageNyTilbakekrevingsbehandling});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),addon_knobs_dist=__webpack_require__("./node_modules/@storybook/addon-knobs/dist/index.js"),behandlingArsakType=__webpack_require__("./packages/kodeverk/src/behandlingArsakType.ts"),behandlingType=__webpack_require__("./packages/kodeverk/src/behandlingType.ts"),fagsakYtelseType=__webpack_require__("./packages/kodeverk/src/fagsakYtelseType.ts"),utils=__webpack_require__("./node_modules/@formatjs/intl/lib/src/utils.js"),provider=__webpack_require__("./node_modules/react-intl/lib/src/components/provider.js"),injectIntl=__webpack_require__("./node_modules/react-intl/lib/src/components/injectIntl.js"),grid=__webpack_require__("./node_modules/nav-frontend-grid/lib/grid.js"),lib=__webpack_require__("./node_modules/nav-frontend-knapper/lib/index.js"),nav_frontend_modal_lib=__webpack_require__("./node_modules/nav-frontend-modal/lib/index.js"),nav_frontend_modal_lib_default=__webpack_require__.n(nav_frontend_modal_lib),nav_frontend_typografi_lib=__webpack_require__("./node_modules/nav-frontend-typografi/lib/index.js"),message=__webpack_require__("./node_modules/react-intl/lib/src/components/message.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),formValueSelector=__webpack_require__("./node_modules/redux-form/es/formValueSelector.js"),reduxForm=__webpack_require__("./node_modules/redux-form/es/reduxForm.js"),reselect_es=__webpack_require__("./node_modules/reselect/es/index.js"),innvilget_valgt=__webpack_require__("./packages/assets/images/innvilget_valgt.svg"),packages_form=__webpack_require__("./packages/form/index.jsx"),shared_components=__webpack_require__("./packages/shared-components/index.ts"),packages_utils=__webpack_require__("./packages/utils/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),nyBehandlingModal_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-meny-ny-behandling/src/components/nyBehandlingModal.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(nyBehandlingModal_module.Z,options);const components_nyBehandlingModal_module=nyBehandlingModal_module.Z&&nyBehandlingModal_module.Z.locals?nyBehandlingModal_module.Z.locals:void 0;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var NyBehandlingModal=_ref=>{var{handleSubmit,cancelEvent,intl,behandlingTyper,behandlingArsakTyper,enabledBehandlingstyper,behandlingUuid,sjekkOmTilbakekrevingKanOpprettes,sjekkOmTilbakekrevingRevurderingKanOpprettes,uuid,saksnummer,erTilbakekrevingAktivert,valgtBehandlingTypeKode,erTilbakekreving}=_ref;return(0,react.useEffect)((()=>{erTilbakekrevingAktivert&&(void 0!==uuid&&sjekkOmTilbakekrevingKanOpprettes({saksnummer,uuid}),erTilbakekreving&&sjekkOmTilbakekrevingRevurderingKanOpprettes({uuid:behandlingUuid}))}),[]),react.createElement(nav_frontend_modal_lib_default(),{className:components_nyBehandlingModal_module.modal,isOpen:!0,closeButton:!1,contentLabel:intl.formatMessage({id:"MenyNyBehandlingIndex.ModalDescription"}),onRequestClose:cancelEvent,shouldCloseOnOverlayClick:!1},react.createElement("form",{onSubmit:handleSubmit},react.createElement(grid.Row,null,react.createElement(grid.Column,{xs:"1"},react.createElement(shared_components.Ee,{className:components_nyBehandlingModal_module.image,src:innvilget_valgt.Z}),react.createElement("div",{className:components_nyBehandlingModal_module.divider})),react.createElement(grid.Column,{xs:"11"},react.createElement("div",{className:components_nyBehandlingModal_module.label},react.createElement(nav_frontend_typografi_lib.Element,null,react.createElement(message.Z,{id:"MenyNyBehandlingIndex.OpprettNyForstegangsbehandling"}))),react.createElement(shared_components.P6,{sixteenPx:!0}),react.createElement(shared_components.P6,{sixteenPx:!0}),react.createElement(packages_form.mg,{name:"behandlingType",label:"",placeholder:intl.formatMessage({id:"MenyNyBehandlingIndex.SelectBehandlingTypePlaceholder"}),validate:[packages_utils.C1],selectValues:behandlingTyper.map((bt=>((bt,enabledBehandlingstyper,intl)=>{var navn=bt.kode===behandlingType.Z.REVURDERING?intl.formatMessage({id:"MenyNyBehandlingIndex.OpprettRevurdering"}):bt.navn,isEnabled=enabledBehandlingstyper.some((b=>b.kode===bt.kode));return react.createElement("option",{key:bt.kode,value:bt.kode,disabled:!isEnabled}," ".concat(navn," "))})(bt,enabledBehandlingstyper,intl))),bredde:"l"}),react.createElement(shared_components.P6,{eightPx:!0}),valgtBehandlingTypeKode===behandlingType.Z.FORSTEGANGSSOKNAD&&react.createElement(packages_form.ji,{name:"nyBehandlingEtterKlage",label:intl.formatMessage({id:"MenyNyBehandlingIndex.NyBehandlingEtterKlage"})}),behandlingArsakTyper.length>0&&react.createElement(packages_form.mg,{name:"behandlingArsakType",label:"",placeholder:intl.formatMessage({id:"MenyNyBehandlingIndex.SelectBehandlingArsakTypePlaceholder"}),validate:[packages_utils.C1],selectValues:behandlingArsakTyper.map((b=>react.createElement("option",{key:b.kode,value:b.kode},b.navn)))}),react.createElement("div",{className:components_nyBehandlingModal_module.right},react.createElement(lib.Hovedknapp,{mini:!0,className:components_nyBehandlingModal_module.button},react.createElement(message.Z,{id:"MenyNyBehandlingIndex.Ok"})),react.createElement(lib.Knapp,{htmlType:"button",mini:!0,onClick:cancelEvent,className:components_nyBehandlingModal_module.cancelButton},react.createElement(message.Z,{id:"MenyNyBehandlingIndex.Avbryt"})))))))},formName="NyBehandlingModal",manuelleRevurderingsArsaker=[behandlingArsakType.Z.BEREEGNINGSGRUNNLAG,behandlingArsakType.Z.MEDLEMSKAP,behandlingArsakType.Z.OPPTJENING,behandlingArsakType.Z.FORDELING,behandlingArsakType.Z.INNTEKT,behandlingArsakType.Z.DØD,behandlingArsakType.Z.SØKERS_RELASJON,behandlingArsakType.Z.SØKNADSFRIST,behandlingArsakType.Z.KLAGE_U_INNTK,behandlingArsakType.Z.KLAGE_M_INNTK,behandlingArsakType.Z.ANNET,behandlingArsakType.Z.FEIL_I_LOVANDVENDELSE,behandlingArsakType.Z.FEIL_ELLER_ENDRET_FAKTA,behandlingArsakType.Z.FEIL_REGELVERKSFORSTAELSE,behandlingArsakType.Z.FEIL_PROSESSUELL,behandlingArsakType.Z.ETTER_KLAGE],unntakVurderingsArsaker=[behandlingArsakType.Z.UNNT_GENERELL,behandlingArsakType.Z.ANNET],tilbakekrevingRevurderingArsaker=[behandlingArsakType.Z.RE_FORELDELSE,behandlingArsakType.Z.RE_VILKÅR,behandlingArsakType.Z.RE_KLAGE_KA,behandlingArsakType.Z.RE_KLAGE_NFP,behandlingArsakType.Z.RE_FEILUTBETALT_BELØP_REDUSERT],getBehandlingAarsaker=(0,reselect_es.P1)([(_state,ownProps)=>ownProps.revurderingArsaker,(_state,ownProps)=>ownProps.tilbakekrevingRevurderingArsaker,state=>(0,formValueSelector.Z)(formName)(state,"behandlingType")],((alleRevurderingArsaker,alleTilbakekrevingRevurderingArsaker,valgtBehandlingType)=>valgtBehandlingType===behandlingType.Z.TILBAKEKREVING_REVURDERING?tilbakekrevingRevurderingArsaker.map((ar=>alleTilbakekrevingRevurderingArsaker.find((el=>el.kode===ar)))).filter((ar=>ar)):valgtBehandlingType===behandlingType.Z.REVURDERING?alleRevurderingArsaker.filter((bat=>manuelleRevurderingsArsaker.indexOf(bat.kode)>-1)).sort(((bat1,bat2)=>bat1.navn.localeCompare(bat2.navn))):valgtBehandlingType===behandlingType.Z.UNNTAK?alleRevurderingArsaker.filter((bat=>unntakVurderingsArsaker.indexOf(bat.kode)>-1)).sort(((bat1,bat2)=>bat1.navn.localeCompare(bat2.navn))):[])),getBehandlingTyper=(0,reselect_es.P1)([ownProps=>ownProps.behandlingstyper],(behandlingstyper=>behandlingstyper.sort(((bt1,bt2)=>bt1.navn.localeCompare(bt2.navn))))),getEnabledBehandlingstyper=(0,reselect_es.P1)([getBehandlingTyper,ownProps=>ownProps.behandlingOppretting,ownProps=>ownProps.kanTilbakekrevingOpprettes],(function(behandlingstyper,behandlingOppretting){var kanTilbakekrevingOpprettes=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{kanBehandlingOpprettes:!1,kanRevurderingOpprettes:!1},behandlingstyperSomErValgbare=behandlingstyper.filter((type=>((behandlingOppretting,behandlingTypeKode)=>behandlingOppretting.some((bo=>bo.behandlingType.kode===behandlingTypeKode&&bo.kanOppretteBehandling)))(behandlingOppretting,type.kode)));return kanTilbakekrevingOpprettes.kanBehandlingOpprettes&&behandlingstyperSomErValgbare.push(behandlingstyper.find((type=>type.kode===behandlingType.Z.TILBAKEKREVING))),kanTilbakekrevingOpprettes.kanRevurderingOpprettes&&behandlingstyperSomErValgbare.push(behandlingstyper.find((type=>type.kode===behandlingType.Z.TILBAKEKREVING_REVURDERING))),behandlingstyperSomErValgbare}));const components_NyBehandlingModal=(0,es.$j)(((initialState,initialOwnProps)=>{var onSubmit=values=>{var klageOnlyValues=(null==values?void 0:values.behandlingType)===behandlingType.Z.KLAGE?{aktørId:initialOwnProps.aktorId,behandlendeEnhetId:initialOwnProps.gjeldendeVedtakBehandlendeEnhetId}:{};initialOwnProps.submitCallback(_objectSpread(_objectSpread({},values),{},{eksternUuid:initialOwnProps.uuidForSistLukkede,fagsakYtelseType:initialOwnProps.ytelseType},klageOnlyValues))};return(state,ownProps)=>({onSubmit,behandlingTyper:getBehandlingTyper(ownProps),enabledBehandlingstyper:getEnabledBehandlingstyper(ownProps),uuid:ownProps.uuidForSistLukkede,behandlingArsakTyper:getBehandlingAarsaker(state,ownProps),valgtBehandlingTypeKode:(0,formValueSelector.Z)(formName)(state,"behandlingType"),erTilbakekreving:ownProps.behandlingType&&(ownProps.behandlingType.kode===behandlingType.Z.TILBAKEKREVING||ownProps.behandlingType.kode===behandlingType.Z.TILBAKEKREVING_REVURDERING)})}))((0,reduxForm.Z)({form:formName})((0,injectIntl.ZP)(NyBehandlingModal)));try{NyBehandlingModal.displayName="NyBehandlingModal",NyBehandlingModal.__docgenInfo={description:"NyBehandlingModal\n\nPresentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.\nVed å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.",displayName:"NyBehandlingModal",props:{ytelseType:{defaultValue:null,description:"",name:"ytelseType",required:!1,type:{name:"Readonly<{ kode: string; kodeverk: string; }>"}},saksnummer:{defaultValue:null,description:"",name:"saksnummer",required:!1,type:{name:"number"}},cancelEvent:{defaultValue:null,description:"",name:"cancelEvent",required:!1,type:{name:"() => void"}},submitCallback:{defaultValue:null,description:"",name:"submitCallback",required:!1,type:{name:"(data: { eksternUuid?: string; fagsakYtelseType: Readonly<{ kode: string; kodeverk: string; }>; } & FormValues) => void"}},behandlingOppretting:{defaultValue:null,description:"",name:"behandlingOppretting",required:!1,type:{name:"Readonly<{ behandlingType: Readonly<{ kode: string; kodeverk: string; }>; kanOppretteBehandling: boolean; }>[]"}},behandlingstyper:{defaultValue:null,description:"",name:"behandlingstyper",required:!1,type:{name:"KodeverkMedNavn[]"}},tilbakekrevingRevurderingArsaker:{defaultValue:null,description:"",name:"tilbakekrevingRevurderingArsaker",required:!1,type:{name:"KodeverkMedNavn[]"}},revurderingArsaker:{defaultValue:null,description:"",name:"revurderingArsaker",required:!1,type:{name:"KodeverkMedNavn[]"}},kanTilbakekrevingOpprettes:{defaultValue:null,description:"",name:"kanTilbakekrevingOpprettes",required:!1,type:{name:"{ kanBehandlingOpprettes: boolean; kanRevurderingOpprettes: boolean; }"}},behandlingType:{defaultValue:null,description:"",name:"behandlingType",required:!1,type:{name:"Readonly<{ kode: string; kodeverk: string; }>"}},behandlingId:{defaultValue:null,description:"",name:"behandlingId",required:!1,type:{name:"number"}},behandlingUuid:{defaultValue:null,description:"",name:"behandlingUuid",required:!1,type:{name:"string"}},uuidForSistLukkede:{defaultValue:null,description:"",name:"uuidForSistLukkede",required:!1,type:{name:"string"}},erTilbakekrevingAktivert:{defaultValue:null,description:"",name:"erTilbakekrevingAktivert",required:!1,type:{name:"boolean"}},sjekkOmTilbakekrevingKanOpprettes:{defaultValue:null,description:"",name:"sjekkOmTilbakekrevingKanOpprettes",required:!1,type:{name:"(params: { saksnummer: number; uuid: string; }) => void"}},sjekkOmTilbakekrevingRevurderingKanOpprettes:{defaultValue:null,description:"",name:"sjekkOmTilbakekrevingRevurderingKanOpprettes",required:!1,type:{name:"(params: { uuid: string; }) => void"}},aktorId:{defaultValue:null,description:"",name:"aktorId",required:!1,type:{name:"string"}},gjeldendeVedtakBehandlendeEnhetId:{defaultValue:null,description:"",name:"gjeldendeVedtakBehandlendeEnhetId",required:!1,type:{name:"string"}},behandlingTyper:{defaultValue:null,description:"",name:"behandlingTyper",required:!0,type:{name:"KodeverkMedNavn[]"}},enabledBehandlingstyper:{defaultValue:null,description:"",name:"enabledBehandlingstyper",required:!0,type:{name:"KodeverkMedNavn[]"}},uuid:{defaultValue:null,description:"",name:"uuid",required:!1,type:{name:"string"}},behandlingArsakTyper:{defaultValue:null,description:"",name:"behandlingArsakTyper",required:!0,type:{name:"KodeverkMedNavn[]"}},valgtBehandlingTypeKode:{defaultValue:null,description:"",name:"valgtBehandlingTypeKode",required:!0,type:{name:"string"}},erTilbakekreving:{defaultValue:null,description:"",name:"erTilbakekreving",required:!0,type:{name:"boolean"}},intl:{defaultValue:null,description:"",name:"intl",required:!0,type:{name:"IntlShape"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-meny-ny-behandling/src/components/NyBehandlingModal.tsx#NyBehandlingModal"]={docgenInfo:NyBehandlingModal.__docgenInfo,name:"NyBehandlingModal",path:"packages/sak-meny-ny-behandling/src/components/NyBehandlingModal.tsx#NyBehandlingModal"})}catch(__react_docgen_typescript_loader_error){}const nb_NO_namespaceObject=JSON.parse('{"MenyNyBehandlingIndex.NyForstegangsbehandling":"Opprett ny behandling","MenyNyBehandlingIndex.ModalDescription":"Ny behandling","MenyNyBehandlingIndex.OpprettRevurdering":"Revurderingsbehandling","MenyNyBehandlingIndex.OpprettUnntak":"Unntakssbehandling","MenyNyBehandlingIndex.OpprettNyForstegangsbehandling":"Opprett ny behandling","MenyNyBehandlingIndex.NyBehandlingEtterKlage":"Behandlingen opprettes som et resultat av klagebehandling","MenyNyBehandlingIndex.Ok":"OK","MenyNyBehandlingIndex.Avbryt":"Avbryt","MenyNyBehandlingIndex.SelectBehandlingTypePlaceholder":"Velg","MenyNyBehandlingIndex.SelectBehandlingArsakTypePlaceholder":"Velg årsak","ValidationMessage.NotEmpty":"Feltet må fylles ut"}');function MenyNyBehandlingIndex_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function MenyNyBehandlingIndex_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?MenyNyBehandlingIndex_ownKeys(Object(t),!0).forEach((function(r){MenyNyBehandlingIndex_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):MenyNyBehandlingIndex_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function MenyNyBehandlingIndex_defineProperty(obj,key,value){return(key=function MenyNyBehandlingIndex_toPropertyKey(arg){var key=function MenyNyBehandlingIndex_toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var TILBAKEKREVING_BEHANDLINGSTYPER=[behandlingType.Z.TILBAKEKREVING,behandlingType.Z.TILBAKEKREVING_REVURDERING],cache=(0,utils.Sn)(),intl=(0,provider.d)({locale:"nb-NO",messages:nb_NO_namespaceObject},cache),MenyNyBehandlingIndex=_ref=>{var{ytelseType,saksnummer,behandlingId,behandlingUuid,behandlingVersjon,behandlingType,lagNyBehandling,behandlingstyper,tilbakekrevingRevurderingArsaker,revurderingArsaker,behandlingOppretting,kanTilbakekrevingOpprettes,uuidForSistLukkede,erTilbakekrevingAktivert,sjekkOmTilbakekrevingKanOpprettes,sjekkOmTilbakekrevingRevurderingKanOpprettes,lukkModal,aktorId,gjeldendeVedtakBehandlendeEnhetId}=_ref,submit=(0,react.useCallback)((formValues=>{var isTilbakekreving=TILBAKEKREVING_BEHANDLINGSTYPER.includes(formValues.behandlingType),tilbakekrevingBehandlingId=behandlingId&&isTilbakekreving?{behandlingId}:{},params=MenyNyBehandlingIndex_objectSpread(MenyNyBehandlingIndex_objectSpread({saksnummer:saksnummer.toString()},tilbakekrevingBehandlingId),formValues);lagNyBehandling(formValues.behandlingType,params),lukkModal()}),[behandlingId,behandlingVersjon]);return react.createElement(injectIntl.zt,{value:intl},react.createElement(components_NyBehandlingModal,{ytelseType,saksnummer,cancelEvent:lukkModal,submitCallback:submit,behandlingOppretting,behandlingstyper,tilbakekrevingRevurderingArsaker,revurderingArsaker,kanTilbakekrevingOpprettes,behandlingType,behandlingId,behandlingUuid,uuidForSistLukkede,erTilbakekrevingAktivert,sjekkOmTilbakekrevingKanOpprettes,sjekkOmTilbakekrevingRevurderingKanOpprettes,aktorId,gjeldendeVedtakBehandlendeEnhetId}))};const src_MenyNyBehandlingIndex=MenyNyBehandlingIndex;try{MenyNyBehandlingIndex.displayName="MenyNyBehandlingIndex",MenyNyBehandlingIndex.__docgenInfo={description:"",displayName:"MenyNyBehandlingIndex",props:{ytelseType:{defaultValue:null,description:"",name:"ytelseType",required:!0,type:{name:"Readonly<{ kode: string; kodeverk: string; }>"}},saksnummer:{defaultValue:null,description:"",name:"saksnummer",required:!0,type:{name:"string"}},behandlingId:{defaultValue:null,description:"",name:"behandlingId",required:!1,type:{name:"number"}},behandlingUuid:{defaultValue:null,description:"",name:"behandlingUuid",required:!1,type:{name:"string"}},behandlingVersjon:{defaultValue:null,description:"",name:"behandlingVersjon",required:!1,type:{name:"number"}},behandlingType:{defaultValue:null,description:"",name:"behandlingType",required:!1,type:{name:"Readonly<{ kode: string; kodeverk: string; }>"}},lagNyBehandling:{defaultValue:null,description:"",name:"lagNyBehandling",required:!0,type:{name:"(behandlingTypeKode: string, data: any) => void"}},behandlingstyper:{defaultValue:null,description:"",name:"behandlingstyper",required:!0,type:{name:"KodeverkMedNavn[]"}},tilbakekrevingRevurderingArsaker:{defaultValue:null,description:"",name:"tilbakekrevingRevurderingArsaker",required:!0,type:{name:"KodeverkMedNavn[]"}},revurderingArsaker:{defaultValue:null,description:"",name:"revurderingArsaker",required:!0,type:{name:"KodeverkMedNavn[]"}},behandlingOppretting:{defaultValue:null,description:"",name:"behandlingOppretting",required:!0,type:{name:"Readonly<{ behandlingType: Readonly<{ kode: string; kodeverk: string; }>; kanOppretteBehandling: boolean; }>[]"}},kanTilbakekrevingOpprettes:{defaultValue:null,description:"",name:"kanTilbakekrevingOpprettes",required:!0,type:{name:"{ kanBehandlingOpprettes: boolean; kanRevurderingOpprettes: boolean; }"}},uuidForSistLukkede:{defaultValue:null,description:"",name:"uuidForSistLukkede",required:!1,type:{name:"string"}},erTilbakekrevingAktivert:{defaultValue:null,description:"",name:"erTilbakekrevingAktivert",required:!0,type:{name:"boolean"}},sjekkOmTilbakekrevingKanOpprettes:{defaultValue:null,description:"",name:"sjekkOmTilbakekrevingKanOpprettes",required:!0,type:{name:"(params: { saksnummer: number; uuid: string; }) => void"}},sjekkOmTilbakekrevingRevurderingKanOpprettes:{defaultValue:null,description:"",name:"sjekkOmTilbakekrevingRevurderingKanOpprettes",required:!0,type:{name:"(params: { uuid: string; }) => void"}},lukkModal:{defaultValue:null,description:"",name:"lukkModal",required:!0,type:{name:"() => void"}},aktorId:{defaultValue:null,description:"",name:"aktorId",required:!1,type:{name:"string"}},gjeldendeVedtakBehandlendeEnhetId:{defaultValue:null,description:"",name:"gjeldendeVedtakBehandlendeEnhetId",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-meny-ny-behandling/src/MenyNyBehandlingIndex.tsx#MenyNyBehandlingIndex"]={docgenInfo:MenyNyBehandlingIndex.__docgenInfo,name:"MenyNyBehandlingIndex",path:"packages/sak-meny-ny-behandling/src/MenyNyBehandlingIndex.tsx#MenyNyBehandlingIndex"})}catch(__react_docgen_typescript_loader_error){}var withRedux=__webpack_require__("./packages/storybook/decorators/withRedux.tsx");const MenyNyBehandlingIndex_stories={title:"sak/sak-meny-ny-behandling",component:src_MenyNyBehandlingIndex,decorators:[addon_knobs_dist.withKnobs,withRedux.Z]};var behandlingstyper=[{kode:behandlingType.Z.FORSTEGANGSSOKNAD,kodeverk:"BEHANDLING_TYPE",navn:"Førstegangssøknad"},{kode:behandlingType.Z.REVURDERING,kodeverk:"BEHANDLING_TYPE",navn:"Revurdering"},{kode:behandlingType.Z.KLAGE,kodeverk:"BEHANDLING_TYPE",navn:"Klage"},{kode:behandlingType.Z.DOKUMENTINNSYN,kodeverk:"BEHANDLING_TYPE",navn:"Dokumentinnsyn"},{kode:behandlingType.Z.TILBAKEKREVING,kodeverk:"BEHANDLING_TYPE",navn:"Tilbakekreving"},{kode:behandlingType.Z.TILBAKEKREVING_REVURDERING,kodeverk:"BEHANDLING_TYPE",navn:"Tilbakekreving revurdering"},{kode:behandlingType.Z.ANKE,kodeverk:"BEHANDLING_TYPE",navn:"Anke"}],behandlingOppretting=[{behandlingType:{kode:behandlingType.Z.FORSTEGANGSSOKNAD,kodeverk:""},kanOppretteBehandling:!0},{behandlingType:{kode:behandlingType.Z.REVURDERING,kodeverk:""},kanOppretteBehandling:!0}],visMenyForÅLageNyBehandling=()=>react.createElement(src_MenyNyBehandlingIndex,{ytelseType:{kode:fagsakYtelseType.Z.FORELDREPENGER,kodeverk:"YTELSE_TYPE"},saksnummer:"123",behandlingId:1,behandlingVersjon:2,behandlingType:{kode:behandlingType.Z.FORSTEGANGSSOKNAD,kodeverk:"BEHANDLING_TYPE"},lagNyBehandling:(0,dist.aD)("button-click"),behandlingstyper,tilbakekrevingRevurderingArsaker:[],revurderingArsaker:[{kode:behandlingArsakType.Z.KLAGE_U_INNTK,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Klage uten inntekt"},{kode:behandlingArsakType.Z.FØDSEL,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Fødsel"}],behandlingOppretting,kanTilbakekrevingOpprettes:{kanBehandlingOpprettes:!1,kanRevurderingOpprettes:!1},erTilbakekrevingAktivert:!1,sjekkOmTilbakekrevingKanOpprettes:(0,dist.aD)("button-click"),sjekkOmTilbakekrevingRevurderingKanOpprettes:(0,dist.aD)("button-click"),lukkModal:(0,dist.aD)("button-click")}),visMenyForÅLageNyTilbakekrevingsbehandling=()=>react.createElement(src_MenyNyBehandlingIndex,{ytelseType:{kode:fagsakYtelseType.Z.FORELDREPENGER,kodeverk:"YTELSE_TYPE"},saksnummer:"123",behandlingId:1,behandlingVersjon:2,behandlingType:{kode:behandlingType.Z.FORSTEGANGSSOKNAD,kodeverk:"BEHANDLING_TYPE"},lagNyBehandling:(0,dist.aD)("button-click"),behandlingstyper,tilbakekrevingRevurderingArsaker:[{kode:behandlingArsakType.Z.RE_KLAGE_KA,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Klage KA"},{kode:behandlingArsakType.Z.RE_KLAGE_NFP,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Klage NFP"}],revurderingArsaker:[{kode:behandlingArsakType.Z.KLAGE_U_INNTK,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Klage uten inntekt"},{kode:behandlingArsakType.Z.FØDSEL,kodeverk:"BEHANDLING_ARSAK_TYPE",navn:"Fødsel"}],behandlingOppretting,kanTilbakekrevingOpprettes:{kanBehandlingOpprettes:!0,kanRevurderingOpprettes:!0},erTilbakekrevingAktivert:!0,sjekkOmTilbakekrevingKanOpprettes:(0,dist.aD)("button-click"),sjekkOmTilbakekrevingRevurderingKanOpprettes:(0,dist.aD)("button-click"),lukkModal:(0,dist.aD)("button-click")}),__namedExportsOrder=["visMenyForÅLageNyBehandling","visMenyForÅLageNyTilbakekrevingsbehandling"]},"./packages/assets/images/innvilget_valgt.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");const __WEBPACK_DEFAULT_EXPORT__=__webpack_require__.p+"innvilget_valgt_d16fe7412e7b35b39887c6a30bb57e66.svg"},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-meny-ny-behandling/src/components/nyBehandlingModal.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js"),_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".i0XR4SIrRH2fsYsWKwqU {\n  width: 730px;\n}\n\n.W6c0zjlLmgpAZrsO0RaR {\n  border-left: 1px solid #a0a0a0;\n  border-right: 0 solid #a0a0a0;\n  display: inline;\n  float: right;\n  height: 30px;\n  margin-left: 9px;\n  position: absolute;\n  top: 4px;\n}\n\n.K_hQjaBXD5VXMkUbAXSU {\n  height: 25px;\n  margin-top: 5px;\n  width: 25px;\n}\n\n.t5XrE48CeQF0dBerSX0O {\n  width: 540px;\n}\n\n.hxrCJ_tjSgAQqxodPoMg {\n  margin-top: 5px;\n}\n\n.PsBJa1hzKfEAWD8wSkOC {\n  float: right;\n  margin-right: 50px;\n}\n\n.RMi7Crl3tjnFbOrWR5Ku {\n  margin-top: 10px;\n  padding-left: 35px;\n  padding-right: 35px;\n}\n\n.YQ40Zbwe_xoTKDPm69uw {\n  margin: 10px 10px 0 10px;\n}\n",""]),___CSS_LOADER_EXPORT___.locals={container:"i0XR4SIrRH2fsYsWKwqU",divider:"W6c0zjlLmgpAZrsO0RaR",image:"K_hQjaBXD5VXMkUbAXSU",modal:"t5XrE48CeQF0dBerSX0O",label:"hxrCJ_tjSgAQqxodPoMg",right:"PsBJa1hzKfEAWD8wSkOC",button:"RMi7Crl3tjnFbOrWR5Ku",cancelButton:"YQ40Zbwe_xoTKDPm69uw"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);