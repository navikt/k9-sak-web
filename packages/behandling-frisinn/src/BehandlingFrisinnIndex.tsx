import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk,
  NavAnsatt,
  Behandling,
  FagsakInfo,
  SettPaVentParams,
  ReduxFormStateCleaner,
  DataFetcherBehandlingDataV2,
} from '@fpsak-frontend/behandling-felles';

import frisinnBehandlingApi, { reduxRestApi, PleiepengerBehandlingApiKeys } from './data/frisinnBehandlingApi';
import FrisinnPaneler from './components/FrisinnPaneler';
import FetchedData from './types/fetchedDataTsType';

const frisinnData = [
  frisinnBehandlingApi.AKSJONSPUNKTER,
  frisinnBehandlingApi.VILKAR,
  frisinnBehandlingApi.PERSONOPPLYSNINGER,
  frisinnBehandlingApi.YTELSEFORDELING,
  frisinnBehandlingApi.SOKNAD,
  frisinnBehandlingApi.INNTEKT_ARBEID_YTELSE,
  frisinnBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER,
  frisinnBehandlingApi.BEREGNINGSGRUNNLAG,
  frisinnBehandlingApi.UTTAK_STONADSKONTOER,
  frisinnBehandlingApi.UTTAKSRESULTAT_PERIODER,
  frisinnBehandlingApi.SIMULERING_RESULTAT,
  frisinnBehandlingApi.VEDTAK_VARSEL,
];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
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
  kodeverk?: { [key: string]: [Kodeverk] };
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

class BehandlingFrisinnIndex extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      behandlingEventHandler,
      nyBehandlendeEnhet,
      settBehandlingPaVent,
      taBehandlingAvVent,
      henleggBehandling,
      hentBehandling,
      behandlingId,
      opneBehandlingForEndringer,
      opprettVerge,
      fjernVerge,
      lagreRisikoklassifiseringAksjonspunkt,
    } = this.props;
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
  };

  componentWillUnmount = () => {
    const { behandlingEventHandler, resetRestApiContext, destroyReduxForm, behandling } = this.props;
    behandlingEventHandler.clear();
    resetRestApiContext();
    setTimeout(() => destroyReduxForm(getBehandlingFormPrefix(behandling.id, behandling.versjon)), 1000);
  };

  render() {
    const {
      behandling,
      forrigeBehandling,
      oppdaterBehandlingVersjon,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegOgFaktaPanelIUrl,
      valgtProsessSteg,
      valgtFaktaSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      hasFetchError,
      featureToggles,
    } = this.props;

    if (!behandling) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcherBehandlingDataV2
        behandlingVersion={behandling.versjon}
        endpoints={frisinnData}
        showOldDataWhenRefetching
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
              navAnsatt={navAnsatt}
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
  }
}

const mapStateToProps = state => ({
  behandling: frisinnBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: frisinnBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!frisinnBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => dispatch => {
  Object.values(PleiepengerBehandlingApiKeys).forEach(value => {
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
      opprettVerge: frisinnBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
      fjernVerge: frisinnBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
      hentBehandling: frisinnBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
      lagreRisikoklassifiseringAksjonspunkt: frisinnBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
      resetRestApiContext: getResetRestApiContext,
      destroyReduxForm: destroy,
    },
    dispatch,
  ),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingFrisinnIndex);
