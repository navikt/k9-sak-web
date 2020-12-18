import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DagerTimer } from './durationUtils';
import Nøkkeltall from './Nøkkeltall';
import AntallTimer from './AntallTimer';

interface RestdagerProps {
  tilgodeDagertimer: DagerTimer;
  dagerNavKanUtbetale: number;
  navHarUtbetaltDagerTimer: DagerTimer;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const Restdager: React.FunctionComponent<RestdagerProps> = ({
  tilgodeDagertimer,
  dagerNavKanUtbetale,
  navHarUtbetaltDagerTimer,
  viserDetaljer,
  visDetaljer,
}) => {
  return (
    <Nøkkeltall
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
      farge="#06893a"
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
    />
  );
};

export default Restdager;
