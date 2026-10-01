import type { FC } from 'react';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { prettifyPeriod, sortPeriodsChronological } from '../../utils/periodUtils.js';
import styles from './utsattePerioderStripe.module.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUttakApi } from '../../api/UttakApiContext.js';
import { useUttakContext } from '../../context/UttakContext.js';
import { uttakQueryOptions } from '../../api/uttakQueryOptions.js';

const UtsattePerioderStripe: FC = () => {
  const uttakApi = useUttakApi();
  const { behandling } = useUttakContext();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const utsattePerioder = uttak?.utsattePerioder;

  if (!utsattePerioder || utsattePerioder.length === 0) {
    return null;
  }

  const perioder = utsattePerioder
    .map(utsattPeriode => {
      const [fomValue, tomValue] = utsattPeriode.split('/');
      return {
        fom: fomValue ?? '',
        tom: tomValue ?? '',
      };
    })
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
            <li key={`${periode.fom}-${periode.tom}`}>{prettifyPeriod(periode.fom, periode.tom)}</li>
          ))}
        </ul>
      </Alert>
    </div>
  );
};

export default UtsattePerioderStripe;
