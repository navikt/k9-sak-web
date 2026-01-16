import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { finnPanelStatus, sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from './api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR];
const RELEVANTE_AKSJONSPUNKTKODER = [aksjonspunktCodes.MEDISINSK_VILKAAR];

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.MEDISINSK_VILKAR;
const PANEL_TEKST = 'Sykdom';

interface Props {
  api: K9SakProsessApi;
  behandling: Behandling;
}

/**
 * InitPanel for medisinsk vilkår prosesssteg
 *
 * Wrapper for medisinsk vilkår-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av vilkår
 * - Beregning av paneltype basert på vilkårstatus og aksjonspunkter
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 *
 * Medisinsk vilkår dekker:
 * - Medisinske vilkår for pleietrengende under 18 år
 * - Medisinske vilkår for pleietrengende over 18 år
 */
export function MedisinskVilkarProsessStegInitPanel({ api, behandling }: Props) {
  const context = useContext(ProsessPanelContext);
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));

  // Filtrer vilkår som er relevante for dette panelet
  const vilkårForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [vilkår]);

  // Sjekk om panelet skal vises
  // Panelet vises hvis det finnes relevante vilkår
  const skalVisePanel = vilkårForSteg.length > 0;

  const panelStatus = useMemo(
    () => finnPanelStatus(skalVisePanel, vilkårForSteg, aksjonspunkter, RELEVANTE_AKSJONSPUNKTKODER),
    [skalVisePanel, vilkårForSteg, aksjonspunkter],
  );

  const visDelvisStatus = useMemo(() => sjekkDelvisVilkårStatus(vilkårForSteg), [vilkårForSteg]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelStatus, visDelvisStatus);

  const erStegVurdert = panelStatus !== ProcessMenuStepType.default;

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !skalVisePanel) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const vilkårPleietrengendeUnder18år = vilkår?.find(v => v.vilkarType === vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR);
  const vilkårPleietrengendeOver18år = vilkår?.find(v => v.vilkarType === vilkarType.MEDISINSKEVILKÅR_18_ÅR);
  const perioderUnder18 =
    vilkårPleietrengendeUnder18år?.perioder?.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: false,
      vilkarStatus: { kode: periode.vilkarStatus, kodeverk: '' },
    })) ?? [];
  const perioderOver18 =
    vilkårPleietrengendeOver18år?.perioder?.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: true,
      vilkarStatus: { kode: periode.vilkarStatus, kodeverk: '' },
    })) ?? [];
  const allePerioder = perioderUnder18.concat(perioderOver18);
  return (
    <SykdomProsessIndex lovReferanse={vilkårForSteg[0].lovReferanse} panelTittelKode="Sykdom" perioder={allePerioder} />
  );
}
