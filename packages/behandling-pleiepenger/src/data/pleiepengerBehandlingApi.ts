import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum PleiepengerBehandlingApiKeys {
  BEHANDLING_PP = 'BEHANDLING_PP',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
  HENT_FRITEKSTBREV_HTML = 'HENT_FRITEKSTBREV_HTML',
  STONADSKONTOER_GITT_UTTAKSPERIODER = 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER = 'AKSJONSPUNKTER',
  VILKAR = 'VILKAR',
  SOKNADSFRIST_STATUS = 'SOKNADSFRIST_STATUS',
  PERSONOPPLYSNINGER = 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT = 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG = 'TILBAKEKREVINGVALG',
  BEREGNINGSRESULTAT_UTBETALING = 'BEREGNINGSRESULTAT_UTBETALING',
  BEREGNINGSGRUNNLAG = 'BEREGNINGSGRUNNLAG',
  FAMILIEHENDELSE = 'FAMILIEHENDELSE',
  SOKNAD = 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING = 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING = 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  MEDLEMSKAP = 'MEDLEMSKAP',
  UTTAK_PERIODE_GRENSE = 'UTTAK_PERIODE_GRENSE',
  VERGE = 'VERGE',
  OPPTJENING = 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING = 'SEND_VARSEL_OM_REVURDERING',
  FAKTA_ARBEIDSFORHOLD = 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER = 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER = 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER = 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET = 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING = 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING = 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD = 'BEHANDLING_ON_HOLD',
  VERGE_OPPRETT = 'VERGE_OPPRETT',
  VERGE_FJERN = 'VERGE_FJERN',
  SYKDOM = 'SYKDOM',
  TILGJENGELIGE_VEDTAKSBREV = 'TILGJENGELIGE_VEDTAKSBREV',
  INFORMASJONSBEHOV_VEDTAKSBREV = 'INFORMASJONSBEHOV_VEDTAKSBREV',
  DOKUMENTDATA_LAGRE = 'DOKUMENTDATA_LAGRE',
  DOKUMENTDATA_HENTE = 'DOKUMENTDATA_HENTE',
  ARBEIDSFORHOLD = 'ARBEIDSFORHOLD',
  UTTAK = 'UTTAK',
  FRITEKSTDOKUMENTER = 'FRITEKSTDOKUMENTER',
  INNTEKT_OG_YTELSER = 'INNTEKT_OG_YTELSER',
  OVERSTYR_INPUT_BEREGNING = 'OVERSTYR_INPUT_BEREGNING',
  OVERLAPPENDE_YTELSER = 'OVERLAPPENDE_YTELSER',
  UTENLANDSOPPHOLD = 'UTENLANDSOPPHOLD',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
  BEREGNINGREFERANSER_TIL_VURDERING = 'BEREGNINGREFERANSER_TIL_VURDERING',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', PleiepengerBehandlingApiKeys.BEHANDLING_PP)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', PleiepengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', PleiepengerBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', PleiepengerBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', PleiepengerBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', PleiepengerBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', PleiepengerBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', PleiepengerBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', PleiepengerBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', PleiepengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', PleiepengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', PleiepengerBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', PleiepengerBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('arbeidsforhold-v1', PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', PleiepengerBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', PleiepengerBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', PleiepengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', PleiepengerBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', PleiepengerBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', PleiepengerBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', PleiepengerBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', PleiepengerBehandlingApiKeys.SYKDOM)
  .withRel('tilgjengelige-vedtaksbrev', PleiepengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('informasjonsbehov-vedtaksbrev', PleiepengerBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV)
  .withRel('pleiepenger-uttaksplan-med-utsatt', PleiepengerBehandlingApiKeys.UTTAK)
  .withRel('pleiepenger-fritekstdokumenter', PleiepengerBehandlingApiKeys.FRITEKSTDOKUMENTER)
  .withRel('inntekt', PleiepengerBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('overstyr-input-beregning', PleiepengerBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING)
  .withRel('overlappende-ytelser', PleiepengerBehandlingApiKeys.OVERLAPPENDE_YTELSER)
  .withRel('utenlandsopphold', PleiepengerBehandlingApiKeys.UTENLANDSOPPHOLD)
  .withRel('behandling-perioder-årsak-med-vilkår', PleiepengerBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR)
  .withRel('beregning-koblinger-til-vurdering', PleiepengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING)

  // operasjoner
  .withRel('dokumentdata-lagre', PleiepengerBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', PleiepengerBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', PleiepengerBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', PleiepengerBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    PleiepengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    PleiepengerBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', PleiepengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', PleiepengerBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', PleiepengerBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', PleiepengerBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', PleiepengerBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', PleiepengerBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    PleiepengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', PleiepengerBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })
  .withPost('/k9/formidling/api/brev/html', PleiepengerBehandlingApiKeys.HENT_FRITEKSTBREV_HTML)

  .build();

export const requestPleiepengerApi = createRequestApi(endpoints);

export const restApiPleiepengerHooks = RestApiHooks.initHooks(requestPleiepengerApi);
