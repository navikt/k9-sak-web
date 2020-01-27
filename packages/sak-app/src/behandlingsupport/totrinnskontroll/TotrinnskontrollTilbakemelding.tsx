import { BehandlingIdentifier, DataFetcher, requireProps } from '@fpsak-frontend/fp-felles';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { TilbakemeldingerFraTotrinnskontrollContainer } from '@fpsak-frontend/sak-totrinnskontroll-tilbakemeldinger';
import {
  AlleKodeverk,
  BehandlingStatusType,
  SkjermlenkeTyper,
  TotrinnskontrollAksjonspunkter,
} from '@k9-frontend/types';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getBehandlingIdentifier,
  getBehandlingStatus,
  getBehandlingType,
  getBehandlingVersjon,
  getSelectedBehandlingId,
} from '../../behandling/duck';
import fpsakApi from '../../data/fpsakApi';
import { isForeldrepengerFagsak } from '../../fagsak/fagsakSelectors';
import { getFpTilbakeKodeverk, getKodeverk } from '../../kodeverk/duck';

const klageData = [fpsakApi.TOTRINNS_KLAGE_VURDERING];
const ingenData = [];

interface TotrinnskontrollTilbakemeldingProps {
  totrinnskontrollReadOnlySkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  behandlingIdentifier: BehandlingIdentifier;
  selectedBehandlingVersjon?: number;
  behandlingStatus: BehandlingStatusType;
  location: Location;
  skjemalenkeTyper: SkjermlenkeTyper[];
  alleKodeverk: AlleKodeverk;
  isForeldrepenger: boolean;
}

/**
 * Totrinnskontrolltilbakemelding
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const TotrinnskontrollTilbakemelding: FunctionComponent<TotrinnskontrollTilbakemeldingProps> = props => {
  const {
    totrinnskontrollReadOnlySkjermlenkeContext,
    behandlingStatus,
    location,
    skjemalenkeTyper,
    behandlingIdentifier,
    selectedBehandlingVersjon,
    alleKodeverk,
    isForeldrepenger,
  } = props;

  if (!totrinnskontrollReadOnlySkjermlenkeContext) {
    return null;
  }

  return (
    <DataFetcher
      behandlingId={behandlingIdentifier.behandlingId}
      behandlingVersjon={selectedBehandlingVersjon}
      endpoints={klageData.some(kd => kd.isEndpointEnabled()) ? klageData : ingenData}
      render={p => (
        <TilbakemeldingerFraTotrinnskontrollContainer
          behandlingStatus={behandlingStatus}
          totrinnskontrollContext={totrinnskontrollReadOnlySkjermlenkeContext}
          location={location}
          skjermlenkeTyper={skjemalenkeTyper}
          isForeldrepengerFagsak={isForeldrepenger}
          alleKodeverk={alleKodeverk}
          behandlingKlageVurdering={p.totrinnsKlageVurdering}
        />
      )}
    />
  );
};

const mapStateToPropsFactory = initialState => {
  const skjermlenkeTyperFpsak = getKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  const skjermlenkeTyperFptilbake = getFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE)(initialState);
  return state => {
    const behandlingType = getBehandlingType(state);
    const behandlingTypeKode = behandlingType ? behandlingType.kode : undefined;
    const erTilbakekreving =
      BehandlingType.TILBAKEKREVING === behandlingTypeKode ||
      BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
    const behandlingIdentifier = getBehandlingIdentifier(state);
    return {
      totrinnskontrollReadOnlySkjermlenkeContext: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData()(
        state,
      ),
      selectedBehandlingVersjon: getBehandlingVersjon(state),
      behandlingStatus: getBehandlingStatus(state),
      alleKodeverk: erTilbakekreving
        ? fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()(state)
        : fpsakApi.KODEVERK.getRestApiData()(state),
      skjemalenkeTyper: erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak,
      location: state.router.location,
      isForeldrepenger: isForeldrepengerFagsak(state),
      behandlingId: getSelectedBehandlingId(state),
      behandlingIdentifier,
    };
  };
};

const comp = requireProps(['behandlingIdentifier', 'selectedBehandlingVersjon'])(TotrinnskontrollTilbakemelding);
export default withRouter(connect(mapStateToPropsFactory)(comp));
