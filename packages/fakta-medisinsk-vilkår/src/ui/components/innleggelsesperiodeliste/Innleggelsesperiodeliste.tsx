import { Period, sortPeriodsByFomDate } from '@k9-sak-web/utils';
import React from 'react';
import styles from './innleggelsesperiodeliste.module.css';

interface InnleggelsesperiodelisteProps {
  innleggelsesperioder: Period[];
}

const Innleggelsesperiodeliste = ({ innleggelsesperioder }: InnleggelsesperiodelisteProps): JSX.Element => (
  <ul className={styles.innleggelsesperiodeliste}>
    {innleggelsesperioder.sort(sortPeriodsByFomDate).map(innleggelsesperiode => {
      const { fom, tom } = innleggelsesperiode;
      return (
        <li key={`${fom}${tom}`} className={styles.innleggelsesperiodeliste__element}>
          {innleggelsesperiode.prettifyPeriod()}
        </li>
      );
    })}
  </ul>
);

export default Innleggelsesperiodeliste;
