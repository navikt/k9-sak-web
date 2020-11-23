import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { FagsakInfo, Rettigheter, SettPaVentParams, ReduxFormStateCleaner } from '@fpsak-frontend/behandling-felles';
import { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import FetchedData from './types/fetchedDataTsType';
import unntakBehandlingApi, { reduxRestApi, UnntakBehandlingApiKeys } from './data/unntakBehandlingApi';
import UnntakPaneler from './components/UnntakPaneler';

const unntakData = [
  unntakBehandlingApi.AKSJONSPUNKTER,
  unntakBehandlingApi.VILKAR,
  unntakBehandlingApi.PERSONOPPLYSNINGER,
  unntakBehandlingApi.SOKNAD,
  unntakBehandlingApi.INNTEKT_ARBEID_YTELSE,
  unntakBehandlingApi.BEREGNINGSRESULTAT_UTBETALING,
  unntakBehandlingApi.SIMULERING_RESULTAT,
  unntakBehandlingApi.FORBRUKTE_DAGER,
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
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const BehandlingUnntakIndex: FunctionComponent<Props> = ({
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
      endpoints={unntakData}
      showOldDataWhenRefetching
      loadingPanel={<LoadingPanel />}
      render={(dataProps: FetchedData, isFinished) => (
        <>
          <ReduxFormStateCleaner
            behandlingId={behandling.id}
            behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon}
          />
          <UnntakPaneler
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
  behandling: unntakBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: unntakBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!unntakBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => dispatch => {
  Object.values(UnntakBehandlingApiKeys).forEach(value => {
    dispatch(unntakBehandlingApi[value].resetRestApi()());
  });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators(
    {
      nyBehandlendeEnhet: unntakBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
      settBehandlingPaVent: unntakBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
      taBehandlingAvVent: unntakBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
      henleggBehandling: unntakBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
      settPaVent: unntakBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
      opneBehandlingForEndringer: unntakBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
      opprettVerge: unntakBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
      fjernVerge: unntakBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
      hentBehandling: unntakBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
      lagreRisikoklassifiseringAksjonspunkt: unntakBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
      resetRestApiContext: getResetRestApiContext,
      destroyReduxForm: destroy,
    },
    dispatch,
  ),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingUnntakIndex);
