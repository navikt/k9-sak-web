import { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { getSelectedBehandlingId, getSelectedBehandlingUuid } from '../behandling/duck';
import {
  getBehandlingerTypesMappedById,
  getBehandlingerStatusMappedById,
} from '../behandling/selectors/behandlingerSelectors';
import fpsakApi from '../data/fpsakApi';

interface OwnProps {
  fetchTotrinnsaksjonspunkter: () => void;
  fetchTotrinnsaksjonspunkterReadonly: () => void;
  resetTotrinnsaksjonspunkter: () => void;
  resetTotrinnsaksjonspunkterReadonly: () => void;
  fetchTilgjengeligeVedtaksbrev: (params: any) => void;
  behandlingId?: number;
  behandlingUuid?: string;
  behandlingStatusKode?: string;
  isInnsyn: boolean;
  children: ReactNode;
}

// TODO (TOR) Det er i dag behov for å kalle totrinns-endepunkt her fordi BehandlingSupportIndex har behov for datte. Bedre om dette
// kan flyttast til "approval".
/**
 * BehandlingsupportDataResolver
 *
 * Har ansvar for å hente opp data som skal brukes i supportpanelet.
 */
export class BehandlingsupportDataResolver extends Component<OwnProps> {
  componentDidUpdate = prevProps => {
    const {
      fetchTotrinnsaksjonspunkter,
      fetchTotrinnsaksjonspunkterReadonly,
      resetTotrinnsaksjonspunkter,
      resetTotrinnsaksjonspunkterReadonly,
      fetchTilgjengeligeVedtaksbrev,
      behandlingId,
      behandlingUuid,
      behandlingStatusKode,
      isInnsyn,
    } = this.props;

    if (
      behandlingId &&
      (behandlingStatusKode !== prevProps.behandlingStatusKode || behandlingId !== prevProps.behandlingId)
    ) {
      resetTotrinnsaksjonspunkter();
      resetTotrinnsaksjonspunkterReadonly();
      if (!isInnsyn && behandlingStatusKode === BehandlingStatus.FATTER_VEDTAK) {
        fetchTotrinnsaksjonspunkter();
      }
      if (!isInnsyn && behandlingStatusKode === BehandlingStatus.BEHANDLING_UTREDES) {
        fetchTotrinnsaksjonspunkterReadonly();
      }
    }
    if (behandlingUuid) {
      fetchTilgjengeligeVedtaksbrev({behandlingsid: behandlingUuid});
    }
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

const mapStateToProps = state => {
  const behandlingId = getSelectedBehandlingId(state);
  const behandlingUuid = getSelectedBehandlingUuid(state);
  const behandlingStatus = getBehandlingerStatusMappedById(state)[behandlingId];
  const bType = getBehandlingerTypesMappedById(state)[behandlingId];
  const isInnsyn = !!bType && bType.kode === behandlingType.DOKUMENTINNSYN;

  return {
    behandlingStatusKode: behandlingStatus ? behandlingStatus.kode : undefined,
    isInnsyn,
    behandlingId,
    behandlingUuid
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.resetRestApi(),
      resetTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.resetRestApi(),
      fetchTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.makeRestApiRequest(),
      fetchTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.makeRestApiRequest(),
      fetchTilgjengeligeVedtaksbrev: fpsakApi.TILGJENGELIGE_VEDTAKSBREV.makeRestApiRequest()
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingsupportDataResolver);
