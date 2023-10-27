"use strict";(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[3518],{"./packages/storybook/stories/fakta/VergeFaktaIndex.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{__namedExportsOrder:()=>__namedExportsOrder,default:()=>VergeFaktaIndex_stories,visAksjonspunktForAvklaringAvVerge:()=>visAksjonspunktForAvklaringAvVerge});var react=__webpack_require__("./node_modules/react/index.js"),dist=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),addon_knobs_dist=__webpack_require__("./node_modules/@storybook/addon-knobs/dist/index.js"),aksjonspunktCodes=__webpack_require__("./packages/kodeverk/src/aksjonspunktCodes.ts"),aksjonspunktStatus=__webpack_require__("./packages/kodeverk/src/aksjonspunktStatus.ts"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),utils=__webpack_require__("./node_modules/@formatjs/intl/lib/src/utils.js"),provider=__webpack_require__("./node_modules/react-intl/lib/src/components/provider.js"),injectIntl=__webpack_require__("./node_modules/react-intl/lib/src/components/injectIntl.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),reselect_es=__webpack_require__("./node_modules/reselect/es/index.js"),fakta_felles=__webpack_require__("./packages/fakta-felles/index.ts"),packages_form=__webpack_require__("./packages/form/index.jsx"),shared_components=__webpack_require__("./packages/shared-components/index.ts"),packages_utils=__webpack_require__("./packages/utils/index.ts"),lib=__webpack_require__("./node_modules/nav-frontend-typografi/lib/index.js"),packages_prop_types=__webpack_require__("./packages/prop-types/index.jsx");const propTypes_vergeAksjonspunkterPropType=prop_types_default().shape({definisjon:packages_prop_types.M$.isRequired,status:packages_prop_types.M$.isRequired,begrunnelse:prop_types_default().string,kanLoses:prop_types_default().bool.isRequired});var _excluded=["intl","hasOpenAksjonspunkter","submittable","readOnly","initialValues","aksjonspunkt","behandlingId","behandlingVersjon"];function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var RegistrereVergeInfoPanelImpl=_ref=>{var{intl,hasOpenAksjonspunkter,submittable,readOnly,initialValues,aksjonspunkt,behandlingId,behandlingVersjon}=_ref,formProps=_objectWithoutProperties(_ref,_excluded);return aksjonspunkt?react.createElement(react.Fragment,null,react.createElement(shared_components.ix,{isAksjonspunktOpen:hasOpenAksjonspunkter},[intl.formatMessage({id:"RegistrereVergeInfoPanel.CheckInformation"})]),react.createElement(shared_components.P6,{twentyPx:!0}),react.createElement(lib.Normaltekst,null,[intl.formatMessage({id:"RegistrereVergeInfoPanel.HjelpeTekst"})]),react.createElement("form",{onSubmit:formProps.handleSubmit},react.createElement(shared_components.P6,{twentyPx:!0}),react.createElement(fakta_felles.L,{isSubmittable:submittable,isReadOnly:readOnly,hasBegrunnelse:!!initialValues.begrunnelse,label:intl.formatMessage({id:"RegistrereVergeInfoPanel.Begrunnelse"})}),react.createElement(shared_components.P6,{twentyPx:!0}),react.createElement(fakta_felles.m,{formName:formProps.form,behandlingId,behandlingVersjon,isSubmittable:submittable,isReadOnly:readOnly,hasOpenAksjonspunkter,doNotCheckForRequiredFields:!0}))):null};RegistrereVergeInfoPanelImpl.propTypes={intl:prop_types_default().shape().isRequired,hasOpenAksjonspunkter:prop_types_default().bool.isRequired,submittable:prop_types_default().bool,readOnly:prop_types_default().bool.isRequired,aksjonspunkt:propTypes_vergeAksjonspunkterPropType.isRequired,initialValues:prop_types_default().shape(),behandlingId:prop_types_default().number.isRequired,behandlingVersjon:prop_types_default().number.isRequired},RegistrereVergeInfoPanelImpl.defaultProps={initialValues:{},submittable:!0};var buildInitialValues=(0,reselect_es.P1)([ownProps=>ownProps.verge,ownProps=>ownProps.aksjonspunkter],((verge,aksjonspunkter)=>({begrunnelse:verge&&verge.begrunnelse?(0,packages_utils.hu)(verge.begrunnelse):fakta_felles.L.buildInitialValues(aksjonspunkter.filter((ap=>ap.definisjon.kode===aksjonspunktCodes.default.AVKLAR_VERGE))[0]).begrunnelse}))),transformValues=values=>({begrunnelse:values.begrunnelse,kode:aksjonspunktCodes.default.AVKLAR_VERGE});RegistrereVergeInfoPanelImpl.__docgenInfo={description:"RegistrereVergeInfoPanel\n\nPresentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.",methods:[],displayName:"RegistrereVergeInfoPanelImpl",props:{initialValues:{defaultValue:{value:"{}",computed:!1},description:"",type:{name:"shape",value:"PropTypes.shape()",computed:!0},required:!1},submittable:{defaultValue:{value:"true",computed:!1},description:"",type:{name:"bool"},required:!1},intl:{description:"",type:{name:"shape",value:"PropTypes.shape()",computed:!0},required:!0},hasOpenAksjonspunkter:{description:"",type:{name:"bool"},required:!0},readOnly:{description:"",type:{name:"bool"},required:!0},aksjonspunkt:{description:"",type:{name:"custom",raw:"vergeAksjonspunkterPropType.isRequired"},required:!1},behandlingId:{description:"",type:{name:"number"},required:!0},behandlingVersjon:{description:"",type:{name:"number"},required:!0}}};const RegistrereVergeInfoPanel=(0,es.$j)(((initialState,initialOwnProps)=>{var onSubmit=values=>initialOwnProps.submitCallback([transformValues(values)]);return(state,ownProps)=>({aksjonspunkt:ownProps.aksjonspunkter[0],initialValues:buildInitialValues(ownProps),onSubmit})}))((0,packages_form.Rq)({form:"RegistrereVergeInfoPanel"})((0,injectIntl.ZP)(RegistrereVergeInfoPanelImpl)));const propTypes_vergeVergePropType=prop_types_default().shape({navn:prop_types_default().string,gyldigFom:prop_types_default().string,gyldigTom:prop_types_default().string,fnr:prop_types_default().string,vergeType:packages_prop_types.M$,begrunnelse:prop_types_default().string});const propTypes_vergeBehandlingPropType=prop_types_default().shape({id:prop_types_default().number.isRequired,versjon:prop_types_default().number.isRequired}),nb_NO_namespaceObject=JSON.parse('{"RegistrereVergeInfoPanel.CheckInformation":"Søker er under 18 år.","RegistrereVergeInfoPanel.HjelpeTekst":"Vurder om søknaden kan behandles videre, eller om den må henlegges.","RegistrereVergeInfoPanel.Begrunnelse":"Begrunnelse","Verge.KontaktPerson":"Kontaktperson","Verge.Navn":"Navn","Verge.Mandat":"Mandat","Verge.FodselsNummer":"Fødselsnummer","Verge.PeriodeFOM":"Periode f.o.m.","Verge.PeriodeTOM":"Periode t.o.m.","Verge.TypeVerge":"Type verge","Verge.VergeFullmektig":"Verge/fullmektig","Verge.Soker":"Søker","Verge.BrukerErUnderTvungenForvaltning":"Søker er under tvungen forvaltning","Verge.Organisasjonsnummer":"Organisasjonsnummer","Behandling.EditedField":"Saksbehandler har endret feltets verdi","FaktaBegrunnelseTextField.BegrunnEndringene":"Begrunn endringene","SubmitButton.ConfirmInformation":"Bekreft og fortsett","HelpText.Aksjonspunkt":"Aksjonspunkt","HelpText.Aksjonspunkt.BehandletAksjonspunkt":"Behandlet aksjonspunkt: ","ValidationMessage.NotEmpty":"Feltet må fylles ut","ValidationMessage.MinLength":"Du må skrive minst {length} tegn","ValidationMessage.MaxLength":"Du kan skrive maksimalt {length} tegn","ValidationMessage.MinValue":"Feltet må være større eller lik {length}","ValidationMessage.MaxValue":"Feltet må være mindre eller lik {length}","ValidationMessage.InvalidDate":"Dato må skrives slik : dd.mm.åååå","ValidationMessage.DateNotBeforeOrEqual":"Dato må være før eller lik {limit}","ValidationMessage.DateNotAfterOrEqual":"Dato må være etter eller lik {limit}","ValidationMessage.DateRangesOverlapping":"Perioder kan ikke overlappe i tid","ValidationMessage.DateRangesOverlappingPeriodTypes":"Perioder kan ikke overlappe i tid (uttak, utsettelse, gradering, overforing, opphold)","ValidationMessage.DatesNotEqual":"Dato må være lik {value}","ValidationMessage.InvalidInteger":"Tallet kan ikke ha desimaler","ValidationMessage.InvalidDecimal":"Tallet kan ikke inneholde mer enn to desimaler","ValidationMessage.InvalidDatesInPeriod":"Periode må skrives slik : dd.mm.åååå - dd.mm.åååå","ValidationMessage.InvalidPeriod":"Startdato må være før eller lik sluttdato","ValidationMessage.InvalidPeriodRange":"Periode er utenfor opptjeningsperioden","ValidationMessage.InvalidNumber":"Feltet kan kun inneholde tall","ValidationMessage.utbetalingsgradErMerSamtidigUttaksprosent":"Feltet kan ikke være høyere enn samtidig uttaksprosent","ValidationMessage.maxLengthOrFodselsnr":"Du kan skrive maksimalt {length} tegn eller et fødselsnummer (11 siffer)","ValidationMessage.Registrering.TerminEllerFoedselMessage":"Fyll ut informasjon om termindato eller fødselsdato","ValidationMessage.InvalidFodselsnummerFormat":"Feltet må være et fødselsnummer (11 siffer)","ValidationMessage.InvalidFodselsnummer":"Ugyldig fødselsnummer","ValidationMessage.SammeFodselsnummerSomSoker":"Fødselsnummer til den andre forelderen kan ikke være det samme som søker.","ValidationMessage.InvalidText":"Feltet inneholder ugyldige tegn: {text}","ValidationMessage.InvalidValue":"Feltet inneholder en ugyldig verdi: {value}","ValidationMessage.ArrayMinLength":"Listen må ha lengde større enn: {length}","ValidationMessage.InvalidSaksnummerOrFodselsnummerFormat":"Ugyldig saksnummer eller fødselsnummer","ValidationMessage.InvalidTrekkAntallDagerUttakForm":"Antall dager i {periode} kan ikke være høyere enn {maxDays}","ValidationMessage.InvalidTrekkDagerFlerbarnsdager":"Antall dager med flerbarnsdager kan ikke være høyere enn {maxDays}","ValidationMessage.NegativeSaldo":"Antall dager kan ikke overstige dagene som gjenstår på {periode}. Det er oppgitt {days} dager for mye.","ValidationMessage.InvalidStonadskonto":"Stønadskonto {konto} er ikke tilgjengelig","ValidationMessage.MinstEnPeriodeRequired":"Minst en av følgende perioder må være utfylt: fullt uttak, overføring av kvote, utsettelse eller gradering","ValidationMessage.trekkdagerErMerEnnNullUtsettelse":"Ingen trekkdager for utsettelse","ValidationMessage.utbetalingMerEnnNullUtsettelse":"Ingen utbetalingsgrad for utsettelse","ValidationMessage.ukerOgDagerVidNullUtbetalningsgradMessage":"Trekk minst en dag når utbetalingsgraden er høyre enn 0%","ValidationMessage.UtsettelseUtenFullArbeid":"Søker har ikke 100% stilling, vurder om perioden kan utsettes.","ValidationMessage.MerEn100Prosent":"Samlet utbetalingsgrad og andel i arbeid bør ikke overskride 100%.","ValidationMessage.MerEn100ProsentOgOgyldigUtsettlse":"Samlet utbetalingsgrad og andel i arbeid bør ikke overskride 100%. Søker har ikke 100% stilling, vurder om perioden kan utsettes.","ValidationMessage.InvalidOrganisasjonsnummer":"Ugyldig organisasjonsnummer.","Calendar.Day.0":"søndag","Calendar.Day.1":"mandag","Calendar.Day.2":"tirsdag","Calendar.Day.3":"onsdag","Calendar.Day.4":"torsdag","Calendar.Day.5":"fredag","Calendar.Day.6":"lørdag","Calendar.Day.Short.0":"søn","Calendar.Day.Short.1":"man","Calendar.Day.Short.2":"tir","Calendar.Day.Short.3":"ons","Calendar.Day.Short.4":"tor","Calendar.Day.Short.5":"fre","Calendar.Day.Short.6":"lør","Calendar.Month.0":"Januar","Calendar.Month.1":"Februar","Calendar.Month.2":"Mars","Calendar.Month.3":"April","Calendar.Month.4":"Mai","Calendar.Month.5":"Juni","Calendar.Month.6":"Juli","Calendar.Month.7":"August","Calendar.Month.8":"September","Calendar.Month.9":"Oktober","Calendar.Month.10":"November","Calendar.Month.11":"Desember"}');var cache=(0,utils.Sn)(),intl=(0,provider.d)({locale:"nb-NO",messages:nb_NO_namespaceObject},cache),VergeFaktaIndex=_ref=>{var{behandling,verge,aksjonspunkter,alleMerknaderFraBeslutter,alleKodeverk,submitCallback,readOnly,harApneAksjonspunkter,submittable}=_ref;return react.createElement(injectIntl.zt,{value:intl},react.createElement(RegistrereVergeInfoPanel,{behandlingId:behandling.id,behandlingVersjon:behandling.versjon,verge,aksjonspunkter,alleMerknaderFraBeslutter,hasOpenAksjonspunkter:harApneAksjonspunkter,alleKodeverk,submitCallback,readOnly,submittable}))};VergeFaktaIndex.propTypes={behandling:propTypes_vergeBehandlingPropType.isRequired,verge:propTypes_vergeVergePropType,aksjonspunkter:prop_types_default().arrayOf(propTypes_vergeAksjonspunkterPropType).isRequired,alleMerknaderFraBeslutter:prop_types_default().shape().isRequired,alleKodeverk:prop_types_default().shape().isRequired,submitCallback:prop_types_default().func.isRequired,readOnly:prop_types_default().bool.isRequired,harApneAksjonspunkter:prop_types_default().bool.isRequired,submittable:prop_types_default().bool.isRequired},VergeFaktaIndex.defaultProps={verge:{}},VergeFaktaIndex.__docgenInfo={description:"",methods:[],displayName:"VergeFaktaIndex",props:{verge:{defaultValue:{value:"{}",computed:!1},description:"",type:{name:"custom",raw:"vergeVergePropType"},required:!1},behandling:{description:"",type:{name:"custom",raw:"vergeBehandlingPropType.isRequired"},required:!1},aksjonspunkter:{description:"",type:{name:"arrayOf",value:{name:"custom",raw:"vergeAksjonspunkterPropType"}},required:!0},alleMerknaderFraBeslutter:{description:"",type:{name:"shape",value:"PropTypes.shape()",computed:!0},required:!0},alleKodeverk:{description:"",type:{name:"shape",value:"PropTypes.shape()",computed:!0},required:!0},submitCallback:{description:"",type:{name:"func"},required:!0},readOnly:{description:"",type:{name:"bool"},required:!0},harApneAksjonspunkter:{description:"",type:{name:"bool"},required:!0},submittable:{description:"",type:{name:"bool"},required:!0}}};const src_VergeFaktaIndex=VergeFaktaIndex;var withRedux=__webpack_require__("./packages/storybook/decorators/withRedux.tsx"),alleKodeverk=__webpack_require__("./packages/storybook/stories/mocks/alleKodeverk.json"),behandling={id:1,versjon:1},aksjonspunkter=[{definisjon:{kode:aksjonspunktCodes.default.AVKLAR_VERGE},status:{kode:aksjonspunktStatus.Z.OPPRETTET},begrunnelse:void 0,kanLoses:!0,erAktivt:!0}],verge={},merknaderFraBeslutter={notAccepted:!1};const VergeFaktaIndex_stories={title:"fakta/fakta-verge",component:src_VergeFaktaIndex,decorators:[addon_knobs_dist.withKnobs,withRedux.Z]};var visAksjonspunktForAvklaringAvVerge=()=>react.createElement(src_VergeFaktaIndex,{behandling,verge,aksjonspunkter,alleKodeverk,alleMerknaderFraBeslutter:{[aksjonspunktCodes.default.AVKLAR_VERGE]:(0,addon_knobs_dist.object)("merknaderFraBeslutter",merknaderFraBeslutter)},submitCallback:(0,dist.aD)("button-click"),readOnly:(0,addon_knobs_dist.boolean)("readOnly",!1),harApneAksjonspunkter:(0,addon_knobs_dist.boolean)("harApneAksjonspunkter",!0),submittable:(0,addon_knobs_dist.boolean)("submittable",!0)}),__namedExportsOrder=["visAksjonspunktForAvklaringAvVerge"];visAksjonspunktForAvklaringAvVerge.__docgenInfo={description:"",methods:[],displayName:"visAksjonspunktForAvklaringAvVerge"}}}]);