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
 * slik at saksbehandler ser og redigerer avkortingen som én periode. Ved innsending, sendes de to periodene som separate perioder til backend.
 *
 * 🟩 = OPPFYLT
 * 🟦 = IKKE_OPPFYLT (delen av perioden på 260 dager som ikke er innvilget)
 * 🟥 = IKKE_OPPFYLT (avslag)
 *
 * Mappingkoden gjør følgende
 * 1. 🟩 + 🟦 = Disse to slås sammen hvis de er kant i kant. Alt annet forblir separate perioder
 * 2. Dersom en periode er innenfor avkortingsperiode (det kommer et annet navn for dette) legger vi på hvor mye det er lov å korte ned en innvilgelse
 *
 *
 * TODO: I revurderinger vil man kunne kunne få 🟩🟥🟦 mønstre. Det er foreløpig ikke håndtert i denne logikken, eller i visningen.
 * Må avklares med teamet hvordan det skal fremstilles i gui
 *
 *
 */
export const byggVisningsperioder = (
  vilkårMedPerioder: VilkårMedPerioderDto,
  avkortingsperioder: MuligAvkortingPeriode[],
): VilkårPeriodeVisning[] => {
  const perioderFraVilkår = (vilkårMedPerioder.perioder ?? []).filter(
    periode => periode.vilkarStatus !== Utfall.IKKE_RELEVANT,
  );
  const visningsperioder: VilkårPeriodeVisning[] = [];
  const justerteAvkortingsperioder = avkortingsperioder.map(avkortingsperiode => ({
    fom: dayjs(avkortingsperiode.fom).subtract(1, 'day').format(ISO_DATE_FORMAT),
    tom: avkortingsperiode.tom,
  }));
  const perioderSomFallerUtenforAvkortingsperioder = perioderFraVilkår.filter(
    vilkårPeriode =>
      !justerteAvkortingsperioder.some(avkortingsperiode =>
        isPeriodCoveredByPeriod(vilkårPeriode.periode, avkortingsperiode),
      ),
  );
  const vilkårISammePeriode: VilkårPeriodeVisning[] = [];
  justerteAvkortingsperioder.forEach(avkortingsperiode => {
    const vilkårISammePeriodeForDenneAvkortingsperioden = perioderFraVilkår
      .filter(vilkårPeriode => isPeriodCoveredByPeriod(vilkårPeriode.periode, avkortingsperiode))
      .map(vilkårPeriode => ({
        ...vilkårPeriode,
        muligAvkortingPeriode: {
          fom: dayjs(avkortingsperiode.fom).add(1, 'day').format(ISO_DATE_FORMAT),
          tom: avkortingsperiode.tom,
        },
      }));
    vilkårISammePeriode.push(...vilkårISammePeriodeForDenneAvkortingsperioden);
  });

  const alleVilkårsPerioder = [...vilkårISammePeriode, ...perioderSomFallerUtenforAvkortingsperioder].toSorted(
    (a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime(),
  );
  for (let periodeIndex = 0; periodeIndex < alleVilkårsPerioder.length; periodeIndex += 1) {
    const periode = alleVilkårsPerioder[periodeIndex];
    const nestePeriode = alleVilkårsPerioder[periodeIndex + 1];
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
  return visningsperioder;
};
