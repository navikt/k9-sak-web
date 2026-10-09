import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import Vurderingsnavigasjon, {
  Resultat,
  type Vurderingselement,
} from '@k9-sak-web/gui/shared/vurderingsperiode-navigasjon/Vurderingsnavigasjon.js';
import { Period } from '@k9-sak-web/gui/utils/Period.js';
import { type JSX } from 'react';
import { hentResultatFraPeriode } from './util/utils';

interface OmsorgsperiodeNavigasjonselement extends Vurderingselement {
  omsorgsperiode: OmsorgenForDto;
}

interface PeriodenavigasjonProps {
  perioderTilVurdering: OmsorgenForDto[];
  vurdertePerioder: OmsorgenForDto[];
  onPeriodeValgt: (periode: OmsorgenForDto | null) => void;
  valgtPeriode: OmsorgenForDto | null;
}

const Periodenavigasjon = ({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeValgt,
  valgtPeriode,
}: PeriodenavigasjonProps): JSX.Element => {
  const lagNavigasjonselement = (
    omsorgsperiode: OmsorgenForDto,
    resultat: Vurderingselement['resultat'],
  ): OmsorgsperiodeNavigasjonselement[] => {
    const periode = omsorgsperiode.periode;
    if (!periode) {
      return [];
    }
    return [{ omsorgsperiode, perioder: [new Period(periode.fom, periode.tom)], resultat }];
  };

  const perioder = [
    ...perioderTilVurdering.flatMap(omsorgsperiode => lagNavigasjonselement(omsorgsperiode, Resultat.MÅ_VURDERES)),
    ...vurdertePerioder.flatMap(omsorgsperiode =>
      lagNavigasjonselement(omsorgsperiode, hentResultatFraPeriode(omsorgsperiode) ?? Resultat.MÅ_VURDERES),
    ),
  ];

  const valgtNavigasjonselement = perioder.find(
    element =>
      element.omsorgsperiode.periode?.fom === valgtPeriode?.periode?.fom &&
      element.omsorgsperiode.periode?.tom === valgtPeriode?.periode?.tom,
  );

  return (
    <Vurderingsnavigasjon
      perioder={perioder}
      valgtPeriode={valgtNavigasjonselement ?? null}
      onPeriodeClick={element => onPeriodeValgt(element?.omsorgsperiode ?? null)}
    />
  );
};

export default Periodenavigasjon;
