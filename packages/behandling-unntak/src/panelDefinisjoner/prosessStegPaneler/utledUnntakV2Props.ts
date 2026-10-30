import {
  behandlingResultatType,
  type BehandlingResultatType,
} from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingResultatType.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';

// Nøkkelen backend bruker i behandlingsresultat.vilkårResultat for K9-vilkåret.
const VILKÅR_RESULTAT_NØKKEL = 'K9_VILKÅRET';

interface LegacyVilkar {
  vilkarType?: { kode?: string };
  perioder?: { periode?: { fom?: string; tom?: string }; begrunnelse?: string }[];
}

export interface LegacyBehandling {
  behandlingsresultat?: {
    type?: { kode?: string };
    vilkårResultat?: Record<string, { periode?: { fom?: string; tom?: string } }[] | undefined>;
  };
}

interface UnntakV2Props {
  periode?: Periode;
  begrunnelse?: string;
  behandlingResultatType?: BehandlingResultatType;
}

/**
 * Perioden hentes fra behandlingsresultat.vilkårResultat.K9_VILKÅRET, som backend leverer som et sett uten
 * dokumentert rekkefølge. Derfor brukes perioden bare når det finnes nøyaktig én. Ellers returneres ingen periode,
 * og V2-komponenten lar ikke saksbehandler sende inn.
 * Lagret begrunnelse hentes fra K9-vilkåret sin periode med samme fom og tom. Resultatet er behandlingsresultatet.
 */
export const utledUnntakV2Props = (
  vilkar: LegacyVilkar[] | undefined,
  behandling: LegacyBehandling | undefined,
): UnntakV2Props => {
  const vilkårResultater = behandling?.behandlingsresultat?.vilkårResultat?.[VILKÅR_RESULTAT_NØKKEL] ?? [];
  const [enesteResultat, ...flereResultater] = vilkårResultater;
  const fom = enesteResultat?.periode?.fom;
  const tom = enesteResultat?.periode?.tom;
  const periode: Periode | undefined =
    flereResultater.length === 0 && typeof fom === 'string' && typeof tom === 'string' ? { fom, tom } : undefined;

  const begrunnelse =
    periode === undefined
      ? undefined
      : (vilkar ?? [])
          .filter(v => v.vilkarType?.kode === VilkårType.K9_VILKÅRET)
          .flatMap(v => v.perioder ?? [])
          .find(p => p.periode?.fom === periode.fom && p.periode?.tom === periode.tom)?.begrunnelse;

  const lagretResultatKode = behandling?.behandlingsresultat?.type?.kode;
  const lagretResultat = Object.values(behandlingResultatType).find(verdi => verdi === lagretResultatKode);

  return { periode, begrunnelse, behandlingResultatType: lagretResultat };
};
