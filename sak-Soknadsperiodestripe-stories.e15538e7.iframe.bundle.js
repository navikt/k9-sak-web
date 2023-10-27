"use strict";(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[9908],{"./packages/kodeverk/src/vilkarUtfallType.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={OPPFYLT:"OPPFYLT",IKKE_OPPFYLT:"IKKE_OPPFYLT",IKKE_VURDERT:"IKKE_VURDERT"}},"./packages/storybook/stories/sak/Soknadsperiodestripe.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,default:()=>Soknadsperiodestripe_stories,visSoknadsperiodestripe:()=>visSoknadsperiodestripe});var react=__webpack_require__("./node_modules/react/index.js"),utils=__webpack_require__("./node_modules/@formatjs/intl/lib/src/utils.js"),provider=__webpack_require__("./node_modules/react-intl/lib/src/components/provider.js"),injectIntl=__webpack_require__("./node_modules/react-intl/lib/src/components/injectIntl.js"),vilkarUtfallType=__webpack_require__("./packages/kodeverk/src/vilkarUtfallType.ts"),shared_components=__webpack_require__("./packages/shared-components/index.ts"),HorisontalNavigering=__webpack_require__("./packages/shared-components/src/tidslinje/HorisontalNavigering.tsx"),useTidslinjerader=__webpack_require__("./packages/shared-components/src/tidslinje/useTidslinjerader.ts"),build=__webpack_require__("./node_modules/@navikt/k9-fe-period-utils/build/index.js"),dayjs_min=__webpack_require__("./node_modules/dayjs/dayjs.min.js"),dayjs_min_default=__webpack_require__.n(dayjs_min),useIntl=(__webpack_require__("./node_modules/dayjs/locale/nb.js"),__webpack_require__("./node_modules/react-intl/lib/src/components/useIntl.js")),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),soknadsperiodestripe_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-soknadsperiodestripe/src/soknadsperiodestripe.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(soknadsperiodestripe_module.Z,options);const src_soknadsperiodestripe_module=soknadsperiodestripe_module.Z&&soknadsperiodestripe_module.Z.locals?soknadsperiodestripe_module.Z.locals:void 0;dayjs_min_default().locale("nb");var formaterPerioder=behandlingPerioderMedVilkår=>{var _behandlingPerioderMe,_behandlingPerioderMe3,_behandlingPerioderMe4,_behandlingPerioderMe5,vedtakshistorikk=(null==behandlingPerioderMedVilkår||null===(_behandlingPerioderMe=behandlingPerioderMedVilkår.forrigeVedtak)||void 0===_behandlingPerioderMe?void 0:_behandlingPerioderMe.map((_ref=>{var _behandlingPerioderMe2,{periode,utfall}=_ref,vedtaksperiode=new build.pH(periode.fom,periode.tom),harOverlappMedPeriodeTilVurdering=null==behandlingPerioderMedVilkår||null===(_behandlingPerioderMe2=behandlingPerioderMedVilkår.perioderMedÅrsak)||void 0===_behandlingPerioderMe2?void 0:_behandlingPerioderMe2.perioderTilVurdering.some((_ref2=>{var{fom,tom}=_ref2;return new build.pH(fom,tom).covers(vedtaksperiode)})),nyPeriode={id:"".concat(periode.fom,"-").concat(periode.tom),fom:new Date(periode.fom),tom:new Date(periode.tom),className:utfall.kode===vilkarUtfallType.Z.OPPFYLT?src_soknadsperiodestripe_module.suksess:src_soknadsperiodestripe_module.feil,status:utfall.kode===vilkarUtfallType.Z.OPPFYLT?"suksess":"feil"};return harOverlappMedPeriodeTilVurdering&&(nyPeriode.status=utfall.kode===vilkarUtfallType.Z.OPPFYLT?"suksessRevurder":"feilRevurder",nyPeriode.className="".concat(src_soknadsperiodestripe_module.advarsel," ").concat(src_soknadsperiodestripe_module.aktivPeriode)),nyPeriode})))||[],perioderTilVurderingPeriodType=(null==behandlingPerioderMedVilkår||null===(_behandlingPerioderMe3=behandlingPerioderMedVilkår.perioderMedÅrsak)||void 0===_behandlingPerioderMe3?void 0:_behandlingPerioderMe3.perioderTilVurdering.map((periode=>new build.pH(periode.fom,periode.tom))))||[],vedtaksperioder=(null==behandlingPerioderMedVilkår||null===(_behandlingPerioderMe4=behandlingPerioderMedVilkår.forrigeVedtak)||void 0===_behandlingPerioderMe4?void 0:_behandlingPerioderMe4.map((_ref3=>{var{periode}=_ref3;return new build.pH(periode.fom,periode.tom)})))||[],erBehandlingFullført=((perioderTilVurdering,perioderMedUtfall)=>!(null==perioderTilVurdering||!perioderTilVurdering.length||null==perioderMedUtfall||!perioderMedUtfall.length)&&perioderTilVurdering.every((periodeTilVurdering=>perioderMedUtfall.some((periodeMedUtfall=>new build.pH(periodeMedUtfall.periode.fom,periodeMedUtfall.periode.tom).covers(new build.pH(periodeTilVurdering.fom,periodeTilVurdering.tom))&&periodeMedUtfall.utfall.kode!==vilkarUtfallType.Z.IKKE_VURDERT)))))(null==behandlingPerioderMedVilkår||null===(_behandlingPerioderMe5=behandlingPerioderMedVilkår.perioderMedÅrsak)||void 0===_behandlingPerioderMe5?void 0:_behandlingPerioderMe5.perioderTilVurdering,null==behandlingPerioderMedVilkår?void 0:behandlingPerioderMedVilkår.periodeMedUtfall),formatertePerioderTilVurdering=(erBehandlingFullført?perioderTilVurderingPeriodType:(0,build.fD)(perioderTilVurderingPeriodType,vedtaksperioder)).map((periodeTilVurdering=>{var{fom,tom}=periodeTilVurdering,overlappendePeriodeMedUtfall=behandlingPerioderMedVilkår.periodeMedUtfall.find((periodeMedUtfall=>new build.pH(periodeMedUtfall.periode.fom,periodeMedUtfall.periode.tom).covers(new build.pH(fom,tom))&&periodeMedUtfall.utfall.kode!==vilkarUtfallType.Z.IKKE_VURDERT)),erDelvisInnvilget=behandlingPerioderMedVilkår.periodeMedUtfall.some((periodeMedUtfall=>periodeTilVurdering.covers(new build.pH(periodeMedUtfall.periode.fom,periodeMedUtfall.periode.tom))&&periodeMedUtfall.utfall.kode===vilkarUtfallType.Z.OPPFYLT)),nyPeriode={id:"".concat(fom,"-").concat(tom),fom:new Date(fom),tom:new Date(tom),status:"advarsel",className:"".concat(src_soknadsperiodestripe_module.advarsel," ").concat(src_soknadsperiodestripe_module.aktivPeriode)};if(overlappendePeriodeMedUtfall){var utfall=nyPeriode.status;return overlappendePeriodeMedUtfall.utfall.kode===vilkarUtfallType.Z.OPPFYLT?utfall="suksess":overlappendePeriodeMedUtfall.utfall.kode===vilkarUtfallType.Z.IKKE_OPPFYLT&&(utfall="feil"),nyPeriode.status=utfall,nyPeriode.className="".concat(src_soknadsperiodestripe_module[utfall]," ").concat(src_soknadsperiodestripe_module.aktivPeriode),nyPeriode}return erDelvisInnvilget&&(nyPeriode.status="suksessDelvis",nyPeriode.className="".concat(src_soknadsperiodestripe_module.suksess," ").concat(src_soknadsperiodestripe_module.aktivPeriode)),nyPeriode}))||[];return vedtakshistorikk.concat(formatertePerioderTilVurdering)},Soknadsperiodestripe=_ref4=>{var{behandlingPerioderMedVilkår}=_ref4,intl=(0,useIntl.Z)(),formatertePerioder=(0,react.useMemo)((()=>formaterPerioder(behandlingPerioderMedVilkår)),[behandlingPerioderMedVilkår]),rader=[{perioder:formatertePerioder,radLabel:intl.formatMessage({id:"Soknadsperioder.Søknadsperioder"}),radClassname:src_soknadsperiodestripe_module.rad}],getSenesteTom=()=>(0,useTidslinjerader.nJ)({sluttDato:void 0,rader}),[tidslinjeSkala,setTidslinjeSkala]=(0,react.useState)(6),[navigasjonFomDato,setNavigasjonFomDato]=(0,react.useState)(void 0);if((0,react.useEffect)((()=>{var antallMånederFraSluttdato,senesteTom,fomDato;formatertePerioder.length>0&&(antallMånederFraSluttdato=6,senesteTom=getSenesteTom(),fomDato=dayjs_min_default()(senesteTom).subtract(antallMånederFraSluttdato,"months").toDate(),setNavigasjonFomDato(fomDato))}),[behandlingPerioderMedVilkår]),0===formatertePerioder.length)return null;var updateZoom=(zoomValue,zoomIn)=>{if(zoomIn){var senesteTom=getSenesteTom();dayjs_min_default()(navigasjonFomDato).add(zoomValue+1,"months").isSameOrAfter(senesteTom)?setNavigasjonFomDato((dateToSubtractFrom=senesteTom,numberOfMonthsToSubtract=zoomValue,dayjs_min_default()(dateToSubtractFrom).subtract(numberOfMonthsToSubtract,"months").toDate())):setNavigasjonFomDato(dayjs_min_default()(navigasjonFomDato).add(1,"months"))}else setNavigasjonFomDato(dayjs_min_default()(navigasjonFomDato).subtract(1,"months"));var dateToSubtractFrom,numberOfMonthsToSubtract;setTidslinjeSkala(zoomValue)};return react.createElement("div",{className:src_soknadsperiodestripe_module.container},react.createElement(shared_components.Z3,{rader,tidslinjeSkala,startDato:navigasjonFomDato}),react.createElement("div",{className:src_soknadsperiodestripe_module.navigasjonContainer},react.createElement(HorisontalNavigering.Z,{tidslinjeSkala,rader,navigasjonFomDato,updateHorisontalNavigering:setNavigasjonFomDato}),react.createElement(shared_components.Xq,{disabledZoomIn:1===tidslinjeSkala,disabledZoomOut:36===tidslinjeSkala,handleZoomIn:()=>{tidslinjeSkala>1&&updateZoom(tidslinjeSkala-1,!0)},handleZoomOut:()=>{tidslinjeSkala<36&&updateZoom(tidslinjeSkala+1)}})))};const src_Soknadsperiodestripe=Soknadsperiodestripe;try{formaterPerioder.displayName="formaterPerioder",formaterPerioder.__docgenInfo={description:"",displayName:"formaterPerioder",props:{perioderMedÅrsak:{defaultValue:null,description:"",name:"perioderMedÅrsak",required:!0,type:{name:"PerioderMedÅrsak"}},periodeMedUtfall:{defaultValue:null,description:"",name:"periodeMedUtfall",required:!0,type:{name:"PeriodeMedUtfall[]"}},forrigeVedtak:{defaultValue:null,description:"",name:"forrigeVedtak",required:!0,type:{name:"PeriodeMedUtfall[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-soknadsperiodestripe/src/Soknadsperiodestripe.tsx#formaterPerioder"]={docgenInfo:formaterPerioder.__docgenInfo,name:"formaterPerioder",path:"packages/sak-soknadsperiodestripe/src/Soknadsperiodestripe.tsx#formaterPerioder"})}catch(__react_docgen_typescript_loader_error){}try{Soknadsperiodestripe.displayName="Soknadsperiodestripe",Soknadsperiodestripe.__docgenInfo={description:"",displayName:"Soknadsperiodestripe",props:{behandlingPerioderMedVilkår:{defaultValue:null,description:"",name:"behandlingPerioderMedVilkår",required:!0,type:{name:"BehandlingPerioderårsakMedVilkår"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-soknadsperiodestripe/src/Soknadsperiodestripe.tsx#Soknadsperiodestripe"]={docgenInfo:Soknadsperiodestripe.__docgenInfo,name:"Soknadsperiodestripe",path:"packages/sak-soknadsperiodestripe/src/Soknadsperiodestripe.tsx#Soknadsperiodestripe"})}catch(__react_docgen_typescript_loader_error){}const nb_NO_namespaceObject=JSON.parse('{"Soknadsperioder.Skala.SkalaForVisning":"Velg skala for visning","Soknadsperioder.Skala.3mnd":"3 mnd","Soknadsperioder.Skala.6mnd":"6 mnd","Soknadsperioder.Skala.1år":"1 år","Soknadsperioder.Søknadsperioder":"Søknadsperioder","TidslinjeZoom.Forstørre":"Forstørre","TidslinjeZoom.Forminske":"Forminske"}');var cache=(0,utils.Sn)(),intlConfig=(0,provider.d)({locale:"nb-NO",messages:nb_NO_namespaceObject},cache),SoknadsperiodestripeIndex=_ref=>{var{behandlingPerioderMedVilkår}=_ref;return react.createElement(injectIntl.zt,{value:intlConfig},react.createElement(src_Soknadsperiodestripe,{behandlingPerioderMedVilkår}))};const src_SoknadsperiodestripeIndex=SoknadsperiodestripeIndex;try{SoknadsperiodestripeIndex.displayName="SoknadsperiodestripeIndex",SoknadsperiodestripeIndex.__docgenInfo={description:"",displayName:"SoknadsperiodestripeIndex",props:{behandlingPerioderMedVilkår:{defaultValue:null,description:"",name:"behandlingPerioderMedVilkår",required:!0,type:{name:"BehandlingPerioderårsakMedVilkår"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/sak-soknadsperiodestripe/src/SoknadsperiodestripeIndex.tsx#SoknadsperiodestripeIndex"]={docgenInfo:SoknadsperiodestripeIndex.__docgenInfo,name:"SoknadsperiodestripeIndex",path:"packages/sak-soknadsperiodestripe/src/SoknadsperiodestripeIndex.tsx#SoknadsperiodestripeIndex"})}catch(__react_docgen_typescript_loader_error){}const Soknadsperiodestripe_stories={title:"sak/sak-soknadsperiodestripe",component:src_SoknadsperiodestripeIndex};var data={perioderMedÅrsak:{perioderTilVurdering:[{fom:"2022-01-05",tom:"2022-04-05"}],perioderMedÅrsak:[{periode:{fom:"2022-01-05",tom:"2022-02-05"},årsaker:["REVURDERER_BERØRT_PERIODE"]},{periode:{fom:"2022-02-06",tom:"2022-04-05"},årsaker:["REVURDERER_BERØRT_PERIODE","REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON"]}],dokumenterTilBehandling:[],årsakMedPerioder:[{årsak:"REVURDERER_BERØRT_PERIODE",perioder:[{fom:"2022-01-04",tom:"2022-02-05"},{fom:"2022-02-06",tom:"2022-04-05"}]},{årsak:"REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON",perioder:[{fom:"2022-02-06",tom:"2022-04-05"}]}]},periodeMedUtfall:[{periode:{fom:"2022-01-05",tom:"2022-04-05"},utfall:{kode:"OPPFYLT",kodeverk:"VILKAR_UTFALL_TYPE"}}],forrigeVedtak:[{periode:{fom:"2022-01-05",tom:"2022-02-05"},utfall:{kode:"OPPFYLT",kodeverk:"VILKAR_UTFALL_TYPE"}}]},visSoknadsperiodestripe=()=>react.createElement(src_SoknadsperiodestripeIndex,{behandlingPerioderMedVilkår:data}),__namedExportsOrder=["visSoknadsperiodestripe"]},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].use[1]!./packages/sak-soknadsperiodestripe/src/soknadsperiodestripe.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js"),_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/css-loader/dist/runtime/getUrl.js"),_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__),___CSS_LOADER_URL_IMPORT_0___=new URL(__webpack_require__("data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M5 5.83333V4.16667H1.66667L1.66667 8.33333H18.3333V4.16667H15V5.83333C15 6.29357 14.6269 6.66667 14.1667 6.66667C13.7064 6.66667 13.3333 6.29357 13.3333 5.83333V4.16667H6.66667V5.83333C6.66667 6.29357 6.29357 6.66667 5.83333 6.66667C5.3731 6.66667 5 6.29357 5 5.83333ZM13.3333 2.5H6.66667V0.833333C6.66667 0.373096 6.29357 0 5.83333 0C5.3731 0 5 0.373096 5 0.833333V2.5H1.66667C0.746192 2.5 0 3.24619 0 4.16667V18.3333C0 19.2538 0.746192 20 1.66667 20H18.3333C19.2538 20 20 19.2538 20 18.3333V4.16667C20 3.24619 19.2538 2.5 18.3333 2.5H15V0.833333C15 0.373096 14.6269 0 14.1667 0C13.7064 0 13.3333 0.373096 13.3333 0.833333V2.5ZM1.66667 10L1.66667 18.3333H18.3333V10H1.66667ZM5.83333 11.6667H4.16667C3.70643 11.6667 3.33333 12.0398 3.33333 12.5C3.33333 12.9602 3.70643 13.3333 4.16667 13.3333H5.83333C6.29357 13.3333 6.66667 12.9602 6.66667 12.5C6.66667 12.0398 6.29357 11.6667 5.83333 11.6667ZM4.16667 15H5.83333C6.29357 15 6.66667 15.3731 6.66667 15.8333C6.66667 16.2936 6.29357 16.6667 5.83333 16.6667H4.16667C3.70643 16.6667 3.33333 16.2936 3.33333 15.8333C3.33333 15.3731 3.70643 15 4.16667 15ZM10.8333 11.6667H9.16667C8.70643 11.6667 8.33333 12.0398 8.33333 12.5C8.33333 12.9602 8.70643 13.3333 9.16667 13.3333H10.8333C11.2936 13.3333 11.6667 12.9602 11.6667 12.5C11.6667 12.0398 11.2936 11.6667 10.8333 11.6667ZM9.16667 15H10.8333C11.2936 15 11.6667 15.3731 11.6667 15.8333C11.6667 16.2936 11.2936 16.6667 10.8333 16.6667H9.16667C8.70643 16.6667 8.33333 16.2936 8.33333 15.8333C8.33333 15.3731 8.70643 15 9.16667 15ZM16.6667 12.5C16.6667 12.0398 16.2936 11.6667 15.8333 11.6667H14.1667C13.7064 11.6667 13.3333 12.0398 13.3333 12.5C13.3333 12.9602 13.7064 13.3333 14.1667 13.3333H15.8333C16.2936 13.3333 16.6667 12.9602 16.6667 12.5ZM13.3333 15.8333C13.3333 15.3731 13.7064 15 14.1667 15H15.8333C16.2936 15 16.6667 15.3731 16.6667 15.8333C16.6667 16.2936 16.2936 16.6667 15.8333 16.6667H14.1667C13.7064 16.6667 13.3333 16.2936 13.3333 15.8333Z%27 fill=%27%23262626%27/%3E%3C/svg%3E%0A"),__webpack_require__.b),___CSS_LOADER_URL_IMPORT_1___=new URL(__webpack_require__("data:image/svg+xml,%3Csvg width=%2717%27 height=%2717%27 viewBox=%270 0 17 17%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M8.5 0C3.81296 0 0 3.81367 0 8.5C0 13.1863 3.81296 17 8.5 17C13.1863 17 17 13.1863 17 8.5C17 3.81367 13.1863 0 8.5 0ZM12.2832 6.28008L6.97071 11.2384C6.90271 11.3015 6.81558 11.3333 6.72917 11.3333C6.63779 11.3333 6.54783 11.2986 6.47842 11.2299L4.70758 9.45908C4.56946 9.32096 4.56946 9.09642 4.70758 8.95829C4.84571 8.82017 5.07025 8.82017 5.20837 8.95829L6.73696 10.4869L11.7994 5.76229C11.9418 5.62913 12.1663 5.6355 12.3002 5.77858C12.4341 5.92167 12.4263 6.14621 12.2832 6.28008Z%27 fill=%27%23006A23%27/%3E%3Cpath d=%27M11.5575 5.50363L6.74474 9.99387L5.4588 8.70786C5.18237 8.43142 4.73358 8.43142 4.45714 8.70786C4.18071 8.98429 4.18071 9.43308 4.45714 9.70952L6.22798 11.4804C6.36394 11.6149 6.54294 11.6875 6.72916 11.6875C6.90643 11.6875 7.07908 11.6209 7.21149 11.4981L12.5249 6.539C12.811 6.27122 12.8264 5.82256 12.5588 5.53661C12.2914 5.2508 11.8428 5.23678 11.5575 5.50363Z%27 fill=%27white%27/%3E%3C/svg%3E%0A"),__webpack_require__.b),___CSS_LOADER_URL_IMPORT_2___=new URL(__webpack_require__("data:image/svg+xml,%3Csvg width=%2718%27 height=%2717%27 viewBox=%270 0 18 17%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M8.95825 0C4.2803 0 0.467871 3.80504 0.459001 8.483C0.454566 10.7536 1.33413 12.8897 2.93656 14.4988C4.53899 16.1071 6.67212 16.9956 8.94272 17H8.95899C13.6362 17 17.4494 13.1942 17.459 8.51552C17.4678 3.82944 13.6621 0.00886957 8.95825 0Z%27 fill=%27%23BA3A26%27/%3E%3Cpath d=%27M8.95572 7.54479L11.3441 5.15636C11.608 4.89254 12.0357 4.89254 12.2995 5.15636C12.5633 5.42018 12.5633 5.84791 12.2995 6.11173L9.91109 8.50016L12.2995 10.8886C12.5633 11.1524 12.5633 11.5801 12.2995 11.844C12.0357 12.1078 11.608 12.1078 11.3441 11.844L8.95572 9.45553L6.5673 11.844C6.30348 12.1078 5.87574 12.1078 5.61193 11.844C5.34811 11.5801 5.34811 11.1524 5.61193 10.8886L8.00035 8.50016L5.61193 6.11173C5.34811 5.84791 5.34811 5.42018 5.61193 5.15636C5.87574 4.89254 6.30348 4.89254 6.5673 5.15636L8.95572 7.54479Z%27 fill=%27white%27/%3E%3C/svg%3E%0A"),__webpack_require__.b),___CSS_LOADER_URL_IMPORT_3___=new URL(__webpack_require__("data:image/svg+xml,%3Csvg width=%2717%27 height=%2717%27 viewBox=%270 0 17 17%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M12.0417 3.71875C12.0417 5.77256 10.3767 7.4375 8.32294 7.4375C6.26913 7.4375 4.60419 5.77256 4.60419 3.71875C4.60419 1.66494 6.26913 0 8.32294 0C10.3767 0 12.0417 1.66494 12.0417 3.71875ZM8.26047 8.22454C5.36992 8.22454 3.02667 10.5678 3.02667 13.4583H10.2261L12.8119 10.8725C11.9115 9.29101 10.2105 8.22454 8.26047 8.22454ZM15.8297 11.7953C15.2138 11.1793 14.2151 11.1793 13.5991 11.7953L10.913 14.4815L10.6251 17L13.1435 16.7121L15.8297 14.0259C16.4457 13.4099 16.4457 12.4113 15.8297 11.7953Z%27 fill=%27%23262626%27/%3E%3C/svg%3E%0A"),__webpack_require__.b),___CSS_LOADER_EXPORT___=_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()),___CSS_LOADER_URL_REPLACEMENT_0___=_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___),___CSS_LOADER_URL_REPLACEMENT_1___=_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___),___CSS_LOADER_URL_REPLACEMENT_2___=_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___),___CSS_LOADER_URL_REPLACEMENT_3___=_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);___CSS_LOADER_EXPORT___.push([module.id,`.VS0f8Uh_lv8VszUPHz0M {\n  border-bottom: 1px solid #6a6a6a;\n  padding: 0.875rem 2.125rem 0.75rem 2.75rem;\n  position: relative;\n}\n\n.VS0f8Uh_lv8VszUPHz0M .pin {\n  height: 100%;\n  top: -12px;\n}\n\n.VS0f8Uh_lv8VszUPHz0M .pin:before {\n  display: none;\n}\n\n.VS0f8Uh_lv8VszUPHz0M .tidslinje {\n  margin-left: 10.375rem;\n  width: calc(100% - 10.375rem);\n  margin-bottom: 0.625rem;\n}\n\n.cMMr7qlIaRygxnaRMJph .radLabel {\n  left: -10.375rem;\n  margin-left: 1.75rem;\n  position: absolute;\n}\n\n.cMMr7qlIaRygxnaRMJph .radLabel:before {\n  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});\n  content: '';\n  display: block;\n  height: 1.25rem;\n  left: -1.75rem;\n  position: absolute;\n  top: -0.125rem;\n  width: 1.25rem;\n}\n\n.aeG9KiKynV1cCdxIX6rV {\n  clip: rect(1px, 1px, 1px, 1px);\n  height: 1px;\n  overflow: hidden;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n}\n\n.VbTzIQ8gsIe2_acYRnT2 {\n  align-items: center;\n  background-color: white;\n  border: 1px solid #c6c2bf;\n  color: #262626;\n  cursor: pointer;\n  display: flex;\n  height: 24px;\n  padding: 2px 8px;\n}\n\n.VbTzIQ8gsIe2_acYRnT2 p {\n  font-size: 0.875rem;\n  font-weight: 400;\n}\n\n.XNVrMSklGG9k9IAtnNQ5 {\n  background-color: #59514b;\n  color: white;\n}\n\n.EZmVyeHxQ5vA1euliFG0 {\n  clip: rect(1px, 1px, 1px, 1px);\n  height: 1px;\n  overflow: hidden;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n}\n\n.EZmVyeHxQ5vA1euliFG0:focus-visible + label {\n  box-shadow: 0 0 0 3px var(--a-blue-800);\n}\n\n.EZmVyeHxQ5vA1euliFG0:first-of-type + label {\n  border-top-left-radius: 4px;\n  border-bottom-left-radius: 4px;\n  border-right: none;\n}\n\n.EZmVyeHxQ5vA1euliFG0:last-of-type + label {\n  border-left: none;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n\n.X6QKg8JAke52GEgFs0gv:before {\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 6px;\n  transform: translateY(-45%);\n  background-repeat: no-repeat;\n  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});\n  height: 18px;\n  width: 17px;\n}\n\n.e8kM3t3lQ0I2XqeZLMeX:before {\n  content: '';\n  position: absolute;\n  top: 50%;\n  left: 6px;\n  transform: translateY(-45%);\n  background-repeat: no-repeat;\n  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_2___});\n  height: 18px;\n  width: 17px;\n}\n\n.NdfAOl_uZTdmTR2HvMP6:before {\n  content: '';\n  position: absolute;\n  width: 16px;\n  top: 50%;\n  left: 6px;\n  transform: translateY(-45%);\n  background-repeat: no-repeat;\n  height: 16px;\n  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_3___});\n}\n\n.l88SHVtYYrfXOxl2yzGA {\n  height: 1.875rem;\n}\n\n.frittstående.l88SHVtYYrfXOxl2yzGA {\n  border: 3px solid #254b6d;\n}\n\n.sammenhengendeFraBegge.l88SHVtYYrfXOxl2yzGA {\n  border-top: 3px solid #254b6d;\n  border-bottom: 3px solid #254b6d;\n  border-left: none;\n  border-right: none;\n}\n\n.sammenhengendeFraBegge.l88SHVtYYrfXOxl2yzGA:before {\n  display: none;\n}\n\n.sammenhengendeFraHøyre.l88SHVtYYrfXOxl2yzGA {\n  border-top: 3px solid #254b6d;\n  border-bottom: 3px solid #254b6d;\n  border-left: 3px solid #254b6d;\n}\n\n.sammenhengendeFraVenstre.l88SHVtYYrfXOxl2yzGA {\n  border-top: 3px solid #254b6d;\n  border-bottom: 3px solid #254b6d;\n  border-right: 3px solid #254b6d;\n}\n\n.sammenhengendeFraVenstre.l88SHVtYYrfXOxl2yzGA:before {\n  display: none;\n}\n\n.FOLrw8VGsxrIR6uF_d9x {\n  display: flex;\n  justify-content: flex-end;\n}\n`,""]),___CSS_LOADER_EXPORT___.locals={container:"VS0f8Uh_lv8VszUPHz0M",rad:"cMMr7qlIaRygxnaRMJph",visuallyhidden:"aeG9KiKynV1cCdxIX6rV",skalaRadioLabel:"VbTzIQ8gsIe2_acYRnT2","skalaRadioLabel--selected":"XNVrMSklGG9k9IAtnNQ5",skalaRadioInput:"EZmVyeHxQ5vA1euliFG0",suksess:"X6QKg8JAke52GEgFs0gv",feil:"e8kM3t3lQ0I2XqeZLMeX",advarsel:"NdfAOl_uZTdmTR2HvMP6",aktivPeriode:"l88SHVtYYrfXOxl2yzGA",navigasjonContainer:"FOLrw8VGsxrIR6uF_d9x"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M5 5.83333V4.16667H1.66667L1.66667 8.33333H18.3333V4.16667H15V5.83333C15 6.29357 14.6269 6.66667 14.1667 6.66667C13.7064 6.66667 13.3333 6.29357 13.3333 5.83333V4.16667H6.66667V5.83333C6.66667 6.29357 6.29357 6.66667 5.83333 6.66667C5.3731 6.66667 5 6.29357 5 5.83333ZM13.3333 2.5H6.66667V0.833333C6.66667 0.373096 6.29357 0 5.83333 0C5.3731 0 5 0.373096 5 0.833333V2.5H1.66667C0.746192 2.5 0 3.24619 0 4.16667V18.3333C0 19.2538 0.746192 20 1.66667 20H18.3333C19.2538 20 20 19.2538 20 18.3333V4.16667C20 3.24619 19.2538 2.5 18.3333 2.5H15V0.833333C15 0.373096 14.6269 0 14.1667 0C13.7064 0 13.3333 0.373096 13.3333 0.833333V2.5ZM1.66667 10L1.66667 18.3333H18.3333V10H1.66667ZM5.83333 11.6667H4.16667C3.70643 11.6667 3.33333 12.0398 3.33333 12.5C3.33333 12.9602 3.70643 13.3333 4.16667 13.3333H5.83333C6.29357 13.3333 6.66667 12.9602 6.66667 12.5C6.66667 12.0398 6.29357 11.6667 5.83333 11.6667ZM4.16667 15H5.83333C6.29357 15 6.66667 15.3731 6.66667 15.8333C6.66667 16.2936 6.29357 16.6667 5.83333 16.6667H4.16667C3.70643 16.6667 3.33333 16.2936 3.33333 15.8333C3.33333 15.3731 3.70643 15 4.16667 15ZM10.8333 11.6667H9.16667C8.70643 11.6667 8.33333 12.0398 8.33333 12.5C8.33333 12.9602 8.70643 13.3333 9.16667 13.3333H10.8333C11.2936 13.3333 11.6667 12.9602 11.6667 12.5C11.6667 12.0398 11.2936 11.6667 10.8333 11.6667ZM9.16667 15H10.8333C11.2936 15 11.6667 15.3731 11.6667 15.8333C11.6667 16.2936 11.2936 16.6667 10.8333 16.6667H9.16667C8.70643 16.6667 8.33333 16.2936 8.33333 15.8333C8.33333 15.3731 8.70643 15 9.16667 15ZM16.6667 12.5C16.6667 12.0398 16.2936 11.6667 15.8333 11.6667H14.1667C13.7064 11.6667 13.3333 12.0398 13.3333 12.5C13.3333 12.9602 13.7064 13.3333 14.1667 13.3333H15.8333C16.2936 13.3333 16.6667 12.9602 16.6667 12.5ZM13.3333 15.8333C13.3333 15.3731 13.7064 15 14.1667 15H15.8333C16.2936 15 16.6667 15.3731 16.6667 15.8333C16.6667 16.2936 16.2936 16.6667 15.8333 16.6667H14.1667C13.7064 16.6667 13.3333 16.2936 13.3333 15.8333Z%27 fill=%27%23262626%27/%3E%3C/svg%3E%0A":module=>{module.exports="data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M5 5.83333V4.16667H1.66667L1.66667 8.33333H18.3333V4.16667H15V5.83333C15 6.29357 14.6269 6.66667 14.1667 6.66667C13.7064 6.66667 13.3333 6.29357 13.3333 5.83333V4.16667H6.66667V5.83333C6.66667 6.29357 6.29357 6.66667 5.83333 6.66667C5.3731 6.66667 5 6.29357 5 5.83333ZM13.3333 2.5H6.66667V0.833333C6.66667 0.373096 6.29357 0 5.83333 0C5.3731 0 5 0.373096 5 0.833333V2.5H1.66667C0.746192 2.5 0 3.24619 0 4.16667V18.3333C0 19.2538 0.746192 20 1.66667 20H18.3333C19.2538 20 20 19.2538 20 18.3333V4.16667C20 3.24619 19.2538 2.5 18.3333 2.5H15V0.833333C15 0.373096 14.6269 0 14.1667 0C13.7064 0 13.3333 0.373096 13.3333 0.833333V2.5ZM1.66667 10L1.66667 18.3333H18.3333V10H1.66667ZM5.83333 11.6667H4.16667C3.70643 11.6667 3.33333 12.0398 3.33333 12.5C3.33333 12.9602 3.70643 13.3333 4.16667 13.3333H5.83333C6.29357 13.3333 6.66667 12.9602 6.66667 12.5C6.66667 12.0398 6.29357 11.6667 5.83333 11.6667ZM4.16667 15H5.83333C6.29357 15 6.66667 15.3731 6.66667 15.8333C6.66667 16.2936 6.29357 16.6667 5.83333 16.6667H4.16667C3.70643 16.6667 3.33333 16.2936 3.33333 15.8333C3.33333 15.3731 3.70643 15 4.16667 15ZM10.8333 11.6667H9.16667C8.70643 11.6667 8.33333 12.0398 8.33333 12.5C8.33333 12.9602 8.70643 13.3333 9.16667 13.3333H10.8333C11.2936 13.3333 11.6667 12.9602 11.6667 12.5C11.6667 12.0398 11.2936 11.6667 10.8333 11.6667ZM9.16667 15H10.8333C11.2936 15 11.6667 15.3731 11.6667 15.8333C11.6667 16.2936 11.2936 16.6667 10.8333 16.6667H9.16667C8.70643 16.6667 8.33333 16.2936 8.33333 15.8333C8.33333 15.3731 8.70643 15 9.16667 15ZM16.6667 12.5C16.6667 12.0398 16.2936 11.6667 15.8333 11.6667H14.1667C13.7064 11.6667 13.3333 12.0398 13.3333 12.5C13.3333 12.9602 13.7064 13.3333 14.1667 13.3333H15.8333C16.2936 13.3333 16.6667 12.9602 16.6667 12.5ZM13.3333 15.8333C13.3333 15.3731 13.7064 15 14.1667 15H15.8333C16.2936 15 16.6667 15.3731 16.6667 15.8333C16.6667 16.2936 16.2936 16.6667 15.8333 16.6667H14.1667C13.7064 16.6667 13.3333 16.2936 13.3333 15.8333Z%27 fill=%27%23262626%27/%3E%3C/svg%3E%0A"}}]);