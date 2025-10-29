import React from 'react';
import AntallTimer from './AntallTimer';
import Nokkeltall, { Nokkeltalldetalj } from './Nokkeltall';
import { DagerTimer } from './durationUtils';
import styles from './nokkeltall.module.css';

interface ForbrukteDagerProps {
  navHarUtbetaltDagerTimer: DagerTimer;
  infotrygdDagerTimer: DagerTimer;
  forbrukteDagerTimer: DagerTimer;
  smittevernDagerTimer?: DagerTimer;
  utbetaltForMangeDagerTimer?: DagerTimer;
  visDetaljer: () => void;
  viserDetaljer: boolean;
  ar: string;
}

const forbrukteDagerDetaljer = (
  tidFraInfotrygd: DagerTimer,
  forbruktDagerTimer: DagerTimer,
  ar: string,
  smittevernDagerTimer?: DagerTimer,
  utbetaltForMangeDagerTimer?: DagerTimer,
): Nokkeltalldetalj[] => {
  const detaljer: Nokkeltalldetalj[] = [];

  if (tidFraInfotrygd.dager || tidFraInfotrygd.timer) {
    detaljer.push({
      antallDager: tidFraInfotrygd.dager,
      antallTimer: <AntallTimer timer={tidFraInfotrygd.timer} />,
      overskrifttekstId: 'Nøkkeltall.DagerFraInfotrygd',
      infotekstContent: tidFraInfotrygd.timer ? (
        `{dager} dager og {timer} timer utbetalt fra Infotrygd.`
      ) : (
        `${tidFraInfotrygd.dager} dager utbetalt fra Infotrygd.`
      ),
    });
  }

  detaljer.push({
    antallDager: forbruktDagerTimer.dager,
    antallTimer: <AntallTimer timer={forbruktDagerTimer.timer} />,
    overskrifttekstId: 'Nøkkeltall.ForbrukteDager',
    infotekstContent: forbruktDagerTimer.timer ? (
      `{dager} dager og {timer} timer utbetalt i K9.`
    ) : (
      `${forbruktDagerTimer.dager} dager utbetalt i K9.`
    ),
  });

  if (smittevernDagerTimer) {
    if ([2020, 2021, 2022].includes(parseInt(ar, 10))) {
      detaljer.push({
        antallDager: smittevernDagerTimer.dager,
        antallTimer: <AntallTimer timer={smittevernDagerTimer.timer} />,
        overskrifttekstId: 'Nøkkeltall.Smittevern',
        infotekstContent: getSmittevernText(ar),
      });
    }
  } else if (utbetaltForMangeDagerTimer) {
    detaljer.push({
      antallDager: utbetaltForMangeDagerTimer.dager,
      antallTimer: <AntallTimer timer={utbetaltForMangeDagerTimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.UtbetaltForMangeDager',
      infotekstContent: utbetaltForMangeDagerTimer.timer ? (
        `Det er utbetalt {dager} dager og {timer} timer mer enn brukeren har rett på.`
      ) : (
        `Det er utbetalt ${utbetaltForMangeDagerTimer.dager} flere dager enn brukeren har rett på.`
      ),
    });
  }

  return detaljer;
};

// Helper to get smittevern text
const getSmittevernText = (år: string): string => {
  return `Ekstra smittevernsdager for ${år}`;
};

const ForbrukteDager = ({
  navHarUtbetaltDagerTimer,
  infotrygdDagerTimer,
  forbrukteDagerTimer,
  smittevernDagerTimer,
  utbetaltForMangeDagerTimer,
  viserDetaljer,
  visDetaljer,
  ar,
}: ForbrukteDagerProps) => (
  <Nokkeltall
    overskrift={{
      antallDager: navHarUtbetaltDagerTimer.dager,
      antallTimer: <AntallTimer timer={navHarUtbetaltDagerTimer.timer} />,
      overskrifttekstId: 'Nøkkeltall.DagerNavHarUtbetalt',
    }}
    detaljer={forbrukteDagerDetaljer(
      infotrygdDagerTimer,
      forbrukteDagerTimer,
      ar,
      smittevernDagerTimer,
      utbetaltForMangeDagerTimer,
    )}
    viserDetaljer={viserDetaljer}
    visDetaljer={visDetaljer}
    className={styles.dagerNavHarUtbetalt}
  />
);

export default ForbrukteDager;
