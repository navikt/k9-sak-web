import { RestApiConfigBuilder, createRequestApi } from '@k9-sak-web/rest-api';
import { RestApiHooks } from '@k9-sak-web/rest-api-hooks';

// NB! ALDRI BRUK DETTE UTENFOR DENNE BEHANDLINGSPAKKEN

export enum PleiepengerSluttfaseBehandlingApiKeys {
  BEHANDLING_PP = 'BEHANDLING_PP',
  UPDATE_ON_HOLD = 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT = 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT = 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE = 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE = 'PREVIEW_TILBAKEKREVING_MESSAGE',
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
  HENT_SAKSBEHANDLERE = 'HENT_SAKSBEHANDLERE',
  OM_PLEIETRENGENDE = 'OM_PLEIETRENGENDE',
  BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR = 'BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR',
}

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_PP)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', PleiepengerSluttfaseBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', PleiepengerSluttfaseBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', PleiepengerSluttfaseBehandlingApiKeys.VILKAR)
  .withRel('soknadsfrist-status', PleiepengerSluttfaseBehandlingApiKeys.SOKNADSFRIST_STATUS)
  .withRel('soeker-personopplysninger', PleiepengerSluttfaseBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', PleiepengerSluttfaseBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', PleiepengerSluttfaseBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', PleiepengerSluttfaseBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', PleiepengerSluttfaseBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', PleiepengerSluttfaseBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', PleiepengerSluttfaseBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel(
    'familiehendelse-original-behandling',
    PleiepengerSluttfaseBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
  )
  .withRel('soeker-medlemskap-v2', PleiepengerSluttfaseBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', PleiepengerSluttfaseBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('arbeidsforhold-v1', PleiepengerSluttfaseBehandlingApiKeys.ARBEIDSFORHOLD)
  .withRel('soeker-verge', PleiepengerSluttfaseBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', PleiepengerSluttfaseBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', PleiepengerSluttfaseBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', PleiepengerSluttfaseBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', PleiepengerSluttfaseBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', PleiepengerSluttfaseBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', PleiepengerSluttfaseBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', PleiepengerSluttfaseBehandlingApiKeys.SYKDOM)
  .withRel('tilgjengelige-vedtaksbrev', PleiepengerSluttfaseBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)
  .withRel('informasjonsbehov-vedtaksbrev', PleiepengerSluttfaseBehandlingApiKeys.INFORMASJONSBEHOV_VEDTAKSBREV)
  .withRel('pleiepenger-sykt-barn-uttaksplan', PleiepengerSluttfaseBehandlingApiKeys.UTTAK)
  .withRel('pleiepenger-fritekstdokumenter', PleiepengerSluttfaseBehandlingApiKeys.FRITEKSTDOKUMENTER)
  .withRel('inntekt', PleiepengerSluttfaseBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('overstyr-input-beregning', PleiepengerSluttfaseBehandlingApiKeys.OVERSTYR_INPUT_BEREGNING)
  .withRel('overlappende-ytelser', PleiepengerSluttfaseBehandlingApiKeys.OVERLAPPENDE_YTELSER)
  .withRel('saksbehandler-info', PleiepengerSluttfaseBehandlingApiKeys.HENT_SAKSBEHANDLERE)
  .withRel('om-pleietrengende', PleiepengerSluttfaseBehandlingApiKeys.OM_PLEIETRENGENDE)
  .withRel(
    'behandling-perioder-årsak-med-vilkår',
    PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR,
  )

  // operasjoner
  .withRel('dokumentdata-lagre', PleiepengerSluttfaseBehandlingApiKeys.DOKUMENTDATA_LAGRE)
  .withRel('dokumentdata-hente', PleiepengerSluttfaseBehandlingApiKeys.DOKUMENTDATA_HENTE)

  // TODO Flytt alle endepunkter under til backend på same måte som i fp-frontend
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', PleiepengerSluttfaseBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', PleiepengerSluttfaseBehandlingApiKeys.SAVE_AKSJONSPUNKT)
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    PleiepengerSluttfaseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    PleiepengerSluttfaseBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost(
    '/k9/sak/api/behandlinger/bytt-enhet',
    PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  )
  .withPost('/k9/sak/api/behandlinger/henlegg', PleiepengerSluttfaseBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', PleiepengerSluttfaseBehandlingApiKeys.RESUME_BEHANDLING)
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/verge/opprett', PleiepengerSluttfaseBehandlingApiKeys.VERGE_OPPRETT)
  .withPost('/k9/sak/api/verge/fjern', PleiepengerSluttfaseBehandlingApiKeys.VERGE_FJERN)

  /* FPTILBAKE */
  .withPost(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    PleiepengerSluttfaseBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
    { isResponseBlob: true },
  )

  /* K9FORMIDLING */
  .withPost('/k9/formidling/api/brev/forhaandsvis', PleiepengerSluttfaseBehandlingApiKeys.PREVIEW_MESSAGE, {
    isResponseBlob: true,
  })

  .build();

export const requestPleiepengerSluttfaseApi = createRequestApi(endpoints);

export const restApiPleiepengerSluttfaseHooks = RestApiHooks.initHooks(requestPleiepengerSluttfaseApi);
