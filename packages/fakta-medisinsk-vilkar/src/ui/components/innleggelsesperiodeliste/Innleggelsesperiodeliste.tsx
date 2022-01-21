import React from 'react';
import { Period, sortPeriodsByFomDate } from '@navikt/k9-period-utils';
import styles from './innleggelsesperiodeliste.less';

interface InnleggelsesperiodelisteProps {
    innleggelsesperioder: Period[];
}

const Innleggelsesperiodeliste = ({ innleggelsesperioder }: InnleggelsesperiodelisteProps): JSX.Element => (
    <ul className={styles.innleggelsesperiodeliste}>
        {innleggelsesperioder
            .sort(sortPeriodsByFomDate)
            .map((innleggelsesperiode) => {
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
