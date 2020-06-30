import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FagsakInfo, Rettigheter, SettPaVentParams, ReduxFormStateCleaner } from '@fpsak-frontend/behandling-felles';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';

import frisinnBehandlingApi, { reduxRestApi, FrisinnBehandlingApiKeys } from './data/frisinnBehandlingApi';
import FrisinnPaneler from './components/FrisinnPaneler';
import FetchedData from './types/fetchedDataTsType';

const frisinnData = [
  frisinnBehandlingApi.AKSJONSPUNKTER,
  frisinnBehandlingApi.VILKAR,
  frisinnBehandlingApi.PERSONOPPLYSNINGER,
  frisinnBehandlingApi.BEREGNINGSRESULTAT_UTBETALT,
  frisinnBehandlingApi.BEREGNINGSGRUNNLAG,
  frisinnBehandlingApi.SIMULERING_RESULTAT,
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
  lagreRisikoklassifiseringAksjonspunkt: (params: {}) => Promise<any>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const BehandlingFrisinnIndex: FunctionComponent<Props> = ({
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
  valgtFaktaSteg,
  settPaVent,
  opneSokeside,
  forrigeBehandling,
  opneBehandlingForEndringer,
  lagreRisikoklassifiseringAksjonspunkt,
  hasFetchError,
  featureToggles,
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
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
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
      endpoints={frisinnData}
      showOldDataWhenRefetching
      loadingPanel={<LoadingPanel />}
      render={(dataProps: FetchedData, isFinished) => (
        <>
          <ReduxFormStateCleaner
            behandlingId={behandling.id}
            behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon}
          />
          <FrisinnPaneler
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
  behandling: frisinnBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: frisinnBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!frisinnBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => dispatch => {
  Object.values(FrisinnBehandlingApiKeys).forEach(value => {
    dispatch(frisinnBehandlingApi[value].resetRestApi()());
  });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators(
    {
      nyBehandlendeEnhet: frisinnBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
      settBehandlingPaVent: frisinnBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
      taBehandlingAvVent: frisinnBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
      henleggBehandling: frisinnBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
      settPaVent: frisinnBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
      opneBehandlingForEndringer: frisinnBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
      hentBehandling: frisinnBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
      lagreRisikoklassifiseringAksjonspunkt: frisinnBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
      resetRestApiContext: getResetRestApiContext,
      destroyReduxForm: destroy,
    },
    dispatch,
  ),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(BehandlingFrisinnIndex);
