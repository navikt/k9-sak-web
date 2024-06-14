import React from 'react';
import { FormattedMessage } from 'react-intl';
import Nokkeltall from './Nokkeltall';
import styles from './nokkeltall.module.css';

interface DagerNavKanUtbetaleProps {
  dagerNavKanUtbetale: number;
  dagerRettPå: number;
  antallDagerArbeidsgiverDekker: number;
  antallDagerFraværRapportertSomNyoppstartet: number;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerNavKanUtbetale = ({
  dagerNavKanUtbetale,
  dagerRettPå,
  antallDagerArbeidsgiverDekker,
  antallDagerFraværRapportertSomNyoppstartet,
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
      {
        antallDager: antallDagerFraværRapportertSomNyoppstartet,
        overskrifttekstId: 'Nøkkeltall.AntallDagerFraværRapportertSomNyoppstartet',
        infotekstContent: (
          <FormattedMessage id="Nøkkeltall.AntallDagerFraværRapportertSomNyoppstartet.InfoText" />
        )
      },
    ]}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.dagerNavKanUtbetale}
  />
);

export default DagerNavKanUtbetale;
