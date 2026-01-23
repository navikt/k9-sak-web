import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import { Behandling } from '@k9-sak-web/types';
import { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@navikt/k9-sak-typescript-client/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { vilkårQueryOptions } from './api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR];

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.MEDISINSK_VILKAR;

// Transformerer vilkår til perioder med aldersmarkering
const transformerTilPerioder = (vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[]) => {
  const vilkårUnder18 = vilkår.find(v => v.vilkarType === vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR);
  const vilkårOver18 = vilkår.find(v => v.vilkarType === vilkarType.MEDISINSKEVILKÅR_18_ÅR);

  const perioderUnder18 =
    vilkårUnder18?.perioder?.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: false,
      vilkarStatus: { kode: periode.vilkarStatus, kodeverk: '' },
    })) ?? [];

  const perioderOver18 =
    vilkårOver18?.perioder?.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: true,
      vilkarStatus: { kode: periode.vilkarStatus, kodeverk: '' },
    })) ?? [];

  return perioderUnder18.concat(perioderOver18);
};

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
}

export function MedisinskVilkarProsessStegInitPanel({ api, behandling }: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));

  const vilkårForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

  if (!erValgt || !skalVisePanel) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const allePerioder = transformerTilPerioder(vilkår);

  return (
    <SykdomProsessIndex lovReferanse={vilkårForSteg[0].lovReferanse} panelTittelKode="Sykdom" perioder={allePerioder} />
  );
}
