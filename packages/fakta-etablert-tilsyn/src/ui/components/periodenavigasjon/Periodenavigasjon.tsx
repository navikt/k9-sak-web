import { Heading, Label } from '@navikt/ds-react';
import { Box, InteractiveList, Margin } from '@navikt/ft-plattform-komponenter';
import React, { useEffect } from 'react';
import Vurderingsperiode from '../../../types/Vurderingsperiode';
import { usePrevious } from '../../../util/hooks';
import PeriodeSomSkalVurderes from '../periode-som-skal-vurderes/PeriodeSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './periodenavigasjon.module.css';

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
        <Heading size="small" level="2" className={styles.vurderingsnavigasjon__heading}>
          Alle perioder
        </Heading>
      </Box>
      {antallPerioder === 0 && <p className={styles.vurderingsnavigasjon__emptyText}>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
          <div className={styles.vurderingsvelgerContainer__columnHeadings}>
            <Label size="small" as="p" className={styles['vurderingsvelgerContainer__columnHeading--first']}>
              Status
            </Label>
            <Label size="small" as="p" className={styles['vurderingsvelgerContainer__columnHeading--second']}>
              Periode
            </Label>

            <Label size="small" as="p" className={styles['vurderingsvelgerContainer__columnHeading--third']}>
              Kilde
            </Label>
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
