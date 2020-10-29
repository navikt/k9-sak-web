import {
  ReduxEvents,
  ReduxRestApiBuilder,
  RestApiConfigBuilder,
  reducerRegistry,
  setRequestPollingMessage,
} from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';

export const UnntakBehandlingApiKeys = {
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
  DOKUMENTDATA_LAGRE: 'DOKUMENTDATA_LAGRE',
};

const endpoints = new RestApiConfigBuilder()
  .withAsyncPost('/k9/sak/api/behandlinger', UnntakBehandlingApiKeys.BEHANDLING_FP)

  // behandlingsdata
  // behandlingsdata
  .withRel('beregningsresultat-utbetalt', UnntakBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING)
  .withRel('aksjonspunkter', UnntakBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar-v3', UnntakBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', UnntakBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', UnntakBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', UnntakBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsgrunnlag-alle', UnntakBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('familiehendelse-v2', UnntakBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', UnntakBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', UnntakBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', UnntakBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap-v2', UnntakBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', UnntakBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('inntekt-arbeid-ytelse', UnntakBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', UnntakBehandlingApiKeys.VERGE)
  .withRel('opptjening-v2', UnntakBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', UnntakBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', UnntakBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', UnntakBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', UnntakBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', UnntakBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', UnntakBehandlingApiKeys.SYKDOM)
  .withRel('vedtak-varsel', UnntakBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('omsorgen-for', UnntakBehandlingApiKeys.OMSORGEN_FOR)
  .withRel('forbrukte-dager', UnntakBehandlingApiKeys.FORBRUKTE_DAGER)
  .withRel('full-uttaksplan', UnntakBehandlingApiKeys.FULL_UTTAKSPLAN)
  .withRel('inntekt', UnntakBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('tilgjengelige-vedtaksbrev', UnntakBehandlingApiKeys.TILGJENGELIGE_VEDTAKSBREV)

  // operasjoner
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', UnntakBehandlingApiKeys.UPDATE_ON_HOLD)
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', UnntakBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', UnntakBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    UnntakBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )
  .withPost('/k9/sak/api/behandlinger/bytt-enhet', UnntakBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', UnntakBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', UnntakBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', UnntakBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', UnntakBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/opprett', UnntakBehandlingApiKeys.VERGE_OPPRETT, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/fjern', UnntakBehandlingApiKeys.VERGE_FJERN, {
    saveResponseIn: UnntakBehandlingApiKeys.BEHANDLING_FP,
  })

  /* FPTILBAKE */
  .withPostAndOpenBlob(
    '/k9/tilbake/api/dokument/forhandsvis-varselbrev',
    UnntakBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* K9FORMIDLING */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', UnntakBehandlingApiKeys.PREVIEW_MESSAGE)
  .withRel('dokumentdata-lagre', UnntakBehandlingApiKeys.DOKUMENTDATA_LAGRE)

  .build();

const reducerName = 'dataContextUnntakBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(
    new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator())
      .withPollingMessageActionCreator(setRequestPollingMessage),
  )
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const unntakBehandlingApi = reduxRestApi.getEndpointApi();
export default unntakBehandlingApi;
