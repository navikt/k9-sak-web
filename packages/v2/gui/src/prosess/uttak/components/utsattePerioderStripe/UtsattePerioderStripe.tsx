import type { FC } from 'react';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import Period from '@k9-sak-web/prosess-uttak/src/types/Period';
import { sortPeriodsChronological } from '@k9-sak-web/prosess-uttak/src/util/periodUtils';

import styles from './utsattePerioderStripe.module.css';

interface UtsattePerioderProps {
  utsattePerioder: string[];
}

const UtsattePerioderStripe: FC<UtsattePerioderProps> = ({ utsattePerioder }) => {
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
