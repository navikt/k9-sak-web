import { Box, Margin, InteractiveList } from '@navikt/ft-plattform-komponenter';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import Vurderingsperiode from '../../../types/Vurderingsperiode';
import { usePrevious } from '../../../util/hooks';
import PeriodeSomSkalVurderes from '../periode-som-skal-vurderes/PeriodeSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './periodenavigasjon.css';

interface PeriodenavigasjonProps {
  perioderTilVurdering: Vurderingsperiode[];
  vurdertePerioder: Vurderingsperiode[];
  onPeriodeValgt: (periode: Vurderingsperiode) => void;
  harValgtPeriode?: boolean;
}

const Periodenavigasjon = ({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeValgt,
  harValgtPeriode,
}: PeriodenavigasjonProps): JSX.Element => {
  const harPerioderSomSkalVurderes = perioderTilVurdering?.length > 0;
  const [activeIndex, setActiveIndex] = React.useState(harPerioderSomSkalVurderes ? 0 : -1);
  const previousHarValgtPeriode = usePrevious(harValgtPeriode);

  useEffect(() => {
    if (harValgtPeriode === false && previousHarValgtPeriode === true) {
      setActiveIndex(-1);
    }
  }, [harValgtPeriode]);

  const vurdertePerioderElements = vurdertePerioder.map(({ periode, resultat, kilde }) => (
    <VurderingsperiodeElement periode={periode} resultat={resultat} kilde={kilde} />
  ));

  const periodeTilVurderingElements = perioderTilVurdering.map(({ periode }) => (
    <PeriodeSomSkalVurderes periode={periode} />
  ));

  const perioder = [...perioderTilVurdering, ...vurdertePerioder];
  const elements = [...periodeTilVurderingElements, ...vurdertePerioderElements];
  const antallPerioder = elements.length;

  return (
    <div className={styles.vurderingsnavigasjon}>
      <Box marginBottom={Margin.large}>
        <Undertittel className={styles.vurderingsnavigasjon__heading}>Alle perioder</Undertittel>
      </Box>
      {antallPerioder === 0 && <p className={styles.vurderingsnavigasjon__emptyText}>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
          <div className={styles.vurderingsvelgerContainer__columnHeadings}>
            <Element className={styles['vurderingsvelgerContainer__columnHeading--first']}>Status</Element>
            <Element className={styles['vurderingsvelgerContainer__columnHeading--second']}>Periode</Element>

            <Element className={styles['vurderingsvelgerContainer__columnHeading--third']}>Kilde</Element>
          </div>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                setActiveIndex(currentIndex);
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
