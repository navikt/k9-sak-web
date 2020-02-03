import React, { FunctionComponent, useState } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import svgKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import svgMann from '@fpsak-frontend/assets/images/mann.svg';
import Kjønnkode from '@k9-frontend/types/src/Kjønnkode';
import TimeLineControl from '@fpsak-frontend/tidslinje/src/components/TimeLineControl';
import messages from '../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface Perioder {
  [fomTom: string]: {
    grad: number;
  };
}

interface BehandlingUttak {
  perioder: Perioder;
}

interface Behandlinger {
  [behandlingId: string]: BehandlingUttak;
}

interface UttakkPPProps {
  behandlinger: Behandlinger;
  behandlingPersonMap: {
    [behandlingId: string]: {
      kjønnkode: Kjønnkode;
    };
  };
}

const erKvinne = kjønnkode => kjønnkode === navBrukerKjonn.KVINNE;

export const mapRader = (behandlinger: Behandlinger, behandlingPersonMap) =>
  Object.entries(behandlinger).map(([behandlingsId, behandling]) => {
    const { kjønnkode } = behandlingPersonMap[behandlingsId];
    const kvinne = erKvinne(kjønnkode);
    const ikon = {
      imageTextKey: 'Person.ImageText',
      titleKey: kvinne ? 'Person.Woman' : 'Person.Man',
      src: kvinne ? svgKvinne : svgMann,
    };

    const perioder = Object.entries(behandling.perioder).map(([fomTom, periode], index) => {
      const [fom, tom] = fomTom.split('/');
      return {
        fom,
        tom,
        id: `${behandlingsId}-${index}`,
        hoverText: `${periode.grad}% ${intl.formatMessage({ id: 'UttakPanel.Gradering' })}`,
        className: periode.grad < 100 ? 'gradert' : 'godkjentPeriode',
      };
    });

    return {
      ikon,
      id: behandlingsId,
      perioder,
    };
  });

const UttakPP: FunctionComponent<UttakkPPProps> = ({ behandlinger, behandlingPersonMap }) => {
  const [valgtPeriode, velgPeriode] = useState();
  const [timelineRef, setTimelineRef] = useState();

  const rader = mapRader(behandlinger, behandlingPersonMap);

  const selectHandler = eventProps => {
    const nyValgtPeriode = rader.flatMap(rad => rad.perioder).find(item => item.id === eventProps.items[0]);
    velgPeriode(nyValgtPeriode);
    eventProps.event.preventDefault();
  };

  const openPeriodInfo = event => {
    console.log(event);
    // TODO: er det vits i å ha en egen knapp for å velge/lukke første periode. lukker selv om det ikke er første som er valgt
  };

  const goBackward = () => {
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };
    timeline.setWindow(newWindowTimes);
  };

  const goForward = () => {
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  };

  const zoomIn = () => {
    const timeline = timelineRef.current.$el;
    timeline.zoomIn(0.5);
  };

  const zoomOut = () => {
    const timeline = timelineRef.current.$el;
    timeline.zoomOut(0.5);
  };

  return (
    <RawIntlProvider value={intl}>
      <Row>
        <Column xs="12">
          <Tidslinje
            rader={rader}
            velgPeriode={selectHandler}
            valgtPeriode={valgtPeriode}
            setTimelineRef={setTimelineRef}
          />
          <TimeLineControl
            goBackwardCallback={goBackward}
            goForwardCallback={goForward}
            zoomInCallback={zoomIn}
            zoomOutCallback={zoomOut}
            openPeriodInfo={openPeriodInfo}
            selectedPeriod={valgtPeriode}
          />
        </Column>
      </Row>
    </RawIntlProvider>
  );
};

export default UttakPP;
