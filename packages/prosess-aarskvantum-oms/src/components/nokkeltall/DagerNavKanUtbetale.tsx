import React from 'react';
import { FormattedMessage } from 'react-intl';
import Nokkeltall from './Nokkeltall';
import styles from './nokkeltall.css';

interface DagerNavKanUtbetaleProps {
  dagerNavKanUtbetale: number;
  dagerRettPå: number;
  antallDagerArbeidsgiverDekker: number;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerNavKanUtbetale = ({
  dagerNavKanUtbetale,
  dagerRettPå,
  antallDagerArbeidsgiverDekker,
  visDetaljer,
  viserDetaljer,
}: DagerNavKanUtbetaleProps) => (
  <Nokkeltall
    overskrift={{ antallDager: dagerNavKanUtbetale, overskrifttekstId: 'Nøkkeltall.DagerNavKanUtbetale' }}
    detaljer={[
      {
        antallDager: dagerRettPå,
        overskrifttekstId: 'Nøkkeltall.TotaltAntallDager',
        infotekstContent: <FormattedMessage id="Nøkkeltall.TotaltAntallDager.InfoText" />,
      },
      {
        antallDager: -antallDagerArbeidsgiverDekker,
        overskrifttekstId: 'Nøkkeltall.Ventetid',
        infotekstContent: (
          <FormattedMessage id="Nøkkeltall.Ventetid.InfoText" values={{ dager: antallDagerArbeidsgiverDekker }} />
        ),
      },
    ]}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.dagerNavKanUtbetale}
  />
);

export default DagerNavKanUtbetale;
