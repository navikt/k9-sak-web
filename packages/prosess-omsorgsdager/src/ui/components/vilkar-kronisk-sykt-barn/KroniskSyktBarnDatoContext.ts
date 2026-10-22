import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { BehandlingAppKontekst } from '@k9-sak-web/types';
import dayjs from 'dayjs';
import { createContext } from 'react';

type KroniskSyktBarnDatoer = {
  foreslåttFraDato?: string;
  innvilgedePerioder: { fom: string; tom: string }[];
};

export const KroniskSyktBarnDatoContext = createContext<KroniskSyktBarnDatoer>({ innvilgedePerioder: [] });

type TidligereBehandling = Pick<
  BehandlingAppKontekst,
  'id' | 'status' | 'behandlingHenlagt' | 'sakstype' | 'behandlingsresultat'
>;

export const finnDatoerForKroniskSyktBarn = (
  behandlinger: readonly TidligereBehandling[],
  behandlingId: number,
): KroniskSyktBarnDatoer => {
  const innvilgedePerioder = behandlinger
    .filter(
      behandling =>
        behandling.id !== behandlingId &&
        behandling.sakstype === fagsakYtelsesType.OMSORGSPENGER_KS &&
        behandling.status.kode === behandlingStatus.AVSLUTTET &&
        behandling.behandlingsresultat?.type.kode === behandlingResultatType.INNVILGET &&
        !behandling.behandlingHenlagt,
    )
    .flatMap(behandling => behandling.behandlingsresultat?.vilkårResultat?.['UTVIDETRETT'] ?? [])
    .filter(resultat => resultat.utfall.kode === vilkarUtfallType.OPPFYLT)
    .map(resultat => resultat.periode);

  const sisteSluttdato = innvilgedePerioder
    .map(periode => periode.tom)
    .toSorted()
    .at(-1);
  return {
    innvilgedePerioder,
    foreslåttFraDato: sisteSluttdato ? dayjs(sisteSluttdato).add(1, 'day').format('YYYY-MM-DD') : undefined,
  };
};
