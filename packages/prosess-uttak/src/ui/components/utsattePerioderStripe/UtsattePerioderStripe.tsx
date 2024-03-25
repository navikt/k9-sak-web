import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import Period from '../../../types/Period';
import { sortPeriodsChronological } from '../../../util/periodUtils';
import ContainerContext from '../../context/ContainerContext';
import styles from './utsattePerioderStripe.module.css';

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
      <Alert size="small" variant="info">
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
      </Alert>
    </div>
  );
};

export default UtsattePerioderStripe;
