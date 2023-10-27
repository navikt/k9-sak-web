(self.webpackChunkk9_sak_web=self.webpackChunkk9_sak_web||[]).push([[9732],{"./packages/kodeverk/src/aksjonspunktStatus.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__,v:()=>isAksjonspunktOpen});var aksjonspunktStatus={OPPRETTET:"OPPR",UTFORT:"UTFO",AVBRUTT:"AVBR"};const __WEBPACK_DEFAULT_EXPORT__=aksjonspunktStatus;var isAksjonspunktOpen=statusKode=>statusKode===aksjonspunktStatus.OPPRETTET},"./packages/utils-test/src/intl-enzyme-test-helper.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{VN:()=>shallowWithIntl});var provider=__webpack_require__("./node_modules/react-intl/lib/src/components/provider.js"),utils=__webpack_require__("./node_modules/@formatjs/intl/lib/src/utils.js"),build=__webpack_require__("./node_modules/enzyme/build/index.js");const nb_NO_namespaceObject=JSON.parse('{"TilleggsopplysningerInfoPanel.Tilleggsopplysninger":"Tilleggsopplysninger","ArbeidsforholdInfoPanel.Title":"Arbeidsforhold","EtablertTilsynInfoPanel.Title":"Etablert tilsyn","InntektsmeldingInfoPanel.Title":"Inntektsmelding","UtenlandsoppholdInfoPanel.Title":"Utenlandsopphold","FodselInfoPanel.Fodsel":"Fødsel","MedlemskapInfoPanel.Medlemskap":"Medlemskap","RegistrereVergeInfoPanel.Info":"Verge/fullmektig","AdopsjonInfoPanel.Adopsjon":"Adopsjon","OmsorgOgForeldreansvarInfoPanel.Omsorg":"Omsorg og foreldreansvar","OpptjeningInfoPanel.KontrollerFaktaForOpptjening":"Opptjening","OverstyrBeregningPanel.OverstyrBeregning":"Overstyr inntekt","InfotrygdmigreringPanel.Infotrygdmigrering":"Overgang fra infotrygd","BeregningInfoPanel.Title":"Beregning","FordelBeregningsgrunnlag.Title":"Fordeling","OmsorgInfoPanel.Omsorg":"Omsorg","UttakInfoPanel.FaktaUttak":"Uttak","FaktaRammevedtak.Title":"Deling av dager","FaktaNøkkeltall.Title":"Nøkkeltall","FaktaBarn.Title":"Barn","FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging":"Fødsel og tilrettelegging","FaktaOmAlderOgOmsorg.header":"Alder og omsorg","MedisinskVilkarPanel.MedisinskVilkar":"Sykdom","SoknadsperioderPanel.Soknadsperioder":"Søknadsperioder","InntektOgYtelser.Title":"Inntekt og ytelser","Institusjon.Title":"Institusjon","Opplaering.Title":"Opplæring","OpplysningerFraSoknaden.Title":"Søknaden","OmsorgenForInfoPanel.Title":"Omsorgen for","OmBarnetInfoPanel.Title":"Om barnet","Personspanel.Arbeidsforhold":"Opplysninger om søker","BostedBarnView.DodsDato":"Barnets dødsdato","YtelserFaktaIndex.Ytelser":"Ytelser","SakenFaktaPanel.Title":"Saken","Messages.BrevErBestilt":"Brevet er bestilt. Du kan endre frist eller årsak før du fortsetter.","Behandlingspunkt.MedisinskVilkar":"Sykdom","Behandlingspunkt.Saksopplysninger":"Saksopplysninger","Behandlingspunkt.Inngangsvilkar":"Inngangsvilkår","Behandlingspunkt.InngangsvilkarForts":"Inngangsvilkår Fortsettelse","Behandlingspunkt.CheckVarselRevurdering":"Varsel","Behandlingspunkt.CheckFormkravNFP":"Formkrav Vedtaksinstans","Behandlingspunkt.CheckKlageresultatNFP":"Resultat Vedtaksinstans","Behandlingspunkt.CheckFormkravNK":"Formkrav Klageinstans","Behandlingspunkt.CheckKlageresultatNK":"Resultat Klageinstans","Behandlingspunkt.CheckKlageNFP":"Behandling Vedtaksinstans","Behandlingspunkt.CheckKlageNK":"Behandling Klageinstans","Behandlingspunkt.FormkravKlageNFP":"Formkrav Vedtaksinstans","Behandlingspunkt.FormkravKlageKA":"Formkrav Klageinstans","Behandlingspunkt.Ankebehandling":"Ankebehandling","Behandlingspunkt.AnkeMerknader":"Merknader","Behandlingspunkt.Beregning":"Beregning","Behandlingspunkt.Uttak":"Uttak","Behandlingspunkt.Alder":"Alder","Behandlingspunkt.UtvidetRett":"Utvidet Rett","Behandlingspunkt.OmsorgenFor":"Omsorgen For","Behandlingspunkt.AleneOmOmsorgen":"Alene om omsorgen","Behandlingspunkt.BeregningForeldrepenger":"Beregning","Behandlingspunkt.Vedtak":"Vedtak","Behandlingspunkt.Innsyn":"Behandle innsyn","Behandlingspunkt.Opplysningsplikt":"Opplysningsplikt","Behandlingspunkt.Opplaering":"Opplæring","Behandlingspunkt.OmsorgsvilkaretEngangsstonad":"Fakta om omsorg og foreldreansvar","Behandlingspunkt.FortsattMedlemskap":"Fortsatt medlem","Behandlingspunkt.Beregningsgrunnlagvilkaret":"Beregning","Behandlingspunkt.TilkjentYtelse":"Tilkjent ytelse","Behandlingspunkt.Soknadsfristvilkaret":"Søknadsfrist","Behandlingspunkt.FaktaOmOpptjening":"Fakta om opptjening","Behandlingspunkt.FaktaOmOmsorg":"Fakta om omsorg","Behandlingspunkt.FaktaOmUttak":"Fakta om uttak","Behandlingspunkt.FaktaOmVerge":"Fakta om verge/fullmektig","Behandlingspunkt.ResultatKlage":"Resultat","Behandlingspunkt.AnkeResultat":"Resultat","Behandlingspunkt.Avregning":"Simulering","Behandlingspunkt.Unntak":"Manuell Behandling","Behandlingspunkt.Foreldelse":"Foreldelse","Behandlingspunkt.Tilbakekreving":"Tilbakekreving","Behandlingspunkt.Opptjening":"Opptjening","InngangsvilkarPanel.AvventerAvklaringAv":"Avventer avklaring av fakta om ","OpptjeningVilkarView.VurderOmSøkerHarRett":"Vurder om søker har opptjent rett til foreldrepenger","FodselVilkarForm.VurderGjelderSammeBarn":"Vurder om tidligere utbetalte foreldrepenger eller engangsstønad gjelder for samme barn. Dersom det gjelder for samme barn er dette vilkåret ikke oppfylt.","ErOmsorgVilkaarOppfyltForm.Paragraf":"Vurder om vilkårene i § 14-17 tredje ledd for far er oppfylt (når mor dør ifm fødsel/omsorgsovertakelse)","ErOmsorgVilkaarOppfyltForm.Vurder":"Vurder om tidligere utbetalte foreldrepenger eller engangsstønad gjelder for samme barn. Dersom det gjelder for samme barn er dette vilkåret ikke oppfylt.","ErForeldreansvarVilkaarOppfyltForm.Vurder":"Vurder om tidligere utbetalte foreldrepenger eller engangsstønad gjelder for samme barn. Dersom det gjelder for samme barn er dette vilkåret ikke oppfylt.","ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafEngangsStonad":"Vurder om vilkår om foreldreansvaret etter § 14-17 andre ledd er oppfylt","ErForeldreansvarVilkaarOppfyltForm.2LeddParagrafForeldrepenger":"Vurder om vilkår om foreldreansvaret etter § 14-5 andre ledd er oppfylt","ErForeldreansvarVilkaarOppfyltForm.4LeddParagraf":"Vurder om vilkårene i § 14-17 fjerde ledd for far er oppfylt (når far overtar foreldreansvaret alene)","SvangerskapVilkarForm.FyllerVilkår":"Kontroller at søker fyller vilkårene i § 14-4 første eller andre ledd og tredje ledd, første punktum","AdopsjonVilkarForm.VurderGjelderSammeBarn":"Vurder om tidligere utbetalte foreldrepenger eller engangsstønad gjelder for samme barn. Dersom det gjelder for samme barn er dette vilkåret ikke oppfylt.","IverksetterVedtakStatusModal.Beskrivelse":"Vedtak er innvilget. Du kommer nå til forsiden.","IverksetterVedtakStatusModal.VedtakAvslatt":"Vedtak er avslått.","IverksetterVedtakStatusModal.VedtakInnvilet":"Vedtaket ble fattet og blir nå iverksatt","IverksetterVedtakStatusModal.Innvilget":"Innvilget","IverksetterVedtakStatusModal.Avslatt":"Avslått","IverksetterVedtakStatusModal.InnvilgetOgIverksattAutomatisk":"Vedtaket ble automatisk fattet og blir nå iverksatt","IverksetterVedtakStatusModal.InnvilgetOgIverksatt":"Vedtaket ble fattet og blir nå iverksatt","IverksetterVedtakStatusModal.UendretUtfall":"Resultat: Ingen endring, behandlingen avsluttes.","IverksetterVedtakStatusModal.GoToSearchPage":"Du kommer nå til forsiden","IverksetterVedtakStatusModal.Ok":"OK","BegrunnelsePanel.ConfirmInformation":"Bekreft opplysningene","BegrunnelsePanel.ChangeOfInformationRequiresExplanation":"Begrunn endringene","BegrunnelsePanel.readOnly":"Begrunnelse","FaktaBegrunnelseTextField.BegrunnEndringene":"Begrunn endringene","FaktaBegrunnelseTextField.Vurdering":"Vurdering","BehandlingspunktBegrunnelseTextField.ExplanationRequired":"Vurdering","BehandlingspunktBegrunnelseTextField.ExplanationRequiredReadOnly":"Begrunnelse","ConfirmInformationVilkarReadOnly.Reasoning":"Begrunnelse","ConfirmInformationVilkarReadOnly.ConditionMet":"Vilkåret er oppfylt","ConfirmInformationVilkarReadOnly.ConditionNotMet":"Vilkåret er ikke oppfylt","Fagsak.NoFagsakWithReferenceNr":"Det finnes ingen sak med saksnummer: {saksnummer}","BehandlingErPaVentModal.ModalDescription":"Behandlingen er satt på vent","BehandlingErPaVentModal.PaVent":"På vent","BehandlingErPaVentModal.SattPaVent":"Behandlingen er satt på vent med frist {frist}","BehandlingErPaVentModal.Ok":"OK","BehandlingErPaVentModal.EndreFrist":"Du kan endre frist eller årsak før du fortsetter","FortsattMedlemskapFaktaPanel.Fom":"Gjeldende f.o.m","FortsattMedlemskapFaktaPanel.OpplysningerFraFolkeregisteret":"Opplysninger fra folkeregisteret:","FortsattMedlemskapFaktaPanel.NyUtlandsadresse":"Ny utenlandsadresse f.o.m. {dato}","FortsattMedlemskapFaktaPanel.EndretStatsborgerskap":"Endret statsborgerskap f.o.m. {dato}","FortsattMedlemskapFaktaPanel.EndretPersonstatus":"Endret personstatus f.o.m. {dato}","FortsattMedlemskapFaktaPanel.DateNotAfterOrEqual":"Dato kan ikke være før skjæringstidspunktet {limit}","ArbeidsforholdFaktaPanel.Faktagruppe":"Arbeidsforhold som det er søkt for","ArbeidsforholdFaktaPanel.Oppdater":"Oppdater","ArbeidsforholdFaktaPanel.Avbryt":"Avbryt","ArbeidsforholdTable.Arbeidsforhold":"Arbeidsforhold","ArbeidsforholdTable.TilretteleggingFra":"Trenger tilrettelegging fra","ArbeidsforholdTable.Revurdering":"Nye opplysninger","ArbeidsforholdTable.Ja":"Ja","ArbeidsforholdTable.Nei":"Nei","ArbeidsforholdInnhold.Jordmor.TilretteleggingFra":"Jordmor/lege oppgir at tilrettelegging er nødvendig fra og med","ArbeidsforholdInnhold.BegrunnEndringene":"Begrunn endringene","ArbeidsforholdInnhold.TilretteleggingWarning":"For et av arbeidsforholdene er datoene fra arbeidsgiver motstridende. Avklar dette før du kan gå videre i saken.","ArbeidsforholdInnhold.LeggTilPeriode":"Legg til periode","ArbeidsforholdCheckboxes.Arbeidsgiver.Tilrettelegging":"Arbeidsgiver oppgir at nødvendig tilrettelegging","ArbeidsforholdCheckboxes.Arbeidsgiver.Dato":"Dato","ArbeidsforholdCheckboxes.Arbeidsgiver.Stillingsprosent":"Stillingsprosent","ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores":"a) kan gjennomføres slik at arbeidstakeren kan fortsette med samme stilling fra og med","ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid":"b) kan gjennomføres slik at arbeidstakeren kan fortsette med redusert arbeidstid fra og med","ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores":"c) kan ikke gjennomføres og arbeidstakeren må midlertidig gå ut av sitt arbeid fra og med","HelpText.Aksjonspunkt":"Aksjonspunkt","HelpText.Aksjonspunkt.BehandletAksjonspunkt":"Behandlet aksjonspunkt: ","InfoPanel.History":"Historikk","InfoPanel.Messages":"Send melding","InfoPanel.Documents":"Dokumenter","InfoPanel.Approval":"Godkjenning","InfoPanel.Returned":"Fra beslutter","InfoPanel.Medunderskriver":"Fra medund.","InfoPanel.UtforteEndringer":"Utførte endringer","InfoPanel.Godkjenn":"Godkjenn vedtaket","InfoPanel.SendTilbake":"Send til saksbehandler","InfoPanel.Godkjent":"Godkjent","InfoPanel.Vurder":"Vurder på nytt","InfoPanel.Arsak":"Årsak","InfoPanel.Begrunnelse":"Begrunnelse","Historikk.ikkeGodkjent":"må vurderes på nytt","Historikk.godkjent":"er godkjent","Historikk.godkjentKomplett":"Er godkjent","Historikk.ikkeGodkjentKomplett":"Må vurderes på nytt","InfoPanel.FeilFakta":"Feil fakta","InfoPanel.FeilLovanvendelse":"Feil lovanvendelse","InfoPanel.FeilRegelForstaelse":"Feil regelforståelse","InfoPanel.Annet":"Annet","InfoPanel.resultatAvGodkjenning":"Resultat av godkjenning","Malform.Bokmal":"Bokmål","Malform.Nynorsk":"Nynorsk","Malform.Engelsk":"Engelsk","Malform.Beskrivelse":"Foretrukket språk","Tekstbygger.Og":"{value1} og {value2}","Tekstbygger.KombinerObjekter":"{object1} {object2}","MissingPage.PageIsMissing":"Siden finnes ikke","MissingPage.Home":"Hjem","VilkarResultPanel.VilkarOppfylt":"Vilkåret er oppfylt","VilkarResultPanel.VilkarIkkeOppfylt":"Vilkåret er ikke oppfylt","Person.Age":"{age} år","Person.ImageText":"Personinformasjon","Person.Woman":"Kvinne","Person.Man":"Mann","Person.Unknown":"Ukjent","Person.ManglerDodsdato":"Dødsdato mangler","Person.HarIkkeNorskFnrEllerDnr":"Har ikke norsk f.nr. eller d-nr.","MerkePanel.Dod":"DØD","MerkePanel.DodFodt":"DØDFØDT","MerkePanel.Diskresjon6":"Kode 6","MerkePanel.Diskresjon7":"Kode 7","MerkePanel.EgenAnsatt":"NAV","MerkePanel.Verge":"Verge","MerkePanel.DodTittel":"Personen er død","MerkePanel.Diskresjon6Tittel":"Personen har diskresjonsmerking kode 6","MerkePanel.Diskresjon7Tittel":"Personen har diskresjonsmerking kode 7","MerkePanel.EgenAnsattTittel":"Personen er ansatt i NAV","MerkePanel.VergeTittel":"Personen har verge","Historikk.Omsorg.Omsorg":"Omsorg","Historikk.Aleneomsorg.Aleneomsorg":"Aleneomsorg","Historikk.Aleneomsorg.ApplicationInformation":"Manuell kontroll av om søker har aleneomsorg","Historikk.Omsorg.ApplicationInformation":"Manuell kontroll av om søker har omsorg","SubmitButton.ConfirmInformation":"Bekreft og fortsett","SubmitButton.SettPåVent":"Sett behandling på vent","Historikk.Tilleggsopplysninger":"Tilleggsopplysninger","ValidationMessage.NotEmpty":"Feltet må fylles ut","ValidationMessage.MinLength":"Du må skrive minst {length} tegn","ValidationMessage.MaxLength":"Du kan skrive maksimalt {length} tegn","ValidationMessage.MinValue":"Feltet må være større eller lik {length}","ValidationMessage.MaxValue":"Feltet må være mindre eller lik {length}","ValidationMessage.InvalidDate":"Dato må skrives slik : dd.mm.åååå","ValidationMessage.DateNotBeforeOrEqual":"Dato må være før eller lik {limit}","ValidationMessage.DateNotAfterOrEqual":"Dato må være etter eller lik {limit}","ValidationMessage.DateRangesOverlapping":"Perioder kan ikke overlappe i tid","ValidationMessage.DateRangesOverlappingPeriodTypes":"Perioder kan ikke overlappe i tid (uttak, utsettelse, gradering, overforing, opphold)","ValidationMessage.DatesNotEqual":"Dato må være lik {value}","ValidationMessage.InvalidInteger":"Tallet kan ikke ha desimaler","ValidationMessage.InvalidDecimal":"Tallet kan ikke inneholde mer enn to desimaler","ValidationMessage.InvalidDatesInPeriod":"Periode må skrives slik : dd.mm.åååå - dd.mm.åååå","ValidationMessage.InvalidPeriod":"Startdato må være før eller lik sluttdato","ValidationMessage.InvalidPeriodRange":"Periode er utenfor opptjeningsperioden","ValidationMessage.InvalidNumber":"Feltet kan kun inneholde tall","ValidationMessage.utbetalingsgradErMerSamtidigUttaksprosent":"Feltet kan ikke være høyere enn samtidig uttaksprosent","ValidationMessage.maxLengthOrFodselsnr":"Du kan skrive maksimalt {length} tegn eller et fødselsnummer (11 siffer)","ValidationMessage.Registrering.TerminEllerFoedselMessage":"Fyll ut informasjon om termindato eller fødselsdato","ValidationMessage.InvalidFodselsnummerFormat":"Feltet må være et fødselsnummer (11 siffer)","ValidationMessage.InvalidFodselsnummer":"Ugyldig fødselsnummer","ValidationMessage.SammeFodselsnummerSomSoker":"Fødselsnummer til den andre forelderen kan ikke være det samme som søker.","ValidationMessage.InvalidText":"Feltet inneholder ugyldige tegn: {text}","ValidationMessage.InvalidValue":"Feltet inneholder en ugyldig verdi: {value}","ValidationMessage.ArrayMinLength":"Listen må ha lengde større enn: {length}","ValidationMessage.InvalidSaksnummerOrFodselsnummerFormat":"Ugyldig saksnummer eller fødselsnummer","ValidationMessage.InvalidTrekkAntallDagerUttakForm":"Antall dager i {periode} kan ikke være høyere enn {maxDays}","ValidationMessage.InvalidTrekkDagerFlerbarnsdager":"Antall dager med flerbarnsdager kan ikke være høyere enn {maxDays}","ValidationMessage.NegativeSaldo":"Antall dager kan ikke overstige dagene som gjenstår på {periode}. Det er oppgitt {days} dager for mye.","ValidationMessage.InvalidStonadskonto":"Stønadskonto {konto} er ikke tilgjengelig","ValidationMessage.MinstEnPeriodeRequired":"Minst en av følgende perioder må være utfylt: fullt uttak, overføring av kvote, utsettelse eller gradering","ValidationMessage.trekkdagerErMerEnnNullUtsettelse":"Ingen trekkdager for utsettelse","ValidationMessage.utbetalingMerEnnNullUtsettelse":"Ingen utbetalingsgrad for utsettelse","ValidationMessage.ukerOgDagerVidNullUtbetalningsgradMessage":"Trekk minst en dag når utbetalingsgraden er høyre enn 0%","ValidationMessage.UtsettelseUtenFullArbeid":"Søker har ikke 100% stilling, vurder om perioden kan utsettes.","ValidationMessage.MerEn100Prosent":"Samlet utbetalingsgrad og andel i arbeid bør ikke overskride 100%.","ValidationMessage.MerEnNullUtaksprosent":"Uttak av foreldrepenger i denne perioden er avslått, utbetalingsgrad kan ikke være større enn 0.","ValidationMessage.MerEn100ProsentOgOgyldigUtsettlse":"Samlet utbetalingsgrad og andel i arbeid bør ikke overskride 100%. Søker har ikke 100% stilling, vurder om perioden kan utsettes.","ValidationMessage.InvalidOrganisasjonsnummer":"Ugyldig organisasjonsnummer.","VilkarsresultatView.VilkarOppfylt":"Vilkåret er oppfylt","VilkarsresultatView.VilkarIkkeOppfylt":"Vilkåret er ikke oppfylt","VilkarsresultatView.VilkarIkkeOppfylt1":"Vilkåret er ","VilkarsresultatView.VilkarIkkeOppfylt2":"ikke","VilkarsresultatView.VilkarIkkeOppfylt3":" oppfylt","VilkarsresultatView.VurderOmKravErOppfylt":"Vurder om {lovReferanse} er oppfylt","VilkarsresultatView.Begrunnelse":"Vurdering","FatterVedtakStatusModal.GoToSearchPage":"Du kommer nå til forsiden.","FatterVedtakStatusModal.Ok":"OK","FatterVedtakStatusModal.ModalDescription":"Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.","FatterVedtakStatusModal.ModalDescriptionFRISINN":"FRISINN er avslått.","FatterVedtakStatusModal.ModalDescriptionOMS":"Omsorgspenger er avslått.","FatterVedtakStatusModal.ModalDescriptionUtvidetRett":"Ekstra omsorgsdager er avslått.","FatterVedtakStatusModal.ModalDescriptionPleiepenger":"Behandlingen er sendt til godkjenning.","FatterVedtakStatusModal.ModalDescriptionOpplaeringspenger":"Behandlingen er sendt til godkjenning.","FatterVedtakStatusModal.Sendt":"Forslag til vedtak er sendt til beslutter","FatterVedtakStatusModal.SendtBeslutter":"Forslag til vedtak er sendt til beslutter","FatterVedtakStatusModal.KlagenErFerdigbehandlet":"Klagen er ferdigbehandlet.","FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver":"Forslag til klageresultat er sendt til medunderskriver.","SettBehandlingPaVentModal.ModalDescription":"Behandlingen settes på vent med frist","SettBehandlingPaVentModal.PaVent":"På vent","SettBehandlingPaVentModal.SettesPaVent":"Behandlingen settes på vent med frist","SettBehandlingPaVentModal.ErPaVent":"Behandlingen er satt på vent med frist","SettBehandlingPaVentModal.ErPaVentUtenFrist":"Behandlingen er satt på vent","SettBehandlingPaVentModal.Ok":"OK","SettBehandlingPaVentModal.Arsak":"Årsak","SettBehandlingPaVentModal.SelectPlaceholder":"Velg årsak","SettBehandlingPaVentModal.Avbryt":"Avbryt","SettBehandlingPaVentModal.Lukk":"Lukk","PeriodLabel.DateToday":"d.d.","Registrering.RegistrereSoknad":"Registrere søknad","Registrering.RegistrerAlleOpplysninger":"Registrer inn alle opplysninger fra papirsøknaden","Registrering.Omsoknaden.Title":"Om søknaden","Registrering.Omsoknaden.soknadstype":"Søknadstype","Registrering.Omsoknaden.Tema":"Tema","Registrering.Omsoknaden.Soker":"Søker","Registrering.Omsoknaden.VisSkjema":"Vis skjema","SoknadRegistrertModal.ContentLabel":"Søknaden er registrert. Du kommer nå til forsiden.","SoknadRegistrertModal.InfoTextOne":"Søknaden er registrert og vil bli behandlet","SoknadRegistrertModal.InfoTextTwo":"Du kommer nå til forsiden","SoknadRegistrertModal.OkButtonText":"OK","PeriodFieldArray.LeggTilPeriode":"Legg til periode","PeriodFieldArray.LeggTilBarn":"Legg til barn","PreviewAnkeLink.ForhandvisBrev":"Forhåndsvis brev","PeriodeInformasjon.Feilutbetaling":"Feilutbetaling","PeriodeController.Detaljer":"Detaljer for valgt periode","PeriodeController.DelOppPerioden":"Del opp perioden","PeriodeController.ForrigePeriode":"Forrige periode","PeriodeController.NestePeriode":"Neste periode","Behandling.EditedField":"Saksbehandler har endret feltets verdi","Calendar.Day.0":"søndag","Calendar.Day.1":"mandag","Calendar.Day.2":"tirsdag","Calendar.Day.3":"onsdag","Calendar.Day.4":"torsdag","Calendar.Day.5":"fredag","Calendar.Day.6":"lørdag","Calendar.Day.Short.0":"søn","Calendar.Day.Short.1":"man","Calendar.Day.Short.2":"tir","Calendar.Day.Short.3":"ons","Calendar.Day.Short.4":"tor","Calendar.Day.Short.5":"fre","Calendar.Day.Short.6":"lør","Calendar.Month.0":"Januar","Calendar.Month.1":"Februar","Calendar.Month.2":"Mars","Calendar.Month.3":"April","Calendar.Month.4":"Mai","Calendar.Month.5":"Juni","Calendar.Month.6":"Juli","Calendar.Month.7":"August","Calendar.Month.8":"September","Calendar.Month.9":"Oktober","Calendar.Month.10":"November","Calendar.Month.11":"Desember","Skjermlenke.Klage.ResolveKlage.Title":"Behandle klage","Klage.ResolveKlage.ExplanationRequiredBrev":"Begrunnelse/tekst i brev","KlageVurderingModal.VedtakOversendt":"Innstilling er sendt til NAV Klageinstans.","KlageVurderingModal.ModalDescription":"Vedtaket er stadfestet. Du kommer nå til forsiden","KlageVurderingModal.GoToSearchPage":"Du kommer nå til forsiden.","KlageVurderingModal.Ok":"OK","AnkeVurderingModal.VedtakOversendt":"Behandlingen er sendt.","AnkeVurderingModal.ModalDescription":"Vedtaket er stadfestet. Du kommer nå til forsiden","AnkeVurderingModal.GoToSearchPage":"Du kommer nå til forsiden.","AnkeVurderingModal.Ok":"OK","OverstyrBegrunnelsePanel.Beregning":"Oppgi årsak til overstyring av beregningsgrunnlag","OverstyrBekreftKnappPanel.ConfirmInformation":"Bekreft overstyring","OverstyrVurderingVelger.OverstyrBeregning":"Overstyr beregning","OverstyrVurderingVelger.OverstyrtBeregning":"Overstyrt beregning","OverstyrVurderingVelger.OverstyrAutomatiskVurdering":"Overstyr automatisk vurdering","OverstyrVurderingVelger.OverstyrtAutomatiskVurdering":"Overstyrt automatisk vurdering","VilkarBegrunnelse.Vilkar":"Vurdering","Personstatus.Ukjent":"Ukjent","UtbetalningTimeLine.Title":"Detaljer for valgt periode","UtbetalningTimeLine.Periode":"Periode","UtbetalningTimeLine.Type":"Type","UtbetalningTimeLine.Dagsats":"Dagsats","UtbetalningTimeLine.Arbeidsgiver":"Arbeidsgiver","UtbetalningTimeLine.IArbeid":"I arbeid","UtbetalningTimeLine.Refusjon":"Refusjon","UtbetalningTimeLine.SistePermisjonsdag":"Siste permisjonsdag","KeyboardNavigation.PrevPeriod":"Foregående periode","KeyboardNavigation.NextPeriod":"Neste periode","Timeline.scrollLeft":"Scrolle venstre","Timeline.scrollRight":"Scrolle høyre","Timeline.zoomIn":"Zoom inn","Timeline.zoomOut":"Zoom ut","Timeline.openData":"Åpne info om første periode","Timeline.closeData":"Lukke info om periode","Timeline.nextPeriod":"Neste periode","Timeline.prevPeriod":"Forrige periode","Timeline.tooltip.dagsats":"Dagsats: {dagsats}kr","Timeline.tooltip.start":"Start","Timeline.tooltip.slutt":"Slutt","Timeline.tooltip.periodetype":"Periodetype","Timeline.tooltip.utsettelsePeriode":"Utsettelse","Timeline.TidspunktFamiliehendelse":"Tidspunkt for familiehendelse","Timeline.OppfyltPeriode":"Oppfylt periode","Timeline.IkkeOppfyltPeriode":"Ikke oppfylt periode","Timeline.TidspunktMotakSoknad":"Tidspunkt for mottatt søknad","Timeline.BelopTilbakereves":"Beløp tilbakekreves","Timeline.IngenTilbakekreving":"Ingen tilbakekreving","Timeline.IkkeAvklartPeriode":"Uavklart periode","Timeline.TidspunktRevurdering":"Startpunkt for revurdering","Timeline.GradertPeriode":"Gradert periode","Timeline.ManueltAvklart":"Manuelt avklart periode","DelOppPeriodeModalImpl.Periode":"Periode","DelOppPeriodeModalImpl.AngiTomDato":"Angi t.o.m. dato for første periode","DelOppPeriodeModalImpl.ModalDescription":"Periode er splittet","DelOppPeriodeModalImpl.DelOppPerioden":"Del opp perioden","DelOppPeriodeModalImpl.Ok":"Ok","DelOppPeriodeModalImpl.Avbryt":"Avbryt","DelOppPeriodeModalImpl.DatoUtenforPeriode":"Dato må være innenfor perioden","DelOppPeriodeModalImpl.BelopEr0":"Periode har 0 virkedager","SykdomsperiodeFieldArray.AngiSykdomsperiode":"Angi sykdomsperiode","SykdomsperiodeFieldArray.periodeFom":"F.o.m.","SykdomsperiodeFieldArray.periodeTom":"T.o.m.","SykdomsperiodeFieldArray.LeggTilPeriode":"Legg til periode","OkAvbrytModal.Ok":"OK","OkAvbrytModal.Avbryt":"Avbryt","TilretteleggingTable.IngenTilretteleggingDatoer":"Ingen tilretteleggingsdatoer er spesifisert","TilretteleggingTable.NodvendigTilrettelegging":"Arbeidsgiver oppgir at nødvendig tilrettelegging","TilretteleggingTable.Dato":"Dato","TilretteleggingTable.Stillingsprosent":"Stillingsprosent","FatterTilbakekrevingVedtakStatusModal.GoToSearchPage":"Du kommer nå til forsiden.","FatterTilbakekrevingVedtakStatusModal.Ok":"OK","FatterTilbakekrevingVedtakStatusModal.Sendt":"Forslag til vedtak er sendt til beslutter","TilretteleggingDetailForm.Endre":"Endre","TilretteleggingDetailForm.LeggTil":"Legg til","TilretteleggingDetailForm.Avbryt":"Avbryt","TilretteleggingDetailForm.DatoFinnes":"Dato brukes i annen tilrettelegging","TilretteleggingDetailForm.TidligereEnnOppgittAvJordmor":"Dato kan ikke være før dato oppgitt av jordmor/lege","TilretteleggingDetailForm.SenereEnnTilrettelegging":"Dato kan ikke være etter tilretteleggingsdato","FritekstAnkeBrevTextField":"Fritekst til brev","BehandlingTilbakekrevingIndex.ApenRevurdering":"Det finnes en åpen revurdering som kan påvirke denne tilbakekrevingsbehandlingen. Vurder konsekvens ved behandling.","BehandlingTilbakekrevingIndex.ApenRevurderingHeader":"Åpen revurdering","IntegrationStatusPanel.ServiceDowntime":"Tredjepartstjeneste(r) har nedetid","IntegrationStatusPanel.Downtime":"{system} har nedetid.","IntegrationStatusPanel.DowntimeUntil":"{system} har nedetid frem til {datetime}.","IntegrationStatusPanel.Endpoint":"Endepunkt:","IntegrationStatusPanel.ErrorMessage":"Feilmelding:","IntegrationStatusPanel.Stacktrace":"StackTrace:","DataFetchPendingModal.LosningenJobberMedBehandlingen":"Løsningen jobber med behandlingen...","AdvarselModal.Ok":"OK","ProsessStegIkkeBehandletPanel.IkkeBehandlet":"Dette steget er ikke behandlet","BehandlingHenlagtPanel.Henlagt":"Behandlingen er henlagt","TilbakekrevingFakta.FaktaFeilutbetaling":"Feilutbetaling","MainSideMenu.Heading":"Saksopplysninger","AktoerGrid.IngenFagsaker":"Har ingen fagsaker i k9-sak","DashboardResolver.FpLosErNede":"Forsiden har nedetid","Rest.ErrorMessage.General":"Noe feilet. Feilen kan være forbigående. Prøv å behandle saken litt senere. Om feilen oppstår igjen, meld den inn via porten.","Rest.ErrorMessage.DownTime":"Saksbehandlingsløsningen venter på et annet system som har nedetid nå. Du trenger ikke melde inn en feil, men prøv igjen {date} kl. {time}.\\n{message}","Rest.ErrorMessage.PollingTimeout":"Serverkall har gått ut på tid: {location}","Rest.ErrorMessage.GatewayTimeoutOrNotFound":"Får ikke kontakt med {contextPath} ({location})","OMSORGEN_FOR":"Omsorgen for","KONTINUERLIG_TILSYN":"Kontinuerlig tilsyn og pleie","OmPleietrengendeInfoPanel.Title":"Om pleietrengende"}');function shallowWithIntl(node){var messages=arguments.length>1&&void 0!==arguments[1]?arguments[1]:nb_NO_namespaceObject;return(0,build.shallow)(node,{wrappingComponent:provider.Z,wrappingComponentProps:{locale:"nb-NO",defaultLocale:"nb-NO",messages}})}var cache=(0,utils.Sn)(),getIntlObject=messages=>{var selectedMessages=messages||nb_NO_namespaceObject;return(0,provider.d)({locale:"nb-NO",defaultLocale:"nb-NO",messages:selectedMessages},cache)};getIntlObject(nb_NO_namespaceObject)},"?4f7e":()=>{}}]);