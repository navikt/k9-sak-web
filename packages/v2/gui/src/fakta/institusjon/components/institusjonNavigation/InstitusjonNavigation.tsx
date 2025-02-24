import React, { useState, useMemo, useEffect } from 'react';

import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

import type { InstitusjonPerioderDtoMedResultat } from '../../types/IinstitusjonPerioderDtoMedResultat.js';
import PeriodeRad from '../periodeRad/PeriodeRad.js';

import styles from './InstitusjonNavigation.module.css';

interface OwnProps {
  perioder: InstitusjonPerioderDtoMedResultat[];
  setValgtPeriode: React.Dispatch<React.SetStateAction<InstitusjonPerioderDtoMedResultat | null>>;
}

const InstitusjonNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = useMemo(
    () => perioder.filter(periode => periode.resultat === InstitusjonVurderingDtoResultat.MÅ_VURDERES),
    [perioder],
  );

  const [activeIndex, setActiveIndex] = useState(perioderTilVurdering.length ? 0 : -1);

  useEffect(() => {
    const firstPeriode = perioderTilVurdering[0];
    if (firstPeriode) {
      setValgtPeriode(firstPeriode);
    } else {
      setValgtPeriode(null);
    }
  }, [perioderTilVurdering, setValgtPeriode]);

  const perioderSomErVurdert = useMemo(
    () => perioder.filter(periode => periode.resultat !== InstitusjonVurderingDtoResultat.MÅ_VURDERES),
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
    <div className={styles.institusjonOversikt}>
      <Heading size="xsmall" className={styles.heading}>
        Alle perioder
      </Heading>
      <div className={styles.periodColumns}>
        <div className={styles.marginLeft}>Status</div>
        <div>Periode</div>
      </div>
      {elements.length === 0 && <p className={styles.marginLeft}>Ingen vurderinger å vise</p>}
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
