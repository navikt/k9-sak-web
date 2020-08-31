import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const OmsorgspengerBehandlingApiKeys = {
  BEHANDLING_FP: 'BEHANDLING_FP',
  UPDATE_ON_HOLD: 'UPDATE_ON_HOLD',
  SAVE_AKSJONSPUNKT: 'SAVE_AKSJONSPUNKT',
  SAVE_OVERSTYRT_AKSJONSPUNKT: 'SAVE_OVERSTYRT_AKSJONSPUNKT',
  PREVIEW_MESSAGE: 'PREVIEW_MESSAGE',
  PREVIEW_TILBAKEKREVING_MESSAGE: 'PREVIEW_TILBAKEKREVING_MESSAGE',
  STONADSKONTOER_GITT_UTTAKSPERIODER: 'STONADSKONTOER_GITT_UTTAKSPERIODER',
  AKSJONSPUNKTER: 'AKSJONSPUNKTER',
  VILKAR: 'VILKAR',
  PERSONOPPLYSNINGER: 'PERSONOPPLYSNINGER',
  SIMULERING_RESULTAT: 'SIMULERING_RESULTAT',
  TILBAKEKREVINGVALG: 'TILBAKEKREVINGVALG',
  BEREGNINGSRESULTAT_UTBETALING: 'BEREGNINGSRESULTAT_UTBETALING',
  BEREGNINGSGRUNNLAG: 'BEREGNINGSGRUNNLAG',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  UTTAK_PERIODE_GRENSE: 'UTTAK_PERIODE_GRENSE',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  OPPTJENING: 'OPPTJENING',
  SEND_VARSEL_OM_REVURDERING: 'SEND_VARSEL_OM_REVURDERING',
  FAKTA_ARBEIDSFORHOLD: 'FAKTA_ARBEIDSFORHOLD',
  UTTAKSRESULTAT_PERIODER: 'UTTAKSRESULTAT_PERIODER',
  UTTAK_STONADSKONTOER: 'UTTAK_STONADSKONTOER',
  UTTAK_KONTROLLER_FAKTA_PERIODER: 'UTTAK_KONTROLLER_FAKTA_PERIODER',
  BEHANDLING_NY_BEHANDLENDE_ENHET: 'BEHANDLING_NY_BEHANDLENDE_ENHET',
  HENLEGG_BEHANDLING: 'HENLEGG_BEHANDLING',
  RESUME_BEHANDLING: 'RESUME_BEHANDLING',
  BEHANDLING_ON_HOLD: 'BEHANDLING_ON_HOLD',
  OPEN_BEHANDLING_FOR_CHANGES: 'OPEN_BEHANDLING_FOR_CHANGES',
  VERGE_OPPRETT: 'VERGE_OPPRETT',
  VERGE_FJERN: 'VERGE_FJERN',
  SYKDOM: 'SYKDOM',
  VEDTAK_VARSEL: 'VEDTAK_VARSEL',
  OMSORGEN_FOR: 'OMSORGEN_FOR',
  FORBRUKTE_DAGER: 'FORBRUKTE_DAGER',
  FULL_UTTAKSPLAN: 'FULL_UTTAKSPLAN',
  INNTEKT_OG_YTELSER: 'INNTEKT_OG_YTELSER',
  TILGJENGELIGE_VEDTAKSBREV: 'TILGJENGELIGE_VEDTAKSBREV',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', OmsorgspengerBehandlingApiKeys.BEHANDLING_FP)

  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', OmsorgspengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', OmsorgspengerBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', OmsorgspengerBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', OmsorgspengerBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', OmsorgspengerBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', OmsorgspengerBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', OmsorgspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', OmsorgspengerBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', OmsorgspengerBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', OmsorgspengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', OmsorgspengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', OmsorgspengerBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', OmsorgspengerBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('inntekt-arbeid-ytelse', OmsorgspengerBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', OmsorgspengerBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', OmsorgspengerBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', OmsorgspengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', OmsorgspengerBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', OmsorgspengerBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', OmsorgspengerBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', OmsorgspengerBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', OmsorgspengerBehandlingApiKeys.SYKDOM)
  .withRel('vedtak-varsel', OmsorgspengerBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('omsorgen-for', OmsorgspengerBehandlingApiKeys.OMSORGEN_FOR)
  .withRel('forbrukte-dager', OmsorgspengerBehandlingApiKeys.FORBRUKTE_DAGER)
  .withRel('full-uttaksplan', OmsorgspengerBehandlingApiKeys.FULL_UTTAKSPLAN)
  .withRel('inntekt', OmsorgspengerBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('tilgjengelige-vedtaksbrev', OmsorgspengerBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', OmsorgspengerBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', OmsorgspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost(
    '/k9/sak/api/behandling/aksjonspunkt/overstyr',
    OmsorgspengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
    {
      saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
    },
  )
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    OmsorgspengerBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', OmsorgspengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', OmsorgspengerBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', OmsorgspengerBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', OmsorgspengerBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', OmsorgspengerBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/opprett', OmsorgspengerBehandlingApiKeys.VERGE_OPPRETT, {
    saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/fjern', OmsorgspengerBehandlingApiKeys.VERGE_FJERN, {
    saveResponseIn: OmsorgspengerBehandlingApiKeys.BEHANDLING_FP,
  })

  /* FPTILBAKE */
  .withPostAndOpenBlob(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    OmsorgspengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* K9FORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', OmsorgspengerBehandlingApiKeys.PREVIEW_MESSAGE)

  .build();

const reducerName = 'dataContextFPBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const omsorgspengerBehandlingApi = reduxRestApi.getEndpointApi();
export default omsorgspengerBehandlingApi;
