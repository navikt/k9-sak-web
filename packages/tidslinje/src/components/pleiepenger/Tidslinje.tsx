import React, { FunctionComponent, ReactNode, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Timeline from 'react-visjs-timeline';

import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { Image, FlexRow } from '@fpsak-frontend/shared-components';
import styles from './tidslinje.less';
import Periode from './types/Periode';
import TidslinjeRad from './types/TidslinjeRad';

interface EventProps {
  items: string[];
  event: Event;
}

interface TidslinjeProps<Periodeinfo> {
  rader: TidslinjeRad<Periodeinfo>[];
  customTimes?: {
    [value: string]: string;
  };
  velgPeriode: (eventProps: EventProps) => void;
  valgtPeriode?: Periode<Periodeinfo>;
  setTimelineRef?: (timelineRef: any) => void;
  sideContentRader?: ReactNode[];
}

const momentDate = dateString => moment(dateString, ISO_DATE_FORMAT);

const getOptions = (perioderSortert: Periode<any>[]) => ({
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

const createGroups = (rader: TidslinjeRad<Periode<any>>[]) =>
  rader.map(rad => ({
    id: rad.id,
    content: '',
  }));

const createItems = (perioder: Periode<any>[]) =>
  perioder.map(periode => ({
    ...periode,
    start: momentDate(periode.fom).toDate(),
    end: momentDate(periode.tom)
      .add(1, 'days') // Timeline sin end har til, men ikke med
      .toDate(),
    title: periode.hoverText,
  }));

const leggPåGroupId = (rad: TidslinjeRad<Periode<any>>) => {
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

const Tidslinje: FunctionComponent<TidslinjeProps<any>> = ({
  rader,
  customTimes,
  velgPeriode,
  valgtPeriode,
  setTimelineRef,
  sideContentRader,
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

  const allePerioderSortert = useMemo(
    () =>
      rader
        .map(leggPåGroupId)
        .flatMap(rad => rad.perioder)
        .sort((p1, p2) => momentDate(p1.fom).diff(momentDate(p2.fom))),
    [rader],
  );

  const timeline = (
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
  );

  if (sideContentRader) {
    return (
      <div className={styles.timelineContainer}>
        <FlexRow>
          <div className={styles.timelineIkonContainer}>{sideContentRader}</div>
          {timeline}
        </FlexRow>
      </div>
    );
  }

  return (
    <div className={styles.timelineContainer}>
      <Row>
        <Column xs="1">
          <div className={styles.timelineIkonContainer}>
            {rader.map(({ ikon, id }) => (
              <Image key={id} src={ikon.src} alt={ikon.imageText} tooltip={ikon.title} />
            ))}
          </div>
        </Column>
        <Column xs="11">{timeline}</Column>
      </Row>
    </div>
  );
};

export default Tidslinje;
