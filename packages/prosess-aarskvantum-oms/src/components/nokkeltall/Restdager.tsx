import React from 'react';
import { FormattedMessage } from 'react-intl';
import AntallTimer from './AntallTimer';
import Nokkeltall from './Nokkeltall';
import { DagerTimer } from './durationUtils';
import styles from './nokkeltall.css';

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
          <FormattedMessage id="Nøkkeltall.KanUtbetales.InfoText" values={{ dager: dagerNavKanUtbetale }} />
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
          <FormattedMessage
            id="Nøkkeltall.TotaltForbrukte.Dager.InfoText"
            values={{ dager: navHarUtbetaltDagerTimer.dager }}
          />
        ),
      },
    ]}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.restdager}
  />
);

export default Restdager;
