import { InstitusjonPerioderMedResultat } from '@k9-sak-web/types';
import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React, { useEffect } from 'react';
import styles from './InstitusjonNavigation.module.css';
import PeriodeRad from './PeriodeRad';
import institusjonStatus from './konstanter';

interface OwnProps {
  perioder: InstitusjonPerioderMedResultat[];
  setValgtPeriode: React.Dispatch<React.SetStateAction<InstitusjonPerioderMedResultat>>;
}

const InstitusjonNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = perioder.filter(periode => periode.resultat === institusjonStatus.MÅ_VURDERES);
  const [activeIndex, setActiveIndex] = React.useState(perioderTilVurdering.length ? 0 : -1);
  useEffect(() => {
    if (activeIndex > -1) setValgtPeriode(perioderTilVurdering[activeIndex]);
  }, []);
  const perioderSomErVurdert = perioder.filter(periode => periode.resultat !== institusjonStatus.MÅ_VURDERES);
  const allePerioder = [...perioderTilVurdering, ...perioderSomErVurdert];
  const elements = [
    ...perioderTilVurdering.map(periode => <PeriodeRad perioder={periode.perioder} resultat={periode.resultat} />),
    ...perioderSomErVurdert.map(periode => <PeriodeRad perioder={periode.perioder} resultat={periode.resultat} />),
  ];
  const antallPerioder = elements.length;
  return (
    <div className={styles['institusjon-oversikt']}>
      <Heading size="xsmall" className={styles.heading}>
        Alle perioder
      </Heading>
      <div className={styles.periodColumns}>
        <div className={styles.marginLeft}>Status</div>
        <div>Periode</div>
        <div>Part</div>
      </div>
      {antallPerioder === 0 && <p className={styles.marginLeft}>Ingen vurderinger å vise</p>}
      {antallPerioder > 0 && (
        <div>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => {
                setActiveIndex(currentIndex);
                const periodeIndex = elements.indexOf(element);
                setValgtPeriode(allePerioder[periodeIndex]);
              },
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default InstitusjonNavigation;
