import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { NoedvendighetPerioderMedResultat } from '@k9-sak-web/types';
import noedvendighetStatus from './konstanter';
import PeriodeRad from '../components/PeriodeRad';
import styles from './noedvendighetNavigation.modules.css';

interface OwnProps {
  perioder: NoedvendighetPerioderMedResultat[];
  setValgtPeriode: React.Dispatch<React.SetStateAction<NoedvendighetPerioderMedResultat>>;
}

const NoedvendighetNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = perioder.filter(periode => periode.resultat === noedvendighetStatus.IKKE_VURDERT);
  const [activeIndex, setActiveIndex] = React.useState(perioderTilVurdering.length ? 0 : -1);
  const perioderSomErVurdert = perioder.filter(periode => periode.resultat !== noedvendighetStatus.IKKE_VURDERT);
  const allePerioder = [...perioderTilVurdering, ...perioderSomErVurdert];
  const elements = [
    ...perioderTilVurdering.map(periode => <PeriodeRad perioder={periode.perioder} resultat={periode.resultat} />),
    ...perioderSomErVurdert.map(periode => <PeriodeRad perioder={periode.perioder} resultat={periode.resultat} />),
  ];
  const antallPerioder = elements.length;
  return (
    <div className={styles['noedvendighet-oversikt']}>
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

export default NoedvendighetNavigation;
