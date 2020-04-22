import { ReduxEvents, ReduxRestApiBuilder, RestApiConfigBuilder } from '@fpsak-frontend/rest-api-redux';
import errorHandler from '@fpsak-frontend/error-api-redux';
import { reducerRegistry, setRequestPollingMessage } from '@fpsak-frontend/fp-felles';

export const FrisinnBehandlingApiKeys = {
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
  INNTEKT_OG_YTELSER: 'INNTEKT_OG_YTELSER',
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
};

const endpoints = new RestApiConfigBuilder()
  /* /api/behandlinger */
  .withAsyncPost('/k9/sak/api/behandlinger', FrisinnBehandlingApiKeys.BEHANDLING_FP)
  .withPost('/k9/sak/api/behandlinger/endre-pa-vent', FrisinnBehandlingApiKeys.UPDATE_ON_HOLD)

  /* /api/behandling */
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt', FrisinnBehandlingApiKeys.SAVE_AKSJONSPUNKT, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withAsyncPost('/k9/sak/api/behandling/aksjonspunkt/overstyr', FrisinnBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost(
    '/k9/sak/api/behandling/uttak/stonadskontoerGittUttaksperioder',
    FrisinnBehandlingApiKeys.STONADSKONTOER_GITT_UTTAKSPERIODER,
  )

  /* fptilbake/api/dokument */
  .withPostAndOpenBlob(
    '/fptilbake/api/dokument/forhandsvis-varselbrev',
    FrisinnBehandlingApiKeys.PREVIEW_TILBAKEKREVING_MESSAGE,
  )

  /* /api/brev */
  .withPostAndOpenBlob('/k9/formidling/api/brev/forhaandsvis', FrisinnBehandlingApiKeys.PREVIEW_MESSAGE)

  .withRel('inntekt', FrisinnBehandlingApiKeys.INNTEKT_OG_YTELSER)
  .withRel('aksjonspunkter', FrisinnBehandlingApiKeys.AKSJONSPUNKTER)
  .withRel('vilkar', FrisinnBehandlingApiKeys.VILKAR)
  .withRel('soeker-personopplysninger', FrisinnBehandlingApiKeys.PERSONOPPLYSNINGER)
  .withRel('simuleringResultat', FrisinnBehandlingApiKeys.SIMULERING_RESULTAT)
  .withRel('tilbakekrevingvalg', FrisinnBehandlingApiKeys.TILBAKEKREVINGVALG)
  .withRel('beregningsresultat-foreldrepenger', FrisinnBehandlingApiKeys.BEREGNINGRESULTAT_FORELDREPENGER)
  .withRel('beregningsgrunnlag', FrisinnBehandlingApiKeys.BEREGNINGSGRUNNLAG)
  .withRel('beregningsresultat-foreldrepenger', FrisinnBehandlingApiKeys.BEREGNINGRESULTAT)
  .withRel('familiehendelse-v2', FrisinnBehandlingApiKeys.FAMILIEHENDELSE)
  .withRel('soknad', FrisinnBehandlingApiKeys.SOKNAD)
  .withRel('soknad-original-behandling', FrisinnBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING)
  .withRel('familiehendelse-original-behandling', FrisinnBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING)
  .withRel(
    'beregningsresultat-engangsstonad-original-behandling',
    FrisinnBehandlingApiKeys.BEREGNINGSRESULTAT_ORIGINAL_BEHANDLING,
  )
  .withRel('soeker-medlemskap-v2', FrisinnBehandlingApiKeys.MEDLEMSKAP)
  .withRel('uttak-periode-grense', FrisinnBehandlingApiKeys.UTTAK_PERIODE_GRENSE)
  .withRel('inntekt-arbeid-ytelse', FrisinnBehandlingApiKeys.INNTEKT_ARBEID_YTELSE)
  .withRel('soeker-verge', FrisinnBehandlingApiKeys.VERGE)
  .withRel('ytelsefordeling', FrisinnBehandlingApiKeys.YTELSEFORDELING)
  .withRel('opptjening-v2', FrisinnBehandlingApiKeys.OPPTJENING)
  .withRel('sendt-varsel-om-revurdering', FrisinnBehandlingApiKeys.SEND_VARSEL_OM_REVURDERING)
  .withRel('fakta-arbeidsforhold', FrisinnBehandlingApiKeys.FAKTA_ARBEIDSFORHOLD)
  .withRel('uttaksresultat-perioder', FrisinnBehandlingApiKeys.UTTAKSRESULTAT_PERIODER)
  .withRel('uttak-stonadskontoer', FrisinnBehandlingApiKeys.UTTAK_STONADSKONTOER)
  .withRel('uttak-kontroller-fakta-perioder', FrisinnBehandlingApiKeys.UTTAK_KONTROLLER_FAKTA_PERIODER)
  .withRel('sykdom', FrisinnBehandlingApiKeys.SYKDOM)
  .withRel('vedtak-varsel', FrisinnBehandlingApiKeys.VEDTAK_VARSEL)
  .withRel('omsorgen-for', FrisinnBehandlingApiKeys.OMSORGEN_FOR)

  .withPost('/k9/sak/api/behandlinger/bytt-enhet', FrisinnBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET)
  .withPost('/k9/sak/api/behandlinger/henlegg', FrisinnBehandlingApiKeys.HENLEGG_BEHANDLING)
  .withAsyncPost('/k9/sak/api/behandlinger/gjenoppta', FrisinnBehandlingApiKeys.RESUME_BEHANDLING, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/behandlinger/sett-pa-vent', FrisinnBehandlingApiKeys.BEHANDLING_ON_HOLD)
  .withPost('/k9/sak/api/behandlinger/opne-for-endringer', FrisinnBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/opprett', FrisinnBehandlingApiKeys.VERGE_OPPRETT, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })
  .withPost('/k9/sak/api/verge/fjern', FrisinnBehandlingApiKeys.VERGE_FJERN, {
    saveResponseIn: FrisinnBehandlingApiKeys.BEHANDLING_FP,
  })

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

const frisinnBehandlingApi = reduxRestApi.getEndpointApi();
export default frisinnBehandlingApi;
