import React, { FunctionComponent, useEffect, useCallback, useMemo } from 'react';

import { Aksjonspunkt, NavAnsatt, Risikoklassifisering, Fagsak } from '@k9-sak-web/types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';

import useHistory from '../../app/useHistory';
import useLocation from '../../app/useLocation';
import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import behandlingEventHandler from '../../behandling/BehandlingEventHandler';
import useTrackRouteParam from '../../app/useTrackRouteParam';
import { FpsakApiKeys, restApiHooks } from '../../data/fpsakApi';
import { getRiskPanelLocationCreator } from '../../app/paths';
import getAccessRights from '../../app/util/access';

const getReadOnly = (navAnsatt: NavAnsatt, rettigheter, erPaaVent: boolean) => {
  if (erPaaVent) {
    return true;
  }
  const { kanSaksbehandle } = navAnsatt;
  return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
};

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingVersjon?: number;
  kontrollresultat?: Risikoklassifisering;
  risikoAksjonspunkt?: Aksjonspunkt;
  behandlingId: number;
}

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
const RisikoklassifiseringIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  risikoAksjonspunkt,
  kontrollresultat,
  behandlingVersjon,
  behandlingId,
}) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  const erPaaVent = behandling ? behandling.behandlingPaaVent : false;
  const behandlingStatus = behandling?.status;
  const behandlingType = behandling?.type;

  const { selected: isRiskPanelOpen = false } = useTrackRouteParam<boolean>({
    paramName: 'risiko',
    parse: isOpen => isOpen === 'true',
    isQueryParam: true,
  });

  const history = useHistory();
  const location = useLocation();

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => getAccessRights(navAnsatt, fagsak.status, behandlingStatus, behandlingType), [
    fagsak.status,
    behandlingStatus,
    behandlingType,
  ]);
  const readOnly = useMemo(() => getReadOnly(navAnsatt, rettigheter, erPaaVent), [rettigheter, erPaaVent]);

  const toggleRiskPanel = useCallback(() => {
    history.push(getRiskPanelLocationCreator(location)(!isRiskPanelOpen));
  }, [location, isRiskPanelOpen]);

  const harRisikoAksjonspunkt = !!risikoAksjonspunkt;
  useEffect(() => {
    if (harRisikoAksjonspunkt && risikoAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !isRiskPanelOpen) {
      toggleRiskPanel();
    }
  }, [harRisikoAksjonspunkt, behandlingId, behandlingVersjon]);

  const submitAksjonspunkt = useCallback(
    aksjonspunkt => {
      const params = {
        behandlingId,
        saksnummer: fagsak.saksnummer,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [
          {
            '@type': aksjonspunkt.kode,
            ...aksjonspunkt,
          },
        ],
      };

      return behandlingEventHandler.lagreRisikoklassifiseringAksjonspunkt(params);
    },
    [behandlingId, behandlingVersjon],
  );

  return (
    <RisikoklassifiseringSakIndex
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkt={risikoAksjonspunkt}
      risikoklassifisering={kontrollresultat}
      isPanelOpen={isRiskPanelOpen}
      readOnly={readOnly}
      submitAksjonspunkt={submitAksjonspunkt}
      toggleRiskPanel={toggleRiskPanel}
    />
  );
};

export default RisikoklassifiseringIndex;
