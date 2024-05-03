import { FlexRow, Image } from '@k9-sak-web/shared-components';
import { Timeline } from '@k9-sak-web/tidslinje';
import { ISO_DATE_FORMAT } from '@k9-sak-web/utils';
import { HGrid } from '@navikt/ds-react';
import moment from 'moment';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import styles from './tidslinje.module.css';
import Periode from './types/Periode';
import TidslinjeRad from './types/TidslinjeRad';

const momentDate = dateString => moment(dateString, ISO_DATE_FORMAT);

export const createGroups = (rader: TidslinjeRad<Periode<any>>[]) =>
  rader.map(rad => ({
    id: rad.id,
    content: '',
  }));

export const createItems = (perioder: Periode<any>[]) =>
  perioder.map(periode => ({
    ...periode,
    start: momentDate(periode.fom).toDate(),
    end: momentDate(periode.tom)
      .add(1, 'days') // Timeline sin end har til, men ikke med
      .toDate(),
    title: periode.hoverText,
    content: '',
  }));

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
  withBorder?: boolean;
}

const getOptions = (perioderSortert: Periode<any>[]) => ({
  end: moment(perioderSortert[perioderSortert.length - 1].tom)
    .add(2, 'days')
    .toDate(),
  locale: moment.locale('nb'),
  margin: { item: 14 },
  max: moment(perioderSortert[perioderSortert.length - 1].tom)
    .add(4, 'years')
    .toDate(),
  min: moment(perioderSortert[0].fom).subtract(4, 'weeks').toDate(),
  moment,
  moveable: true,
  orientation: { axis: 'top' },
  showCurrentTime: false,
  stack: false,
  start: moment(perioderSortert[0].fom).subtract(1, 'days').toDate(),
  tooltip: { followMouse: true },
  verticalScroll: false,
  width: '100%',
  zoomable: true,
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
  zoomMin: 1000 * 60 * 60 * 24 * 30,
});

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

const Tidslinje = ({
  rader,
  customTimes,
  velgPeriode,
  valgtPeriode,
  setTimelineRef,
  sideContentRader,
  withBorder,
}: TidslinjeProps<any>) => {
  const timelineRef = useRef();

  useEffect(() => setTimelineRef && setTimelineRef(timelineRef), [timelineRef]);

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
          initialItems={createItems(allePerioderSortert)}
          initialGroups={createGroups(rader)}
          customTimes={customTimes}
          selectHandler={velgPeriode}
          selection={[valgtPeriode ? valgtPeriode.id : null]}
        />
      </div>
    </div>
  );

  if (sideContentRader) {
    return (
      <div className={`${styles.timelineContainer} ${withBorder ? styles['timelineContainer--border'] : ''}`}>
        <FlexRow>
          <div className={styles.timelineIkonContainer}>{sideContentRader}</div>
          {timeline}
        </FlexRow>
      </div>
    );
  }

  return (
    <div className={`${styles.timelineContainer} ${withBorder ? styles['timelineContainer--border'] : ''}`}>
      <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
        <div className={styles.timelineIkonContainer}>
          {rader.map(({ ikon, id }) => (
            <Image key={id} src={ikon.src} alt={ikon.imageText} tooltip={ikon.title} />
          ))}
        </div>

        <div>{timeline}</div>
      </HGrid>
    </div>
  );
};

export default Tidslinje;
