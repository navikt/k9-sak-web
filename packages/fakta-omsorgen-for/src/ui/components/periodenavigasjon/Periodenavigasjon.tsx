import { Period } from '@fpsak-frontend/utils';
import { Box, Margin, InteractiveList } from '@navikt/ft-plattform-komponenter';
import { Undertittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import Omsorgsperiode from '../../../types/Omsorgsperiode';
import { usePrevious } from '../../../util/hooks';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import PeriodeSomSkalVurderes from '../periode-som-skal-vurderes/PeriodeSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './periodenavigasjon.css';

interface PeriodenavigasjonProps {
  perioderTilVurdering: Omsorgsperiode[];
  vurdertePerioder: Omsorgsperiode[];
  onPeriodeValgt: (periode: Omsorgsperiode) => void;
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

  const vurdertePerioderElements = vurdertePerioder
    .sort((op1, op2) => {
      const omsorgsperiode1 = new Period(op1.periode.fom, op1.periode.tom);
      const omsorgsperiode2 = new Period(op2.periode.fom, op2.periode.tom);
      return sortPeriodsByFomDate(omsorgsperiode1, omsorgsperiode2);
    })
    .map(omsorgsperiode => {
      const { periode } = omsorgsperiode;
      return <VurderingsperiodeElement periode={periode} resultat={omsorgsperiode.hentResultat()} />;
    });

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
      {antallPerioder === 0 && <p>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div className={styles.vurderingsvelgerContainer}>
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
