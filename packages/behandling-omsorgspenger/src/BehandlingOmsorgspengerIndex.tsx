import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FagsakInfo, Rettigheter, SettPaVentParams, ReduxFormStateCleaner } from '@fpsak-frontend/behandling-felles';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';

import omsorgspengerBehandlingApi, {
  reduxRestApi,
  OmsorgspengerBehandlingApiKeys,
} from './data/omsorgspengerBehandlingApi';
import OmsorgspengerPaneler from './components/OmsorgspengerPaneler';
import FetchedData from './types/fetchedDataTsType';

const omsorgspengerData = [
  omsorgspengerBehandlingApi.AKSJONSPUNKTER,
  omsorgspengerBehandlingApi.VILKAR,
  omsorgspengerBehandlingApi.PERSONOPPLYSNINGER,
  omsorgspengerBehandlingApi.SOKNAD,
  omsorgspengerBehandlingApi.BEREGNINGSRESULTAT_UTBETALING,
  omsorgspengerBehandlingApi.BEREGNINGSGRUNNLAG,
  omsorgspengerBehandlingApi.SIMULERING_RESULTAT,
  omsorgspengerBehandlingApi.FORBRUKTE_DAGER,
  omsorgspengerBehandlingApi.TILGJENGELIGE_VEDTAKSBREV
];

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: { [key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  featureToggles: {};
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  kodeverk?: { [key: string]: KodeverkMedNavn[] };
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  opneBehandlingForEndringer: (params: {}) => Promise<any>;
  opprettVerge: (params: {}) => Promise<any>;
  fjernVerge: (params: {}) => Promise<any>;
  lagreRisikoklassifiseringAksjonspunkt: (params: {}) => Promise<any>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  tilgjengeligeVedtaksbrev: (params: {}) => Promise<void>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const BehandlingOmsorgspengerIndex: FunctionComponent<Props> = ({
  behandlingEventHandler,
  nyBehandlendeEnhet,
  settBehandlingPaVent,
  taBehandlingAvVent,
  henleggBehandling,
  hentBehandling,
  behandlingId,
  resetRestApiContext,
  destroyReduxForm,
  behandling,
  oppdaterBehandlingVersjon,
  kodeverk,
  fagsak,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  settPaVent,
  opneSokeside,
  forrigeBehandling,
  opneBehandlingForEndringer,
  opprettVerge,
  fjernVerge,
  lagreRisikoklassifiseringAksjonspunkt,
  valgtFaktaSteg,
  hasFetchError,
  featureToggles,
  tilgjengeligeVedtaksbrev
}) => {
  const forrigeVersjon = useRef<number>();

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params =>
        nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, { keepData: true })),
      settBehandlingPaVent: params =>
        settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, { keepData: true })),
      taBehandlingAvVent: params => taBehandlingAvVent(params, { keepData: true }),
      henleggBehandling: params => henleggBehandling(params),
      opneBehandlingForEndringer: params => opneBehandlingForEndringer(params),
      opprettVerge: params => opprettVerge(params),
      fjernVerge: params => fjernVerge(params),
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
      tilgjengeligeVedtaksbrev: params => tilgjengeligeVedtaksbrev(params)
    });

    hentBehandling({ behandlingId }, { keepData: false });

    return () => {
      behandlingEventHandler.clear();
      resetRestApiContext();
      setTimeout(() => {
        destroyReduxForm(getBehandlingFormPrefix(behandlingId, forrigeVersjon.current));
      }, 1000);
    };
  }, [behandlingId]);

  if (!behandling) {
    return <LoadingPanel />;
  }

  forrigeVersjon.current = behandling.versjon;

  reduxRestApi.injectPaths(behandling.links);

  return (
    <DataFetcher
      fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
      endpoints={omsorgspengerData}
      showOldDataWhenRefetching
      loadingPanel={<LoadingPanel />}
      render={(dataProps: FetchedData, isFinished) => (
        <>
          <ReduxFormStateCleaner
            behandlingId={behandling.id}
            behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon}
          />
          <OmsorgspengerPaneler
            behandling={isFinished ? behandling : forrigeBehandling}
            fetchedData={dataProps}
            fagsak={fagsak}
            alleKodeverk={kodeverk}
            rettigheter={rettigheter}
            valgtProsessSteg={valgtProsessSteg}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={valgtFaktaSteg}
            oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
            settPaVent={settPaVent}
            hentBehandling={hentBehandling}
            opneSokeside={opneSokeside}
            hasFetchError={hasFetchError}
            featureToggles={featureToggles}
          />
        </>
      )}
    />
  );
};

const mapStateToProps = state => ({
  behandling: omsorgspengerBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: omsorgspengerBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!omsorgspengerBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => dispatch => {
  Object.values(OmsorgspengerBehandlingApiKeys).forEach(value => {
    dispatch(omsorgspengerBehandlingApi[value].resetRestApi()());
  });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators(
    {
      nyBehandlendeEnhet: omsorgspengerBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
      settBehandlingPaVent: omsorgspengerBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
      taBehandlingAvVent: omsorgspengerBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
      henleggBehandling: omsorgspengerBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
      settPaVent: omsorgspengerBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
      opneBehandlingForEndringer: omsorgspengerBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
      opprettVerge: omsorgspengerBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
      fjernVerge: omsorgspengerBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
      hentBehandling: omsorgspengerBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
      lagreRisikoklassifiseringAksjonspunkt: omsorgspengerBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
      tilgjengeligeVedtaksbrev: omsorgspengerBehandlingApi.TILGJENGELIGE_VEDTAKSBREV.makeRestApiRequest,
      resetRestApiContext: getResetRestApiContext,
      destroyReduxForm: destroy,
    },
    dispatch,
  ),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(BehandlingOmsorgspengerIndex);
