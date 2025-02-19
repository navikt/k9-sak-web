import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import type { InstitusjonPerioderMedResultat } from '@k9-sak-web/types';
import React, { useState, useMemo, useEffect } from 'react';

import institusjonStatus from '../../constants/institusjonStatus';
import PeriodeRad from '../periodeRad/PeriodeRad';
import styles from './InstitusjonNavigation.module.css';

interface OwnProps {
  perioder: InstitusjonPerioderMedResultat[];
  setValgtPeriode: React.Dispatch<React.SetStateAction<InstitusjonPerioderMedResultat | null>>;
}

const InstitusjonNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = useMemo(
    () => perioder.filter(periode => periode.resultat === institusjonStatus.MÅ_VURDERES),
    [perioder],
  );

  const [activeIndex, setActiveIndex] = useState(perioderTilVurdering.length ? 0 : -1);

  useEffect(() => {
    if (activeIndex > -1) {
      const periode = perioderTilVurdering[activeIndex];
      if (periode) setValgtPeriode(periode);
    }
  }, []);

  const perioderSomErVurdert = useMemo(
    () => perioder.filter(periode => periode.resultat !== institusjonStatus.MÅ_VURDERES),
    [perioder],
  );

  const allePerioder = [...perioderTilVurdering, ...perioderSomErVurdert];

  const elements = allePerioder.map(periode => (
    <PeriodeRad
      key={periode.perioder.map(p => p.prettifyPeriod()).join('-')}
      perioder={periode.perioder}
      resultat={periode.resultat}
    />
  ));

  const handlePeriodeClick = (currentIndex: number, element: React.ReactElement) => {
    setActiveIndex(currentIndex);
    const periodeIndex = elements.indexOf(element);
    const periode = allePerioder[periodeIndex];
    if (periode) setValgtPeriode(periode);
  };

  return (
    <div className={styles['institusjon-oversikt']}>
      <Heading size="xsmall" className={styles['heading']}>
        Alle perioder
      </Heading>
      <div className={styles['periodColumns']}>
        <div className={styles['marginLeft']}>Status</div>
        <div>Periode</div>
      </div>
      {elements.length === 0 && <p className={styles['marginLeft']}>Ingen vurderinger å vise</p>}
      {elements.length > 0 && (
        <div>
          <InteractiveList
            elements={elements.map((element, currentIndex) => ({
              content: element,
              active: activeIndex === currentIndex,
              key: `${currentIndex}`,
              onClick: () => handlePeriodeClick(currentIndex, element),
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default InstitusjonNavigation;
