import type { OmsorgenForDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForDto.js';
import { Box, Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import styles from './periodenavigasjon.module.css';
import PeriodeSomSkalVurderes from './PeriodeSomSkalVurderes';
import { sortPeriodsByFomDate } from './util/periodUtils';
import { hentResultatFraPeriode } from './util/utils';
import VurderingsperiodeElement from './VurderingsperiodeElement';
interface PeriodenavigasjonProps {
  perioderTilVurdering: OmsorgenForDto[];
  vurdertePerioder: OmsorgenForDto[];
  onPeriodeValgt: (periode: OmsorgenForDto) => void;
  valgtPeriode: OmsorgenForDto | null;
}

const Periodenavigasjon = ({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeValgt,
  valgtPeriode,
}: PeriodenavigasjonProps): JSX.Element => {
  const sortedVurdertePerioder = vurdertePerioder.toSorted((op1, op2) => {
    const omsorgsperiode1 = op1.periode;
    const omsorgsperiode2 = op2.periode;
    return omsorgsperiode1 && omsorgsperiode2 ? sortPeriodsByFomDate(omsorgsperiode1, omsorgsperiode2) : 0;
  });

  const vurdertePerioderElements = sortedVurdertePerioder.map(omsorgsperiode => {
    const { periode } = omsorgsperiode;
    if (!periode) {
      return <></>;
    }
    return <VurderingsperiodeElement periode={periode} resultat={hentResultatFraPeriode(omsorgsperiode)} />;
  });

  const periodeTilVurderingElements = perioderTilVurdering.map(({ periode }) => {
    if (!periode) {
      return <></>;
    }
    return <PeriodeSomSkalVurderes key={`${periode.fom}-${periode.tom}`} periode={periode} />;
  });

  const perioder = [...perioderTilVurdering, ...sortedVurdertePerioder];
  const elements = [...periodeTilVurderingElements, ...vurdertePerioderElements];
  const antallPerioder = elements.length;
  const activeIndex = valgtPeriode ? perioder.indexOf(valgtPeriode) : -1;

  return (
    <div className={styles.vurderingsnavigasjon}>
      <Box marginBlock="space-0 space-6">
        <Heading size="small" level="2" className={styles.vurderingsnavigasjonHeading}>
          Alle perioder
        </Heading>
      </Box>
      {antallPerioder === 0 && <p>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                const periode = perioder[currentIndex];
                if (periode) {
                  onPeriodeValgt(periode);
                }
              },
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default Periodenavigasjon;
