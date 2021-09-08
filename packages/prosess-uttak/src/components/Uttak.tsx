import React, { ReactNode, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { Column, Row } from 'nav-frontend-grid';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import svgKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import svgMann from '@fpsak-frontend/assets/images/mann.svg';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import TidslinjePeriode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import TimeLineControl from '@fpsak-frontend/tidslinje/src/components/pleiepenger/TimeLineControl';
import { Image } from '@fpsak-frontend/shared-components';

import { Element } from 'nav-frontend-typografi';
import { UtfallEnum } from './dto/Utfall';
import UttakTabell from './UttakTabell';
import Uttaksperiode from './types/Uttaksperiode';
import Uttaksplan from './types/Uttaksplan';
import Person from './types/Person';
import styles from './uttak.less';

interface UttakkProps {
  uttaksplaner: Uttaksplan[];
}

const erKvinne = kjønnkode => kjønnkode === navBrukerKjonn.KVINNE;

const fulltNavn = navn => [navn.fornavn, navn.mellomavn, navn.etternavn].filter(n => !!n).join(' ');

export const mapRader = (uttaksplaner: Uttaksplan[], intl): TidslinjeRad<Uttaksperiode>[] =>
  uttaksplaner.map(({ behandlingId, perioder }) => {
    const tidslinjeperioder: TidslinjePeriode<Uttaksperiode>[] = perioder.map((periode, index) => {
      const { utfall, grad, fom, tom } = periode;
      const hoverText =
        utfall === UtfallEnum.INNVILGET
          ? `${grad}% ${intl.formatMessage({ id: 'UttakPanel.Gradering' })}`
          : intl.formatMessage({ id: 'UttakPanel.Avslått' });

      const tidslinjeperiode: TidslinjePeriode<Uttaksperiode> = {
        fom,
        tom,
        id: `${behandlingId}-${index}`,
        hoverText,
        className: classNames({
          gradert: grad < 100,
          godkjentPeriode: utfall === UtfallEnum.INNVILGET,
          avvistPeriode: utfall === UtfallEnum.AVSLÅTT,
        }),
        periodeinfo: periode,
      };

      return tidslinjeperiode;
    });

    return {
      id: behandlingId,
      perioder: tidslinjeperioder,
    };
  });

export const mapSideContent = (uttaksplaner: Uttaksplan[], intl): ReactNode[] =>
  uttaksplaner.map(({ person, behandlingId }) => {
    const navn = fulltNavn(person.navn);
    const kvinne = erKvinne(person.kjønn);
    return (
      <span className={styles.sideContent}>
        <Element>{navn}</Element>
        <Image
          key={behandlingId}
          src={kvinne ? svgKvinne : svgMann}
          alt={intl.formatMessage({ id: kvinne ? 'Person.Woman' : 'Person.Man' })}
        />
      </span>
    );
  });

const Uttak = ({ uttaksplaner }: UttakkProps) => {
  const [valgtPeriode, velgPeriode] = useState<TidslinjePeriode<Uttaksperiode> | null>();
  const [timelineRef, setTimelineRef] = useState();
  const valgtPerson = useMemo<Person>(
    () =>
      valgtPeriode && uttaksplaner.find(plan => plan.behandlingId === valgtPeriode.periodeinfo.behandlingId)?.person,
    [valgtPeriode, uttaksplaner],
  );
  const intl = useIntl();

  const rader: TidslinjeRad<Uttaksperiode>[] = useMemo(() => mapRader(uttaksplaner, intl), [uttaksplaner]);
  const sideContent: ReactNode[] = useMemo(() => mapSideContent(uttaksplaner, intl), [uttaksplaner]);

  const selectHandler = eventProps => {
    const nyValgtPeriode = rader.flatMap(rad => rad.perioder).find(periode => periode.id === eventProps.items[0]);
    velgPeriode(nyValgtPeriode);
    eventProps.event.preventDefault();
  };

  const goBackward = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 31),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 31),
    };
    timeline.setWindow(newWindowTimes.start, newWindowTimes.end);
  };

  const goForward = () => {
    // @ts-ignore
    const timeline = timelineRef.current.$el;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 31),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 31),
    };

    timeline.setWindow(newWindowTimes.start, newWindowTimes.end);
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
          sideContentRader={sideContent}
        />
        <TimeLineControl
          goBackward={{ buttonText: intl.formatMessage({ id: 'UttakTimeline.GoBack' }), callback: goBackward }}
          goForward={{ buttonText: intl.formatMessage({ id: 'UttakTimeline.GoForward' }), callback: goForward }}
          zoomIn={{ buttonText: intl.formatMessage({ id: 'UttakTimeline.ZoomIn' }), callback: zoomIn }}
          zoomOut={{ buttonText: intl.formatMessage({ id: 'UttakTimeline.ZoomOut' }), callback: zoomOut }}
        />
        {valgtPeriode && <UttakTabell periode={valgtPeriode.periodeinfo} person={valgtPerson} />}
      </Column>
    </Row>
  );
};

export default Uttak;
