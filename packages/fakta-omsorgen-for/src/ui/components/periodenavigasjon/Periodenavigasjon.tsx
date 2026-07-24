import { Period } from '@fpsak-frontend/utils';
import { Box, Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React, { type JSX, useEffect } from 'react';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import PeriodeSomSkalVurderes from '../periode-som-skal-vurderes/PeriodeSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './periodenavigasjon.module.css';

interface PeriodenavigasjonProps {
  perioderTilVurdering: Omsorgsperiode[];
  vurdertePerioder: Omsorgsperiode[];
  valgtPeriode: Omsorgsperiode | null;
  onPeriodeValgt: (periode: Omsorgsperiode) => void;
}

const Periodenavigasjon = ({
  perioderTilVurdering,
  vurdertePerioder,
  valgtPeriode,
  onPeriodeValgt,
}: PeriodenavigasjonProps): JSX.Element => {
  const listeContainerRef = React.useRef<HTMLDivElement>(null);

  const vurdertePerioderSortert = [...vurdertePerioder].sort((op1, op2) => {
    const omsorgsperiode1 = new Period(op1.periode.fom, op1.periode.tom);
    const omsorgsperiode2 = new Period(op2.periode.fom, op2.periode.tom);
    return sortPeriodsByFomDate(omsorgsperiode1, omsorgsperiode2);
  });

  const vurdertePerioderElements = vurdertePerioderSortert.map(omsorgsperiode => {
    const { periode } = omsorgsperiode;
    return <VurderingsperiodeElement periode={periode} resultat={omsorgsperiode.hentResultat()} />;
  });

  const periodeTilVurderingElements = perioderTilVurdering.map(({ periode }) => (
    <PeriodeSomSkalVurderes periode={periode} />
  ));

  const perioder = [...perioderTilVurdering, ...vurdertePerioderSortert];
  const elements = [...periodeTilVurderingElements, ...vurdertePerioderElements];
  const antallPerioder = elements.length;
  const activeIndex = valgtPeriode ? perioder.indexOf(valgtPeriode) : -1;

  useEffect(() => {
    if (activeIndex >= 0) {
      const aktivKnapp = listeContainerRef.current?.querySelectorAll('button')[activeIndex];
      aktivKnapp?.focus();
    }
  }, [activeIndex]);

  return (
    <div className={styles.vurderingsnavigasjon}>
      <Box marginBlock="space-0 space-24">
        <Heading size="small" level="2" className={styles.vurderingsnavigasjon__heading}>
          Alle perioder
        </Heading>
      </Box>
      {antallPerioder === 0 && <p>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer} ref={listeContainerRef}>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                const periodeIndex = elements.indexOf(element);
                onPeriodeValgt(perioder[periodeIndex]);
              },
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default Periodenavigasjon;
