import { useCallback } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';
import { BehandlingAppKontekst } from '@k9-sak-web/types';

import { BehandlingDtoType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import FatterVedtakTotrinnskontrollModalSakIndex from '@k9-sak-web/gui/sak/totrinnskontroll/FatterVedtakTotrinnskontrollModalSakIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { getPathToK9Los } from '../../app/paths';
import { UngSakApiKeys, requestApi, restApiHooks } from '../../data/ungsakApi';

interface OwnProps {
  behandling: BehandlingAppKontekst;
  fagsakYtelseType: FagsakYtelsesType;
  allAksjonspunktApproved: boolean;
  erKlageWithKA: boolean;
}

const BeslutterModalIndex = ({ behandling, fagsakYtelseType, allAksjonspunktApproved, erKlageWithKA }: OwnProps) => {
  const { data, state } = restApiHooks.useRestApi<{ harRevurderingSammeResultat: boolean }>(
    UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT,
    undefined,
    {
      updateTriggers: [behandling.id, behandling.versjon],
      suspendRequest: !requestApi.hasPath(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT),
      keepData: true,
    },
  );

  const goToSearchPage = useCallback(() => {
    window.location.assign(getPathToK9Los() || '/');
  }, []);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  const v2Behandling = JSON.parse(JSON.stringify(behandling));
  konverterKodeverkTilKode(v2Behandling, behandling.type.kode === BehandlingDtoType.TILBAKEKREVING);

  return (
    <FatterVedtakTotrinnskontrollModalSakIndex
      behandling={v2Behandling}
      closeEvent={goToSearchPage}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erKlageWithKA={erKlageWithKA}
      harSammeResultatSomOriginalBehandling={data?.harRevurderingSammeResultat}
    />
  );
};

export default BeslutterModalIndex;
