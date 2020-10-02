import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RouteProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { push } from 'connected-react-router';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Kodeverk } from '@k9-sak-web/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getSelectedSaksnummer, getFagsakYtelseType } from '../fagsak/fagsakSelectors';
import { getBehandlingVersjon, getBehandlingType, getSelectedBehandlingId } from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { hentVergeMenyvalg, resetVergeMenyvalg, fjernVerge, opprettVerge } from './duck';
import BehandlingMenuIndex from './BehandlingMenuIndex';
import BehandlingIdentifier from '../behandling/BehandlingIdentifier';

const YTELSE_BEHANDLINGTYPER = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.REVURDERING,
  BehandlingType.TILBAKEKREVING,
  BehandlingType.TILBAKEKREVING_REVURDERING,
];
const menyDataBehandlingValgt = [fpsakApi.MENYHANDLING_RETTIGHETER, fpsakApi.BEHANDLENDE_ENHETER];
const menyData = [fpsakApi.BEHANDLENDE_ENHETER];
const BEHANDLINGER_STØTTER_VERGE: BehandlingType[] = [
  BehandlingType.TILBAKEKREVING,
  BehandlingType.TILBAKEKREVING_REVURDERING,
];

const VERGE_MENYVALG = {
  FJERN: 'FJERN',
  OPPRETT: 'OPPRETT',
};

interface OwnProps {
  location: RouteProps['location'];
}

interface StateProps {
  saksnummer: string;
  ytelseType: Kodeverk;
  behandlingId?: number;
  behandlingVersion?: number;
  behandlingType?: Kodeverk;
  vergeMenyvalg: string;
}

interface DispatchProps {
  hentVerge: (params: { behandlingId: number; saksnummer: string }) => void;
  resetVerge: () => void;
  pushLocation: (location: string) => void;
}

const BehandlingMenuDataResolver: FunctionComponent<OwnProps & StateProps & DispatchProps> = ({
  saksnummer,
  ytelseType,
  behandlingId,
  behandlingVersion,
  behandlingType,
  resetVerge,
  vergeMenyvalg,
  location,
  pushLocation,
  hentVerge,
}) => {
  const ref = useRef<{ behandlingId: number; behandlingVersion: number }>();
  useEffect(() => {
    const erBehandlingEndret =
      !ref.current || behandlingId !== ref.current.behandlingId || behandlingVersion !== ref.current.behandlingVersion;
    if (
      !!behandlingId &&
      YTELSE_BEHANDLINGTYPER.includes(behandlingType.kode) &&
      BEHANDLINGER_STØTTER_VERGE.includes(behandlingType.kode) &&
      erBehandlingEndret
    ) {
      // TODO Skal verge brukast?
      const params = new BehandlingIdentifier(saksnummer, behandlingId).toJson();
      hentVerge(params);
    }

    ref.current = { behandlingId, behandlingVersion };

    return () => {
      resetVerge();
    };
  }, [behandlingId, behandlingVersion]);

  const fjernVergeFn =
    vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.FJERN
      ? fjernVerge(location, pushLocation, saksnummer, behandlingId, behandlingVersion)
      : undefined;
  const opprettVergeFn =
    vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.OPPRETT
      ? opprettVerge(location, pushLocation, saksnummer, behandlingId, behandlingVersion)
      : undefined;

  return (
    <DataFetcher
      key={behandlingId ? 0 : 1}
      endpoints={behandlingId ? menyDataBehandlingValgt : menyData}
      endpointParams={{ [fpsakApi.BEHANDLENDE_ENHETER.name]: { ytelseType: ytelseType.kode } }}
      fetchingTriggers={new DataFetcherTriggers({ behandlingId, behandlingVersion }, false)}
      showOldDataWhenRefetching
      loadingPanel={<LoadingPanel />}
      render={(dataProps: {
        menyhandlingRettigheter?: { harSoknad: boolean };
        behandlendeEnheter: {
          enhetId: string;
          enhetNavn: string;
        }[];
      }) => (
        <BehandlingMenuIndex
          saksnummer={saksnummer}
          behandlingId={behandlingId}
          behandlingVersion={behandlingVersion}
          behandlingType={behandlingType}
          ytelseType={ytelseType}
          vergeMenyvalg={vergeMenyvalg}
          menyhandlingRettigheter={dataProps.menyhandlingRettigheter}
          behandlendeEnheter={dataProps.behandlendeEnheter}
          fjernVerge={fjernVergeFn}
          opprettVerge={opprettVergeFn}
          location={location}
          pushLocation={pushLocation}
        />
      )}
    />
  );
};

const mapStateToProps = (state): StateProps => {
  const vergeMenyvalg = fpsakApi.VERGE_MENYVALG.getRestApiData()(state);
  const behandlingType = getBehandlingType(state);
  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingId: getSelectedBehandlingId(state),
    behandlingVersion: getBehandlingVersjon(state),
    behandlingType: getBehandlingType(state),
    ytelseType: getFagsakYtelseType(state),
    vergeMenyvalg:
      vergeMenyvalg && behandlingType && YTELSE_BEHANDLINGTYPER.includes(behandlingType.kode)
        ? vergeMenyvalg.vergeBehandlingsmeny
        : undefined,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      hentVerge: hentVergeMenyvalg,
      resetVerge: resetVergeMenyvalg,
      pushLocation: push,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuDataResolver));
