import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_sak_kontrakt_behandling_BehandlingDto as Behandling } from '@k9-sak-web/backend/k9sak/generated/types.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { AntallDagerLivetsSluttfase } from '../uttak-antall-dager-sluttfase/AntallDagerLivetsSluttfase.js';
import UttakLegacy from '../uttak-legacy/UttakLegacy.js';
import Uttak from './Uttak.js';
import { use, type JSX } from 'react';
import VersjonsvelgerV1V2 from '@k9-sak-web/gui/shared/versjonsvelger/VersjonsvelgerV1V2.js';

interface UttakPanelProps {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrer: boolean;
  readOnly: boolean;
  onAksjonspunktBekreftet?: () => void;
  visKvoteinfoSluttfase?: boolean;
}

/**
 * Gammelt (v1) eller nytt (v2) uttak-panel. Feature toggle NYTT_UTTAK_PANEL styrer om v2 er tilgjengelig,
 * og VersjonsvelgerV1V2 lar saksbehandler bytte versjon utenfor prod.
 */
export const UttakPanel = ({
  behandling,
  aksjonspunkter,
  erOverstyrer,
  readOnly,
  onAksjonspunktBekreftet,
  visKvoteinfoSluttfase = false,
}: UttakPanelProps): JSX.Element => {
  const { NYTT_UTTAK_PANEL } = use(FeatureTogglesContext);

  const v1 = (
    <UttakLegacy
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      erOverstyrer={erOverstyrer}
      readOnly={readOnly}
      onAksjonspunktBekreftet={onAksjonspunktBekreftet}
      visKvoteinfoSluttfase={visKvoteinfoSluttfase}
    />
  );
  if (!NYTT_UTTAK_PANEL) {
    return v1;
  }

  const v2 = (
    <>
      {visKvoteinfoSluttfase && (
        <AntallDagerLivetsSluttfase behandlingUuid={behandling.uuid} behandlingVersjon={behandling.versjon} />
      )}
      <Uttak
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        erOverstyrer={erOverstyrer}
        readOnly={readOnly}
        onAksjonspunktBekreftet={onAksjonspunktBekreftet}
      />
    </>
  );
  return <VersjonsvelgerV1V2 v1={v1} v2={v2} />;
};
