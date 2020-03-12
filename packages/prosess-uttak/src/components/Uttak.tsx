import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { Column, Row } from 'nav-frontend-grid';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import svgKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import svgMann from '@fpsak-frontend/assets/images/mann.svg';
import TimeLineControl from '@fpsak-frontend/tidslinje/src/components/TimeLineControl';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';

import BehandlingPersonMap from './types/BehandlingPersonMap';
import UttakTidslinjePeriode from './types/UttakTidslinjePeriode';
import Uttaksplaner from './types/Uttaksplaner';
import { UtfallEnum } from './types/Utfall';
import ValgtPeriode from './ValgtPeriode';

interface UttakkProps {
  uttaksplaner: Uttaksplaner;
  behandlingPersonMap: BehandlingPersonMap;
}

const erKvinne = kjønnkode => kjønnkode === navBrukerKjonn.KVINNE;

export const mapRader = (
  uttaksplaner: Uttaksplaner,
  behandlingPersonMap: BehandlingPersonMap,
  intl,
): TidslinjeRad<UttakTidslinjePeriode>[] =>
  Object.entries(uttaksplaner).map(([behandlingsId, behandling]) => {
    const { kjønnkode } = behandlingPersonMap[behandlingsId];
    const kvinne = erKvinne(kjønnkode);
    const ikon = {
      imageText: intl.formatMessage({ id: 'Person.ImageText' }),
      title: intl.formatMessage({ id: kvinne ? 'Person.Woman' : 'Person.Man' }),
      src: kvinne ? svgKvinne : svgMann,
    };

    const perioder = Object.entries(behandling.perioder).map(([fomTom, periode], index) => {
      const [fom, tom] = fomTom.split('/');
      const { utfall } = periode;
      const hoverText =
        utfall === UtfallEnum.INNVILGET
          ? `${periode.grad}% ${intl.formatMessage({ id: 'UttakPanel.Gradering' })}`
          : intl.formatMessage({ id: 'UttakPanel.Avslått' });

      return {
        fom,
        tom,
        id: `${behandlingsId}-${index}`,
        hoverText,
        className: classNames({
          gradert: periode.grad < 100,
          godkjentPeriode: utfall === UtfallEnum.INNVILGET,
          avvistPeriode: utfall === UtfallEnum.AVSLÅTT,
        }),
        periodeinfo: {
          ...periode,
          behandlingsId,
        },
      };
    });

    return {
      ikon,
      id: behandlingsId,
      perioder,
    };
  });

const Uttak: FunctionComponent<UttakkProps> = ({ uttaksplaner, behandlingPersonMap }) => {
  const [valgtPeriode, velgPeriode] = useState<UttakTidslinjePeriode | null>();
  const [timelineRef, setTimelineRef] = useState();
  const intl = useIntl();

  const rader: TidslinjeRad<UttakTidslinjePeriode>[] = mapRader(uttaksplaner, behandlingPersonMap, intl);

  const selectHandler = eventProps => {
    const nyValgtPeriode = rader.flatMap(rad => rad.perioder).find(item => item.id === eventProps.items[0]);
    velgPeriode(nyValgtPeriode);
    eventProps.event.preventDefault();
  };

  const openPeriodInfo = () => {
    // TODO: er det vits i å ha en egen knapp for å velge/lukke første periode. lukker selv om det ikke er første som er valgt
  };

  const goBackward = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };
    timeline.setWindow(newWindowTimes);
  };

  const goForward = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes);
  };

  const zoomIn = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    timeline.zoomIn(0.5);
  };

  const zoomOut = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    timeline.zoomOut(0.5);
  };

  return (
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
        {valgtPeriode && <ValgtPeriode behandlingPersonMap={behandlingPersonMap} valgtPeriode={valgtPeriode} />}
      </Column>
    </Row>
  );
};

export default Uttak;
