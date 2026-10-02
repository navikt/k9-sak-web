// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  k9_sak_kontrakt_behandling_BehandlingDto as Behandling,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { use, type JSX } from 'react';
import AntallDagerLivetsSluttfaseIndex from './antall-dager-sluttfase/AntallDagerLivetsSluttfaseIndex';
import { UttakApiContext } from './api/UttakApiContext';
import { relevanteUttakAksjonspunkterLegacy } from './relevanteUttakAksjonspunkter';
import Uttak from './Uttak';

interface UttakLegacyProps {
  behandling: Pick<Behandling, 'uuid' | 'id' | 'versjon' | 'status' | 'sakstype'>;
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrer: boolean;
  readOnly: boolean;
  onAksjonspunktBekreftet?: () => void;
  visKvoteinfoSluttfase?: boolean;
}

/**
 * Gammel versjon av uttak-panelet. Henter selv uttaksplanen slik at den kan brukes likt som nytt uttak-panel.
 */
const UttakLegacy = ({
  behandling,
  aksjonspunkter,
  erOverstyrer,
  readOnly,
  onAksjonspunktBekreftet,
  visKvoteinfoSluttfase = false,
}: UttakLegacyProps): JSX.Element => {
  const uttakApi = use(UttakApiContext);
  if (!uttakApi) {
    throw new Error('Uttak må wrappes i UttakApiContext');
  }
  const { data: uttak } = useSuspenseQuery({
    queryKey: ['legacy-uttak-plan', behandling.uuid, behandling.versjon],
    queryFn: () => uttakApi.hentUttak(behandling.uuid),
  });

  const kvoteInfo = uttak?.uttaksplan?.kvoteInfo;

  return (
    <>
      {visKvoteinfoSluttfase && kvoteInfo?.totaltForbruktKvote !== undefined && (
        <AntallDagerLivetsSluttfaseIndex
          kvoteInfo={{ maxDato: kvoteInfo.maxDato, totaltForbruktKvote: kvoteInfo.totaltForbruktKvote }}
        />
      )}
      <Uttak
        uttak={uttak}
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        relevanteAksjonspunkter={relevanteUttakAksjonspunkterLegacy(behandling.sakstype)}
        erOverstyrer={erOverstyrer}
        readOnly={readOnly}
        onAksjonspunktBekreftet={onAksjonspunktBekreftet}
      />
    </>
  );
};

export default UttakLegacy;
