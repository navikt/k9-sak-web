import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';
import { useIntl } from 'react-intl';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './tidslinje.less';
import Periode from './types/Periode';
import TidslinjeRad from './types/TidslinjeRad';

export interface TidslinjeIkon {
  imageTextKey: string;
  titleKey: string;
  src: SVGElement;
}

interface EventProps {
  items: string[];
  event: Event;
}

interface TidslinjeProps {
  rader: TidslinjeRad<Periode>[];
  customTimes?: {
    [value: string]: string;
  };
  velgPeriode: (eventProps: EventProps) => void;
  valgtPeriode?: Periode;
  setTimelineRef?: (timelineRef: any) => void;
}

const momentDate = dateString => moment(dateString, ISO_DATE_FORMAT);

const getOptions = (perioderSortert: Periode[]) => ({
  end: moment(perioderSortert[perioderSortert.length - 1].tom).add(2, 'days'),
  locale: moment.locale('nb'),
  margin: { item: 14 },
  max: moment(perioderSortert[perioderSortert.length - 1].tom).add(4, 'years'),
  min: moment(perioderSortert[0].fom).subtract(4, 'weeks'),
  moment,
  moveable: true,
  orientation: { axis: 'top' },
  showCurrentTime: false,
  stack: false,
  start: moment(perioderSortert[0].fom).subtract(1, 'days'),
  tooltip: { followMouse: true },
  verticalScroll: false,
  width: '100%',
  zoomable: true,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomMin: 1000 * 60 * 60 * 24 * 30,
});

const createGroups = (rader: TidslinjeRad<Periode>[]) => {
  return rader.map(rad => ({
    id: rad.id,
    content: '',
  }));
};

const createItems = (perioder: Periode[]) =>
  perioder.map(periode => ({
    ...periode,
    start: momentDate(periode.fom).toDate(),
    end: momentDate(periode.tom)
      .add(1, 'days') // Timeline sin end har til, men ikke med
      .toDate(),
    title: periode.hoverText,
  }));

const leggPåGroupId = (rad: TidslinjeRad<Periode>) => {
  const groupId = rad.id;
  const perioderMedId = rad.perioder.map(periode => ({
    ...periode,
    group: groupId,
  }));

  return {
    ...rad,
    perioder: perioderMedId,
  };
};

const Tidslinje: FunctionComponent<TidslinjeProps> = ({
  rader,
  customTimes,
  velgPeriode,
  valgtPeriode,
  setTimelineRef,
}) => {
  const timelineRef = useRef();

  useEffect(() => setTimelineRef && setTimelineRef(timelineRef), [timelineRef]);

  useEffect(() => {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }, []);

  const allePerioderSortert = useMemo(() => {
    return rader
      .map(leggPåGroupId)
      .flatMap(rad => rad.perioder)
      .sort((p1, p2) => momentDate(p1.fom).diff(momentDate(p2.fom)));
  }, [rader]);

  const intl = useIntl();

  return (
    <div className={styles.timelineContainer}>
      <Row>
        <Column xs="1">
          <div className={styles.timelineIkonContainer}>
            {rader.map(({ ikon, id }) => (
              <Image
                key={id}
                src={ikon.src}
                alt={intl.formatMessage({ id: ikon.imageTextKey })}
                title={intl.formatMessage({ id: ikon.titleKey })}
              />
            ))}
          </div>
        </Column>
        <Column xs="11">
          <div className={styles.timeLineWrapper}>
            <div className="uttakTimeline">
              <Timeline
                ref={timelineRef}
                options={getOptions(allePerioderSortert)}
                items={createItems(allePerioderSortert)}
                groups={createGroups(rader)}
                customTimes={customTimes}
                selectHandler={velgPeriode}
                selection={[valgtPeriode ? valgtPeriode.id : null]}
              />
            </div>
          </div>
        </Column>
      </Row>
    </div>
  );
};

export default Tidslinje;
