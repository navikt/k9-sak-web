import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React, { useEffect } from 'react';
import PeriodeRad from './PeriodeRad';
import { ReisetidVurdering } from './ReisetidTypes';
import ReisetidStatus from './konstanter';
import styles from './reisetidNavigation.modules.css';

interface OwnProps {
  perioder: ReisetidVurdering[];
  setValgtPeriode: React.Dispatch<React.SetStateAction<ReisetidVurdering>>;
}

const ReisetidNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = perioder.filter(periode => periode.resultat === ReisetidStatus.IKKE_VURDERT);
  const [activeIndex, setActiveIndex] = React.useState(perioderTilVurdering.length ? 0 : -1);
  useEffect(() => {
    if (activeIndex > -1) setValgtPeriode(perioderTilVurdering[activeIndex]);
  }, []);
  const perioderSomErVurdert = perioder
    .filter(periode => periode.resultat !== ReisetidStatus.IKKE_VURDERT)
    // @ts-ignore
    .sort((a, b) => new Date(b.periode.fom) - new Date(a.periode.fom));
  const allePerioder = [...perioderTilVurdering, ...perioderSomErVurdert];
  const elements = [
    ...perioderTilVurdering.map(periode => <PeriodeRad periode={periode.periode} resultat={periode.resultat} />),
    ...perioderSomErVurdert.map(periode => <PeriodeRad periode={periode.periode} resultat={periode.resultat} />),
  ];
  const antallPerioder = elements.length;
  return (
    <div className={styles['Reisetid-oversikt']}>
      <Heading size="xsmall" className={styles.heading}>
        Alle perioder
      </Heading>
      <div className={styles.periodColumns}>
        <div className={styles.marginLeft}>Status</div>
        <div>Periode</div>
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

export default ReisetidNavigation;
