import { Heading } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { Period } from '@navikt/k9-period-utils';
import { InstitusjonPeriode, Vurderingsresultat } from '@k9-sak-web/types';
import PeriodeSomSkalVurderes from './PeriodeSomSkalVurderes';
import styles from './InstitusjonNavigation.modules.css';
import institusjonStatus from './konstanter';
import PeriodeSomErVurdert from './PeriodeSomErVurdert';

interface InstitusjonPeriodeMedStatus extends InstitusjonPeriode {
  periode: Period;
  resultat: Vurderingsresultat;
}

interface OwnProps {
  perioder: InstitusjonPeriodeMedStatus[];
  setValgtPeriode: (periode: InstitusjonPeriodeMedStatus) => void;
}

const InstitusjonNavigation = ({ perioder, setValgtPeriode }: OwnProps) => {
  const perioderTilVurdering = perioder.filter(periode => periode.resultat === institusjonStatus.IKKE_VURDERT);
  const [activeIndex, setActiveIndex] = React.useState(perioderTilVurdering.length ? 0 : -1);
  const perioderSomErVurdert = perioder.filter(periode => periode.resultat !== institusjonStatus.IKKE_VURDERT);
  const allePerioder = [...perioderTilVurdering, ...perioderSomErVurdert];
  const elements = [
    ...perioderTilVurdering.map(periode => <PeriodeSomSkalVurderes periode={periode.periode} />),
    ...perioderSomErVurdert.map(periode => (
      <PeriodeSomErVurdert periode={periode.periode} kilde="SØKER" resultat={periode.resultat} />
    )),
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
