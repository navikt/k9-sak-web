import { BodyShort, Heading } from '@navikt/ds-react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import Period from '../../../types/Period';
import { sortPeriodsChronological } from '../../../util/periodUtils';
import ContainerContext from '../../context/ContainerContext';
import styles from './utsattePerioderStripe.css';

const UtsattePerioderStripe = () => {
  const { utsattePerioder } = React.useContext(ContainerContext);

  if (!utsattePerioder || utsattePerioder.length === 0) {
    return null;
  }

  const perioder = utsattePerioder
    .map(utsattPeriode => new Period(utsattPeriode))
    .sort((p1, p2) => sortPeriodsChronological(p1, p2));

  return (
    <div className={styles.utsattePerioderStripe}>
      <AlertStripeInfo>
        <Heading level="3" size="xsmall">
          Perioder i denne behandlingen har blitt utsatt
        </Heading>
        <BodyShort size="small" className={styles.bodyText}>
          Følgende periode(r) i denne behandlingen er utsatt på grunn av gjensidig avhengighet:
        </BodyShort>
        <ul className={styles.punktliste}>
          {perioder.map(periode => (
            <li>{periode.prettifyPeriod()}</li>
          ))}
        </ul>
      </AlertStripeInfo>
    </div>
  );
};

export default UtsattePerioderStripe;
