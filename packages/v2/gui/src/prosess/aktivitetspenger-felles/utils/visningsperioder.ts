import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårPeriodeDto.js';
import { checkIfPeriodsAreEdgeToEdge, isPeriodCoveredByPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import dayjs from 'dayjs';

export type VilkårPeriodeVisning = VilkårPeriodeDto & {
  muligAvkortingPeriode?: MuligAvkortingPeriode;
  avkortetPeriodeInfo?: {
    begrunnelse: string;
    periode: {
      fom: string;
      tom: string;
    };
  };
};

/**
 * Slår sammen en oppfylt vilkårsperiode med en påfølgende avkortet avslagsperiode til én visningsperiode,
 * slik at saksbehandler ser og redigerer avkortingen som én periode.
 *
 * Ved innsending, sendes de to periodene som separate perioder til backend.
 */
export const byggVisningsperioder = (
  vilkårMedPerioder: VilkårMedPerioderDto,
  avkortingsperioder: MuligAvkortingPeriode[],
): VilkårPeriodeVisning[] => {
  const perioderFraVilkår = vilkårMedPerioder.perioder ?? [];
  const visningsperioder: VilkårPeriodeVisning[] = [];
  const perioderSomFallerUtenforAvkortingsperioder = perioderFraVilkår.filter(vilkårPeriode =>
    avkortingsperioder.every(avkortingsperiode => !isPeriodCoveredByPeriod(vilkårPeriode.periode, avkortingsperiode)),
  );
  avkortingsperioder
    .map(avkortingsperiode => ({
      fom: dayjs(avkortingsperiode.fom).subtract(1, 'day').format(ISO_DATE_FORMAT),
      tom: avkortingsperiode.tom,
    }))
    .forEach(avkortingsperiode => {
      const vilkårISammePeriode = perioderFraVilkår
        .filter(vilkårPeriode => isPeriodCoveredByPeriod(vilkårPeriode.periode, avkortingsperiode))
        .toSorted((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
        .map(vilkårPeriode => ({ ...vilkårPeriode, muligAvkortingPeriode: avkortingsperiode }));
      for (let periodeIndex = 0; periodeIndex < vilkårISammePeriode.length; periodeIndex += 1) {
        const periode = vilkårISammePeriode[periodeIndex];
        const nestePeriode = vilkårISammePeriode[periodeIndex + 1];
        const erAvkortetNestePeriode =
          nestePeriode?.vilkarStatus === Utfall.IKKE_OPPFYLT && nestePeriode.avslagKode === Avslagsårsak.AVKORTET;

        if (
          periode &&
          erAvkortetNestePeriode &&
          periode.vilkarStatus === Utfall.OPPFYLT &&
          checkIfPeriodsAreEdgeToEdge(periode.periode, nestePeriode.periode)
        ) {
          visningsperioder.push({
            ...periode,
            avkortetPeriodeInfo: {
              begrunnelse: nestePeriode.begrunnelse ?? '',
              periode: {
                fom: nestePeriode.periode.fom,
                tom: nestePeriode.periode.tom,
              },
            },
          });
          periodeIndex += 1;
        } else if (periode) {
          visningsperioder.push(periode);
        }
      }
    });
  visningsperioder.push(...perioderSomFallerUtenforAvkortingsperioder);
  return visningsperioder;
};
