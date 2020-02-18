import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const PleiepengerBehandlingApiKeys = {
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
  BEREGNINGRESULTAT_FORELDREPENGER: 'BEREGNINGRESULTAT_FORELDREPENGER',
  BEREGNINGSGRUNNLAG: 'BEREGNINGSGRUNNLAG',
  BEREGNINGRESULTAT: 'BEREGNINGRESULTAT',
  FAMILIEHENDELSE: 'FAMILIEHENDELSE',
  SOKNAD: 'SOKNAD',
  SOKNAD_ORIGINAL_BEHANDLING: 'SOKNAD_ORIGINAL_BEHANDLING',
  FAMILIEHENDELSE_ORIGINAL_BEHANDLING: 'FAMILIEHENDELSE_ORIGINAL_BEHANDLING',
  BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING: 'BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING',
  MEDLEMSKAP: 'MEDLEMSKAP',
  MEDLEMSKAP_V2: 'MEDLEMSKAP_V2',
  UTTAK_PERIODE_GRENSE: 'UTTAK_PERIODE_GRENSE',
  INNTEKT_ARBEID_YTELSE: 'INNTEKT_ARBEID_YTELSE',
  VERGE: 'VERGE',
  YTELSEFORDELING: 'YTELSEFORDELING',
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
  SYKDOM: 'SYKDOM'
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/k9/sak/api/behandlinger', PleiepengerBehandlingApiKeys.BEHANDLING_FP)
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', PleiepengerBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', PleiepengerBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', PleiepengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder', PleiepengerBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER)

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob('/fptilbake/api/dokument/forhandsvis-varselbrev', PleiepengerBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE)

  /* /api/brev */
  .withPostAndOpenBlob('/fpformidling/api/brev/forhaandsvis', PleiepengerBehandlingApiKeys.PREVIEW_MESSAGE)

  .withRel('aksjonspunkter', PleiepengerBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', PleiepengerBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', PleiepengerBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', PleiepengerBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsresultat-foreldrepenger', PleiepengerBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withRel('beregningsgrunnlag', PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('beregningsresultat-foreldrepenger', PleiepengerBehandlingApiKeys.BEREGNINGRESULTAT)
  .withRel('familiehendelse-v2', PleiepengerBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', PleiepengerBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', PleiepengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', PleiepengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel('beregningsresultat-engangsstonad-original-behandling', PleiepengerBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING)
  .withRel('soeker-medlemskap', PleiepengerBehandlingApiKeys.MEDLEMSKAP)
  .withRel('soeker-medlemskap-v2', PleiepengerBehandlingApiKeys.MEDLEMSKAP_V2)
  .withRel('uttak-periode-grense', PleiepengerBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('inntekt-arbeid-ytelse', PleiepengerBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', PleiepengerBehandlingApiKeys.VERGE)
  .withRel('ytelsefordeling', PleiepengerBehandlingApiKeys.YTELSEFORDELING)
  .withRel('opptjening', PleiepengerBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', PleiepengerBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', PleiepengerBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', PleiepengerBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', PleiepengerBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', PleiepengerBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', PleiepengerBehandlingApiKeys.SYKDOM)

  .withPost('/k9/sak/api/behandlinger/bytt-enhet', PleiepengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', PleiepengerBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', PleiepengerBehandlingApiKeys.RESUME_BEHANDLING, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', PleiepengerBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', PleiepengerBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/opprett', PleiepengerBehandlingApiKeys.VERGE_OPPRETT, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/fjern', PleiepengerBehandlingApiKeys.VERGE_FJERN, {
    storeResultKey: PleiepengerBehandlingApiKeys.BEHANDLING_FP,
  })

  .build();

const reducerName = 'dataContextFPBehandling';

export const reduxRestApi = new ReduxRestApiBuilder(endpoints, reducerName)
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator())
    .withPollingMessageActionCreator(setRequestPollingMessage))
  .build();

reducerRegistry.register(reducerName, reduxRestApi.getDataReducer());

const pleiepengerBehandlingApi = reduxRestApi.getEndpointApi();
export default pleiepengerBehandlingApi;
