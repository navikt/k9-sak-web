import React from 'react';
import AntallTimer from './AntallTimer';
import Nokkeltall from './Nokkeltall';
import { DagerTimer } from './durationUtils';
import styles from './nokkeltall.module.css';

interface RestdagerProps {
  tilgodeDagertimer: DagerTimer;
  dagerNavKanUtbetale: number;
  navHarUtbetaltDagerTimer: DagerTimer;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const Restdager = ({
  tilgodeDagertimer,
  dagerNavKanUtbetale,
  navHarUtbetaltDagerTimer,
  viserDetaljer,
  visDetaljer,
}: RestdagerProps) => (
  <Nokkeltall
    overskrift={{
      antallDager: tilgodeDagertimer.dager,
      antallTimer: <AntallTimer timer={tilgodeDagertimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.Restdager.InfoText',
    }}
    detaljer={[
      {
        antallDager: dagerNavKanUtbetale,
        overskrifttekstId: 'Nøkkeltall.KanUtbetales',
        infotekstContent: (
          `${dagerNavKanUtbetale} dager som Nav kan utbetale.`
        ),
      },
      {
        antallDager: -navHarUtbetaltDagerTimer.dager,
        antallTimer: <AntallTimer timer={-navHarUtbetaltDagerTimer.timer} />,
        overskrifttekstId: 'Nøkkeltall.TotaltForbrukte',
        infotekstContent: navHarUtbetaltDagerTimer.timer ? (
          <FormattedMessage
            id="Nøkkeltall.TotaltForbrukte.DagerOgTimer.InfoText"
            values={{ ...navHarUtbetaltDagerTimer }}
          />
        ) : (
          `${navHarUtbetaltDagerTimer.dager} dager forbrukt.`
        ),
      },
    ]}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.restdager}
  />
);

export default Restdager;
